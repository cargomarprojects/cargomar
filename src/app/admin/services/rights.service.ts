import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { UserRights, UserRights_VM } from '../models/userrights';

import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class RightsService {
    constructor(private http2: HttpClient, private gs: GlobalService) { }


    List(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/UserRight/List', SearchData, this.gs.headerparam2('authorized'));
    }

    RightsList(SearchData: any) {

      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/UserRight/RightsList', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: UserRights_VM ) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/UserRight/Save', Record, this.gs.headerparam2('authorized'));
    }

    CopyRights(Record: UserRights_VM ) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/UserRight/CopyRights', Record, this.gs.headerparam2('authorized'));
    }
}

