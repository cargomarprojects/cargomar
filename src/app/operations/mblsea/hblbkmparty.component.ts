import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { HblBkmParty } from '../models/hblbkmparty';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-hblbkmparty',
  templateUrl: './hblbkmparty.component.html',
})
export class HblBkmPartyComponent {
  // Local Variables 
  title = 'Booking Details';
  @Output() ModifiedRecords = new EventEmitter<any>();
  @Input() menuid: string = '';
  @Input() public pkid: string = '';
  @Input() public type: string = '';
  @Input() public showCaption: boolean = false;
  @Input() mRecord: HblBkmParty = new HblBkmParty;

  InitCompleted: boolean = false;
  menu_record: any;

  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string;
  EXPRECORD: SearchTable = new SearchTable();
  IMPRECORD: SearchTable = new SearchTable();
  NOTIFYRECORD: SearchTable = new SearchTable();
  ErrorMessage = "";
  InfoMessage = "";
  
  constructor(
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {

    // URL Query Parameter 
    this.sub = this.route.queryParams.subscribe(params => {
      if (params["parameter"] != "") {
        this.InitCompleted = true;
        var options = JSON.parse(params["parameter"]);
        this.menuid = options.menuid;
        this.type = options.type;
        this.InitComponent();
      }
    });

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    if (!this.InitCompleted) {
      this.InitComponent();
    }
    this.LoadCombo();
    this.InitLov();
  }

  InitComponent() {

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  LoadCombo() {

  }


  InitLov() {
    this.EXPRECORD = new SearchTable();
    this.EXPRECORD.controlname = "SHIPPER";
    this.EXPRECORD.displaycolumn = "CODE";
    this.EXPRECORD.type = "CUSTOMER";
    this.EXPRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
    this.EXPRECORD.id = this.mRecord.hp_exp_id;
    this.EXPRECORD.code = this.mRecord.hp_exp_code;
    this.EXPRECORD.name = this.mRecord.hp_exp_name;

    this.IMPRECORD = new SearchTable();
    this.IMPRECORD.controlname = "CONSIGNEE";
    this.IMPRECORD.displaycolumn = "CODE";
    this.IMPRECORD.type = "CUSTOMER";
    this.IMPRECORD.where = " CUST_IS_CONSIGNEE = 'Y' ";
    this.IMPRECORD.id = this.mRecord.hp_imp_id;
    this.IMPRECORD.code =this.mRecord.hp_imp_code;
    this.IMPRECORD.name = this.mRecord.hp_imp_name;

    this.NOTIFYRECORD = new SearchTable();
    this.NOTIFYRECORD.controlname = "NOTIFY";
    this.NOTIFYRECORD.displaycolumn = "CODE";
    this.NOTIFYRECORD.type = "CUSTOMER";
    this.NOTIFYRECORD.id = this.mRecord.hp_notify_id;
    this.NOTIFYRECORD.code = this.mRecord.hp_notify_code;
    this.NOTIFYRECORD.name = this.mRecord.hp_notify_name;

  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "SHIPPER") {
      this.mRecord.hp_exp_id = _Record.id;
      this.mRecord.hp_exp_code = _Record.code;
      this.mRecord.hp_exp_name = _Record.name;
    }

    if (_Record.controlname == "CONSIGNEE") {
      this.mRecord.hp_imp_id = _Record.id;
      this.mRecord.hp_imp_code = _Record.code;
      this.mRecord.hp_imp_name = _Record.name;
    }

    if (_Record.controlname == "NOTIFY") {
      this.mRecord.hp_notify_id = _Record.id;
      this.mRecord.hp_notify_code = _Record.code;
      this.mRecord.hp_notify_name = _Record.name;
    }
  }

  AddRow() {
    if (this.ModifiedRecords != null)
      this.ModifiedRecords.emit({ saction: 'ADD', type: 'BKMPARTY', sid: this.mRecord.hp_pkid });
  }

  RemoveRow() {
    if (this.ModifiedRecords != null)
      this.ModifiedRecords.emit({ saction: 'REMOVE', type: 'BKMPARTY', sid: this.mRecord.hp_pkid });
  }

  OnBlur(field: string) {
    var oldChar = / /gi;//replace all blank space in a string
    switch (field) {

      case 'hp_cbm':
        {
          this.mRecord.hp_cbm = this.gs.roundNumber(this.mRecord.hp_cbm, 3);
          break;
        }
        case 'hp_pcs':
        {
          this.mRecord.hp_pcs = this.gs.roundNumber(this.mRecord.hp_pcs, 3);
          break;
        }
        case 'hp_kgs':
        {
          this.mRecord.hp_kgs = this.gs.roundNumber(this.mRecord.hp_kgs, 3);
          break;
        }
        case 'hp_notify_name':
        {
          this.mRecord.hp_notify_name = this.mRecord.hp_notify_name.toUpperCase().trim();
          break;
        }
    }
  }

}
