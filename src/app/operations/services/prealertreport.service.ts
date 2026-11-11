
import { Injectable } from '@angular/core';



import { HttpClient } from '@angular/common/http';


import { iPreAlertReportModel, initialState, PreAlertReport } from '../models/prealertreport';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class PreAlertReportService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }
      private screen_id = '';
      private screen_type = '';
      public state: iPreAlertReportModel = { ...initialState };
      
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

          this.state.searchcontainer = '';
          
          this.gs.appStates[this.screen_id] = this.state;
        }
      }

    List(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/SeaReport/PreAlertReport', SearchData, this.gs.headerparam2('authorized'));
    }

    PreAlertBookingSea(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/SeaReport/PreAlertBookingSea', SearchData, this.gs.headerparam2('authorized'));
    }
    
    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + 'api/Operations/SeaReport/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }
}

