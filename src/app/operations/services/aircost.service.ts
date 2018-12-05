
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { AirCostm } from '../models/aircost';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class AirCostService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/AirCost/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/AirCost/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: AirCostm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/AirCost/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/AirCost/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/AirCost/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }


}

