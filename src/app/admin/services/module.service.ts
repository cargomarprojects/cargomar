
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';



import { Modulem } from '../models/modulem';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ModuleService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/Module/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/Module/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Modulem) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/Module/Save', Record, this.gs.headerparam2('authorized'));
    }

    newyear(SearchData :any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/Module/NewYear', SearchData, this.gs.headerparam2('authorized'));
    }


    TransferBalance(SearchData :any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/Module/TransferBalance', SearchData, this.gs.headerparam2('authorized'));
    }



}

