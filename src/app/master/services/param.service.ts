
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Param } from '../models/param';
import { Settings } from '../models/settings';
import { Settings_VM } from '../models/settings';
import { Lockingm } from '../models/settings';
import { PayrollSetting } from '../../hr/models/payrollsetting';

import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ParamService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Param/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Param/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Param) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Param/Save', Record, this.gs.headerparam2('authorized'));
    }

    getSettings(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Param/getSettings', SearchData, this.gs.headerparam2('authorized'));
    }

    SaveSettings(Record: Settings_VM) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Param/SaveSettings', Record, this.gs.headerparam2('authorized'));
    }

    DataTransfer(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Param/DataTransfer', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Param/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    SaveImportData(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Param/SaveImportData', SearchData, this.gs.headerparam2('authorized'));
    }


    UpdateData(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Param/UpdateData', SearchData, this.gs.headerparam2('authorized'));
    }

    SaveLockings(Record: Lockingm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Param/SaveLockings', Record, this.gs.headerparam2('authorized'));
    }

    GetPayroll(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Payrollsetting/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    SavePayroll(Record: PayrollSetting) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Payrollsetting/Save', Record, this.gs.headerparam2('authorized'));
    }
    
    Process(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Param/Process', SearchData, this.gs.headerparam2('authorized'));
    }


    ImportDataFromCpl(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Param/ImportDataFromCpl', SearchData, this.gs.headerparam2('authorized'));
    }

    GetTransferStatus(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Param/GetTransferStatus', SearchData, this.gs.headerparam2('authorized'));
    }

    CurrentCulture(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Param/CurrentCulture', SearchData, this.gs.headerparam2('authorized'));
    }
}

