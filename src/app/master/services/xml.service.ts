
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class XmlService {
    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }
  
    GenerateXmlEdi(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Xml/XmlEdi/GenerateXmlEdi', SearchData, this.gs.headerparam2('authorized'));
    }

    GenerateXmlCostingInvoice(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Xml/XmlEdi/GenerateXmlCostingInvoice', SearchData, this.gs.headerparam2('authorized'));
    }

    GenerateXmlBooking(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Xml/XmlEdi/GenerateXmlBooking', SearchData, this.gs.headerparam2('authorized'));
    }
    
    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Xml/XmlEdi/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }
    
    GenerateXlsBooking(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/BkTeu/GenerateXlsBooking', SearchData, this.gs.headerparam2('authorized'));
    }
}

