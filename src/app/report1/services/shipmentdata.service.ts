
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ShipmentData } from '../models/shipmentdata';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ShipmentDataService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ShipmentData/List', SearchData, this.gs.headerparam2('authorized'));
  }
  
  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ShipmentData/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

}

