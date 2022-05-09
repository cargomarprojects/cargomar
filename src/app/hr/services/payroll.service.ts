import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Salarym } from '../models/salarym';
import { GlobalService } from '../../core/services/global.service';
import { Deductm } from '../models/deductm';

@Injectable()
export class PayRollService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Payroll/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Payroll/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Salarym) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Payroll/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Payroll/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  Generate(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Payroll/Generate', SearchData, this.gs.headerparam2('authorized'));
  }
  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Payroll/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  PrintSalarySheet(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Payroll/PrintSalarySheet', SearchData, this.gs.headerparam2('authorized'));
  }


  PostPayRoll(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Costing/Posting/SavePayRoll', SearchData, this.gs.headerparam2('authorized'));
  }

  UpdatePaymentDate(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Payroll/UpdatePaymentDate', SearchData, this.gs.headerparam2('authorized'));
  }
  DeductionList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Deduction/DeductionList', SearchData, this.gs.headerparam2('authorized'));
  }
  
  UpdateDeduction(Record: Deductm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Hr/Payroll/UpdateDeduction', Record, this.gs.headerparam2('authorized'));
  }

}

