import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { installModelContextShim } from './app/webmcp/model-context-shim';

// WebMCP: must be installed BEFORE bootstrap — Angular's tool providers
// silently no-op when document/navigator.modelContext is missing
installModelContextShim();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
