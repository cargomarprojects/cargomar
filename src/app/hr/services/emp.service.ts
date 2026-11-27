
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emp, iEmpModel, initialState } from '../models/emp';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class EmpService {

  private screen_id = '';
  private screen_type = '';
  public state: iEmpModel = { ...initialState };
    
  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  public init(_screen_id: string, _screen_type: string) {
    this.screen_id = _screen_id;
    this.screen_type = _screen_type;
    this.loadState();
  }

  private loadState() {
    if (this.gs.appStates[this.screen_id])
      this.state = this.gs.appStates[this.screen_id];
    else {
      this.state = { ...initialState };
      this.state.Initialized = false;
      this.state.search_datetype = 'DOJ';
      this.state.from_date = '';
      this.state.to_date = '';
      this.state.searchstring = '';
      this.state.allbranch = false;
      this.state.bRelieved = false;
      this.state.searchconverted = '';
      this.state.radio_emp = 'EMPLOYEE',
      this.state.format_type = 'DEFAULT',
      // this.state.CustomReportList = [],

      this.gs.appStates[this.screen_id] = this.state;
    }
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Emp/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Emp/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Emp) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Emp/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Emp/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DownloadEmpDocs(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Emp/DownloadEmpDocs', SearchData, this.gs.headerparam2('authorized'));
  }

  GenerateDocs(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Emp/GenerateDocs', SearchData, this.gs.headerparam2('authorized'));
  }
}

