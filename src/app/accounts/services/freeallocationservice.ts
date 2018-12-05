
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { XList } from '../models/ledgerxref';

import { GlobalService } from '../../core/services/global.service';

@Injectable()

export class FreeAllocationService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  GetPendingList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Allocation/GetPendingList', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: XList) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Allocation/Save', Record, this.gs.headerparam2('authorized'));
  }
}

