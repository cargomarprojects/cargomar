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
    pkid: ''
  };

  constructor(
    private ms: SalesFollowupService,
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

  ShowDetail(_rec: SalesFollowup) {

    this.ms.report_date = _rec.report_date;
    this.ms.currentTab = "DISTINCTLIST";
    this.ms.distinctTab = "SALESMAN";
    this.ms.RecordList = null;
    this.ms.RecordDetList = null;
    this.ms.ShowDistinctReport('SCREEN', 'SALESMAN');
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
    this.InputSearchData.pkid = _rec.pkid;
    if (_rec.pkid == null)
      return;
    if (_rec.pkid != '') {
      _rec.row_displayed = !_rec.row_displayed;
    }
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
      // REC.row_displayed = false;
    }
  }
}
