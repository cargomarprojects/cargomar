
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { LinerBkm } from '../models/linerbkm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class LinerBkmService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinerBooking/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinerBooking/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: LinerBkm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinerBooking/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinerBooking/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    HblList(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinerBooking/HblList', SearchData, this.gs.headerparam2('authorized'));
    }

    PrintCheckList(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinerBooking/PrintCheckList', SearchData, this.gs.headerparam2('authorized'));
    }
    
    GenerateXmlEdi(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Xml/XmlEdi/GenerateXmlEdi', SearchData, this.gs.headerparam2('authorized'));
    }
}

