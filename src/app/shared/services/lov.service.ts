import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../models/searchtable';

@Injectable()
export class LovService {
  constructor(
    private http2: HttpClient,
    private gs: GlobalService) { }

    List(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/Lov/List', SearchData, this.gs.headerparam2('authorized'));
    }

    FileUpload(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/General/UploadFiles', SearchData, this.gs.headerparam2('authorized'));
    }


    DocumentList(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/General/DocumentList', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/General/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/General/DeleteDocument', SearchData, this.gs.headerparam2('authorized'));
    }




}
