import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { EdiHouse } from '../models/edihouse';
import { AmsEdiService } from '../services/amsedi.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-amsedi',
  templateUrl: './amsedi.component.html',
  providers: [AmsEdiService]
})
export class AmsEdiComponent {
  // Local Variables 
  title = 'AMS List';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() mblid: string = '';
  @Input() hblid: string = '';
  selectedRowIndex: number = -1;
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;

  loading = false;
  currentTab = 'LIST';

  bAdmin = false;
  bChanged: boolean;
  user_admin = false;

  searchstring = "";
  ErrorMessage = "";
  InfoMessage = "";

  mode = 'ADD';
  pkid = '';

  ctr: number;

  // Array For Displaying List
  RecordList: EdiHouse[] = [];
  // Single Record for add/edit/view details
  Record: EdiHouse = new EdiHouse;


  constructor(
    private mainService: AmsEdiService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.InitLov();
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
    this.List();
  }

  InitComponent() {
    this.bAdmin = false;
    this.user_admin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
    }
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  InitLov() {

  }

  LovSelected(_Record: SearchTable) {

  }


  ResetControls() {

  }

  List() {
    this.loading = true;

    let SearchData = {
      type: this.type,
      mblid: this.mblid,
      hblid: this.hblid,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  // Save Data
  ImportData() {
    if (!this.allvalid())
      return;

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    let SearchData = {
      type: this.type,
      mblid: this.mblid,
      hblid: this.hblid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code
    };

    SearchData.mblid = this.mblid;
    SearchData.hblid = this.hblid;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.year_code = this.gs.globalVariables.year_code;

    this.mainService.ImportData(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
        alert(this.InfoMessage);
        this.List();
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

    /*
      if (this.Record.ord_desc.trim().length <= 0) {
        bret = false;
        sError += "\n\r | Description Cannot Be Blank";
      }
    */


    //if (bret === false)
    //    this.ErrorMessage = sError;

    return bret;
  }

  RefreshList() {

    //if (this.RecordList == null)
    //    return;
    //var REC = this.RecordList.find(rec => rec.ord_pkid == this.Record.ord_pkid);
    //if (REC == null) {
    //    this.RecordList.push(this.Record);
    //}
    //else {
    //    REC.ord_po = this.Record.ord_po;
    //    REC.ord_style = this.Record.ord_style;
    //    REC.ord_cargo_status = this.Record.ord_cargo_status;
    //    REC.ord_desc = this.Record.ord_desc;
    //    REC.ord_color = this.Record.ord_color;
    //    REC.ord_contractno = this.Record.ord_contractno;
    //}
  }

  Close() {
    this.gs.ClosePage('home');
  }

  OnFocus(field: string) {
    this.bChanged = false;
  }

  OnChange(field: string) {
    this.bChanged = true;
  }

  OnBlur(field: string) {
    switch (field) {

      //   case 'BR_CUSTOM_LOCATIONS':
      //     {
      //       this.BR_CUSTOM_LOCATIONS = this.BR_CUSTOM_LOCATIONS.toUpperCase();
      //       break;
      //     }
    }
  }

  Generate(){
    
  }


}
