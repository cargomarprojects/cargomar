import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { ShipTrackMaster } from '../models/shiptrackmaster';
import { ShipTrackMasterService } from '../services/shiptrackmaster.service';
import { Trackingm } from '../../operations/models/tracking';

@Component({
  selector: 'app-shiptrackmasterdet',
  templateUrl: './shiptrackmasterdet.component.html',
  providers: [ShipTrackMasterService]
})

export class ShipTrackMasterDetComponent {
  // Local Variables 
  title = '';

  @Output() ModifiedRecords = new EventEmitter<any>();
  @Input() record: ShipTrackMaster;
  @Input() type: string = "";

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
  
  // Single Record for add/edit/view details


  constructor(
    private mainService: ShipTrackMasterService,
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
      mblid: this.record.mbl_id,
      hblid: '',
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      root_folder: this.gs.defaultValues.root_folder
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.TrackingList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.tracklist;
        
        // this.invdestfile_displayname = response.invdestfile_displayname;
        // this.invdestfile_name = response.invdestfile_name;
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
