
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ProcessReportService {
    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }
  
    List(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/ProcessReport/List', SearchData, this.gs.headerparam2('authorized'));
    }

    Process(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/ProcessReport/Process', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/ProcessReport/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

}

