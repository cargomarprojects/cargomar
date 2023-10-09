
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { ChemCatgm } from '../models/chemcatgm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ChemCatgService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/ChemCatg/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/ChemCatg/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: ChemCatgm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/ChemCatg/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/ChemCatg/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }
    
}

