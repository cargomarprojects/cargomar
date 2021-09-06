import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { SalesFollowup } from '../models/salesfollowup';

import { SalesFollowupService } from '../services/salesfollowup.service';


@Component({
  selector: 'app-salesfollowup',
  templateUrl: './salesfollowup.component.html',
  providers: [SalesFollowupService]
})

export class SalesFollowupComponent {


  InputSearchData = {
    type: '',
    pkid: '',
    report_date: '',
    sman_name: '',
    branch: '',
    party_name: ''
  };

  constructor(
    public ms: SalesFollowupService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {

    this.ms.InitPage(this.route.snapshot.queryParams.parameter);

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    if (!this.ms.InitCompleted) {
      this.ms.InitComponent();
    }
  }



  LovSelected(_Record: SearchTable) {
    // Company Settings
    if (_Record.controlname == "BRANCH") {
      this.ms.branch_code = _Record.code;
    }

    if (_Record.controlname == "PARTY") {
      this.ms.cust_name = _Record.name;
    }
    if (_Record.controlname == "SALESMAN") {
      this.ms.sman_name = _Record.name;
    }

  }


  // Query List Data


  OnChange(field: string) {
    // this.ms.RecordList = null;
  }

  Close() {
    this.gs.ClosePage('home');
  }

  ReturnPage(_type: string) {

    this.ms.currentTab = _type;
  }


  editData(_rec: SalesFollowup) {
    if (_rec.row_type == "TOTAL")
      return;
    this.InputSearchData.pkid = _rec.pkid;
    this.InputSearchData.report_date = this.ms.report_date;
    this.InputSearchData.sman_name = _rec.sman_name;
    this.InputSearchData.branch = _rec.branch;
    this.InputSearchData.party_name = _rec.party_name;

    _rec.row_displayed = !_rec.row_displayed;
  }

  ModifiedRecords(params: any) {
    if (params.saction == "CLOSE") {
      if (this.ms.RecordDetList == null)
        return;
      var REC = this.ms.RecordDetList.find(rec => rec.pkid == params.pkid);
      REC.row_displayed = false;
    }
    if (params.saction == "SAVE") {
      if (this.ms.RecordDetList == null)
        return;
      var REC = this.ms.RecordDetList.find(rec => rec.pkid == params.pkid);
      REC.row_updated = 'Y';
      REC.row_updated_by = params.updatename;
      REC.row_displayed = false;
      // REC.row_displayed = false;
    }
    if (params.saction == "DELETE") {
      if (this.ms.RecordDetList == null)
        return;
      var REC = this.ms.RecordDetList.find(rec => rec.pkid == params.pkid);
      REC.row_updated = params.updatename != '' ? 'Y' : 'N';
      REC.row_updated_by = params.updatename;
    }
  }

  RemoveList(event: any) {
    if (event.selected) {
      this.ms.RemoveRecord(event.id);
    }
  }

  showInvoiceList(_rec: SalesFollowup, invoicemodal: any) {
    this.ms.sman_name = _rec.sman_name;
    this.ms.cust_name = _rec.party_name;
    this.ms.branch_name = _rec.branch;
    this.ms.open(invoicemodal);
  }

  ModifiedInvoiceRecords(params: any) {
    if (params.saction == "CLOSE") {
      this.ms.modal.close();
    }

  }


}
