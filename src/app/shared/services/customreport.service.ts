import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../models/searchtable';
import { CustomReportH } from '../models/customreporth';

@Injectable()
export class CustomReportService {
    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/CustomReport/List', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/CustomReport/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/CustomReport/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: CustomReportH) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/CustomReport/Save', Record, this.gs.headerparam2('authorized'));
    }

     DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/CustomReport/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }
}
