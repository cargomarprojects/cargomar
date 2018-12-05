
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Stmtm } from '../models/stmtm';
import { Stmtd } from '../models/stmtm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class StmtService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Stmt/List', SearchData, this.gs.headerparam2('authorized'));
  }



  GetPendingList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Stmt/GetPendingList', SearchData, this.gs.headerparam2('authorized'));
  }


  GetRecord(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Stmt/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Stmtm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Stmt/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Stmt/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  PrintList(SearchData: any) {
  return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Stmt/PrintList', SearchData, this.gs.headerparam2('authorized'));
  }

}

