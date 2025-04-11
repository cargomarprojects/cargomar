
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { SaveShipData } from '../models/shipmentdata';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ShipTrackMasterService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ShipTrackMaster/List', SearchData, this.gs.headerparam2('authorized'));
    }

    TrackingList(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ShipTrackMaster/TrackingList', SearchData, this.gs.headerparam2('authorized'));
    }

}

