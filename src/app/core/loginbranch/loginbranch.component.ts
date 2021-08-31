import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { GlobalService } from '../services/global.service';
import { LoginService } from '../services/login.service';

import { Companym } from '../models/company';
import { Yearm } from '../models/yearm';

import { Settings } from '../models/settings';

@Component({
  selector: 'app-loginbranch',
  templateUrl: './loginbranch.component.html'
})
export class LoginBranchComponent {
  ErrorMessage: string;
  loading = false;

  showlogin = false;

  branchid: string = '';
  yearid: string = '';

  username = '';
  password = '';

  public gs: GlobalService;

  BranchList: Companym[] = [];
  YearList: Yearm[] = [];

  constructor(
    private router: Router,
    private location: Location,
    private gs1: GlobalService,
    private loginservice: LoginService) {

    this.gs = gs1;

    this.branchid = this.gs.globalVariables.user_branch_id;
    this.LoadCombo();
  }

  LoadCombo() {
    this.loading = true;
    let SearchData = {
      userid: this.gs.globalVariables.user_pkid,
      usercode: this.gs.globalVariables.user_code,
      compid: this.gs.globalVariables.user_company_id,
      compcode: this.gs.globalVariables.user_company_code

    };

    this.loginservice.LoadBranch(SearchData)
      .subscribe(response => {
        this.BranchList = response.branchlist;
        this.YearList = response.yearlist;

        if (this.branchid == '') {
          this.BranchList.forEach(rec => {
            this.branchid = rec.comp_pkid;
          });
        }
        this.YearList.forEach(rec => {
          this.yearid = rec.year_pkid;
        });

        this.loading = false;
        this.showlogin = true;

        // if trading partner login no branch selection allowed
        if (this.gs.globalVariables.tp_code != '')
          this.Login();
      },
        error => {
          this.loading = false;
          this.showlogin = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  async Login(){
    this.loading = true;
    const bRet = await this.gs.LoadMenu(this.branchid, this.yearid);
    this.loading = false;

    if ( bRet == 0 ) {
      this.gs.CreateAppId();
      this.router.navigate(['home'], { replaceUrl: true });
    }

  }


  ngOnInit() {
  }

  ngOnDestroy() {

  }

  Close() {
    this.gs.IsLoginSuccess = false;
    this.gs.ClosePage('login');
  }




}

