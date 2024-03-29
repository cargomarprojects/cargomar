
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { MarkSalesleadm,MarkSalesleadd } from '../models/marksaleslead';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class MarkSalesleadService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkSaleslLead/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkSaleslLead/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: MarkSalesleadm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkSaleslLead/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkSaleslLead/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    getSalesleadActions(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkSaleslLead/getSalesleadActions', SearchData, this.gs.headerparam2('authorized'));
    }

    SaveSalesleadActions(Record: MarkSalesleadd) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkSaleslLead/SaveSalesleadActions', Record, this.gs.headerparam2('authorized'));
    }

    GetRecordSalesleadActions(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkSaleslLead/GetRecordSalesleadActions', SearchData, this.gs.headerparam2('authorized'));
    }

    PrintSaleslead(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkSaleslLead/PrintSaleslead', SearchData, this.gs.headerparam2('authorized'));
    }
}

