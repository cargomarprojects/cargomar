import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Router } from '@angular/router';
import { GlobalData } from '../models/globaldata';
import { GlobalVariables } from '../models/globalvariables';
import { DefaultValues } from '../models/defaultvalues';
import { Menum } from '../models/menum';
import { Modulem } from '../models/modulem';

import { Settings } from '../models/settings';
import { AppDetails } from '../models/appdetails';




@Injectable()
export class GlobalService {
  public Token: string;
  public Company_Name: string;
  public IsLoginSuccess: boolean = false;
  public IsAuthenticated: boolean = false;
  public Access_Token: string;
  public globalData: GlobalData;
  public globalVariables: GlobalVariables;
  public defaultValues: DefaultValues;

  public Hide_Menu = false;

  public appid = "";
  public reload_url = "";

  public Topbar_Email = "";
  public Topbar_Mob = "";

  public software_version_string: string = '1.649';

  public baseLocalServerUrl: string = "http://localhost:8080";
  public baseUrl: string = "http://localhost:5000";
  //public baseUrl: string = "";

  public appStates: { [key: string]: any } = {};

  // change this is false in production and update
  public isolderror: boolean = false;

  public Modules: Modulem[] = [];
  public MenuList: Menum[] = [];

  constructor(
    private http2: HttpClient,
    private location: Location,
    private router: Router) {
    this.Company_Name = "";
    this.globalVariables = new GlobalVariables;
    this.globalData = new GlobalData;
    this.InitdefaultValues();
  }

  public getGuid(): string {
    let uuid = UUID.UUID();
    return uuid.toUpperCase();
  }

  public CreateAppId() {
    this.appid = UUID.UUID();
    this.resetState();
  }

  public resetState() {
    this.appStates = {};
  }

  public getPagetitle(menucode: string): string {
    return this.MenuList.find(f => f.menu_code == menucode).menu_name;
  }

  public getMenu(menucode: string): Menum {
    return this.MenuList.find(f => f.menu_code == menucode);
  }

  CreateURL(menucode: string, type: string = "{_DEF_}") {
    var _url = '';
    var rec = this.MenuList.find(f => f.menu_code == menucode) as Menum;
    if (rec) {
      let params = new HttpParams();
      params = params.set('appid', this.appid);
      if (type == "{_DEF_}")
        params = params.set('parameter', rec.menu_route2);
      else {
        var p1 = JSON.parse(rec.menu_route2);
        p1.type = type;
        params = params.set('parameter', JSON.stringify(p1));
      }

      _url = window.location.protocol + "//" + window.location.host + '/' + rec.menu_route1 + '?' + params.toString();
    }
    return _url;
  }


  public getError(error: any) {
    if (this.isolderror)
      return JSON.parse(error.error).Message;
    else
      return error.error.Message;
  }

  /*
  public headerparam(type: string, company_code: string = '') {
    let headers = new Headers();
    let options = new RequestOptions({
      headers: headers,
    });
    if (type == 'login')
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
    if (type == 'authorized') {
      headers.append('Authorization', 'Bearer ' + this.Access_Token);
      headers.append('Content-Type', 'application/json');
    }

    if (type == 'authorized-fileupload') {
      headers.append('Authorization', 'Bearer ' + this.Access_Token);
      headers.delete('Content-Type');
    }

    if (type == 'anonymous') {
      headers.append('Content-Type', 'application/json');

    }
    if (type == 'excel') {
      headers.append('Authorization', 'Bearer ' + this.Access_Token);
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/x-msexcel');
      options.responseType = ResponseContentType.Blob;
    }
    if (company_code != '')
      headers.append('company-code', company_code);
    return options;
  }

  */


  public headerparam2(type: string, company_code: string = '') {
    let headers = new HttpHeaders();



    if (type == 'login')
      headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    if (type == 'authorized') {
      headers = headers.append('Authorization', 'Bearer ' + this.Access_Token);
      headers = headers.append('Content-Type', 'application/json');
    }

    if (type == 'authorized-fileupload') {
      headers = headers.append('Authorization', 'Bearer ' + this.Access_Token);
      headers = headers.delete('Content-Type');
    }

    if (type == 'anonymous') {
      headers = headers.append('Content-Type', 'application/json');

    }
    if (type == 'excel') {
      headers = headers.append('Authorization', 'Bearer ' + this.Access_Token);
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('Accept', 'application/x-msexcel');
      //options.responseType = ResponseContentType.Blob;
    }
    if (company_code != '')
      headers = headers.append('company-code', company_code);

    const options = {
      headers: headers,
    };

    return options;
  }


  public ClosePage(sPage: string, IsCloseButton = true) {
    if (IsCloseButton)
      this.router.navigate([sPage], { replaceUrl: true });
    else
      this.location.back();

  }


  public SendEmail(SearchData: any) {
    return this.http2.post<any>(this.baseUrl + "/api/Email/Common", SearchData, this.headerparam2('authorized'));
  }

  public SearchRecord(SearchData: any) {
    return this.http2.post<any>(this.baseUrl + "/api/Admin/Lov/SearchRecord", SearchData, this.headerparam2('authorized'));
  }

  public importData(SearchData: any) {
    if (SearchData.type == 'ITEM')
      return this.http2.post<any>(this.baseUrl + '/api/Operations/Item/ImportData', SearchData, this.headerparam2('authorized'));
  }


  public DownloadFile(report_folder: string, filename: string, filetype: string, filedisplayname: string = 'N') {
    let body = 'report_folder=' + report_folder + '&filename=' + filename + '&filetype=' + filetype + '&filedisplayname=' + filedisplayname;
    window.open(this.baseUrl + '/api/Admin/User/DownloadFile?' + body, "_blank");
  }

  public DownloadFileDirect(pkid: string) {
    //this.gs.globalVariables.report_folder,
    //filename,
    //filetype,
    //filedisplayname
    let SearchData = {
      pkid: pkid,
      'root_folder': this.defaultValues.root_folder,
      'sub_folder': this.defaultValues.sub_folder
    };

    this.http2.post<any>(this.baseUrl + "/api/General/GetFileName", SearchData, this.headerparam2('authorized')).subscribe(
      resp => {
        this.DownloadFile(this.globalVariables.report_folder, resp.record.doc_full_name, '', resp.record.doc_file_name);
      }, error => {
        alert(error);
      }
    )

  }


  public DownloadFileFromLocalhost(report_folder: string, filename: string, filetype: string, filedisplayname: string = 'N') {
    let body = 'report_folder=' + report_folder + '&filename=' + filename + '&filetype=' + filetype + '&filedisplayname=' + filedisplayname;

    window.open('https://software.cargomar.in/api/Admin/User/DownloadFile?' + body, "_blank");
    /*
    if ( window.location.toString().toLowerCase().indexOf('https') >= 0)
      window.open('https://cargomar.net/api/Admin/User/DownloadFile?' + body, "_blank");
    else
      window.open('http://cargomar.net/api/Admin/User/DownloadFile?' + body, "_blank");
    */

  }


  public roundNumber(_number: number, _precision: number) {
    var factor = Math.pow(10, _precision);
    var tempNumber = _number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  };

  // public roundNumber2(_number: number, _precision: number = 2) {
  //   const noAsString = _number.toFixed(_precision);
  //   return Number.parseFloat(noAsString);
  // };


  public async Login(_username: string, _password: string, _company_code: string): Promise<number> {
    var bRet = -1;
    var body = 'grant_type=' + 'password' + '&username=' + _username + '&password=' + _password;
    await this.http2.post<any>(this.baseUrl + "/Token", body, this.headerparam2('login', _company_code)).toPromise().then((response) => {
      let user = response;
      if (user && user.access_token) {
        this.IsLoginSuccess = true;
        this.Access_Token = user.access_token;
        this.globalVariables.user_pkid = user.userpkid;
        this.globalVariables.user_code = user.usercode;
        this.globalVariables.user_name = user.userName;
        this.globalVariables.user_password = _password;
        this.globalVariables.user_email = user.useremail;
        this.globalVariables.user_company_id = user.usercompanyid;
        this.globalVariables.user_company_code = user.usercompanycode;
        this.globalVariables.user_branch_id = user.userbranchid;
        this.globalVariables.sman_id = user.usersmanid;
        this.globalVariables.sman_name = user.usersmanname;
        this.globalVariables.tp_code = user.usertpcode;
        this.globalVariables.tp_name = user.usertpname;
        this.globalVariables.tp_type = user.usertptype;
        this.globalVariables.user_dsc_slno = user.userdscslno;

        this.globalVariables.emp_id = user.userempid;
        this.globalVariables.emp_code = user.userempcode;
        this.globalVariables.emp_name = user.userempname;
        this.globalVariables.emp_status = user.userempstatus;

        this.globalVariables.istp = false;
        if (user.usertpcode != '')
          this.globalVariables.istp = true;
        this.baseLocalServerUrl = user.userlocalserver;
        this.globalVariables.ipaddress = user.useripaddress;
        this.globalVariables.tokenid = user.usertokenid;
        this.globalVariables.user_branch_user = user.user_branch_user;
        this.globalVariables.user_show_payroll = user.user_show_payroll;

        // If a branch user hide ho entries
        if (user.user_branch_user == "Y")
          this.globalVariables.hide_ho_entries = "Y";
        else
          this.globalVariables.hide_ho_entries = "N";
      }

      if (this.IsLoginSuccess) {
        bRet = 0;
      }
      else {
        alert('Login Failed');
      }
    }, error => {
      alert(error.error.error_description);
    });
    return bRet;
  }

  public async checkLocalServer(): Promise<number> {
    var bRet = -1;
    let SearchData = {
      user: "",
    };
    // a service is installed in local iis server and checked whether it is accessible
    await this.http2.post<any>(this.baseLocalServerUrl + "/api/values/GetVersion", SearchData, this.headerparam2('anonymous')).toPromise().then((response) => {
      if (response == "OK")
        bRet = 0;
      else
        alert('External Login Not Allowed');
    }, error => {
      bRet = -1;
      alert('External Login Not Allowed ' + error.error.error_description);
    });
    return bRet;
  }




  public InitdefaultValues() {

    this.defaultValues = new DefaultValues;
    this.defaultValues.today = new Date().toISOString().slice(0, 10);
    this.defaultValues.monthbegindate = this.getNewdate(0);
    this.defaultValues.lastmonthdate = this.getNewdate(30);//get today -30 days
    this.defaultValues.print_cheque_only_after_ho_approved = 'N';
    this.defaultValues.tdsos_list_format = 'BRANCH-WISE';
    this.defaultValues.bl_fmc_no = "031793";
    this.globalData.cost_sea_fromdate = this.defaultValues.monthbegindate;
    this.globalData.cost_sea_todate = this.defaultValues.today;
    this.globalData.cost_air_fromdate = this.defaultValues.monthbegindate;
    this.globalData.cost_air_todate = this.defaultValues.today;
    this.globalData.cost_drcr_fromdate = this.defaultValues.monthbegindate;
    this.globalData.cost_drcr_todate = this.defaultValues.today;
    this.globalData.cost_agentinvoice_fromdate = this.defaultValues.monthbegindate;
    this.globalData.cost_agentinvoice_todate = this.defaultValues.today;

    this.globalData.job_fromdate = this.defaultValues.lastmonthdate;
    this.globalData.job_todate = this.defaultValues.today;
    this.globalData.hbl_fromdate = this.defaultValues.lastmonthdate;
    this.globalData.hbl_todate = this.defaultValues.today;
    this.globalData.mbl_fromdate = this.defaultValues.lastmonthdate;
    this.globalData.mbl_todate = this.defaultValues.today;
    this.globalData.ledger_fromdate = this.defaultValues.lastmonthdate;
    this.globalData.ledger_todate = this.defaultValues.today;

    this.globalData.mark_fromdate = this.defaultValues.monthbegindate;
    this.globalData.mark_todate = this.defaultValues.today;

    this.globalData.arap_fromdate = this.defaultValues.lastmonthdate;
    this.globalData.arap_todate = this.defaultValues.today;
  }

  InitdefaultValues2(settingslist: Settings[]) {
    settingslist.forEach(rec => {
      if (rec.parentid == this.globalVariables.comp_code) {
        if (rec.caption == 'UNIT-PCS') {
          this.defaultValues.param_unit_pcs_id = rec.id;
          this.defaultValues.param_unit_pcs_code = rec.code;
        }
        if (rec.caption == 'UNIT-KGS') {
          this.defaultValues.param_unit_kgs_id = rec.id;
          this.defaultValues.param_unit_kgs_code = rec.code;
        }
        if (rec.caption == 'UNIT-CTN') {
          this.defaultValues.param_unit_ctn_id = rec.id;
          this.defaultValues.param_unit_ctn_code = rec.code;
        }
        if (rec.caption == 'LOCAL-CURRENCY') {
          this.defaultValues.param_curr_local_id = rec.id;
          this.defaultValues.param_curr_local_code = rec.code;
        }
        if (rec.caption == 'FOREIGN-CURRENCY') {
          this.defaultValues.param_curr_foreign_id = rec.id;
          this.defaultValues.param_curr_foreign_code = rec.code;
        }

        if (rec.caption == 'ROOT-FOLDER')
          this.defaultValues.root_folder = rec.name;

        if (rec.caption == 'SUB-FOLDER')
          this.defaultValues.sub_folder = rec.name;


        if (rec.caption == 'BL-REG-NO')
          this.defaultValues.bl_reg_no = rec.name;

        if (rec.caption == 'BL-ISSUED-BY1')
          this.defaultValues.bl_issued_by1 = rec.name;
        if (rec.caption == 'BL-ISSUED-BY2')
          this.defaultValues.bl_issued_by2 = rec.name;
        if (rec.caption == 'BL-ISSUED-BY3')
          this.defaultValues.bl_issued_by3 = rec.name;
        if (rec.caption == 'BL-ISSUED-BY4')
          this.defaultValues.bl_issued_by4 = rec.name;
        if (rec.caption == 'BL-ISSUED-BY5')
          this.defaultValues.bl_issued_by5 = rec.name;

      }
      if (rec.parentid == this.globalVariables.branch_code) {
        if (rec.caption == 'GSTIN') {
          this.defaultValues.gstin = rec.name;
          this.globalVariables.gstin = rec.name;
        }
        if (rec.caption == 'GST-STATE')
          this.defaultValues.gstin_state_code = rec.code;
        if (rec.caption == 'BL-ISSUED-PLACE')
          this.defaultValues.bl_issued_place = rec.name;
        if (rec.caption == 'DOC-PREFIX')
          this.defaultValues.doc_prefix = rec.name;
        if (rec.caption == 'CHQ_PRINT_HO_APRVD')
          this.defaultValues.print_cheque_only_after_ho_approved = rec.name;
        if (rec.caption == 'BR-ACC-EMAIL')
          this.defaultValues.branch_accounts_email = rec.name;
      }


    });
  }


  public CreateAppDetailsRecord() {
    const Record = new AppDetails();
    Record.user_appid = this.appid;
    Record.user_code = this.globalVariables.user_code;
    Record.user_password = this.globalVariables.user_password;
    Record.user_company_code = this.globalVariables.user_company_code;
    Record.user_branch_id = this.globalVariables.branch_pkid;
    Record.user_year_id = this.globalVariables.year_pkid;
    Record.user_hide_menu = this.Hide_Menu;
    Record.user_logged_out = false;
    Record._globalvariables = this.globalVariables;
    return Record;
  }

  public async saveAppDetails(Record: AppDetails): Promise<number> {
    var iRet = -1;
    await this.http2.post<any>(this.baseUrl + "/api/Admin/User/SaveAppDetails", Record, this.headerparam2('authorized')).toPromise().then((response) => {
      iRet = 0;
    }, error => {
      alert(this.getError(error));
    });
    return iRet;
  }

  public async LoadMenu(_branchid: string, _yearid: string): Promise<number> {
    let bRet = -1;
    let SearchData = {
      userid: this.globalVariables.user_pkid,
      usercode: this.globalVariables.user_code,
      compid: this.globalVariables.user_company_id,
      compcode: this.globalVariables.user_company_code,
      branchid: _branchid,
      yearid: _yearid,
      ipaddress: this.globalVariables.ipaddress,
      tokenid: this.globalVariables.tokenid,
      istp: this.globalVariables.istp
    };

    if (_branchid == '') {
      alert('Branch Not Selected');
      return bRet;
    }

    if (_yearid == '') {
      alert('Year Not Selected');
      return bRet;
    }


    //this.loginservice.LoadMenu(SearchData) .subscribe(response => {
    await this.http2.post<any>(this.baseUrl + "/api/Admin/User/LoadMenu", SearchData, this.headerparam2('authorized')).toPromise().then((response) => {
      this.MenuList = response.list;
      this.Modules = response.modules;
      var grpname = '';
      this.MenuList.forEach(element => {
        if (element.menu_displayed) {
          if (grpname != element.menu_group_name)
            grpname = element.menu_group_name;
          else
            element.menu_group_name = null;
        }
      });

      let data = response.data;

      let airjob = response.airjob;
      let seajob = response.seajob;
      let seajobcntr = response.seajobcntr;
      let foreigncurr = response.foreigncurr;
      let payrollsetting = response.payrollsetting;

      this.globalVariables.comp_pkid = data.comp_pkid;
      this.globalVariables.comp_code = data.comp_code;
      this.globalVariables.comp_name = data.comp_name;

      this.Company_Name = data.comp_name;

      this.globalVariables.branch_pkid = data.branch_pkid;
      this.globalVariables.branch_code = data.branch_code;
      this.globalVariables.branch_name = data.branch_name;
      this.globalVariables.branch_location = data.branch_location;

      this.globalVariables.branch_type = data.branch_type;
      this.globalVariables.branch_number = data.branch_number;

      this.globalVariables.year_pkid = data.year_pkid;
      this.globalVariables.year_code = data.year_code;
      this.globalVariables.year_name = data.year_name;
      this.globalVariables.year_prefix = data.year_prefix;

      this.globalVariables.year_start_date = data.year_start_date;
      this.globalVariables.year_end_date = data.year_end_date;
      this.globalVariables.year_end_date = data.year_end_date;
      this.globalVariables.year_closed = data.year_closed;

      this.globalVariables.year_einv_start_date = data.year_einv_start_date;

      this.globalVariables.report_folder = data.report_folder;

      if (data.user_dsc_slno.length > 0) //Otherwise from usermaster
        this.globalVariables.user_dsc_slno = data.user_dsc_slno;

      this.InitdefaultValues();
      this.setTopbarContact(this.globalVariables.comp_code);
      this.InitdefaultValues2(response.settings);

      //Air Export Job Default Loading
      this.defaultValues.air_job_place_receipt_id = airjob.job_place_receipt_id;
      this.defaultValues.air_job_place_receipt_code = airjob.job_place_receipt_code;
      this.defaultValues.air_job_place_receipt_name = airjob.job_place_receipt_name;
      this.defaultValues.air_job_pre_carriage_id = airjob.job_pre_carriage_id;
      this.defaultValues.air_job_pre_carriage_code = airjob.job_pre_carriage_code;
      this.defaultValues.air_job_pre_carriage_name = airjob.job_pre_carriage_name;
      this.defaultValues.air_job_origin_state_id = airjob.job_origin_state_id;
      this.defaultValues.air_job_origin_state_code = airjob.job_origin_state_code;
      this.defaultValues.air_job_origin_state_name = airjob.job_origin_state_name;
      this.defaultValues.air_job_pol_id = airjob.job_pol_id;
      this.defaultValues.air_job_pol_code = airjob.job_pol_code;
      this.defaultValues.air_job_pol_name = airjob.job_pol_name;
      this.defaultValues.air_job_cha_id = airjob.job_cha_id;
      this.defaultValues.air_job_cha_code = airjob.job_cha_code;
      this.defaultValues.air_job_cha_name = airjob.job_cha_name;
      this.defaultValues.air_job_agent_id = airjob.job_agent_id;
      this.defaultValues.air_job_agent_code = airjob.job_agent_code;
      this.defaultValues.air_job_agent_name = airjob.job_agent_name;
      this.defaultValues.air_job_commodity_id = airjob.job_commodity_id;
      this.defaultValues.air_job_commodity_code = airjob.job_commodity_code;
      this.defaultValues.air_job_commodity_name = airjob.job_commodity_name;
      this.defaultValues.air_job_edi_id = airjob.job_edi_id;
      this.defaultValues.air_job_edi_code = airjob.job_edi_code;
      this.defaultValues.air_job_edi_name = airjob.job_edi_name;
      this.defaultValues.air_job_nature = airjob.job_nature;
      this.defaultValues.air_job_terms = airjob.job_terms;
      this.defaultValues.air_job_status = airjob.job_status;
      this.defaultValues.air_job_cargo_nature = airjob.job_cargo_nature;
      this.defaultValues.air_job_marks = airjob.job_marks;
      this.defaultValues.air_job_origin_country_id = airjob.job_origin_country_id;
      this.defaultValues.air_job_origin_country_code = airjob.job_origin_country_code;
      this.defaultValues.air_job_origin_country_name = airjob.job_origin_country_name;


      //Sea Export Job Default Loading
      this.defaultValues.sea_job_place_receipt_id = seajob.job_place_receipt_id;
      this.defaultValues.sea_job_place_receipt_code = seajob.job_place_receipt_code;
      this.defaultValues.sea_job_place_receipt_name = seajob.job_place_receipt_name;
      this.defaultValues.sea_job_pre_carriage_id = seajob.job_pre_carriage_id;
      this.defaultValues.sea_job_pre_carriage_code = seajob.job_pre_carriage_code;
      this.defaultValues.sea_job_pre_carriage_name = seajob.job_pre_carriage_name;
      this.defaultValues.sea_job_origin_state_id = seajob.job_origin_state_id;
      this.defaultValues.sea_job_origin_state_code = seajob.job_origin_state_code;
      this.defaultValues.sea_job_origin_state_name = seajob.job_origin_state_name;
      this.defaultValues.sea_job_pol_id = seajob.job_pol_id;
      this.defaultValues.sea_job_pol_code = seajob.job_pol_code;
      this.defaultValues.sea_job_pol_name = seajob.job_pol_name;
      this.defaultValues.sea_job_cha_id = seajob.job_cha_id;
      this.defaultValues.sea_job_cha_code = seajob.job_cha_code;
      this.defaultValues.sea_job_cha_name = seajob.job_cha_name;
      this.defaultValues.sea_job_agent_id = seajob.job_agent_id;
      this.defaultValues.sea_job_agent_code = seajob.job_agent_code;
      this.defaultValues.sea_job_agent_name = seajob.job_agent_name;
      this.defaultValues.sea_job_commodity_id = seajob.job_commodity_id;
      this.defaultValues.sea_job_commodity_code = seajob.job_commodity_code;
      this.defaultValues.sea_job_commodity_name = seajob.job_commodity_name;
      this.defaultValues.sea_job_edi_id = seajob.job_edi_id;
      this.defaultValues.sea_job_edi_code = seajob.job_edi_code;
      this.defaultValues.sea_job_edi_name = seajob.job_edi_name;
      this.defaultValues.sea_job_nature = seajob.job_nature;
      this.defaultValues.sea_job_terms = seajob.job_terms;
      this.defaultValues.sea_job_status = seajob.job_status;
      this.defaultValues.sea_job_cargo_nature = seajob.job_cargo_nature;
      this.defaultValues.sea_job_marks = seajob.job_marks;
      this.defaultValues.sea_job_origin_country_id = seajob.job_origin_country_id;
      this.defaultValues.sea_job_origin_country_code = seajob.job_origin_country_code;
      this.defaultValues.sea_job_origin_country_name = seajob.job_origin_country_name;

      //Sea Export Job Container Default Loading
      this.defaultValues.sea_jobcntr_sealtype = seajobcntr.cntr_sealtype;

      //foreign currency details
      this.defaultValues.param_curr_foreign_fwdrate = foreigncurr.param_rate;
      this.defaultValues.param_curr_foreign_clrrate = foreigncurr.param_id1;

      //Payroll settings details
      this.defaultValues.pf_col_excluded = payrollsetting.ps_pf_col_excluded;
      this.defaultValues.pf_percent = payrollsetting.ps_pf_per;
      this.defaultValues.pf_limit = payrollsetting.ps_pf_cel_limit;
      this.defaultValues.esi_emply_percent = payrollsetting.ps_esi_emply_per;
      this.defaultValues.esi_limit = payrollsetting.ps_esi_limit;
      this.defaultValues.pf_cel_limit_amt = payrollsetting.ps_pf_cel_limit_amt;
      this.defaultValues.pf_emplr_pension_per = payrollsetting.ps_pf_emplr_pension_per;
      this.defaultValues.pf_br_region = payrollsetting.ps_pf_br_region;
      this.defaultValues.esi_col_excluded = payrollsetting.ps_esi_col_excluded;

      if (this.globalVariables.comp_pkid == '') {
        alert("Invalid Company");
        return bRet;
      } else if (this.globalVariables.branch_pkid == '') {
        alert("Invalid Branch");
        return bRet;
      } else if (this.globalVariables.year_pkid == '') {
        alert("Invalid Fin-Year");
        return bRet;
      } else {
        this.IsAuthenticated = this.Hide_Menu ? false : true;
        bRet = 0;
      }
      //this.router.navigate(['home'], { replaceUrl: true });
    }, error => {
      bRet = -1;
      alert(this.getError(error));

    });
    return bRet;
  }




  public getNewdate(_days: number) {
    var nDate = new Date();
    if (_days <= 0)
      nDate.setDate(1);
    else
      nDate.setDate(nDate.getDate() - _days);
    return nDate.toISOString().slice(0, 10);
  }

  ConvertDate2DisplayFormat(_strdate: string) {
    let retdate: string = '';
    if (_strdate.includes("-")) {
      var strdt = _strdate.split('-');
      let dtyear: string = strdt[0];
      let dtmonth: string = strdt[1];
      let dtday: string = strdt[2];
      retdate = dtday + '/' + dtmonth + '/' + dtyear;
    } else
      retdate = _strdate;
    return retdate;
  }


  ConvertDate(strDate: string) {
    try {
      const dt = new Date(strDate);
      const m = dt.getMonth() + 1;
      const d = dt.getDate();
      const y = dt.getFullYear();
      const retDate = y + "-" + m + '-' + d;
      return retDate;
    }
    catch (err) {
      return '';
    }
  }

  public getGstType(_gstin: string, _gstin_state_code: string, isSez: boolean, bISGT_Exception = false) {
    let _type: string = '';
    if (_gstin.length == 15) {
      if (_gstin.substring(0, 2) == this.defaultValues.gstin_state_code)
        _type = 'INTRA-STATE';
      else
        _type = 'INTER-STATE';
    }
    else if (_gstin_state_code.length == 2) {
      if (_gstin_state_code == this.defaultValues.gstin_state_code)
        _type = 'INTRA-STATE';
      else
        _type = 'INTER-STATE';
    }
    if (isSez)
      _type = 'INTER-STATE';

    if (bISGT_Exception) {
      if (_type == 'INTRA-STATE')
        _type = 'INTER-STATE';
    }

    return _type;
  }


  public roundWeight(_number: number, _category: string) {

    let _precision: number;
    _precision = 0;
    if (_category == "CBM")
      _precision = 3;
    else if (_category == "NTWT")
      _precision = 3;
    else if (_category == "GRWT")
      _precision = 3;
    else if (_category == "CHWT")
      _precision = 3;
    else if (_category == "PCS")
      _precision = 3;
    else if (_category == "PKG")
      _precision = 0;
    else if (_category == "EXRATE")
      _precision = 2;
    else if (_category == "RATE")
      _precision = 2;
    else if (_category == "AMT")
      _precision = 2

    var factor = Math.pow(10, _precision);
    var tempNumber = _number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  };

  public IsBranchWiseCodeOK(Branch_Type: string, accode: string, maincode: string): Boolean {
    let bRet: boolean = true;
    let codetype: string = '';
    if (accode != maincode) {

      if (maincode == '1101' || maincode == '1102' || maincode == '1103' || maincode == '1104' || maincode == '1105' || maincode == '1106' || maincode == '1107')
        codetype = 'SEA';
      if (maincode == '1301' || maincode == '1302' || maincode == '1303' || maincode == '1304' || maincode == '1305' || maincode == '1306' || maincode == '1307')
        codetype = 'SEA';
      if (maincode == '1201' || maincode == '1202' || maincode == '1203' || maincode == '1204' || maincode == '1205')
        codetype = 'AIR';
      if (maincode == '1401' || maincode == '1402' || maincode == '1403' || maincode == '1404' || maincode == '1405')
        codetype = 'AIR';
      if (Branch_Type == "BOTH") {
        codetype = 'BOTH';
      }
      if (codetype == 'SEA' || codetype == 'AIR' || codetype == 'BOTH') {
        if (Branch_Type != codetype) {
          bRet = false;
        }
      }
    }
    return bRet;
  }


  Naviagete(menu_route: string, jsonstring: string) {
    let id = this.getGuid();
    this.router.navigate([menu_route], { queryParams: { id: id, parameter: jsonstring }, replaceUrl: false });

  }

  public IsValidTelephone(_tel: string, _maxval: number = 12): Boolean {
    let bRet: boolean = false;
    let pattrn: string = "^([0-9]{6," + _maxval.toString() + "})$";
    var regexp = new RegExp(pattrn);
    bRet = regexp.test(_tel.trim());
    return bRet;
  }

  public IsValidEmail(_em: string): Boolean {
    let bRet: boolean = false;
    var regexp = new RegExp('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$');
    bRet = regexp.test(_em.trim());
    return bRet;
  }

  public isNull(iData: any): boolean {
    if (iData == null || iData == undefined)
      return true;
    else
      return false;
  }

  public isBlank(iData: any): boolean {
    if (iData == null || iData == undefined || iData == '')
      return true;
    else
      return false;
  }

  public isZero(iData: any): boolean {
    if (iData == null || iData == undefined || iData == 0)
      return true;
    else
      return false;
  }

  public CompareDate(d1: string, d2: string) {
    if (this.isBlank(d1) || this.isBlank(d2))
      return "";
    var p1 = d1.split('-');
    var p2 = d2.split('-');
    var date1 = new Date(parseInt(p1[0]), parseInt(p1[1]) - 1, parseInt(p1[2]));
    var date2 = new Date(parseInt(p2[0]), parseInt(p2[1]) - 1, parseInt(p2[2]));
    if (date1 < date2)
      return "<";
    else if (date1 > date2)
      return ">";
    else
      return "=";
  }

  getURLParam(param: string) {
    return new URLSearchParams(window.location.search).get(param);
  }

  getURLParameter(uri: string, param: string) {
    return new URLSearchParams(uri).get(param);
  }


  getlocalStorageFileName() {
    console.log(this.defaultValues.today + "-" + this.appid);
    return this.defaultValues.today + "-" + this.appid;
  }

  isAppidExtistsInLocalStorage() {
    return localStorage.getItem(this.getlocalStorageFileName()) ? true : false;
  }

  Save2LocalStorage() {
    const app_settings = {
      appid: this.appid,
      user_code: this.globalVariables.user_code,
      user_password: this.globalVariables.user_password,
      company_code: this.globalVariables.user_company_code,
      branch_pkid: this.globalVariables.branch_pkid,
      year_pkid: this.globalVariables.year_pkid,
      hidemainmenu: false,
    }
    localStorage.setItem(this.getlocalStorageFileName(), JSON.stringify(app_settings));
  }



  RemoveLocalStorage() {
    console.log('removing local storage Started : ', this.defaultValues.today);
    for (var key in localStorage) {
      if (localStorage.getItem(key)) {
        if (!key.startsWith(this.defaultValues.today)) {
          localStorage.removeItem(key);
        }
      }
    }
  }

  ReadLocalStorage() {
    const app_settings = JSON.parse(localStorage.getItem(this.getlocalStorageFileName()));

    this.appid = app_settings.appid;
    this.globalVariables.user_code = app_settings.user_code;
    this.globalVariables.user_password = app_settings.user_password;
    this.globalVariables.user_company_code = app_settings.company_code;
    this.globalVariables.branch_pkid = app_settings.branch_pkid;
    this.globalVariables.year_pkid = app_settings.year_pkid;
    this.Hide_Menu = app_settings.hidemainmenu;

    console.log(app_settings);
  }

  public async GetAppDetails(appid: string): Promise<number> {
    let SearchString = {
      appid: appid
    }
    var iRet = -1;
    await this.http2.post<any>(this.baseUrl + "/api/Admin/User/GetAppDetails", SearchString, this.headerparam2('anonymous')).toPromise().then((response) => {
      this.appid = response.record.user_appid;
      this.globalVariables.user_code = response.record.user_code;
      this.globalVariables.user_password = response.record.user_password;
      this.globalVariables.user_company_code = response.record.user_company_code;
      this.globalVariables.branch_pkid = response.record.user_branch_id;
      this.globalVariables.year_pkid = response.record.user_year_id;
      this.Hide_Menu = response.record.user_hide_menu;
      iRet = 0;
    }, error => {
      alert(this.getError(error));
    });
    return iRet;
  }


  public makecall(url: string, SearchData: any) {
    return this.http2.post<any>(this.baseUrl + url, SearchData, this.headerparam2('authorized'));
  }

  public getFile(report_folder: string, filename: string, filetype: string, filedisplayname: string = 'N') {
    let body = 'report_folder=' + report_folder + '&filename=' + filename + '&filetype=' + filetype + '&filedisplayname=' + filedisplayname;
    return this.http2.get(this.baseUrl + '/api/Master/Param/DownloadFile?' + body, { responseType: 'blob' })


  }


  public ProperFileName(str: string) {
    let sRet: string = str;
    try {
      sRet = sRet.replace("\\", "");
      sRet = sRet.replace("/", "");
      sRet = sRet.replace(":", "");
      sRet = sRet.replace("*", "");
      sRet = sRet.replace("?", "");
      sRet = sRet.replace("<", "");
      sRet = sRet.replace(">", "");
      sRet = sRet.replace("|", "");
      sRet = sRet.replace("'", "");
      sRet = sRet.replace("#", "");
      sRet = sRet.replace("&", "");
      sRet = sRet.replace("%", "");
    }
    catch (Exception) {
    }
    return sRet;

  }

  public IsPayrollRecord(_acc_code: string): boolean {
    if (_acc_code == '1507' || _acc_code == '1532'
      || _acc_code == '1535' || _acc_code == '1510'
      || _acc_code == '1545' || _acc_code == '1511'
      || _acc_code == '1515001' || _acc_code == '1515002'
    )
      return true;
    else
      return false;
  }

  public IsCourierCode(jv_acc_code: string) {
    if (jv_acc_code == '1105033'
      || jv_acc_code == '1205030'
      || jv_acc_code == '1105040'
      || jv_acc_code == '1526'
    )
      return true;
    else
      return false;
  }

  public IsIgstCode(jv_acc_code: string, docdate: string) {
    let isIgstCode = false;
    if (jv_acc_code == '1105111'
      || jv_acc_code == '1205111'
      || jv_acc_code == '1205112'
      || jv_acc_code == '1205113'
      || jv_acc_code == '1205114'
      || jv_acc_code == '1205115'
      || jv_acc_code == '1205116'
      || jv_acc_code == '1205117'
      || jv_acc_code == '1205138'
      || jv_acc_code == '1205142'
    )
      isIgstCode = true;
    else
      isIgstCode = false;

    // As per new GST Act after export freight is
    if (isIgstCode) {
      let ctype = this.CompareDate(docdate, "2023-09-30");
      if (ctype == ">")
        isIgstCode = false;
    }
    return isIgstCode;
  }


  public isTdsPaidAccount(acc_code: string = '') {
    let bRet = false;
    if (acc_code == 'TDSPAID' || acc_code == 'TDSPAIDC/F') {
      bRet = true;
    }
    return bRet;
  }




  public IsWrongDrCode(jv_acc_code: string) {
    if (jv_acc_code == '195'
      || jv_acc_code == '194IA'
      || jv_acc_code == 'TDSPAY'
      || jv_acc_code == '194H'
      || jv_acc_code == '194C'
      || jv_acc_code == '194'
      || jv_acc_code == '194A'
      || jv_acc_code == '194J'
      || jv_acc_code == '194I'
      || jv_acc_code == '192B'
    )
      return true;
    else
      return false;

  }
  public IsWrongCrCode(jv_acc_code: string) {
    if (jv_acc_code == ''
    )
      return true;
    else
      return false;

  }

  public IsTdsPayableCode(jv_acc_code: string) {
    if (jv_acc_code == '194A'
      || jv_acc_code == '194B'
      || jv_acc_code == '194C'
      || jv_acc_code == '194H'
      || jv_acc_code == '194I'
      || jv_acc_code == '194IA'
      || jv_acc_code == '194J'
      || jv_acc_code == '192B'
      || jv_acc_code == '195'
    )
      return true;
    else
      return false;
  }


  public CSVToJSON(csv: string): any[] {
    const lines = csv.split('\n');
    const _keys = lines[0].split('\t');

    let keys = _keys.map(col => {
      // return col.replace(" ", "").toLowerCase();//replace one blank space in a string
      return col.replace(/ /gi, "").replace(/-/gi, "").toLowerCase();//replace all blank space in a string
    });

    return lines.slice(1).map(line => {
      return line.split('\t').reduce((acc, cur, i) => {
        const toAdd = {};
        toAdd[keys[i]] = cur;
        return { ...acc, ...toAdd };
      }, {});
    });
  };

  public isLatestFinancialYear(): boolean {

    var currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; //one is added to getexact month
    const currentFinancialYear = currentMonth > 3 ? currentYear : currentYear - 1; //if after march (>3) then current year other wise previous year

    if (this.globalVariables.year_code == currentFinancialYear.toString())
      return true;
    else
      return false;
  };

  public setTopbarContact(_comp_code: string) {
    if (_comp_code == 'DVT') {
      this.Topbar_Email = 'info@divitsoftlabs.com';
      this.Topbar_Mob = '+91-484-4131606';
    } else {
      this.Topbar_Email = 'softwaresupport@cargomar.in';
      this.Topbar_Mob = '+91-484-4131600';
    }
  }

}
