
import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';


import { User } from '../models/user';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class UserService {
    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/User/List', SearchData, this.gs.headerparam2('authorized'));

    }

    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/User/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }
    

    GetRecord(SearchData : any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/User/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: User) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/User/Save', Record, this.gs.headerparam2('authorized'));
    }


}

