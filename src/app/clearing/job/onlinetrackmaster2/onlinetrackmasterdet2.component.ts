import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Joborderm } from '../../models/joborder';
import { OnlineTrackMaster2Service } from '../../services/onlinetrackmaster2.service';
import { Trackingm } from '../../../operations/models/tracking';

@Component({
  selector: 'app-onlinetrackmasterdet2',
  templateUrl: './onlinetrackmasterdet2.component.html',
  providers: [OnlineTrackMaster2Service]
})

export class OnlineTrackMasterDet2Component {
  // Local Variables 
  title = '';

  @Output() ModifiedRecords = new EventEmitter<any>();
  @Input() record: Joborderm;
  @Input() type: '';

  pkid: string = '';
  remarks: string = '';

  invdestfile_name: string = '';
  invdestfile_displayname: string = '';

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
  RecordList: Trackingm[] = [];
  RecordList2: Joborderm[] = [];
  // Single Record for add/edit/view details


  constructor(
    private mainService: OnlineTrackMaster2Service,
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {
    this.page_count = 0;
    this.page_rows = 10;
    this.page_current = 0;
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.List('NEW');
  }

  InitComponent() {

  }

  List(_type: string) {
    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      mblid: this.record.ord_mbl_id,
      hblid: this.record.ord_hbl_id,
      tp_code: this.gs.globalVariables.tp_code,
      tp_name: this.gs.globalVariables.tp_name,
      istp: this.gs.globalVariables.istp,
      root_folder: this.gs.defaultValues.root_folder
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.TrackingList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.tracklist;
        this.RecordList2 = response.ordlist;
        this.invdestfile_displayname = response.invdestfile_displayname;
        this.invdestfile_name = response.invdestfile_name;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }
  Close() {
    this.record.row_displayed = false;
  }
  ShowInvoice() {
    if (this.invdestfile_displayname.length > 0)
      this.Downloadfile(this.invdestfile_name, "", this.invdestfile_displayname);
  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }
}
