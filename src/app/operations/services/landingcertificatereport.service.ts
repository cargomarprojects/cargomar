
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { LandingCertificateReport } from '../models/landingcertificatereport';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class LandingCertificateReportService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/SeaReport/LandingCertificateReport', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + 'api/Operations/SeaReport/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }
}

