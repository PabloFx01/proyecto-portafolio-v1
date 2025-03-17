import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ErrorResponseInterceptor } from './shared/error-response.interceptor';
import { jwtInterceptor } from './interceptors/jwt-interceptor';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { provideEcharts } from 'ngx-echarts';

export const appConfig: ApplicationConfig = {
  providers: [
     provideRouter(routes),
     provideHttpClient(withFetch(), withInterceptors([ErrorResponseInterceptor,jwtInterceptor])),
     provideNativeDateAdapter(),
     provideAnimationsAsync(),
     provideToastr(),
     provideLottieOptions({
      player: () => player,
    }),
    provideEcharts()]
};
