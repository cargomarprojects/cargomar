import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../models/searchtable';

@Injectable()
export class GenerateDocService {
  constructor(
    private http2: HttpClient,
    private gs: GlobalService
  ) { }

    GenerateDocList(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinerBooking/GenerateDocList', SearchData, this.gs.headerparam2('authorized'));
    }

    PrintCheckList(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinerBooking/PrintCheckList', SearchData, this.gs.headerparam2('authorized'));
    }

    GenerateInvoice(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/Report/GenerateInvoice', SearchData, this.gs.headerparam2('authorized'));
    }

}
