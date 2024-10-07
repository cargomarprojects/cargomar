import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LedgertRemarks } from '../models/ledgertremarks';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class LedgerRemarksService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/LedgerRem/List', SearchData, this.gs.headerparam2('authorized'));
    }
 
    GetRecord(SearchData: any) {

        return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/LedgerRem/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: LedgertRemarks) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/LedgerRem/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/LedgerRem/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

}

