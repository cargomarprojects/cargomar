import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TravelExpense, iTravelExpenseModel, initialState } from '../models/travelexpense';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class TravelExpenseService {

    private screen_id = '';
    public state: iTravelExpenseModel = { ...initialState };

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
            //default values
            this.state.from_date = this.gs.getNewdate(180);
            this.state.to_date = this.gs.defaultValues.today;
            
            this.gs.appStates[this.screen_id] = this.state;
        }
    }


    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/TravelExpense/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/TravelExpense/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: TravelExpense) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/TravelExpense/Save', Record, this.gs.headerparam2('authorized'));
    }

    PrintReceipt(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/TravelExpense/PrintReceipt', SearchData, this.gs.headerparam2('authorized'));
    }
    
    LoadDefault(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/TravelExpense/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }




}