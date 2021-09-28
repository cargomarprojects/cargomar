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

  //username: string = '';
  //password: string = '';

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

}

