
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NewCustReport } from '../models/newcustrpt';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class NewCustomerService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/NewCustomer/List', SearchData, this.gs.headerparam2('authorized'));
    }
 
    LoadDefault(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/NewCustomer/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

}

