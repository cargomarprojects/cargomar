
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Paramvalues_vm } from '../models/param';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class SysParamService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/SysParam/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/SysParam/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Paramvalues_vm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/SysParam/Save', Record, this.gs.headerparam2('authorized'));
    }


}

