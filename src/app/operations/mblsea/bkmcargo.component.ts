import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { BkmCargo } from '../models/bkmcargo';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-bkmcargo',
  templateUrl: './bkmcargo.component.html',
})
export class BkmCargoComponent {
  // Local Variables 
  title = 'Cargo Details';
  @Output() ModifiedRecords = new EventEmitter<any>();
  @Input() menuid: string = '';
  @Input() public pkid: string;
  @Input() public type: string = '';
  @Input() mRecord: BkmCargo = new BkmCargo;

  InitCompleted: boolean = false;
  menu_record: any;

  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string;
  RITCRECORD: SearchTable = new SearchTable();
  PKGUNITRECORD: SearchTable = new SearchTable();
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
    this.RITCRECORD = new SearchTable();
    this.RITCRECORD.controlname = "RITC";
    this.RITCRECORD.displaycolumn = "CODE";
    this.RITCRECORD.type = "RITCM";
    this.RITCRECORD.id = this.mRecord.bc_ritc_id;
    this.RITCRECORD.code = this.mRecord.bc_ritc_code;
    this.RITCRECORD.name = this.mRecord.bc_ritc_name;

    this.PKGUNITRECORD = new SearchTable();
    this.PKGUNITRECORD.controlname = "PKG-UNIT";
    this.PKGUNITRECORD.displaycolumn = "CODE";
    this.PKGUNITRECORD.type = "UNIT";
    this.PKGUNITRECORD.id = this.mRecord.bc_pkg_id;
    this.PKGUNITRECORD.code = this.mRecord.bc_pkg_code;
    this.PKGUNITRECORD.name = this.mRecord.bc_pkg_name;
  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "RITC") {
      this.mRecord.bc_ritc_id = _Record.id;
      this.mRecord.bc_ritc_code = _Record.code;
      this.mRecord.bc_ritc_name = _Record.name;
    }
    if (_Record.controlname == "PKG-UNIT") {
      this.mRecord.bc_pkg_id = _Record.id;
      this.mRecord.bc_pkg_code = _Record.code;
      this.mRecord.bc_pkg_name = _Record.name;
    }
  }

  AddRow() {
    if (this.ModifiedRecords != null)
      this.ModifiedRecords.emit({ saction: 'ADD', type: 'CARGO-DESC', sid: this.mRecord.bc_pkid });
  }

  RemoveRow() {
    if (this.ModifiedRecords != null)
      this.ModifiedRecords.emit({ saction: 'REMOVE', type: 'CARGO-DESC', sid: this.mRecord.bc_pkid });
  }

  OnBlur(field: string) {
    if (field == 'bc_desc') {
      this.mRecord.bc_desc = this.mRecord.bc_desc.toUpperCase();
    }
    if (field == 'bc_cbm') {
      this.mRecord.bc_cbm = this.gs.roundNumber(this.mRecord.bc_cbm, 4);
    }
    if (field == 'bc_wt') {
      this.mRecord.bc_wt = this.gs.roundNumber(this.mRecord.bc_wt, 3);
    }
    if (field == 'bc_pkg') {
      this.mRecord.bc_pkg = this.gs.roundNumber(this.mRecord.bc_pkg, 0);
    }
  }

}
