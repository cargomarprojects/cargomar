
import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';

import { Companym } from '../models/company';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class CompanyService {
    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/Company/List', SearchData, this.gs.headerparam2('authorized'));

    }


    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/Company/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }



    GetRecord(SearchData : any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/Company/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Companym) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/Company/Save', Record, this.gs.headerparam2('authorized'));
    }


}

