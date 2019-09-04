import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Menum } from '../models/menum';
import { GlobalService } from '../services/global.service';
import { LoginService } from '../services/login.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    public isNavbarCollapsed = true;
    public gs: GlobalService;
    title = "Pls Login";
    id: string = "";
    constructor(
        private router: Router,
        private gs1: GlobalService,
        private loginservice: LoginService) {
        this.gs = gs1;
    }

    LoadPage(rec: Menum) {
        let bFlag : boolean = false;
        this.getUrlID();
        /* this.router.navigate([rec.menu_route1], { queryParams: { parameter: rec.menu_route2 }, replaceUrl: true }); */
        if (rec.menu_route1 == 'accounts/trial')
            bFlag = true;
        if (rec.menu_route1 == 'accounts/pandl')
            bFlag = true;            
        if (rec.menu_route1 == 'accounts/ledger')
            bFlag = true;
        if (rec.menu_route1 == 'accounts/cashbook')
            bFlag = true;

        if (bFlag)
            this.router.navigate([rec.menu_route1], { queryParams: { id: this.id, parameter: rec.menu_route2 }, replaceUrl: true });
        else
            this.router.navigate([rec.menu_route1], { queryParams: { parameter: rec.menu_route2 }, replaceUrl: true });
    }

    Logout() {
        this.loginservice.Logout();
        this.title = 'Pls Login';
        this.router.navigate(['login'], { replaceUrl: true }); 
    }

    getUrlID() {
        this.id = this.gs1.getGuid();
    }

}
