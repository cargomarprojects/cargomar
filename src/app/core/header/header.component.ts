import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { letProto } from 'rxjs/operator/let';


import { Menum } from '../models/menum';
import { GlobalService } from '../services/global.service';
import { LoginService } from '../services/login.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
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
        let _replaceurl: boolean = true;
        let bFlag: boolean = false;
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

        // replaceurl parameter has to be added in menu_route2 or menu master
        if (rec.menu_route2 != "") {
            let mobj = JSON.parse(rec.menu_route2);
            if (mobj.hasOwnProperty('replaceurl')) {
                _replaceurl = mobj.replaceurl;
            }
        }

        if (bFlag)
            this.router.navigate([rec.menu_route1], { queryParams: { appid: this.gs.appid, id: this.id, parameter: rec.menu_route2 }, replaceUrl: _replaceurl });
        else {
            if (_replaceurl)
                this.router.navigate([rec.menu_route1], { queryParams: { appid: this.gs.appid, parameter: rec.menu_route2 }, replaceUrl: true });
            else
                this.router.navigate([rec.menu_route1], { queryParams: { appid: this.gs.appid, parameter: rec.menu_route2 } });
        }
    }




    Logout(_type: string = "LOGOUT") {
        this.gs.changeBrData.user_login = '';
        this.gs.changeBrData.user_code = '';
        this.gs.changeBrData.user_pwd = '';
        this.gs.changeBrData.user_comp_code = '';
        this.gs.changeBrData.user_branch_id = '';
        this.gs.changeBrData.user_year_id = '';
        if (_type == "BRANCH") {
            this.gs.changeBrData.user_login = 'BRANCH';
            this.gs.changeBrData.user_code = this.gs.globalVariables.user_code;
            this.gs.changeBrData.user_pwd = this.gs.globalVariables.user_password;
            this.gs.changeBrData.user_comp_code = this.gs.globalVariables.comp_code;
            this.gs.changeBrData.user_branch_id = this.gs.globalVariables.branch_pkid;
            this.gs.changeBrData.user_year_id = this.gs.globalVariables.year_pkid;
        }
        
        let SearchData = {
            usercode: this.gs.globalVariables.user_code,
            companycode: this.gs.globalVariables.comp_code,
            branchcode: this.gs.globalVariables.branch_code,
            appid: this.gs.appid
        };

        this.loginservice.Logout(SearchData).subscribe(
            success => {

            },
            error => {
            }
        )

        this.Login();

    }


    Login() {

        this.gs.IsLoginSuccess = false;
        this.gs.IsAuthenticated = false;
        this.gs.Access_Token = '';

        this.gs.Modules = [];
        this.gs.globalVariables.istp = false;

        this.title = 'Pls Login';
        this.router.navigate(['login'], { replaceUrl: true });
    }


    getUrlID() {
        this.id = this.gs1.getGuid();
    }

    home() {
        this.router.navigate(['home'], { replaceUrl: true });
    }



}
