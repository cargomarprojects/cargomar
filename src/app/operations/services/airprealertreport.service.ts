
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { PreAlertReport } from '../models/prealertreport';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class AirPreAlertReportService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/SeaReport/AirPreAlertReport', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + 'api/Operations/SeaReport/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }
}

