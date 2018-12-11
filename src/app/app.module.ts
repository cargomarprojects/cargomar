import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';



import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';


import { StoreModule  } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers, metaReducers } from './reducers';
import { environment } from '../environments/environment.prod';


@NgModule({
    imports: [
      BrowserModule,
      AppRoutingModule,
      CoreModule,
      StoreModule.forRoot(reducers, { metaReducers }),
      !environment.production ? StoreDevtoolsModule.instrument() : [],            
    ],
    declarations: [
        AppComponent
   ],
    providers: [
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
