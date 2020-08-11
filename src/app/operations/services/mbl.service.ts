
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mblm } from '../models/mbl';
import { GlobalService } from '../../core/services/global.service';


@Injectable()
export class MblService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Mbl/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Mbl/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Mblm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Mbl/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Mbl/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    HblList(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Mbl/HblList', SearchData, this.gs.headerparam2('authorized'));
    }

    PrintCheckList(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinerBooking/PrintCheckList', SearchData, this.gs.headerparam2('authorized'));
    }

    UpdateTracking(Record: Mblm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Mbl/UpdateTracking', Record, this.gs.headerparam2('authorized'));
    }

}

