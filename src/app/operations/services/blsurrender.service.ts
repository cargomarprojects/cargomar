import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BlSurrender } from '../models/blsurrender';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class BlSurrenderService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/BlSurrender/List', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: BlSurrender) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/BlSurrender/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/BlSurrender/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/BlSurrender/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }
}

