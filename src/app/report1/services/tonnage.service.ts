
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Tonnage } from '../models/tonnage';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class TonnageService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/Tonnage/List', SearchData, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/Tonnage/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

}

