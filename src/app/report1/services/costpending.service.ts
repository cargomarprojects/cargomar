
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CostPending } from '../models/costpending';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class CostPendingService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/CostPending/List', SearchData, this.gs.headerparam2('authorized'));
  }
}

