
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Costingm } from '../models/costing';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class AgentInvoiceService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Costing/AgentInvoice/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Costing/AgentInvoice/GetRecord', SearchData, this.gs.headerparam2('authorized'));

    }

    Save(Record: Costingm ) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Costing/AgentInvoice/Save', Record, this.gs.headerparam2('authorized'));
    }
   
    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Costing/AgentInvoice/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    PrintNote(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Costing/AgentInvoice/PrintNote', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Costing/Costing/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }




}

