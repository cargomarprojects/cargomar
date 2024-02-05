
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { EdiJob } from '../models/edijob';

@Injectable()
export class EdijobEditService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/EdiJobEdit/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: EdiJob) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/EdiJobEdit/Save', Record, this.gs.headerparam2('authorized'));
  }

}

