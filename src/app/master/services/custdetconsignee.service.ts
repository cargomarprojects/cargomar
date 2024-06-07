
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CustdetConsignee } from '../models/custdetconsignee';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class CustdetConsigneeService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/CustDetConsignee/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/CustDetConsignee/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: CustdetConsignee) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/CustDetConsignee/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/CustDetConsignee/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/CustDetConsignee/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }


}

