import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user/user.component';
import { CompanyComponent } from './company/company.component';
import { MenuComponent } from './menu/menu.component';
import { ModuleComponent } from './module/module.component';
import { RightsComponent } from './rights/rights.component';

const routes: Routes = [
    { path: 'user', component: UserComponent },
    { path: 'company/:type', component: CompanyComponent },
    { path: 'branch/:type', component: CompanyComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'module', component: ModuleComponent },
    { path: 'rights', component: RightsComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AdminRoutingModule {
}
