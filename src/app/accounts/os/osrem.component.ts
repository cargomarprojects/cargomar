import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { ReconService } from '../services/recon.service';
import { SearchTable } from '../../shared/models/searchtable';

import { LedgerReport } from '../models/ledgerreport';


@Component({
  selector: 'app-osrem',
  templateUrl: './osrem.component.html',
  providers: [ReconService]
})

export class OsRemComponent {
  // Local Variables
  title = '';

  @Input() isadmin: boolean = false;
  @Input() record: LedgerReport;

  @Input() adminText = '';

  pkid: string = '';
  type: string = '';
  remarks: string = '';
  remarks2: string = '';


  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;

  ErrorMessage = "";
  InfoMessage = "";

  mode = '';

  SearchData = {
    pkid: '',
    type: '',
    remarks: '',
    remarks2: ''
  }

  // Array For Displaying List

  // Single Record for add/edit/view details


  constructor(
    private mainService: ReconService,
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {
    this.page_count = 0;
    this.page_rows = 10;
    this.page_current = 0;
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.pkid = this.record.pkid;
    this.type = this.record.jv_od_type;
    this.remarks = this.record.jv_od_remarks;
    this.remarks2 = this.record.jv_od_remarks2;
  }

  InitComponent() {

  }


  // Save Data
  Save() {
    /*
    if (!this.allvalid())
      return;
    */
    this.ErrorMessage = '';


    if (this.adminText != "ADMIN") {
      if (this.type != '') {
        alert('You can select the type as NA only');
        return;
      }
    }


    if (this.remarks == '') {
      this.ErrorMessage = 'Remarks Cannot Be Empty';
      return;
    }

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    this.SearchData.pkid = this.pkid;
    this.SearchData.type = this.type;
    this.SearchData.remarks = this.remarks;
    this.SearchData.remarks2 = this.remarks2;

    this.mainService.UpdateOsRemarks(this.SearchData)
      .subscribe(response => {
        this.loading = false;

        if (response.status == "OK") {
          this.record.jv_od_type = this.type;
          this.record.jv_od_remarks = this.remarks;
          this.record.jv_od_remarks2 = this.remarks2;
          this.record.displayed = false;
        }

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    if (this.remarks.toString().length <= 0) {
      bret = false;
      sError = " | Remarks Cannot Be Blank";
    }

    //if (bret === false)
    //  this.ErrorMessage = sError;
    return bret;
  }


  Close() {
    this.record.displayed = false;

  }

}
