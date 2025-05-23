
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Costreco } from '../models/costreco';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class CostRecoService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/CostReco/List', SearchData, this.gs.headerparam2('authorized'));
    }

   
    ChangeReconStatus(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Accounts/CostReco/ChangeReconStatus', SearchData, this.gs.headerparam2('authorized'));
    }

}

