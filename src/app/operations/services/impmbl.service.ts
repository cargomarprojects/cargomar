
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Mblm } from '../models/mbl';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ImpMblService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ImpMbl/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ImpMbl/GetRecord', SearchData, this.gs.headerparam2('authorized'))
    }

    Save(Record: Mblm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ImpMbl/Save', Record, this.gs.headerparam2('authorized'));
            
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ImpMbl/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }
    HblList(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ImpMbl/HblList', SearchData, this.gs.headerparam2('authorized'));
    }

    PrintCheckList(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinerBooking/PrintCheckList', SearchData, this.gs.headerparam2('authorized'));
    }
    GenerateFolderNumber(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinerBooking/GenerateFolderNumber', SearchData, this.gs.headerparam2('authorized'))
    }
}

