
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { MailList } from '../models/maillist';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class MailListService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MailList/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MailList/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: MailList) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MailList/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/MailList/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }


}

