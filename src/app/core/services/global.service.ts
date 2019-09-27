import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Router } from '@angular/router';
import { GlobalData } from '../models/globaldata';
import { GlobalVariables } from '../models/globalvariables';
import { DefaultValues } from '../models/defaultvalues';
import { Menum } from '../models/menum';
import { Modulem } from '../models/modulem';
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
  
  public baseLocalServerUrl: string = "http://localhost:8080";
  public baseUrl: string = "http://localhost:5000";

  
 
  // change this is false in production and update
  public isolderror: boolean = false;

  public Modules: Modulem[] = [];
  public MenuList: Menum[] = [];

  constructor(
    private http2: HttpClient,
    private location : Location,
    private router: Router) {
    this.Company_Name = "CARGOMAR (P) LTD";
    this.globalVariables = new GlobalVariables;
    this.globalData = new GlobalData;
    this.InitdefaultValues();
  }

  public getGuid(): string {
    let uuid = UUID.UUID();
    return uuid.toUpperCase();
  }

  public getPagetitle(menucode: string): string {
    return this.MenuList.find(f => f.menu_code == menucode).menu_name;
  }

  public getMenu(menucode: string): Menum {
    return this.MenuList.find(f => f.menu_code == menucode);
  }

  public getError(error : any) {
    if (this.isolderror)
      return JSON.parse(error.error).Message;
    else
      return  error.error.Message;
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


  public ClosePage(sPage: string,  IsCloseButton = true) {
    if ( IsCloseButton)
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

  public DownloadFile(report_folder: string, filename: string, filetype: string, filedisplayname: string = 'N') {
    let body = 'report_folder=' + report_folder + '&filename=' + filename + '&filetype=' + filetype + '&filedisplayname=' + filedisplayname;
    window.open(this.baseUrl + '/api/Admin/User/DownloadFile?' + body, "_blank");
  }


  public roundNumber(_number: number, _precision: number) {
    var factor = Math.pow(10, _precision);
    var tempNumber = _number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  };

  public InitdefaultValues() {

    this.defaultValues = new DefaultValues;
    this.defaultValues.today = new Date().toISOString().slice(0, 10);
    this.defaultValues.monthbegindate = this.getNewdate(0);
    this.defaultValues.lastmonthdate = this.getNewdate(30);//get today -30 days
    this.defaultValues.print_cheque_only_after_ho_approved = 'N';
    
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

  }
  public getNewdate(_days: number) {
    var nDate = new Date();
    if (_days <= 0)
      nDate.setDate(1);
    else
      nDate.setDate(nDate.getDate() - _days);
    return nDate.toISOString().slice(0, 10);
  }

  public getGstType(_gstin: string, _gstin_state_code: string, isSez: boolean, bISGT_Exception = false ) {
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

    if ( bISGT_Exception){
      if ( _type == 'INTRA-STATE')
        _type = 'INTER-STATE' ;
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


  Naviagete(menu_route : string, jsonstring : string) {
    let id = this.getGuid();
    this.router.navigate([menu_route], { queryParams: { id: id, parameter: jsonstring }, replaceUrl: false });

  }



}
