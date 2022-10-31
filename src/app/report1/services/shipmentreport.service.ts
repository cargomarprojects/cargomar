
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { SaveShipData } from '../models/shipmentdata';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ShipmentReportService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ShipmentReport/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ShipmentReport/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: SaveShipData) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ShipmentReport/Save', Record, this.gs.headerparam2('authorized'));
    }

    ReportNameExist(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ShipmentReport/ReportNameExist', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ShipmentReport/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }


    List2(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/ShipmentReport/List2', SearchData, this.gs.headerparam2('authorized'));
    }
}

