import { bootstrapApplication } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter, withViewTransitions } from '@angular/router'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { AppComponent } from './app/app'
import { routes } from './app/app.routes'
import { authInterceptor } from './app/core/auth.interceptor'

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes, withViewTransitions())
  ]
}).catch(err => console.error(err))
