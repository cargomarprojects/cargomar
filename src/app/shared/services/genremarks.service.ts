import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../models/searchtable';

@Injectable()
export class GenRemarksService {
  constructor(
    private http2: HttpClient,
    private gs: GlobalService
  ) { }

    GetRemarks(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/PreAlert/GetRemarks', SearchData, this.gs.headerparam2('authorized'));
    }

    SaveRemarks(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/PreAlert/SaveRemarks', SearchData, this.gs.headerparam2('authorized'));
    }

}
