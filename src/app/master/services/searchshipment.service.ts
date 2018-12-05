
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';


import { SearchShipment } from '../models/searchshipment';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class SearchShipmentService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/SearchShipment/List', SearchData, this.gs.headerparam2('authorized'));
    }

   


}

