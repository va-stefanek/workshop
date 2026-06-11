# WebMCP - Your App as AI Agent Tools (Experimental)

Welcome to the **WebMCP** module of the Angular Shopping Cart Workshop! This module shows Angular 22's experimental support for the Web Model Context Protocol — an emerging web standard that lets a web page expose **structured tools** that browser AI agents can discover and call, instead of guessing their way through the DOM.

> ⚠️ The WebMCP spec is very early in its lifecycle. Angular's support is **experimental** — APIs may change even outside major versions.

## 🎯 Learning Objectives

By completing this module, you will:

- Understand what WebMCP is and why it beats DOM scraping for AI agents
- Register app-wide tools with `provideExperimentalWebMcpTools`
- Declare lifecycle-bound tools in services with `declareExperimentalWebMcpTool`
- Describe tool inputs with JSON Schema (`inputSchema`) and validate them manually
- Expose a Signal Form as an agent tool with one `experimentalWebMcpTool` option

## 📁 Files You'll Work With

- `src/app/webmcp/shopping-agent-tools.ts` - `greet` + `searchCatalog` tools (docs examples 1-2)
- `src/app/webmcp/counter.service.ts` - tool declared in a root service (docs example 4)
- `src/app/webmcp/components/user-registration-form.component.ts` - Signal Form as a tool (docs example 5)
- `src/app/webmcp/model-context-shim.ts` - workshop shim (see "Browser support" below)
- `src/app/app.config.ts` - tool providers + `provideExperimentalWebMcpForms()`
- `src/main.ts` - shim installation before bootstrap

## 🏗 Architecture Overview

```
AI agent (browser / extension)            Demo page "Registered tools"
            │                                        │
            ▼                                        ▼
   document.modelContext  ◄──── workshop shim mirrors registrations
            ▲
            │ registerTool(tool, { signal })
            │
   Angular WebMCP APIs
   ├─ provideExperimentalWebMcpTools([...])   app-wide (greet, searchCatalog)
   ├─ declareExperimentalWebMcpTool({...})    service lifecycle (getCounter)
   └─ form(..., { experimentalWebMcpTool })   Signal Form (registerUser)
            │ execute() runs in injection context → inject() works
            ▼
   Real app state: ProductService (catalog), Counter (signal), form model
```

## 🔑 The Three APIs

**1. App-wide tools** (`app.config.ts` → `shopping-agent-tools.ts`):

```typescript
provideExperimentalWebMcpTools([
  {
    name: 'greet',
    description: 'Greets the agent.',
    inputSchema: { type: 'object', properties: {} },
    execute: () => {
      const greeter = inject(Greeter); // injection context!
      return { content: [{ type: 'text', text: greeter.sayHello() }] };
    },
  },
]),
```

**2. Tool in a service** (`counter.service.ts`) — registers on first injection, unregisters when the injector is destroyed:

```typescript
@Service()
export class Counter {
  readonly count = signal(0);
  constructor() {
    declareExperimentalWebMcpTool({
      name: 'getCounter',
      description: 'Reads the global counter.',
      inputSchema: { type: 'object', properties: {} },
      execute: () => ({ content: [{ type: 'text', text: `The count is: ${this.count()}.` }] }),
    });
  }
}
```

**3. Signal Form as a tool** (`user-registration-form.component.ts`) — the agent goes through the same validation + submit pipeline as a human:

```typescript
readonly userForm = form(this.model, (f) => {
  required(f.firstName, { message: 'First name is mandatory.' });
}, {
  experimentalWebMcpTool: { name: 'registerUser', description: 'Registers a new user.' },
  submission: { action: async (field) => { /* save */ } },
});
```

Requires `provideExperimentalWebMcpForms()` in the app providers.

## 🌐 Browser Support & The Shim

Angular registers tools into `document.modelContext ?? navigator.modelContext` and **silently does nothing** when neither exists. Options:

- **Chrome 149+** — WebMCP origin trial (since June 2026). Locally: enable the WebMCP flag in `chrome://flags`. The page badge shows "Native browser WebMCP".
- **Any other browser** — `src/app/webmcp/model-context-shim.ts` installs a minimal `document.modelContext` before bootstrap, so the demo page can list and invoke the registered tools. There is also a community polyfill: `@mcp-b/webmcp-polyfill` (useful for unit tests too).

## 🎬 Demo Script (for presenters)

1. Open `/webmcp` — four tools are listed: `greet`, `searchCatalog`, `getCounter`, `registerUser`.
2. Invoke `greet` → "Hello agent!" — the WebMCP hello world.
3. Invoke `searchCatalog` with query `laptop` → REAL products with prices from the in-memory catalog. The agent doesn't scrape the DOM — it gets structured data.
4. Click **+** three times, invoke `getCounter` → "The count is: 3." The agent reads the same signal the UI renders.
5. Submit the registration form by hand, then point out an agent calling `registerUser` hits the same validation (`First name is mandatory.`).

Prompts to try with a real agent (Chrome 149 / MCP-bridged):

- 🇵🇱 „Przywitaj się ze sklepem" / 🇬🇧 "Greet the store"
- 🇵🇱 „Znajdź w katalogu produkty pasujące do 'laptop'" / 🇬🇧 "Search the catalog for 'laptop'"
- 🇵🇱 „Zarejestruj użytkownika Jan Kowalski, 30 lat" / 🇬🇧 "Register the user John Smith, age 30"

## 🔧 Troubleshooting

| Symptom | Cause |
|---|---|
| No tools listed on the demo page | Shim not installed in `main.ts` (or installed after bootstrap) |
| `NG0203` from `declareExperimentalWebMcpTool` | Called outside an injection context |
| Error mentioning `provideExperimentalWebMcpForms` | `experimentalWebMcpTool` used on `form()` without the provider |
| Duplicate tool name errors | Tool declared in a component created multiple times — prefer app/route providers or root services |
| `inject()` throws inside `execute` | `inject()` called after the first `await` — inject at the top |
| Form tool schema error | Form model contains `null`/`undefined`/empty arrays — schema inference needs concrete initial values |

## 📚 Key Concepts

- **Tool descriptions are prompts** — they tell the agent *when* and *how* to use a tool. Write them for the agent, not for developers.
- **Angular does not validate agent input** against `inputSchema` — always validate inside `execute`.
- **Lifecycle = DI lifecycle** — tools unregister automatically when their injector is destroyed; for route-scoped tools combine route `providers` with `withExperimentalAutoCleanupInjectors()` on the router.

Further reading: [angular.dev/ai/webmcp](https://angular.dev/ai/webmcp) · [WebMCP proposal (W3C WebML CG)](https://github.com/webmachinelearning/webmcp)
