import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../models/searchtable';
import { GenRemarks } from '../models/genremarks';

@Injectable()
export class GenRemarksService {
  constructor(
    private http2: HttpClient,
    private gs: GlobalService
  ) { }

  GetRemarks(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/PreAlert/GetRemarks', SearchData, this.gs.headerparam2('authorized'));
  }

  SaveRemarks(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/PreAlert/SaveRemarks', SearchData, this.gs.headerparam2('authorized'));
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/GenRemarks/List', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: GenRemarks) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/GenRemarks/Save', Record, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/GenRemarks/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }
}
