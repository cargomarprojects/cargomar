
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BkTeu } from '../models/bkteu';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ArrivalNoticeService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ArrivalNotice/List', SearchData, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + 'api/Report1/ArrivalNotice/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

}

