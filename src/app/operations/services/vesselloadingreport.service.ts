
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { VesselLoadingReport } from '../models/vesselloadingreport';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class VesselLoadingReportService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/SeaReport/VesselLoadingReport', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + 'api/Operations/SeaReport/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }
}

