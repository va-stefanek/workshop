import { Service, declareExperimentalWebMcpTool, signal } from '@angular/core';

/**
 * 🤖 WEBMCP TOOL IN A SERVICE — example 4 from the Angular docs
 *
 * `declareExperimentalWebMcpTool` registers the tool immediately and
 * unregisters it automatically when the surrounding injection context is
 * destroyed. A root service constructor is the recommended place: it runs
 * exactly once, so there is no risk of duplicate tool names.
 *
 * The agent reads the SAME signal the UI renders — when you click +/- on
 * the demo page and then ask the agent for the counter, it sees the
 * current value. That is the difference between semantic tools and DOM
 * scraping.
 */
@Service()
export class Counter {
  readonly count = signal(0);

  constructor() {
    declareExperimentalWebMcpTool({
      name: 'getCounter',
      description: 'Reads the global counter.',
      inputSchema: { type: 'object', properties: {} },
      execute: () => ({
        content: [{ type: 'text', text: `The count is: ${this.count()}.` }],
      }),
    });
  }

  increment(): void {
    this.count.update(c => c + 1);
  }

  decrement(): void {
    this.count.update(c => c - 1);
  }
}
