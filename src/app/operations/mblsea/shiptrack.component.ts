import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { HblTracking } from '../models/hbltracking';
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
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Record = response.record;
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

  Save(_category: string) {
    if (!this.allvalid())
      return;

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.rec_category = _category;
    this.Record.parent_type = this.type;
    this.Record._globalvariables = this.gs.globalVariables;

    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
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

}


