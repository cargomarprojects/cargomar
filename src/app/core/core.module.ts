import { NgModule }      from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { GlobalService } from './services/global.service';
import { LoginService } from './services/login.service';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { LoginBranchComponent } from './loginbranch/loginbranch.component';
import { ContactComponent } from './contact/contact.component';
import { LoadingScreenComponent } from './loadingscreen/loading-screen.component';




@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      HttpClientModule,
      RouterModule,
      NgbModule.forRoot()
    ],
    declarations: [
        HomeComponent,
        HeaderComponent,
        LoginComponent,
        LoginBranchComponent,
        ContactComponent,
        LoadingScreenComponent
    ],
    exports : [
        HeaderComponent
    ],
    providers: [
        GlobalService,
        LoginService,
    ]
})
export class CoreModule { }

