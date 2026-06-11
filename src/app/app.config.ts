import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideExperimentalWebMcpForms } from '@angular/forms/signals';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './shared/services/in-memory-data.service';
import { SHOPPING_AGENT_TOOL_PROVIDERS } from './webmcp/shopping-agent-tools';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ 
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })
    ),
    provideHttpClient(withFetch()),
    // In-memory web API for development
    importProvidersFrom(
      HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
        dataEncapsulation: false,
        delay: 0, // No delay for development speed
        passThruUnknownUrl: true,
        apiBase: 'api/'
      })
    ),
    // WebMCP (experimental): expose app functionality as AI agent tools
    ...SHOPPING_AGENT_TOOL_PROVIDERS,
    // Required for forms using the experimentalWebMcpTool option
    provideExperimentalWebMcpForms()
  ]
};
