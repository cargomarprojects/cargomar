
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class GenReportService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  PrintBusinessPromotion(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/GenReport/PrintBusinessPromotion', SearchData, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + 'api/Report1/GenReport/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

}

