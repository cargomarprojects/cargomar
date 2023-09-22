
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { AirBuyRate,BuyrateImport } from '../models/airbuyrate';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class AirBuyRateService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/AirBuyRate/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/AirBuyRate/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    CanSave(Record: AirBuyRate) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/AirBuyRate/CanSave', Record, this.gs.headerparam2('authorized'));
    }

    Save(Record: AirBuyRate) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/AirBuyRate/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/AirBuyRate/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/AirBuyRate/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    SaveBuyrateImport(Record: BuyrateImport) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/AirBuyRate/SaveBuyrateImport', Record, this.gs.headerparam2('authorized'));
    }
    
    ExcelFormat(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/AirBuyRate/ExcelFormat', SearchData, this.gs.headerparam2('authorized'));
    }
}
