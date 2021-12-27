
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { ApprovedDet } from '../models/approveddet';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ApprovedDetService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/ApprovedDet/List', SearchData, this.gs.headerparam2('authorized'));
  }
  
  Save(Record: ApprovedDet) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/ApprovedDet/Save', Record, this.gs.headerparam2('authorized'));
  }

 


}

