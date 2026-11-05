
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { Dsr, iDsrModel, initialState } from '../models/dsr';

@Injectable()
export class DsrService {

  private screen_id = '';
  public state: iDsrModel = { ...initialState };

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  public init(_screen_id: string) {
    this.screen_id = _screen_id;
    this.loadState();
  }

  private loadState() {
    if (this.gs.appStates[this.screen_id])
      this.state = this.gs.appStates[this.screen_id];
    else {
      this.state = { ...initialState };
      this.InitValues();
      this.gs.appStates[this.screen_id] = this.state;
    }
  }

  InitValues() {
    if (this.gs.globalVariables.istp)
      this.state.tp_code = this.gs.globalVariables.tp_code;
    this.state.type_date = "DATE";
    this.state.filter_date_type = "JOB";
    this.state.job_type = "ALL";
    this.state.RecordList = [];
    this.state.branch_code = this.gs.globalVariables.branch_code;
    this.state.branch_name = this.gs.globalVariables.branch_name;
    this.state.from_date = this.gs.defaultValues.monthbegindate;
    this.state.to_date = this.gs.defaultValues.today;
    this.state.sman_id = this.gs.globalVariables.sman_id;
    this.state.sman_code = '';
    this.state.sman_name = this.gs.globalVariables.sman_name;
    this.state.format_type = 'GENERAL';
    this.state.all_br_list = false;
  }

  DsrList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/DsrList', SearchData, this.gs.headerparam2('authorized'));
  }

  Loadtplist(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/Loadtplist', SearchData, this.gs.headerparam2('authorized'));
  }

  VolumeReport(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/VolumeReport', SearchData, this.gs.headerparam2('authorized'));
  }
  
  UpdateDsrRemarks(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ReportList/UpdateDsrRemarks', SearchData, this.gs.headerparam2('authorized'));

  }
}

