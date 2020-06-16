
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EdiHouse } from '../models/edihouse';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class AmsEdiService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Xml/AmsEdi/List', SearchData, this.gs.headerparam2('authorized'));
  }

  ImportData(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Xml/AmsEdi/ImportData', SearchData, this.gs.headerparam2('authorized'));
  }
}

