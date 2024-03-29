
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Param } from '../models/param';
import { Settings } from '../models/settings';
import { Settings_VM } from '../models/settings';
import { Lockingm } from '../models/settings';
import { Bank_Info } from '../models/bank_info';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class BankInfoService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }
  
    getSettings(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/BankInfo/getSettings', SearchData, this.gs.headerparam2('authorized'));
    }

    SaveSettings(Record: Settings_VM) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/BankInfo/SaveSettings', Record, this.gs.headerparam2('authorized'));
    }
  
    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/BankInfo/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }
  
    Save(Record: Bank_Info) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/BankInfo/Save', Record, this.gs.headerparam2('authorized'));
    }
}

