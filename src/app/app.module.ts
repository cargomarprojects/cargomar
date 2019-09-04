import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';



import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';


import { StoreModule  } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers, metaReducers } from './reducers';
import { environment } from '../environments/environment';
import { InterceptorServiceProvider } from './core/services/interceptor.service.provider';
import { LoadingScreenService } from './core/services/loadingscreen.service';
import { InterceptorService } from './core/services/interceptor.service';


@NgModule({
    imports: [
      BrowserModule,
      AppRoutingModule,
      CoreModule,
      StoreModule.forRoot(reducers, { metaReducers }),
      environment.production ? [] : StoreDevtoolsModule.instrument(),            
    ],
    declarations: [
        AppComponent
   ],
    providers: [
        LoadingScreenService,
        InterceptorService,
        InterceptorServiceProvider
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
