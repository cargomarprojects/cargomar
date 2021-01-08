import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalCharge } from '../models/localcharge';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class LocalChargeService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/LocalCharge/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/LocalCharge/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    CanSave(Record: LocalCharge) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/LocalCharge/CanSave', Record, this.gs.headerparam2('authorized'));
    }

    Save(Record: LocalCharge) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/LocalCharge/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/LocalCharge/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/LocalCharge/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }

}

