import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Companym } from '../models/company';
import { GlobalService } from '../services/global.service';
import { LoginService } from '../services/login.service';

//edited 10/100/2021
//EDIT-AJITH-25-11-2021
//EDIT-AJITH-09-03-2022

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMessage: string;
  ErrorExternalLogin: string = '';


  //username: string = '';
  //password: string = '';

  //test - 2
  username: string = 'ADMIN';
  password: string = 'cpl2001*';


  server_software_version_string: string = '';
  showloginbutton: boolean = true;

  company_code: string = '';


  loading = false;
  showlogin = false;

  CompanyList: Companym[] = [];

  public gs: GlobalService;


  constructor(
    private router: Router,
    private gs1: GlobalService,
    private loginservice: LoginService) {

    this.gs = gs1;
    this.LoadCombo();
  }




  LoadCombo() {

    this.loading = true;
    let SearchData = {
      userid: ''
    };

    this.loginservice.LoadCompany(SearchData)
      .subscribe(response => {
        this.CompanyList = response.list;
        this.server_software_version_string = response.version;

        if (this.gs.software_version_string != this.server_software_version_string) {
          // this.errorMessage = "New Version Available, Kindly Clear Browser History";
          this.showloginbutton = false;
          alert('New Version Available, Kindly Clear Browser History');
        }

        this.CompanyList.forEach(rec => {
          if (this.company_code == '')
            this.company_code = rec.comp_code;
        });
        this.loading = false;
        this.showlogin = true;

        if (this.company_code == 'DVT') {
          this.gs.Topbar_Email = 'info@divitsoftlabs.com';
          this.gs.Topbar_Mob = '+91-484-4131606';
        } else {
          this.gs.Topbar_Email = 'softwaresupport@cargomar.in';
          this.gs.Topbar_Mob = '+91-484-4131600';
        }
        this.getCompanyName();
      },
        error => {
          this.loading = false;
          this.showlogin = false;
          this.errorMessage = error.error.error_description;
        });
  }


  reload() {
    window.location.reload();
  }

  async Login() {

    if (!this.username) {
      this.errorMessage = 'Login ID Cannot Be Blank';
      return;
    }
    if (!this.password) {
      this.errorMessage = 'Password Cannot Be Blank';
      return;
    }
    if (!this.company_code) {
      this.errorMessage = 'Please Select Company';
      return;
    }
    if (this.gs.software_version_string != this.server_software_version_string) {
      this.errorMessage = "New Version Available, Kindly Clear Browser History";
      this.showloginbutton = false;
      return;
    }
    var iRet = await this.gs.Login(this.username.toUpperCase(), this.password.toUpperCase(), this.company_code);
    if (iRet != 0)
      return;
    if (this.gs.baseLocalServerUrl != "") {
      iRet = await this.gs.checkLocalServer();
      if (iRet != 0)
        return;
    }
    this.router.navigate(['loginbranch'], { replaceUrl: true });
  }

  Logout1() {
    this.errorMessage = 'Pls Login';
  }

  OnChange(field: string) {
    if (field === 'comp_code') {
      this.getCompanyName();
    }
  }

  getCompanyName() {
    if (!this.gs.isBlank(this.CompanyList)) {
      for (let rec of this.CompanyList.filter(rec => rec.comp_code == this.company_code)) {
        this.gs.Company_Name = rec.comp_name;
      }
    }
  }

}
