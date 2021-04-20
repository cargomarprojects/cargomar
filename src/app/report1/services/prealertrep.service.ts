
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class PreAlertRepService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/PreAlert/List', SearchData, this.gs.headerparam2('authorized'));
  }
 
  UpdatePrealert(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/PreAlert/UpdatePrealert', SearchData, this.gs.headerparam2('authorized'));
  }

}

