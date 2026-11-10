
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { iBizdevelopReportModel, initialState, MarkMarketingm } from '../models/markmarketingm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class BizdevelopReportService {

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
  
        this.state.searchDateType = 'MONTHLY'
        this.state.from_date = this.gs.defaultValues.monthbegindate;
        this.state.to_date = this.gs.defaultValues.today;
        this.state.bCoreTeam = true;
        this.FindDefaultDate();

        this.gs.appStates[this.screen_id] = this.state;
      }
    }

    public FindDefaultDate() {
        var today = new Date();

        if (this.state.searchDateType == "MONTHLY") {
            let daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            today.setDate(daysInMonth);
            this.state.to_date = today.toISOString().slice(0, 10);
        }

        if (this.state.searchDateType == "WEEKLY") {
            let dayOfWk: number = 0;
            dayOfWk = today.getDay();
            var wkday = today.getDate() - today.getDay() + 1;
            var wkStart = new Date(today.setDate(wkday));
            var wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));

            if (dayOfWk == 0) {
                //if Sunday will show previous week
                wkStart = new Date(new Date(wkStart).setDate(wkStart.getDate() - 7));
                wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
            }
            this.state.from_date = wkStart.toISOString().slice(0, 10);
            this.state.to_date = wkEnd.toISOString().slice(0, 10);
        }
      }
    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/List', SearchData, this.gs.headerparam2('authorized'));
    }
    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }
    BizDevelopmentReport(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkMarketing/BizDevelopmentReport', SearchData, this.gs.headerparam2('authorized'));
    }

}

