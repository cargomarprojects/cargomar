import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

import { VmShipmentStage } from '../models/shipment-stage';

@Injectable()
export class ShipmentStageService {
  constructor(
    private http2: HttpClient,
    private gs: GlobalService
  ) { }


  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ShipmentTracking/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: VmShipmentStage) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ShipmentTracking/Save', Record, this.gs.headerparam2('authorized'));
  }

}


