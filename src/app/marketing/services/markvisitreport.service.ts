
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { GlobalService } from '../../core/services/global.service';
import { iMarkReportModel, initialState, MarkReport } from '../models/markvisitreport';
import { MarkMarketingm } from '../models/markmarketingm';

@Injectable()
export class MarkReportService {

    private screen_id = '';
    private screen_type = '';
    public state: iMarkReportModel = { ...initialState };

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }
    
    public init(_screen_id: string, _screen_type: string) {
      this.screen_id = _screen_id + '-' + _screen_type;
      this.screen_type = _screen_type;
      this.loadState();
    }
    
    private loadState() {
      if (this.gs.appStates[this.screen_id])
        this.state = this.gs.appStates[this.screen_id];
      else {
        this.state = { ...initialState };
        this.state.Initialized = false;
        let d = new Date();
        this.state.iYear = d.getFullYear();
        this.state.iYearCaption = this.state.iYear;
        this.state.sortby = 'DEFAULT';
        this.state.included = 'NA';
        // this.state.iMonth = 'ALL';
        this.state.search_iMonth = 'ALL';
        this.state.search_format = 'MONTH-WISE';
        this.state.report_format = 'WEEK-WISE';
        this.state.report_type = 'SALES PERSON';
        this.state.search_report_type = 'SALES PERSON';

        this.gs.appStates[this.screen_id] = this.state;
      }
      if (!this.state.RecordCaption) {
        this.state.RecordCaption = new MarkReport();
      }

      if (this.state.week5 == null) {
          this.state.week5 = 0;
      }
    }
    
    getFuturedate(_days: number) {
      var nDate = new Date();
      nDate.setDate(nDate.getDate() + _days);
      return nDate.toISOString().slice(0, 10);
    }

    DashBoard(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/DashBoard', SearchData, this.gs.headerparam2('authorized'));
    }

}

