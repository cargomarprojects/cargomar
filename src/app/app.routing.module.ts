import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './core/home/home.component';
import { LoginComponent } from './core/login/login.component';
import { LoginBranchComponent } from './core/loginbranch/loginbranch.component';
import { ContactComponent } from './core/contact/contact.component';
import { ReloadComponent } from './reload.component';

const routes: Routes = [
    { path: '', redirectTo : 'login', pathMatch : 'full'  },
    { path: 'login', component: LoginComponent },
    { path: 'loginbranch', component: LoginBranchComponent },
    { path: 'home', component: HomeComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'reload', component:ReloadComponent },
    { path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule' },
    { path: 'hr', loadChildren: 'app/hr/hr.module#HrModule' },
    { path: 'master', loadChildren: 'app/master/master.module#MasterModule' },
    { path: 'accounts', loadChildren: 'app/accounts/accounts.module#AccountsModule' },
    { path: 'operations', loadChildren: 'app/operations/operations.module#OperationsModule' },
    { path: 'clearing', loadChildren: 'app/clearing/clearing.module#ClearingModule' },
    { path: 'report1', loadChildren: 'app/report1/report1.module#Report1Module' },
    { path: 'marketing', loadChildren: 'app/marketing/marketing.module#MarketingModule' },
];

@NgModule({
  imports: [
      RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}
