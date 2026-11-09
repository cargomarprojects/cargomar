
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { iBizdevelopReportModel, initialState, MarkMarketingm } from '../models/markmarketingm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class MarkMarketingService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    private screen_id = '';
    private screen_type = '';
    public state: iBizdevelopReportModel = { ...initialState };
    
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

        this.gs.appStates[this.screen_id] = this.state;
      }
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: MarkMarketingm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadVisit(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/LoadVisit', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    DashBoard(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/DashBoard', SearchData, this.gs.headerparam2('authorized'));
    }

    ProcessDownloadList(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/ProcessDownloadList', SearchData, this.gs.headerparam2('authorized'));
    }

    BizDevelopmentReport(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/BizDevelopmentReport', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadCustConvStatus(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/LoadCustConvStatus', SearchData, this.gs.headerparam2('authorized'));
    }

    EmailVisitDetails(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/EmailVisitDetails', SearchData, this.gs.headerparam2('authorized'));
    }

    GetCustDet(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/GetCustDet', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }
}

