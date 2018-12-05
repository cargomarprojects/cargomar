
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ItemLicense } from '../models/itemlicense';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class ItemLicenseService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemLicense/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemLicense/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: ItemLicense) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemLicense/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemLicense/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/ItemLicense/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

}

