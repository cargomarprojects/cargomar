
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Containerm } from '../models/container';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ContainerService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Container/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Container/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Containerm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Container/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Container/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

}

