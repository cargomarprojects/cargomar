

import { InterceptorService } from './interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

export const InterceptorServiceProvider = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true
  }
]; 
