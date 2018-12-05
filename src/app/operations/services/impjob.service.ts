
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { ImpJobm } from '../models/impjob';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ImpJobService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ImpJob/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {

      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ImpJob/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: ImpJobm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ImpJob/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ImpJob/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {

      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ImpJob/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }

}

