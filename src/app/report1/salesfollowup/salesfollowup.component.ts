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
}
