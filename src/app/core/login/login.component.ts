import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Companym } from '../models/company';
import { GlobalService } from '../services/global.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  errorMessage: string;
  ErrorExternalLogin: string = '';

  errorMessageVersion: string = '1.342';
  software_version_string: string = '1.342';
  
  username: string = 'ADMIN';
  password: string = 'ADMIN';
  
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

        if (this.software_version_string != this.server_software_version_string) {
          this.errorMessage = "New Version Available, Kindly Clear Browser History";

          this.showloginbutton = false;
        }

        this.CompanyList.forEach(rec => {
          if (this.company_code == '')
            this.company_code = rec.comp_code;
        });
        this.loading = false;
        this.showlogin = true;
      },
      error => {
        this.loading = false;
        this.showlogin = false;
        this.errorMessage = error.error.error_description;
      });
  }


  Login() {
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

    if (this.software_version_string != this.server_software_version_string) {
      this.errorMessage = "New Version Available, Kindly Clear Browser History";
      this.showloginbutton = false;
      return;
    }


    this.username = this.username.toUpperCase();
    this.password = this.password.toUpperCase();

    this.loading = true;

    this.loginservice.Login(this.username, this.password, this.company_code)
      .subscribe(response => {
        this.loading = false;
        let user = response;
        if (user && user.access_token) {
          this.gs.IsLoginSuccess = true;
          this.gs.Access_Token = user.access_token;
          this.gs.globalVariables.user_pkid = user.userpkid;
          this.gs.globalVariables.user_code = user.usercode;
          this.gs.globalVariables.user_name = user.userName;
          this.gs.globalVariables.user_email = user.useremail;
          this.gs.globalVariables.user_company_id = user.usercompanyid;
          this.gs.globalVariables.user_company_code = user.usercompanycode;
          this.gs.globalVariables.user_branch_id = user.userbranchid;
          this.gs.globalVariables.sman_id = user.usersmanid;
          this.gs.globalVariables.sman_name = user.usersmanname;
          this.gs.baseLocalServerUrl = user.userlocalserver;
          this.gs.globalVariables.ipaddress = user.useripaddress;
          this.gs.globalVariables.tokenid = user.usertokenid;
          this.gs.globalVariables.user_branch_user = user.user_branch_user;
          // If a branch user hide ho entries
          if (user.user_branch_user == "Y")
            this.gs.globalVariables.hide_ho_entries = "Y";
          else
            this.gs.globalVariables.hide_ho_entries = "N";
        }

        if (this.gs.IsLoginSuccess) {
          
          if (this.gs.baseLocalServerUrl != "") {
            this.checkLocalServer();
          }
          else {
            this.errorMessage = "Login Success";
            this.router.navigate(['loginbranch'], { replaceUrl: true });
          }
        }
        else {
          this.errorMessage = "Login Failed";
        }
      },
      error => {
        this.loading = false;
        this.errorMessage = error.error.error_description;
      });

  }


  checkLocalServer() {

    this.loading = true;
    let SearchData = {
      user: "",
    };

    this.loginservice.CheckLocalServer(SearchData)
      .subscribe(response => {
        this.loading = false;

        if (response == null) {
          this.ErrorExternalLogin = 'External Login Not Allowed';
        }
        else if (response == "OK") {
          this.errorMessage = "Login Success";
          this.router.navigate(['loginbranch'], { replaceUrl: true });
        }
        else {
          this.ErrorExternalLogin = 'External Login Not Allowed';
        }
      },
      error => {
        this.loading = false;
        this.ErrorExternalLogin = 'External Login Not Allowed';
      });

  }



  Logout() {
    this.loginservice.Logout();
    this.errorMessage = 'Pls Login';
  }


}

