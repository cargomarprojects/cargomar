
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Jobm } from '../models/job';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class EdijobService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/EdiJob/List', SearchData, this.gs.headerparam2('authorized'));
  }

  FindMissingData(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/EdiJob/FindMissingData', SearchData, this.gs.headerparam2('authorized'));
  }

}

