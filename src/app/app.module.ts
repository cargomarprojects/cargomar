import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CoreModule } from './core.module';




import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers, metaReducers } from './reducers';
import { environment } from '../environments/environment';


import { GlobalService } from './core/services/global.service';
import { LoginService } from './core/services/login.service';
import { HomeComponent } from './core/home/home.component';
import { HeaderComponent } from './core/header/header.component';
import { LoginComponent } from './core/login/login.component';
import { LoginBranchComponent } from './core/loginbranch/loginbranch.component';
import { ContactComponent } from './core/contact/contact.component';
import { LoadingScreenComponent } from './core/loadingscreen/loading-screen.component';
import { InterceptorService } from './core/services/interceptor.service';
import { LoadingScreenService } from './core/services/loadingscreen.service';
import { InterceptorServiceProvider } from './core/services/interceptor.service.provider';



@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        CoreModule,
        AppRoutingModule,
        StoreModule.forRoot(reducers, { metaReducers }),
        environment.production ? [] : StoreDevtoolsModule.instrument(),
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        HeaderComponent,
        LoginComponent,
        LoginBranchComponent,
        ContactComponent,
        LoadingScreenComponent
    ],
    providers: [
        GlobalService,
        LoginService,
        LoadingScreenService,
        InterceptorServiceProvider       
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }




