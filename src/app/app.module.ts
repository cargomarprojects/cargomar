import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';



import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';

@NgModule({
    imports: [
      BrowserModule,
      AppRoutingModule,
      CoreModule
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
