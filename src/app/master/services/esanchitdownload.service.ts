
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Esanchit } from '../models/esanchit';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class EsanchitDownloadService {
    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }
    List(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Email/Esanchit/List', SearchData, this.gs.headerparam2('authorized'));
    }
    SaveSettings(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Email/Esanchit/SaveSettings', SearchData, this.gs.headerparam2('authorized'));
    }
}

