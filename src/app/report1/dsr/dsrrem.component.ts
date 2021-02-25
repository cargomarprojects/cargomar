import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { RepService } from '../services/report.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Dsr } from '../models/dsr';


@Component({
  selector: 'app-dsrrem',
  templateUrl: './dsrrem.component.html',
  providers: [RepService]
})

export class DsrRemComponent {
  // Local Variables 
  title = '';

  @Input() record: Dsr;
  @Input() format_type: string = 'REMARK';

  pkid: string = '';
  remarks: string = '';
  mbl_no: string = '';
  mbl_invno: string = '';
  mbl_invamt: number = 0;

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
    remarks: ''
  }

  // Array For Displaying List
  RecordList: Dsr[] = [];
  // Single Record for add/edit/view details


  constructor(
    private mainService: RepService,
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {
    this.page_count = 0;
    this.page_rows = 10;
    this.page_current = 0;
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.pkid = this.record.job_pkid;
    this.remarks = this.record.job_remarks;
  }

  InitComponent() {

  }

  GetHouseRecord(MblId: string) {
    this.loading = true;

    let SearchData = {
      MBLID: MblId,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetHouseList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
        if (this.RecordList != null)
          this.RecordList.length > 0
        {
          this.mbl_no = this.RecordList[0].mbl_bl_no;
          this.mbl_invno = this.RecordList[0].mbl_ap_invnos;
          this.mbl_invamt = this.RecordList[0].mbl_ap_invamt;
        }

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  // Save Data
  Save() {
    /*
    if (!this.allvalid())
      return;
    */
    this.ErrorMessage = '';
    if (this.remarks == '') {
      this.ErrorMessage = 'Remarks Cannot Be Empty';
      return;
    }

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    this.SearchData.pkid = this.pkid;
    this.SearchData.remarks = this.remarks;

    this.mainService.UpdateDsrRemarks(this.SearchData)
      .subscribe(response => {
        this.loading = false;

        if (response.status == "OK") {
          this.record.job_remarks = this.remarks.toUpperCase();
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
