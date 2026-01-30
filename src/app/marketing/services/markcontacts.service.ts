
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { MarkContacts } from '../models/markcontacts';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class MarkContactService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkContact/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkContact/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: MarkContacts) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkContact/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkContact/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    JobList(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MarkContact/JobList', SearchData, this.gs.headerparam2('authorized'));
    }

}

