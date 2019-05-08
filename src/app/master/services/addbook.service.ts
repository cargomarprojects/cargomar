
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Customerm } from '../models/customer';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class AddbookService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Addbook/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Addbook/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Customerm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Addbook/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Customer/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    AddressLinkList(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Addbook/AddressLinkList', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Addbook/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }
}

