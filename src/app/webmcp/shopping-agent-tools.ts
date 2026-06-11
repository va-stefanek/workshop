import { EnvironmentProviders, Service, inject, provideExperimentalWebMcpTools } from '@angular/core';
import { filter, firstValueFrom, take } from 'rxjs';
import { ProductService } from '../shared/services/product.service';

/**
 * 🤖 WEBMCP TOOLS — straight from the Angular docs (https://angular.dev/ai/webmcp)
 *
 * Tools registered with `provideExperimentalWebMcpTools` live as long as the
 * application injector. Their `execute` callbacks run inside that injector's
 * injection context, so `inject()` works — but only BEFORE the first `await`.
 *
 * KEY CONCEPTS:
 * - name + description tell the agent WHAT the tool does and WHEN to use it
 * - inputSchema (JSON Schema) tells the agent HOW to call it; Angular infers
 *   the TypeScript types of `args` from it
 * - Angular does NOT validate the agent's input against the schema —
 *   validate manually inside execute
 * - Tool names must be unique across the whole page
 */

/** Example 1 from the docs: the WebMCP hello world. */
@Service()
export class Greeter {
  sayHello(): string {
    return 'Hello agent! Welcome to the Shopping Cart Workshop 🛒';
  }
}

export const SHOPPING_AGENT_TOOL_PROVIDERS: EnvironmentProviders[] = [
  // Tool 1: no input — the simplest possible tool
  provideExperimentalWebMcpTools([
    {
      name: 'greet',
      description: 'Greets the agent.',
      inputSchema: { type: 'object', properties: {} },
      execute: () => {
        const greeter = inject(Greeter);
        return { content: [{ type: 'text', text: greeter.sayHello() }] };
      },
    },
  ]),

  // Tool 2: input schema with a required and an optional parameter,
  // wired to the REAL product catalog (in-memory API, 35 products)
  provideExperimentalWebMcpTools([
    {
      name: 'searchCatalog',
      description:
        'Searches the store catalog for products matching a query. ' +
        'Returns product names with prices in USD.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search keywords.',
          },
          maxResults: {
            type: 'number',
            description: 'Maximum number of results to return. Defaults to 5.',
          },
        },
        required: ['query'],
        additionalProperties: false,
      },
      execute: async ({ query, maxResults }) => {
        // inject() must run synchronously, before the first await!
        const productService = inject(ProductService);

        // Angular does not validate agent input — do it yourself
        if (typeof query !== 'string' || !query.trim()) {
          throw new Error(`Bad query: ${query}`);
        }
        if (maxResults !== undefined && typeof maxResults !== 'number') {
          throw new Error(`Bad maxResults: ${maxResults}`);
        }

        // The catalog starts as [] until the in-memory API responds
        const products = await firstValueFrom(
          productService.getProducts().pipe(
            filter(list => list.length > 0),
            take(1)
          )
        );

        const limit = maxResults ?? 5;
        const term = query.trim().toLowerCase();
        const matches = products
          .filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.description.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term)
          )
          .slice(0, limit);

        if (matches.length === 0) {
          return {
            content: [{ type: 'text', text: `No products found for "${query}".` }],
          };
        }

        const lines = matches
          .map(p => `- ${p.name} ($${p.price}) [id: ${p.id}, category: ${p.category}]`)
          .join('\n');
        return {
          content: [{ type: 'text', text: `Found ${matches.length} product(s) for "${query}":\n${lines}` }],
        };
      },
    },
  ]),
];
