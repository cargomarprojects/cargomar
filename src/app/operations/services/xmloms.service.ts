
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class XmlomsService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    GenerateXmlEdiMexico(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Xml/XmlEdi/GenerateXmlEdiMexico', SearchData, this.gs.headerparam2('authorized'));
    }

}

