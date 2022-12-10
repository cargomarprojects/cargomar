
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Posting } from '../models/posting';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class PostingService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }


  Save(Record: Posting) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Costing/Posting/Save', Record, this.gs.headerparam2('authorized'));
  }


  GetRecord(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Costing/Posting/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }


  DeleteRecord(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Costing/Posting/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  IsBackDateEntry(SearchData: any) {
  return this.http2.post<any>(this.gs.baseUrl + '/api/Costing/Posting/IsBackDateEntry', SearchData, this.gs.headerparam2('authorized'));
  }
}

