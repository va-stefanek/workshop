import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Counter } from '../counter.service';
import {
  RegisteredWebMcpTool,
  hasNativeWebMcp,
  registeredWebMcpTools,
} from '../model-context-shim';
import { UserRegistrationFormComponent } from './user-registration-form.component';

/**
 * 🤖 WEBMCP DEMO PAGE
 *
 * Shows the three ways Angular 22 exposes an app to AI agents
 * (https://angular.dev/ai/webmcp):
 *
 * 1. provideExperimentalWebMcpTools — app-wide tools (greet, searchCatalog)
 *    registered in app.config.ts
 * 2. declareExperimentalWebMcpTool — tool declared in a root service
 *    constructor (getCounter, see counter.service.ts)
 * 3. experimentalWebMcpTool on form() — a Signal Form exposed as a tool
 *    (registerUser, see user-registration-form.component.ts)
 *
 * The "Registered tools" list below reads the same registry the agent
 * sees (via the shim in model-context-shim.ts) and lets you invoke the
 * tools by hand — that's the proof the agent gets STRUCTURED, SEMANTIC
 * access to the app instead of scraping the DOM.
 */
@Component({
  selector: 'webmcp-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, UserRegistrationFormComponent],
  template: `
    <div class="webmcp-container">
      <header class="page-header">
        <h1>🤖 WebMCP — Your App as AI Agent Tools</h1>
        <p class="subtitle">
          Angular 22 experimental WebMCP support: expose structured tools that
          browser AI agents can discover and call.
        </p>
        <span class="support-badge" [class.native]="nativeSupport">
          {{ nativeSupport
            ? '✅ Native browser WebMCP (Chrome 149+)'
            : '🔧 Workshop shim active (no native WebMCP in this browser)' }}
        </span>
      </header>

      <!-- Example 2 of the docs: tool declared in a root service -->
      <section class="demo-section">
        <h2>Global counter (tool in a service)</h2>
        <p>
          <code>counter.service.ts</code> declares the <code>getCounter</code> tool with
          <code>declareExperimentalWebMcpTool</code>. The agent reads the same signal
          this UI renders:
        </p>
        <div class="counter-row">
          <button (click)="counter.decrement()">−</button>
          <span class="count">{{ counter.count() }}</span>
          <button (click)="counter.increment()">+</button>
        </div>
      </section>

      <!-- Example 5 of the docs: a Signal Form as an agent tool -->
      <section class="demo-section">
        <h2>User registration (Signal Form as a tool)</h2>
        <p>
          One <code>experimentalWebMcpTool</code> option on <code>form()</code> exposes
          this form as the <code>registerUser</code> tool — the agent goes through the
          same validation and submit pipeline as a human.
        </p>
        <webmcp-user-registration-form />
      </section>

      <!-- What the agent sees -->
      <section class="demo-section">
        <h2>🛰 Registered tools — what the agent sees</h2>
        <p>
          Live registry of <code>document.modelContext</code> registrations.
          Invoke them by hand to prove they work on real app state.
        </p>
        <p class="console-hint">
          External agents (and you, in the DevTools console) can do the same:
          <code>webmcpDemo.listTools()</code> ·
          <code>await webmcpDemo.callTool('searchCatalog', {{ '{' }} query: 'laptop' {{ '}' }})</code>
        </p>

        @for (tool of tools(); track tool.name) {
          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">{{ tool.name }}</code>
              <span class="tool-source">{{ tool.source }}</span>
            </div>
            <p class="tool-description">{{ tool.description }}</p>

            @if (tool.name === 'searchCatalog') {
              <div class="invoke-row">
                <input
                  type="text"
                  placeholder="query, e.g. laptop"
                  [(ngModel)]="searchQuery"
                  (keydown.enter)="invokeSearch(tool)">
                <button (click)="invokeSearch(tool)">Search</button>
              </div>
            } @else if (tool.name !== 'registerUser') {
              <div class="invoke-row">
                <button (click)="invoke(tool, {})">Invoke</button>
              </div>
            } @else {
              <p class="hint">→ invoked by agents with form values; use the form above as a human</p>
            }

            @if (results()[tool.name]; as result) {
              <pre class="tool-result">{{ result }}</pre>
            }
          </div>
        } @empty {
          <p class="hint">No tools registered (is the shim installed in main.ts?)</p>
        }
      </section>
    </div>
  `,
  styleUrl: './webmcp-demo.component.css',
})
export class WebMcpDemoComponent {
  protected readonly counter = inject(Counter);
  protected readonly tools = registeredWebMcpTools;
  protected readonly nativeSupport = hasNativeWebMcp();

  protected searchQuery = '';
  protected readonly results = signal<Record<string, string>>({});

  protected async invoke(tool: RegisteredWebMcpTool, args: unknown): Promise<void> {
    let text: string;
    try {
      const result = await Promise.resolve(
        tool.execute(args, { signal: new AbortController().signal })
      );
      text = this.toText(result);
    } catch (error) {
      text = `Error: ${error instanceof Error ? error.message : error}`;
    }
    this.results.update(r => ({ ...r, [tool.name]: text }));
  }

  protected invokeSearch(tool: RegisteredWebMcpTool): void {
    void this.invoke(tool, { query: this.searchQuery });
  }

  private toText(result: unknown): string {
    const content = (result as { content?: Array<{ type: string; text?: string }> })?.content;
    if (Array.isArray(content) && content[0]?.type === 'text' && content[0].text !== undefined) {
      return content[0].text;
    }
    return typeof result === 'string' ? result : JSON.stringify(result, null, 2);
  }
}
