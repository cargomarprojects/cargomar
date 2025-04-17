import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { ShipTrackMaster } from '../models/shiptrackmaster';
import { ShipTrackMasterService } from '../services/shiptrackmaster.service';
import { Trackingm } from '../../operations/models/tracking';
import { LinerBkm } from '../../operations/models/linerbkm';
import { SearchTable } from '../../shared/models/searchtable';

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
  @Input() bSave: boolean = false;

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
  Record: LinerBkm = new LinerBkm;

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
        this.Record = response.record;

        // this.Record = new LinerBkm();
        // this.Record.book_pkid = this.pkid;
        // this.Record.book_pod_code = "";
        // this.Record.book_pod_name = "";
        // this.Record.book_eta = "";
        // this.Record.book_eta_confirm = false;
        // this.Record.book_pofd_code = "";
        // this.Record.book_pofd_name = "";
        // this.Record.book_pofd_eta = "";
        // this.Record.book_pofd_eta_confirm = false;

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

  OnBlur(field: string, _rec: Trackingm = null) {
    if (field == 'trk_voyage') {
      _rec.trk_voyage = _rec.trk_voyage.toUpperCase();
    }

  }

  LovSelected(_Record: SearchTable, _rec: Trackingm) {

    if (_Record.controlname == "VESSEL") {
      _rec.trk_vsl_id = _Record.id;
      _rec.trk_vsl_code = _Record.code;
      _rec.trk_vsl_name = _Record.name;
    }
  }

  UpdateMasterTrk() {
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.rec_category = this.type;
    this.Record._globalvariables = this.gs.globalVariables;
    this.Record.TransitList = this.RecordList;
    this.mainService.UpdateMasterTrk(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
        // if (response.mailmsg.length > 0)
        //   this.InfoMessage += ", " + response.mailmsg;
        // alert(this.InfoMessage);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }


}
