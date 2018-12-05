
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';


import { Menum } from '../models/menum';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class MenuService {
    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/Menu/List', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/Menu/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }


    GetRecord(SearchData : any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/Menu/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Menum) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/Menu/Save', Record, this.gs.headerparam2('authorized'));
    }


}

