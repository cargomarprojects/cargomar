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

    if (this.route.snapshot.queryParams.parameter != null) {
      this.ms.InitCompleted = true;
      this.ms.menuid =  this.route.snapshot.queryParams.menuid;
      this.ms.type =  this.route.snapshot.queryParams.type;
      this.ms.InitComponent();
  } 
    

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
    this.ms.RecordList = null;
  }

  Close() {
    this.gs.ClosePage('home');
  }
}
