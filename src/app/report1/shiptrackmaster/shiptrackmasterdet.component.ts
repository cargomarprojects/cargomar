import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { ShipTrackMaster } from '../models/shiptrackmaster';
import { ShipTrackMasterService } from '../services/shiptrackmaster.service';
import { Trackingm } from '../../operations/models/tracking';
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

  UpdateMasterTrk(_rec: Trackingm) {
    let SearchData2 = {
      trk_pkid: _rec.trk_pkid,
      trk_vsl_id: _rec.trk_vsl_id,
      trk_voyage: _rec.trk_voyage,
      trk_pol_etd: _rec.trk_pol_etd,
      trk_pol_etd_confirm: _rec.trk_pol_etd_confirm,
      trk_pod_eta:  _rec.trk_pod_eta,
      trk_pod_eta_confirm: _rec.trk_pod_eta_confirm,
      user_code: this.gs.globalVariables.user_code
    };

    this.loading = true;
    this.ErrorMessage = '';
    this.mainService.UpdateMasterTrk(SearchData2)
      .subscribe(response => {
        this.loading = false;
        // if (response.retvalue) {
        //   let pkidsArray = _ids.split(',');
        //   for (let i = 0; i < pkidsArray.length; i++) {
        //     for (let rec of this.mainService.state.RecordListItc.filter(rec => rec.pkid == pkidsArray[i])) {
        //       rec.claim_status = this.mainService.state.gst_recon_itc_claim_status;
        //       rec.row_color2 = rec.claim_status == "PENDING" ? "black" : rec.row_color;
        //       rec.display_claimed_period = response.retperiod;
        //       rec.claim_created_date = this.gs.ConvertDate2DisplayFormat(this.gs.defaultValues.today);
        //       rec.claim_created_by = this.gs.globalVariables.user_code;
        //     }
        //   }
        // }
         
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }
}
