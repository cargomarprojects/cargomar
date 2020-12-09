
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HblTracking } from '../models/hbltracking';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ShipTrackingService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }
     
    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ShipmentTracking/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: HblTracking) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ShipmentTracking/Save', Record, this.gs.headerparam2('authorized'));
    }

    MailTrackShipment(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ShipmentTracking/MailTrackShipment', SearchData, this.gs.headerparam2('authorized'));
    }

}

