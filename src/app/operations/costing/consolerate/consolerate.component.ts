import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Consolerate } from '../../models/consolerate';
import { ConsolerateService } from '../../services/consolerate.service';
import { SearchTable } from '../../../shared/models/searchtable';

@Component({
  selector: 'app-consolerate',
  templateUrl: './consolerate.component.html',
  providers: [ConsolerateService]
})
export class ConsolerateComponent {
  // Local Variables 
  title = 'Console Cost Master';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  selectedRowIndex = 0;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  upload_date: string = '';
  irn: string = '';
  drn: string = '';

  sub: any;
  urlid: string;
  modal: any;

  branch_code: string = '';
  branch_name: string = '';
  agent_id: string = '';
  agent_code: string = '';
  agent_name: string = '';
  lbl_ex_rate: string = 'Ex. Rate @ 1 GBP = ';
  grp_dest_exp: string = 'DESTINATION EXPENSE (GBP) ';
  grp_dest_inc: string = 'DESTINATION INCOME (GBP)';
  min_rate: boolean = false;

  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';


  // Array For Displaying List
  RecordList: Consolerate[] = [];
  // Single Record for add/edit/view details
  Record: Consolerate = new Consolerate;

  BRRECORD: SearchTable = new SearchTable();
  // AGENTRECORD: SearchTable = new SearchTable();

  constructor(
    private modalService: NgbModal,
    private mainService: ConsolerateService,
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {
    this.page_count = 0;
    this.page_rows = 25;
    this.page_current = 0;


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
  }

  InitComponent() {

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
    this.upload_date = this.gs.defaultValues.today;

    this.InitLov();
    // this.LoadCombo();
    this.List("NEW");
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  LoadCombo() {
    
  }

  InitLov() {

    this.BRRECORD = new SearchTable();
    this.BRRECORD.controlname = "BRANCH";
    this.BRRECORD.displaycolumn = "CODE";
    this.BRRECORD.type = "BRANCH";
    this.BRRECORD.id = "";
    this.BRRECORD.code = "";


    //this.AGENTRECORD = new SearchTable();
    //this.AGENTRECORD.controlname = "AGENT";
    //this.AGENTRECORD.where = " CUST_IS_AGENT = 'Y' ";
    //this.AGENTRECORD.displaycolumn = "NAME";
    //this.AGENTRECORD.type = "CUSTOMER";
    //this.AGENTRECORD.id = "";
    //this.AGENTRECORD.code = "";
    //this.AGENTRECORD.name = "";

  }
  LovSelected(_Record: any) {

    if (_Record.controlname == "BRANCH") {
      this.Record.cr_branch_code = _Record.code;
      this.Record.cr_branch_name = _Record.name;
    }

    //if (_Record.controlname == "AGENT") {
    //  //this.agent_id = _Record.id;
    //  //this.agent_code = _Record.code;
    //  this.Record.cr_agent_name = _Record.name;
    //}
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
  }


  ResetControls() {
    this.disableSave = true;
    if (!this.menu_record)
      return;

    if (this.menu_record.rights_admin)
      this.disableSave = false;
    if (this.mode == "ADD" && this.menu_record.rights_add)
      this.disableSave = false;
    if (this.mode == "EDIT" && this.menu_record.rights_edit)
      this.disableSave = false;
    return this.disableSave;
  }

  // Query List Data
  List(_type: string) {

    this.loading = true;

    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      upload_date: this.upload_date,
      min_rate: this.min_rate,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
        this.page_count = response.page_count;
        this.page_current = response.page_current;
        this.page_rowcount = response.page_rowcount;
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
        alert(this.ErrorMessage);
      });
  }


  NewRecord() {

    this.pkid = this.gs.getGuid();

    this.Record = new Consolerate();
    this.Record.cr_pkid = this.pkid;
    this.Record.cr_agent_name = 'ACTION';
    this.Record.cr_branch_code = '';
    this.Record.cr_branch_name = '';
    this.Record.cr_cntr_type = '';
    this.Record.cr_ex_rate_gbp = 0;
    this.Record.cr_org_inc_thc = 0;
    this.Record.cr_org_inc_bl = 0;
    this.Record.cr_org_exp_thc = 0;
    this.Record.cr_org_exp_emtyplce = 0;
    this.Record.cr_org_exp_misc = 0;
    this.Record.cr_org_exp_stuff = 0;
    this.Record.cr_org_exp_trans = 0;
    this.Record.cr_org_exp_cfs = 0;
    this.Record.cr_org_exp_survey = 0;
    this.Record.cr_org_exp_cseal = 0;
    this.Record.cr_org_exp_surrend = 0;

    this.Record.cr_des_inc_thc = 0;
    this.Record.cr_des_inc_hndg_cbm = 0;
    this.Record.cr_des_inc_hndg_ton = 0;
    this.Record.cr_des_inc_bl = 0;

    this.Record.cr_des_exp_terml = 0;
    this.Record.cr_des_exp_bl = 0;
    this.Record.cr_des_exp_shunt = 0;
    this.Record.cr_des_exp_unpack = 0;
    this.Record.cr_des_exp_lolo = 0;
    this.Record.cr_des_exp_securty = 0;
    this.Record.cr_des_exp_isps = 0;
    this.Record.cr_des_exp_tpw = 0;
    this.Record.cr_des_exp_tdoc = 0;

    this.Record.cr_rate_code = '';
    this.Record.cr_rate_value = 0;
    this.Record.rec_mode = this.mode;

    this.InitLov();
    this.OnChange('ACTION');
  }




  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;

    let SearchData = {
      pkid: Id,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.LoadData(response.record);

      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
        alert(this.ErrorMessage);
      });
  }

  LoadData(_Record: Consolerate) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
    this.InitLov();
    this.OnChange(this.Record.cr_agent_name);
    // this.AGENTRECORD.name = this.Record.cr_agent_name;
    this.BRRECORD.name = this.Record.cr_branch_name;
    this.BRRECORD.code = this.Record.cr_branch_code;
  }



  // Save Data
  Save() {

    //if (!this.allvalid())
    //  return;

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    this.Record._globalvariables = this.gs.globalVariables;
    this.Record.min_rate = this.min_rate;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.RefreshList();



      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
        alert(this.ErrorMessage);
      });
  }

  allvalid() {
    //let sError: string = "";
    //let bret: boolean = true;
    //this.ErrorMessage = '';
    //this.InfoMessage = '';

    //if (this.Record.cr_branch_code.trim().length <= 0) {
    //  bret = false;
    //  sError += " | Branch Cannot Be Blank";
    //}

    //if (this.Record.cr_agent_name.trim().length <= 0) {
    //  bret = false;
    //  sError += " | Agent Cannot Be Blank";
    //}


    //if (bret === false)
    //  this.ErrorMessage = sError;
    //return bret;
  }

  RefreshList() {

    if (this.RecordList == null)
      return;

    var REC = this.RecordList.find(rec => rec.cr_pkid == this.Record.cr_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {

      REC.cr_branch_name = this.Record.cr_branch_name;
      REC.cr_agent_name = this.Record.cr_agent_name;
      REC.cr_cntr_type = this.Record.cr_cntr_type;
      REC.cr_ex_rate_gbp = this.Record.cr_ex_rate_gbp;
      REC.cr_org_inc_thc = this.Record.cr_org_inc_thc;
      REC.cr_org_inc_bl = this.Record.cr_org_inc_bl;
      REC.cr_org_exp_thc = this.Record.cr_org_exp_thc;
      REC.cr_org_exp_emtyplce = this.Record.cr_org_exp_emtyplce;
      REC.cr_org_exp_misc = this.Record.cr_org_exp_misc;
      REC.cr_org_exp_stuff = this.Record.cr_org_exp_stuff;
      REC.cr_org_exp_trans = this.Record.cr_org_exp_trans;
      REC.cr_org_exp_surrend = this.Record.cr_org_exp_surrend;
      REC.cr_org_exp_cfs = this.Record.cr_org_exp_cfs;
      REC.cr_org_exp_survey = this.Record.cr_org_exp_survey;
      REC.cr_rate_code = this.Record.cr_rate_code;
      REC.cr_rate_value = this.Record.cr_rate_value;

    }
  }



  OnBlur(field: string) {

    switch (field) {

      case 'cr_ex_rate_gbp':
        {
          this.Record.cr_ex_rate_gbp = this.gs.roundNumber(this.Record.cr_ex_rate_gbp, 3);
          break;
        }

      case 'cr_org_inc_thc':
        {
          this.Record.cr_org_inc_thc = this.gs.roundNumber(this.Record.cr_org_inc_thc, 3);
          break;
        }

      case 'cr_org_inc_bl':
        {
          this.Record.cr_org_inc_bl = this.gs.roundNumber(this.Record.cr_org_inc_bl, 3);
          break;
        }

      case 'cr_org_exp_thc':
        {
          this.Record.cr_org_exp_thc = this.gs.roundNumber(this.Record.cr_org_exp_thc, 3);
          break;
        }

      case 'cr_org_exp_emtyplce':
        {
          this.Record.cr_org_exp_emtyplce = this.gs.roundNumber(this.Record.cr_org_exp_emtyplce, 3);
          break;
        }
      case 'cr_org_exp_misc':
        {
          this.Record.cr_org_exp_misc = this.gs.roundNumber(this.Record.cr_org_exp_misc, 3);
          break;
        }

      case 'cr_org_exp_stuff':
        {
          this.Record.cr_org_exp_stuff = this.gs.roundNumber(this.Record.cr_org_exp_stuff, 3);
          break;
        }

      case 'cr_org_exp_trans':
        {
          this.Record.cr_org_exp_trans = this.gs.roundNumber(this.Record.cr_org_exp_trans, 3);
          break;
        }

      case 'cr_org_exp_cfs':
        {
          this.Record.cr_org_exp_cfs = this.gs.roundNumber(this.Record.cr_org_exp_cfs, 3);
          break;
        }

      case 'cr_org_exp_survey':
        {
          this.Record.cr_org_exp_survey = this.gs.roundNumber(this.Record.cr_org_exp_survey, 3);
          break;
        }

      case 'cr_org_exp_cseal':
        {
          this.Record.cr_org_exp_cseal = this.gs.roundNumber(this.Record.cr_org_exp_cseal, 3);
          break;
        }

      case 'cr_org_exp_surrend':
        {
          this.Record.cr_org_exp_surrend = this.gs.roundNumber(this.Record.cr_org_exp_surrend, 3);
          break;
        }

      case 'cr_des_inc_thc':
        {
          this.Record.cr_des_inc_thc = this.gs.roundNumber(this.Record.cr_des_inc_thc, 3);
          break;
        }

      case 'cr_des_inc_hndg_cbm':
        {
          this.Record.cr_des_inc_hndg_cbm = this.gs.roundNumber(this.Record.cr_des_inc_hndg_cbm, 3);
          break;
        }

      case 'cr_des_inc_hndg_ton':
        {
          this.Record.cr_des_inc_hndg_ton = this.gs.roundNumber(this.Record.cr_des_inc_hndg_ton, 3);
          break;
        }

      case 'cr_des_inc_bl':
        {
          this.Record.cr_des_inc_bl = this.gs.roundNumber(this.Record.cr_des_inc_bl, 3);
          break;
        }

      case 'cr_des_exp_terml':
        {
          this.Record.cr_des_exp_terml = this.gs.roundNumber(this.Record.cr_des_exp_terml, 3);
          break;
        }

      case 'cr_des_exp_bl':
        {
          this.Record.cr_des_exp_bl = this.gs.roundNumber(this.Record.cr_des_exp_bl, 3);
          break;
        }

      case 'cr_des_exp_shunt':
        {
          this.Record.cr_des_exp_shunt = this.gs.roundNumber(this.Record.cr_des_exp_shunt, 3);
          break;
        }

      case 'cr_des_exp_unpack':
        {
          this.Record.cr_des_exp_unpack = this.gs.roundNumber(this.Record.cr_des_exp_unpack, 3);
          break;
        }

      case 'cr_des_exp_lolo':
        {
          this.Record.cr_des_exp_lolo = this.gs.roundNumber(this.Record.cr_des_exp_lolo, 3);
          break;
        }

      case 'cr_des_exp_securty':
        {
          this.Record.cr_des_exp_securty = this.gs.roundNumber(this.Record.cr_des_exp_securty, 3);
          break;
        }

      case 'cr_des_exp_isps':
        {
          this.Record.cr_des_exp_isps = this.gs.roundNumber(this.Record.cr_des_exp_isps, 3);
          break;
        }

      case 'cr_des_exp_tpw':
        {
          this.Record.cr_des_exp_tpw = this.gs.roundNumber(this.Record.cr_des_exp_tpw, 3);
          break;
        }

      case 'cr_des_exp_tdoc':
        {
          this.Record.cr_des_exp_tdoc = this.gs.roundNumber(this.Record.cr_des_exp_tdoc, 3);
          break;
        }

      case 'cr_rate_code':
        {
          this.Record.cr_rate_code = this.Record.cr_rate_code.trim().toUpperCase();
          break;
        }

      case 'cr_rate_value':
        {
          this.Record.cr_rate_value = this.gs.roundNumber(this.Record.cr_rate_value, 3);
          break;
        }
    }

  }

  OnChange(field: string) {

    this.lbl_ex_rate = "Ex. Rate @ 1";
    this.grp_dest_exp = "DESTINATION EXPENSE";
    this.grp_dest_inc = "DESTINATION INCOME";

    if (field == 'ACTION') {
      this.lbl_ex_rate += " GBP = ";
      this.grp_dest_exp += " (GBP)";
      this.grp_dest_inc += " (GBP)";
    }
    if (field == 'GATE4EU') {
      this.lbl_ex_rate += " EUR = ";
      this.grp_dest_exp += " (EUR)";
      this.grp_dest_inc += " (EUR)";
    }

  }

  OnChange2(field: string) {
    this.RecordList = null;

  }

  Close() {
    this.gs.ClosePage('home');
  }

}
