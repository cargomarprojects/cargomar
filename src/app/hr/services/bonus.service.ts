import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bonusm } from '../models/bonusm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class BonusService {
  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Bonus/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Bonus/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Bonusm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Bonus/Save', Record, this.gs.headerparam2('authorized'));
  }

  Generate(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Bonus/Generate', SearchData, this.gs.headerparam2('authorized'));
  }
  
  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Bonus/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Bonus/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

}

