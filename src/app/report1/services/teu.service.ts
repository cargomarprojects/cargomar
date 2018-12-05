
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Teu } from '../models/teu';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class TeuService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/Teu/List', SearchData, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + 'api/Report1/Teu/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

}

