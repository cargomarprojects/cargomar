import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AiDocm, iAiDocmModel, initialState } from '../models/aidocm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class AiDocService {

    private screen_id = '';
    public state: iAiDocmModel = { ...initialState };

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    public init(_screen_id: string) {
        this.screen_id = _screen_id;
        this.loadState();
    }

    private loadState() {
        if (this.gs.appStates[this.screen_id])
            this.state = this.gs.appStates[this.screen_id];
        else {
            this.state = { ...initialState };
            this.gs.appStates[this.screen_id] = this.state;
        }
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/AiDoc/List', SearchData, this.gs.headerparam2('authorized'));
    }

    detailList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/AiDoc/detailList', SearchData, this.gs.headerparam2('authorized'));
    }

    getList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/AiDoc/getList', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: AiDocm) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Report1/AiDoc/Save', Record, this.gs.headerparam2('authorized'));
    }
 

}
