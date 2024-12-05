
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ItemReExport } from '../models/itemreexport';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ItemReExportService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemReExport/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemReExport/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: ItemReExport) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemReExport/Save', Record, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemReExport/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemReExport/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }

}

