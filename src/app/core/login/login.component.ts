import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Companym } from '../models/company';
import { GlobalService } from '../services/global.service';
import { LoginService } from '../services/login.service';

//edited joy 10/100/2021
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
  show_pwd_visible: boolean = false;

  company_code: string = '';

  sub: any;
  loading = false;
  showlogin = false;
  otpTimer = 0;
  otpInterval: any;
  showOtpTimer = false;
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
        this.gs.setTopbarContact(this.company_code);
        this.getCompanyName();

        if (this.gs.changeBrData.user_login == "BRANCH") {
          this.username = this.gs.changeBrData.user_code;
          this.password = this.gs.changeBrData.user_pwd;
          this.company_code = this.gs.changeBrData.user_comp_code;
          this.Login();
        }
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

  GenerateOtp() {

    if (this.gs.isBlank(this.username)) {
      alert('Login ID Cannot Be Blank');
      return;
    }

    if (this.gs.isBlank(this.company_code)) {
      alert('Please Select Company');
      return;
    }

    this.errorMessage = '';
    this.loading = true;
    let SearchData = {
      user_code: this.username,
      company_code: this.company_code,
      report_folder: "c:\\reports"
    };

    this.loginservice.GenerateOtp(SearchData)
      .subscribe(response => {
        this.loading = false;

        if (response.msg) {
          this.errorMessage = response.msg;
          // alert(response.msg);
        }

        if (response.bmail)
          this.startOtpTimer();
      },
        error => {
          this.loading = false;
          alert(error.error.Message);
        });
  }

  startOtpTimer() {
    this.otpTimer = 60; // 1 minute
    this.showOtpTimer = true;

    if (this.otpInterval)
      clearInterval(this.otpInterval);

    this.otpInterval = setInterval(() => {
      this.otpTimer--;

      if (this.otpTimer <= 0) {
        clearInterval(this.otpInterval);
        this.showOtpTimer = false;
        this.errorMessage = '';
      }
    }, 1000);
  }

  passwordVisibility() {
    this.show_pwd_visible = !this.show_pwd_visible;
  }
}
