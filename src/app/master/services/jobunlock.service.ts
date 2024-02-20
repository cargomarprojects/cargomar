
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { JobUnlock } from '../models/jobunlock';

@Injectable()
export class JobUnlockService {
  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/JobUnlock/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/JobUnlock/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: JobUnlock) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/JobUnlock/Save', Record, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/JobUnlock/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  MailCreditLimitRequest(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/JobUnlock/MailCreditLimitRequest', SearchData, this.gs.headerparam2('authorized'));
  }


}

