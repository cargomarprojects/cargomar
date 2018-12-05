import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../../core/services/global.service';

import { AirCostm } from '../../models/aircost';

import { AirCostService } from '../../services/aircost.service';

import { SearchTable } from '../../../shared/models/searchtable';

@Component({
  selector: 'app-aircost',
  templateUrl: './aircost.component.html',
  providers: [AirCostService]
})
export class AirCostComponent {
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
 

  // Array For Displaying List
  RecordList: AirCostm[] = [];
  // Single Record for add/edit/view details
  Record: AirCostm = new AirCostm;

  EXPRECORD: SearchTable = new SearchTable();
  EXPADDRRECORD: SearchTable = new SearchTable();

  constructor(
    private mainService: AirCostService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.InitLov();

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.ActionHandler("EDIT", this.parentid);
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  InitLov() {


  }

  LovSelected(_Record: SearchTable) {


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
     
  }
  List(_type: string) {

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
      });
  }

  NewRecord() {

    this.pkid = this.gs.getGuid();
    this.Record = new AirCostm();
    this.Record.air_mblid = this.parentid;
    this.Record.rec_mode = this.mode;
    this.Record.air_actual_rate = 0;
    this.Record.air_agent_rate = 0;
    this.Record.air_rebate = 0;
    this.Record.air_rebate_payable = '';
    this.Record.air_sell_recd = 0;
    this.Record.air_sell_informed = 0;
    this.Record.air_iata_incentive = '';
    this.Record.air_iata_commission = '';
    this.Record.air_exworks = 0;
    this.Record.air_sell_info_currency = '';
    this.Record.air_sell_recd_currency = '';
    this.Record.air_currency = '';
    this.Record.air_amount = 0;
    this.Record.air_mawb_chg_wt = 0;
    this.Record.air_remarks = '';
    this.Record.air_netnet = '';
    this.Record.air_iata_comm_per = 0;
    this.Record.air_iata_comm_amt = 0;
    this.Record.air_iata_inc_per = 0;
    this.Record.air_iata_inc_amt = 0;
    this.Record.air_other_chg_inc = 0;
    this.Record.air_other_chg_exp = 0;
    this.Record.air_counter_informed = 0;
    this.Record.air_publish_rate = 0;
    
    this.InitLov();
    
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
      });
  }

  LoadData(_Record: AirCostm) {
    this.Record = _Record;
    this.InitLov();

    this.Record.rec_mode = this.mode;
  }
  // Save Data
  Save() {
    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.air_currency = this.gs.defaultValues.param_curr_local_id;
    this.Record.air_sell_info_currency = this.gs.defaultValues.param_curr_local_id;
    this.Record.air_sell_recd_currency = this.gs.defaultValues.param_curr_local_id;
    this.Record.air_mblid = this.parentid;
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
      });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';


    if (this.Record.air_mblid.toString().trim().length <= 0) {
      bret = false;
      sError += "\n\r Parent ID Cannot Be Blank";
    }

    if (bret == false)
      this.ErrorMessage = sError;
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
       this.RecordList.splice(this.RecordList.findIndex(rec => rec.air_mblid == this.pkid), 1);
        this.ActionHandler('ADD', null);
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }


  Close() {
    this.gs.ClosePage('home');
  }

  OnBlur(field: string) {
    switch (field) {





      case 'air_rebate_payable':
        {
          this.Record.air_rebate_payable = this.Record.air_rebate_payable.toUpperCase();
          break;
        }
      case 'air_iata_incentive':
        {
          this.Record.air_iata_incentive = this.Record.air_iata_incentive.toUpperCase();
          break;
        }
      case 'air_iata_commission':
        {
          this.Record.air_iata_commission = this.Record.air_iata_commission.toUpperCase();
          break;
        }
      case 'air_remarks':
        {
          this.Record.air_remarks = this.Record.air_remarks.toUpperCase();
          break;
        }
      case 'air_netnet':
        {
          this.Record.air_netnet = this.Record.air_netnet.toUpperCase();
          break;
        }
      case 'air_actual_rate':
        {
          this.Record.air_actual_rate = this.gs.roundNumber(this.Record.air_actual_rate, 2);
          break;
        }

      case 'air_agent_rate':
        {
          this.Record.air_actual_rate = this.gs.roundNumber(this.Record.air_actual_rate, 2);
          break;
        }

      case 'air_rebate':
        {
          this.Record.air_rebate = this.gs.roundNumber(this.Record.air_rebate, 2);
          break;
        }


      case 'air_sell_recd':
        {
          this.Record.air_sell_recd = this.gs.roundNumber(this.Record.air_sell_recd, 2);
          break;
        }

      case 'air_sell_informed':
        {
          this.Record.air_sell_informed = this.gs.roundNumber(this.Record.air_sell_informed, 2);
          break;
        }


      case 'air_exworks':
        {
          this.Record.air_exworks = this.gs.roundNumber(this.Record.air_exworks, 2);
          break;
        }


      case 'air_amount':
        {
          this.Record.air_amount = this.gs.roundNumber(this.Record.air_amount, 2);
          break;
        }


      case 'air_mawb_chg_wt':
        {
          this.Record.air_mawb_chg_wt = this.gs.roundNumber(this.Record.air_mawb_chg_wt, 2);
          break;
        }

      case 'air_iata_comm_per':
        {
          this.Record.air_iata_comm_per = this.gs.roundNumber(this.Record.air_iata_comm_per, 2);
          break;
        }

      case 'air_iata_comm_amt':
        {
          this.Record.air_iata_comm_amt = this.gs.roundNumber(this.Record.air_iata_comm_amt, 2);
          break;
        }

      case 'air_iata_inc_per':
        {
          this.Record.air_iata_inc_per = this.gs.roundNumber(this.Record.air_iata_inc_per, 2);
          break;
        }

      case 'air_iata_inc_amt':
        {
          this.Record.air_iata_inc_amt = this.gs.roundNumber(this.Record.air_iata_inc_amt, 2);
          break;
        }

      case 'air_other_chg_inc':
        {
          this.Record.air_other_chg_inc = this.gs.roundNumber(this.Record.air_other_chg_inc, 2);
          break;
        }

      case 'air_other_chg_exp':
        {
          this.Record.air_other_chg_exp = this.gs.roundNumber(this.Record.air_other_chg_exp, 2);
          break;
        }

      case 'air_counter_informed':
        {
          this.Record.air_counter_informed = this.gs.roundNumber(this.Record.air_counter_informed, 2);
          break;
        }
      case 'air_publish_rate': 
        {
          this.Record.air_publish_rate = this.gs.roundNumber(this.Record.air_publish_rate, 2);
          break;
        }
    }
  }
  
}
