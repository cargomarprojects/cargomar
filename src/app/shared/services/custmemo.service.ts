import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../models/searchtable';
import { CustMemo,VmMemo } from '../models/custmemo';

@Injectable()
export class CustMemoService {
  constructor(
    private http2: HttpClient,
    private gs: GlobalService
  ) { }

   
  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/CustMemo/List', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: VmMemo) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/CustMemo/Save', Record, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Master/CustMemo/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }
}
