import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, OnChanges, SimpleChange } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../../core/services/global.service';

import { ItemDet } from '../../models/itemdet';

import { ItemDetService } from '../../services/itemdet.service';

import { SearchTable } from '../../../shared/models/searchtable';

@Component({
  selector: 'app-itemdet',
  templateUrl: './itemdet.component.html',
  providers: [ItemDetService]
})
export class ItemDetComponent {
  // Local Variables 
  title = '';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() parentid: string = '';

  Total_Amount: number = 0;

  loading = false;
  currentTab = 'LIST';

  ErrorMessage = "";
  InfoMessage = "";
  mode = 'ADD';
  pkid = '';

  ctr: number;
  jobdisabled = false;



  // Array For Displaying List
  RecordList: ItemDet[] = [];
  // Single Record for add/edit/view details
  Record: ItemDet = new ItemDet;

  COUNTRYRECORD: SearchTable = new SearchTable();
  STATERECORD: SearchTable = new SearchTable();
  TRANSCOUNTRYRECORD: SearchTable = new SearchTable();
  DFIAUNITRECORD: SearchTable = new SearchTable();

  constructor(
    private mainService: ItemDetService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.InitLov();

  }

  // Init Will be called After executing Constructor
  ngOnInit() {

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (let propName in changes) {
      let changedProp = changes[propName];
      let from = changedProp.previousValue;
      if (propName == 'parentid') {
        this.ActionHandler("EDIT", this.parentid);
      }
    }
  }


  InitLov() {

    this.COUNTRYRECORD = new SearchTable();
    this.COUNTRYRECORD.controlname = "COUNTRY";
    this.COUNTRYRECORD.displaycolumn = "NAME";
    this.COUNTRYRECORD.type = "COUNTRY";
    this.COUNTRYRECORD.id = "";
    this.COUNTRYRECORD.name = "";

    this.STATERECORD = new SearchTable();
    this.STATERECORD.controlname = "STATE";
    this.STATERECORD.displaycolumn = "CODE";
    this.STATERECORD.type = "STATE";
    this.STATERECORD.id = "";
    this.STATERECORD.code = "";

    this.TRANSCOUNTRYRECORD = new SearchTable();
    this.TRANSCOUNTRYRECORD.controlname = "TRANSCOUNTRY";
    this.TRANSCOUNTRYRECORD.displaycolumn = "NAME";
    this.TRANSCOUNTRYRECORD.type = "COUNTRY";
    this.TRANSCOUNTRYRECORD.id = "";
    this.TRANSCOUNTRYRECORD.name = "";

    this.DFIAUNITRECORD = new SearchTable();
    this.DFIAUNITRECORD.controlname = "DFIA-UNIT";
    this.DFIAUNITRECORD.displaycolumn = "CODE";
    this.DFIAUNITRECORD.type = "UNIT";
    this.DFIAUNITRECORD.id = "";
    this.DFIAUNITRECORD.code = "";
    this.DFIAUNITRECORD.name = "";
  }

  LovSelected(_Record: SearchTable) {

    if (_Record.controlname == "COUNTRY") {
      this.Record.itm_prod_country_id = _Record.id;
      this.Record.itm_prod_country_name = _Record.name;
    }
    if (_Record.controlname == "STATE") {
      this.Record.itm_prod_state_id = _Record.id;
      this.Record.itm_prod_state_code = _Record.code;
    }
    if (_Record.controlname == "TRANSCOUNTRY") {
      this.Record.itm_prod_transit_country_id = _Record.id;
      this.Record.itm_prod_transit_country_name = _Record.name;
    }
    if (_Record.controlname == "DFIA-UNIT") {
      this.Record.itm_dfia_unit_id = _Record.id;
      this.Record.itm_dfia_unit_code = _Record.code;
      this.Record.itm_dfia_unit_name = _Record.name;
    }
  }


  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (action == 'LIST') {
      this.mode = '';
      this.pkid = '';
      this.currentTab = 'LIST';
    }
    else if (action === 'ADD') {
      this.currentTab = 'DETAILS';
      this.mode = 'ADD';
      this.ResetControls();
      this.NewRecord();

    }
    else if (action === 'EDIT') {
      this.currentTab = 'DETAILS';
      this.mode = 'EDIT';
      this.ResetControls();
      this.pkid = id;
      this.GetRecord(id);
    }
    else if (action === 'REMOVE') {
      this.currentTab = 'DETAILS';
      this.pkid = id;
      this.RemoveRecord(id);
    }
  }

  ResetControls() {
    if (this.mode == "ADD")
      this.jobdisabled = false;
    else
      this.jobdisabled = true;
  }

  List111(_type: string) {

    this.loading = true;

    let SearchData = {
      type: _type,
      rowtype: this.type,
      parentid: this.parentid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.title = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
        this.title = response.containerno;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  NewRecord() {
    this.pkid = this.gs.getGuid();
    this.Record = new ItemDet();
    this.Record.itm_parent_id = this.parentid;
    this.Record.rec_mode = this.mode;
    this.Record.itm_prod_code_type = '';
    this.Record.itm_prod_grower_code = '';
    this.Record.itm_prod_address1 = '';
    this.Record.itm_prod_address2 = '';
    this.Record.itm_prod_city = '';
    this.Record.itm_prod_subdiv = '';
    this.Record.itm_prod_pin = '';
    this.Record.itm_prod_country_id = '';
    this.Record.itm_prod_country_name = '';
    this.Record.itm_prod_state_id = '';
    this.Record.itm_prod_state_code = '';
    this.Record.itm_prod_transit_country_id = '';
    this.Record.itm_prod_transit_country_name = '';
    this.Record.itm_ar4no = '';
    this.Record.itm_ar4date = '';
    this.Record.itm_ar4commrate = '';
    this.Record.itm_ar4division = '';
    this.Record.itm_ar4range = '';
    this.Record.itm_ar4remarks = '';

    this.Record.itm_dfia_sion_group_code = '';
    this.Record.itm_dfia_sion_slno = '';
    this.Record.itm_dfia_sion_norm_slno = '';
    this.Record.itm_dfia_qty = 0;
    this.Record.itm_dfia_unit_id = '';
    this.Record.itm_dfia_unit_code = '';
    this.Record.itm_dfia_unit_name = '';
    this.Record.itm_dfia_item_desc = '';
    this.Record.itm_dfia_characteristics = '';
    this.Record.itm_dfia_filenumber = '';
    this.Record.itm_dfia_licno = '';


    this.InitLov();
    //this.PKGUNITRECORD.id = this.Record.pack_pkg_unit_id;
    //this.PKGUNITRECORD.code = this.Record.pack_pkg_unit_code;
  }

  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;

    let SearchData = {
      pkid: Id,
      parentid: this.parentid,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.mode == "ADD")
          this.ActionHandler("ADD", null);
        else {
          this.mode = "EDIT";
          this.LoadData(response.record);
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  LoadData(_Record: ItemDet) {
    this.Record = _Record;
    this.InitLov();

    this.COUNTRYRECORD.id = this.Record.itm_prod_country_id;
    this.COUNTRYRECORD.name = this.Record.itm_prod_country_name;

    this.STATERECORD.id = this.Record.itm_prod_state_id;
    this.STATERECORD.code = this.Record.itm_prod_state_code;

    this.TRANSCOUNTRYRECORD.id = this.Record.itm_prod_transit_country_id;
    this.TRANSCOUNTRYRECORD.name = this.Record.itm_prod_transit_country_name;

    this.DFIAUNITRECORD.id = this.Record.itm_dfia_unit_id;
    this.DFIAUNITRECORD.code = this.Record.itm_dfia_unit_code;

    this.Record.rec_mode = this.mode;
  }
  // Save Data
  Save() {
    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.itm_parent_id = this.parentid;
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
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


    if (this.Record.itm_parent_id.toString().trim().length <= 0) {
      bret = false;
      sError += "\n\r Parent ID Cannot Be Blank";
    }

    if (bret == false) {
      this.ErrorMessage = sError;
      alert(this.ErrorMessage);
    }
    return bret;
  }

  RefreshList() {

  }

  RemoveRecord(Id: string) {
    this.loading = true;
    let SearchData = {
      pkid: Id,
      parentid: this.parentid
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList.splice(this.RecordList.findIndex(rec => rec.itm_parent_id == this.pkid), 1);
        this.ActionHandler('ADD', null);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }


  Close() {
    this.gs.ClosePage('home');
  }

  OnBlur(field: string) {
    switch (field) {
      case 'itm_prod_code_type':
        {
          this.Record.itm_prod_code_type = this.Record.itm_prod_code_type.toUpperCase();
          break;
        }
      case 'itm_prod_grower_code':
        {
          this.Record.itm_prod_grower_code = this.Record.itm_prod_grower_code.toUpperCase();
          break;
        }
      case 'itm_prod_address1':
        {
          this.Record.itm_prod_address1 = this.Record.itm_prod_address1.toUpperCase();
          break;
        }
      case 'itm_prod_address2':
        {
          this.Record.itm_prod_address2 = this.Record.itm_prod_address2.toUpperCase();
          break;
        }
      case 'itm_prod_city':
        {
          this.Record.itm_prod_city = this.Record.itm_prod_city.toUpperCase();
          break;
        }
      case 'itm_prod_subdiv':
        {
          this.Record.itm_prod_subdiv = this.Record.itm_prod_subdiv.toUpperCase();
          break;
        }
      case 'itm_ar4no':
        {
          this.Record.itm_ar4no = this.Record.itm_ar4no.toUpperCase();
          break;
        }
      case 'itm_ar4commrate':
        {
          this.Record.itm_ar4commrate = this.Record.itm_ar4commrate.toUpperCase();
          break;
        }
      case 'itm_ar4division':
        {
          this.Record.itm_ar4division = this.Record.itm_ar4division.toUpperCase();
          break;
        }
      case 'itm_ar4range':
        {
          this.Record.itm_ar4range = this.Record.itm_ar4range.toUpperCase();
          break;
        }
      case 'itm_ar4remarks':
        {
          this.Record.itm_ar4remarks = this.Record.itm_ar4remarks.toUpperCase();
          break;
        }
      case 'itm_dfia_sion_group_code':
        {
          this.Record.itm_dfia_sion_group_code = this.Record.itm_dfia_sion_group_code.toUpperCase();
          break;
        }

      case 'itm_dfia_sion_slno':
        {
          this.Record.itm_dfia_sion_slno = this.Record.itm_dfia_sion_slno.toUpperCase();
          break;
        }

      case 'itm_dfia_sion_norm_slno':
        {
          this.Record.itm_dfia_sion_norm_slno = this.Record.itm_dfia_sion_norm_slno.toUpperCase();
          break;
        }

      case 'itm_dfia_qty':
        {
          this.Record.itm_dfia_qty = this.gs.roundWeight(this.Record.itm_dfia_qty, "PKG");
          break;
        }

      case 'itm_dfia_item_desc':
        {
          this.Record.itm_dfia_item_desc = this.Record.itm_dfia_item_desc.toUpperCase();
          break;
        }

      case 'itm_dfia_characteristics':
        {
          this.Record.itm_dfia_characteristics = this.Record.itm_dfia_characteristics.toUpperCase();
          break;
        }

      case 'itm_dfia_filenumber':
        {
          this.Record.itm_dfia_filenumber = this.Record.itm_dfia_filenumber.toUpperCase();
          break;
        }

      case 'itm_dfia_licno':
        {
          this.Record.itm_dfia_licno = this.Record.itm_dfia_licno.toUpperCase();
          break;
        }
    }
  }

}
