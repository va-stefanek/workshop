import { signal, type Signal } from '@angular/core';

/**
 * 🤖 WEBMCP MODEL CONTEXT SHIM
 *
 * Angular's WebMCP support registers tools into
 * `document.modelContext ?? navigator.modelContext` and silently does
 * NOTHING when the browser has no WebMCP support (Chrome 149+ origin
 * trial / chrome://flags). This shim makes the workshop demo work in
 * every browser:
 *
 * - No native support → installs a minimal `document.modelContext`
 *   so Angular's `provideExperimentalWebMcpTools` and
 *   `declareExperimentalWebMcpTool` have something to register into.
 * - Native support (Chrome 149 with the WebMCP flag) → wraps the native
 *   `registerTool` and mirrors every registration, so the demo page can
 *   still show what the agent sees.
 *
 * Angular unregisters tools by aborting the AbortSignal it passes in the
 * registration options (tied to the injector's DestroyRef) — the shim
 * listens for that abort to drop the tool from the registry.
 *
 * Must be installed in main.ts BEFORE bootstrapApplication().
 */

export interface RegisteredWebMcpTool {
  name: string;
  description: string;
  inputSchema?: unknown;
  execute: (args: unknown, client: { signal: AbortSignal }) => unknown;
  source: 'native' | 'shim';
  registeredAt: Date;
}

interface RegisterToolOptions {
  signal?: AbortSignal;
}

interface ModelContext {
  registerTool(
    tool: Omit<RegisteredWebMcpTool, 'source' | 'registeredAt'>,
    options?: RegisterToolOptions
  ): unknown;
}

const registry = signal<readonly RegisteredWebMcpTool[]>([]);
let nativeSupport = false;

/** Live view of every WebMCP tool currently registered on this page. */
export const registeredWebMcpTools: Signal<readonly RegisteredWebMcpTool[]> =
  registry.asReadonly();

function track(
  tool: Omit<RegisteredWebMcpTool, 'source' | 'registeredAt'>,
  options: RegisterToolOptions | undefined,
  source: 'native' | 'shim'
): void {
  const entry: RegisteredWebMcpTool = { ...tool, source, registeredAt: new Date() };
  // Re-registering a name replaces the previous entry (matches agent visibility)
  registry.update(list => [...list.filter(t => t.name !== entry.name), entry]);
  options?.signal?.addEventListener(
    'abort',
    () => registry.update(list => list.filter(t => t !== entry)),
    { once: true }
  );
}

export function installModelContextShim(): void {
  const doc = document as Document & { modelContext?: ModelContext };
  const nav = navigator as Navigator & { modelContext?: ModelContext };
  // Same lookup order Angular uses internally
  const native = doc.modelContext ?? nav.modelContext;

  if (native) {
    nativeSupport = true;
    const originalRegisterTool = native.registerTool.bind(native);
    native.registerTool = (tool, options) => {
      track(tool, options, 'native');
      return originalRegisterTool(tool, options);
    };
  } else {
    doc.modelContext = {
      registerTool: (tool, options) => track(tool, options, 'shim'),
    };
  }

  installDemoHandle();
}

/** Whether the browser provided its own WebMCP implementation. */
export function hasNativeWebMcp(): boolean {
  return nativeSupport;
}

/**
 * Demo handle for EXTERNAL agents (and the DevTools console).
 *
 * Native WebMCP exposes registered tools only to the browser's own agent —
 * page scripts cannot enumerate or call them. For the workshop we publish
 * `window.webmcpDemo` so any agent that can run JavaScript on the page
 * (Claude Code via chrome-devtools MCP, Playwright, the DevTools console)
 * can do exactly what a native agent does:
 *
 *   webmcpDemo.listTools()
 *   await webmcpDemo.callTool('searchCatalog', { query: 'laptop' })
 */
function installDemoHandle(): void {
  (globalThis as Record<string, unknown>)['webmcpDemo'] = {
    listTools: () =>
      registry().map(t => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema,
        source: t.source,
      })),
    callTool: async (name: string, args: unknown = {}) => {
      const tool = registry().find(t => t.name === name);
      if (!tool) {
        const available = registry().map(t => t.name).join(', ');
        return `Unknown tool "${name}". Available tools: ${available}`;
      }
      return await tool.execute(args, { signal: new AbortController().signal });
    },
  };
}
