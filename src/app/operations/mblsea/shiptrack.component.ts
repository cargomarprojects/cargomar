import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { HblTracking } from '../models/hbltracking';
import { MailList } from '../../master/models/maillist';
import { ShipTrackingService } from '../services/shiptrack.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-shiptrack',
  templateUrl: './shiptrack.component.html',
  providers: [ShipTrackingService]
})
export class ShipTrackComponent {
  // Local Variables 
  title = 'Shipment Tracking Details';
  @Output() ModifiedRecords = new EventEmitter<any>();
  @Input() menuid: string = '';
  @Input() public pkid: string = '';
  @Input() public type: string = '';

  InitCompleted: boolean = false;
  menu_record: any;
  Record: HblTracking = new HblTracking;
  MailRecords: MailList[] = [];
  canSave = false;

  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string;

  ErrorMessage = "";
  InfoMessage = "";
  constructor(
    private route: ActivatedRoute,
    private mainService: ShipTrackingService,
    private gs: GlobalService
  ) {

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.canSave = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      // if (this.menu_record.rights_add || this.menu_record.rights_edit)
      //   this.canSave = true;
      if (this.menu_record.rights_approval.includes("TRACK"))
        this.canSave = true;

    }
    if (this.gs.globalVariables.user_code == "ADMIN")
      this.canSave = true;

    this.LoadCombo();
    this.InitLov();
    this.GetRecord();
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
  }

  LoadCombo() {

  }


  InitLov() {

  }

  LovSelected(_Record: SearchTable) {

  }


  GetRecord() {
    this.loading = true;
    let SearchData = {
      pkid: this.pkid,
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Record = response.record;
        this.MailRecords = response.list;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  OnBlur(field: string) {
    var oldChar = / /gi;//replace all blank space in a string
    switch (field) {

      //   case 'trk_voyage':
      //     {
      //       this.mRecord.trk_voyage = this.mRecord.trk_voyage.toUpperCase().trim();
      //       break;
      //     }
    }
  }

  Save(_category: string, _pre_position_date: string) {
    if (!this.allvalid())
      return;

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.rec_category = _category;
    this.Record.pre_position_date = _pre_position_date;
    this.Record.parent_type = this.type;
    this.Record._globalvariables = this.gs.globalVariables;

    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";

        if (this.ModifiedRecords != null && this.type == "MBL-SE")
          this.ModifiedRecords.emit({ saction: 'ADD', type: 'SHIP-TRACK-MBL-RLEASE-UPDT', mblreleasedate: this.Record.mbl_released_date });

        if (this.type == "MBL-SE")
          this.MailTrackShipment();
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    // if (this.Record.cost_folderno.trim().length <= 0) {
    //   bret = false;
    //   sError += "| MAWB Cannot Be Blank";
    // }


    // if (bret === false) {
    //   this.ErrorMessage = sError;
    //   alert(this.ErrorMessage);
    // }
    return bret;
  }


  MailTrackShipment() {

    if (!confirm("Do you want to Sent Mail")) {
      return;
    }
    let toids: string = "";
    let ccids: string = "";
    let bccids: string = "";

    for (let rec of this.MailRecords) {
      if (toids != "")
        toids += ",";
      toids += rec.ml_to_ids;
      if (ccids != "")
        ccids += ",";
      ccids += rec.ml_cc_ids;
      if (bccids != "")
        bccids += ",";
      bccids += rec.ml_bcc_ids;
    }

    this.loading = true;
    let SearchData = {
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      branch_name: this.gs.globalVariables.branch_name,
      user_code: this.gs.globalVariables.user_code,
      user_name: this.gs.globalVariables.user_name,
      user_pkid: this.gs.globalVariables.user_pkid,
      parent_type: this.type,
      to_ids: toids,
      cc_ids: ccids,
      bcc_ids: bccids,
      subject: '',
      message: '',
      filename: '',
      filedisplayname: '',
      canftp: 'N',
      email_display_name: '',
      pkid: this.pkid
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.MailTrackShipment(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = response.mailerror;
        alert(this.InfoMessage);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

}
