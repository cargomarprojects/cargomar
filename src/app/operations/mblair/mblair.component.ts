import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';
import { Mblm } from '../models/mbl';
import { MblService } from '../services/mbl.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Param } from '../../master/models/param';
import { Trackingm } from '../models/tracking';

@Component({
  selector: 'app-mblm',
  templateUrl: './mblair.component.html',
  providers: [MblService]
})
export class MblAirComponent {
  // Local Variables 
  title = 'MBL AIR MASTER';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  selectedRowIndex = 0;

  currentPage = 'ROOTPAGE';
  bAdmin = false;
  bDocs = false;
  bPrint = false;
  bCheckList = false;
  bAirCostTab = false;
  bPrepaidTab = false;

  modal: any;
  folder_id: string;
  chk_foldersent: boolean = false;
  foldersent: boolean = false;
  folder_chk: boolean = false;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  HblTab = 'LIST';

  searchby = '';
  searchstring = '';
  jobtype = 'BOTH';
  //porttype = 'SEA PORT';
  //carriertype = 'SEA CARRIER';

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;

  ErrorMessage = "";
  InfoMessage = "";

  sAgent_ID = "";
  sCarrier_ID = "";

  mode = '';
  pkid = '';

  StatusList: Param[] = [];
  // Array For Displaying List
  RecordList: Mblm[] = [];
  // Single Record for add/edit/view details
  Record: Mblm = new Mblm;

  AGENTRECORD: SearchTable = new SearchTable();
  AGENTADDRECORD: SearchTable = new SearchTable();
  //AGENT2RECORD: SearchTable = new SearchTable();
  CARRIERRECORD: SearchTable = new SearchTable();
  EXPRECORD: SearchTable = new SearchTable();
  EXPADDRECORD: SearchTable = new SearchTable();
  IMPRECORD: SearchTable = new SearchTable();
  IMPADDRECORD: SearchTable = new SearchTable();

  FACTORYLOCRECORD: SearchTable = new SearchTable();
  COMMODITYRECORD: SearchTable = new SearchTable();
  POLRECORD: SearchTable = new SearchTable();
  PODRECORD: SearchTable = new SearchTable();
  POFDRECORD: SearchTable = new SearchTable();
  SALESMANRECORD: SearchTable = new SearchTable();

  constructor(
    private modalService: NgbModal,
    private mainService: MblService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 10;
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
    this.searchby = 'ALL';
    this.foldersent = false;
    this.chk_foldersent = false;
    this.folder_chk = false;
    this.bAirCostTab = false;
    this.bPrepaidTab = false;
    this.bCheckList = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    this.bAdmin = false;
    this.bDocs = false;
    this.bPrint = false;
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_docs)
        this.bDocs = true;
      this.bPrint = this.menu_record.rights_print;
      if (this.menu_record.rights_approval.length > 0) {
        if (this.menu_record.rights_approval.toString().indexOf('{COST}') >= 0 || this.gs.globalVariables.user_code == "ADMIN")
          this.bAirCostTab = true;
        if (this.menu_record.rights_approval.toString().indexOf('{PP}') >= 0 || this.gs.globalVariables.user_code == "ADMIN")
          this.bPrepaidTab = true;
        if (this.menu_record.rights_approval.toString().indexOf('{CL}') >= 0 || this.gs.globalVariables.user_code == "ADMIN")
          this.bCheckList = true;
      }
    }
    this.InitLov();
    this.LoadCombo();

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  LoadCombo() {
    this.loading = true;
    let SearchData = {
      type: 'type',
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.LoadDefault(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.StatusList = response.statuslist;

        this.List("NEW");
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });

  }


  InitLov() {

    this.AGENTRECORD = new SearchTable();
    this.AGENTRECORD.controlname = "AGENT";
    this.AGENTRECORD.displaycolumn = "CODE";
    this.AGENTRECORD.type = "CUSTOMER";
    this.AGENTRECORD.where = " CUST_IS_AGENT = 'Y' ";
    this.AGENTRECORD.id = "";
    this.AGENTRECORD.code = "";
    this.AGENTRECORD.name = "";

    this.AGENTADDRECORD = new SearchTable();
    this.AGENTADDRECORD.controlname = "AGENTADDRESS";
    this.AGENTADDRECORD.displaycolumn = "CODE";
    this.AGENTADDRECORD.type = "CUSTOMERADDRESS";
    this.AGENTADDRECORD.id = "";
    this.AGENTADDRECORD.code = "";
    this.AGENTADDRECORD.name = "";
    this.AGENTADDRECORD.parentid = "";

    this.CARRIERRECORD = new SearchTable();
    this.CARRIERRECORD.controlname = "SEACARRIER";
    this.CARRIERRECORD.displaycolumn = "CODE";
    this.CARRIERRECORD.type = "AIR CARRIER";
    this.CARRIERRECORD.id = "";
    this.CARRIERRECORD.code = "";
    this.CARRIERRECORD.name = "";

    this.EXPRECORD = new SearchTable();
    this.EXPRECORD.controlname = "SHIPPER";
    this.EXPRECORD.displaycolumn = "CODE";
    this.EXPRECORD.type = "CUSTOMER";
    // this.EXPRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
    this.EXPRECORD.id = "";
    this.EXPRECORD.code = "";
    this.EXPRECORD.name = "";

    this.EXPADDRECORD = new SearchTable();
    this.EXPADDRECORD.controlname = "SHIPPERADDRESS";
    this.EXPADDRECORD.displaycolumn = "CODE";
    this.EXPADDRECORD.type = "CUSTOMERADDRESS";
    this.EXPADDRECORD.id = "";
    this.EXPADDRECORD.code = "";
    this.EXPADDRECORD.name = "";
    this.EXPADDRECORD.parentid = "";

    this.IMPRECORD = new SearchTable();
    this.IMPRECORD.controlname = "CONSIGNEE";
    this.IMPRECORD.displaycolumn = "CODE";
    this.IMPRECORD.type = "CUSTOMER";
    // this.IMPRECORD.where = " CUST_IS_CONSIGNEE = 'Y' ";
    this.IMPRECORD.id = "";
    this.IMPRECORD.code = "";
    this.IMPRECORD.name = "";
    this.IMPRECORD.parentid = "";

    this.IMPADDRECORD = new SearchTable();
    this.IMPADDRECORD.controlname = "CONSIGNEEADDRESS";
    this.IMPADDRECORD.displaycolumn = "CODE";
    this.IMPADDRECORD.type = "CUSTOMERADDRESS";
    this.IMPADDRECORD.id = "";
    this.IMPADDRECORD.code = "";
    this.IMPADDRECORD.name = "";
    this.IMPADDRECORD.parentid = "";

    this.FACTORYLOCRECORD = new SearchTable();
    this.FACTORYLOCRECORD.controlname = "FACTORYLOCATION";
    this.FACTORYLOCRECORD.displaycolumn = "CODE";
    this.FACTORYLOCRECORD.type = "CITY";
    this.FACTORYLOCRECORD.id = "";
    this.FACTORYLOCRECORD.code = "";
    this.FACTORYLOCRECORD.name = "";

    this.COMMODITYRECORD = new SearchTable();
    this.COMMODITYRECORD.controlname = "COMMODITY";
    this.COMMODITYRECORD.displaycolumn = "CODE";
    this.COMMODITYRECORD.type = "COMMODITY";
    this.COMMODITYRECORD.id = "";
    this.COMMODITYRECORD.code = "";
    this.COMMODITYRECORD.name = "";

    this.POLRECORD = new SearchTable();
    this.POLRECORD.controlname = "POL";
    this.POLRECORD.displaycolumn = "CODE";
    this.POLRECORD.type = "AIR PORT";
    this.POLRECORD.id = "";
    this.POLRECORD.code = "";
    this.POLRECORD.name = "";

    this.PODRECORD = new SearchTable();
    this.PODRECORD.controlname = "POD";
    this.PODRECORD.displaycolumn = "CODE";
    this.PODRECORD.type = "AIR PORT";
    this.PODRECORD.id = "";
    this.PODRECORD.code = "";
    this.PODRECORD.name = "";

    this.POFDRECORD = new SearchTable();
    this.POFDRECORD.controlname = "POFD";
    this.POFDRECORD.displaycolumn = "CODE";
    this.POFDRECORD.type = "AIR PORT";
    this.POFDRECORD.id = "";
    this.POFDRECORD.code = "";
    this.POFDRECORD.name = "";

    this.SALESMANRECORD = new SearchTable();
    this.SALESMANRECORD.controlname = "SALESMAN";
    this.SALESMANRECORD.displaycolumn = "CODE";
    this.SALESMANRECORD.type = "SALESMAN";
    this.SALESMANRECORD.id = "";
    this.SALESMANRECORD.code = "";
    this.SALESMANRECORD.name = "";

  }

  LovSelected(_Record: SearchTable) {
    let bchange: boolean = false;

    if (_Record.controlname == "AGENT") {

      bchange = false;
      if (this.Record.mbl_agent_id != _Record.id)
        bchange = true;

      this.Record.mbl_agent_id = _Record.id;
      this.Record.mbl_agent_code = _Record.code;
      this.Record.mbl_agent_name = _Record.name;

      if (bchange) {
        this.AGENTADDRECORD = new SearchTable();
        this.AGENTADDRECORD.controlname = "AGENTADDRESS";
        this.AGENTADDRECORD.displaycolumn = "CODE";
        this.AGENTADDRECORD.type = "CUSTOMERADDRESS";
        this.AGENTADDRECORD.id = "";
        this.AGENTADDRECORD.code = "";
        this.AGENTADDRECORD.name = "";
        this.AGENTADDRECORD.parentid = this.Record.mbl_agent_id;
        this.Record.mbl_agent_br_addr = "";
      }

    } else if (_Record.controlname == "AGENTADDRESS") {
      this.Record.mbl_agent_br_id = _Record.id;
      this.Record.mbl_agent_br_no = _Record.code;
      this.Record.mbl_agent_br_addr = this.GetBrAddress(_Record.name).address;
    }

    else if (_Record.controlname == "SEACARRIER") {
      this.Record.mbl_carrier_id = _Record.id;
      this.Record.mbl_carrier_code = _Record.code;
      this.Record.mbl_carrier_name = _Record.name;
    }
    else if (_Record.controlname == "SHIPPER") {

      bchange = false;
      if (this.Record.mbl_exp_id != _Record.id)
        bchange = true;

      this.Record.mbl_exp_id = _Record.id;
      this.Record.mbl_exp_code = _Record.code;
      this.Record.mbl_exp_name = _Record.name;

      if (bchange) {
        this.EXPADDRECORD = new SearchTable();
        this.EXPADDRECORD.controlname = "SHIPPERADDRESS";
        this.EXPADDRECORD.displaycolumn = "CODE";
        this.EXPADDRECORD.type = "CUSTOMERADDRESS";
        this.EXPADDRECORD.id = "";
        this.EXPADDRECORD.code = "";
        this.EXPADDRECORD.name = "";
        this.EXPADDRECORD.parentid = this.Record.mbl_exp_id;
        this.Record.mbl_exp_br_addr = "";
      }
    }
    else if (_Record.controlname == "SHIPPERADDRESS") {
      this.Record.mbl_exp_br_id = _Record.id;
      this.Record.mbl_exp_br_no = _Record.code;
      this.Record.mbl_exp_br_addr = this.GetBrAddress(_Record.name).address;
    }
    else if (_Record.controlname == "CONSIGNEE") {
      bchange = false;
      if (this.Record.mbl_imp_id != _Record.id)
        bchange = true;

      this.Record.mbl_imp_id = _Record.id;
      this.Record.mbl_imp_code = _Record.code;
      this.Record.mbl_imp_name = _Record.name;

      if (bchange) {
        this.IMPADDRECORD = new SearchTable();
        this.IMPADDRECORD.controlname = "CONSIGNEEADDRESS";
        this.IMPADDRECORD.displaycolumn = "CODE";
        this.IMPADDRECORD.type = "CUSTOMERADDRESS";
        this.IMPADDRECORD.id = "";
        this.IMPADDRECORD.code = "";
        this.IMPADDRECORD.name = "";
        this.IMPADDRECORD.parentid = this.Record.mbl_imp_id;
        this.Record.mbl_imp_br_addr = "";
      }
    }
    else if (_Record.controlname == "CONSIGNEEADDRESS") {
      this.Record.mbl_imp_br_id = _Record.id;
      this.Record.mbl_imp_br_no = _Record.code;
      this.Record.mbl_imp_br_addr = this.GetBrAddress(_Record.name).address;
    }
    else if (_Record.controlname == "FACTORYLOCATION") {
      this.Record.mbl_factloc_id = _Record.id;
      this.Record.mbl_factloc_code = _Record.code;
      this.Record.mbl_factloc_name = _Record.name;
    } else if (_Record.controlname == "COMMODITY") {
      this.Record.mbl_commodity_id = _Record.id;
      this.Record.mbl_commodity_code = _Record.code;
      this.Record.mbl_commodity_name = _Record.name;
    } else if (_Record.controlname == "POL") {
      this.Record.mbl_pol_id = _Record.id;
      this.Record.mbl_pol_code = _Record.code;
      this.Record.mbl_pol_name = _Record.name;
    } else if (_Record.controlname == "POD") {
      this.Record.mbl_pod_id = _Record.id;
      this.Record.mbl_pod_code = _Record.code;
      this.Record.mbl_pod_name = _Record.name;
    } else if (_Record.controlname == "POFD") {
      this.Record.mbl_pofd_id = _Record.id;
      this.Record.mbl_pofd_code = _Record.code;
      this.Record.mbl_pofd_name = _Record.name;
    } else if (_Record.controlname == "SALESMAN") {
      this.Record.mbl_salesman_id = _Record.id;
      this.Record.mbl_salesman_code = _Record.code;
      this.Record.mbl_salesman_name = _Record.name;
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
      searchby: this.searchby,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      from_date: this.gs.globalData.mbl_fromdate,
      to_date: this.gs.globalData.mbl_todate,
      report_folder: this.gs.globalVariables.report_folder
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.RecordList = response.list;
          this.page_count = response.page_count;
          this.page_current = response.page_current;
          this.page_rowcount = response.page_rowcount;
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  NewRecord() {
    this.foldersent = false;
    this.chk_foldersent = false;
    this.folder_chk = false;
    this.sAgent_ID = "";
    this.sCarrier_ID = "";
    this.pkid = this.gs.getGuid();
    this.Record = new Mblm();
    this.Record.mbl_pkid = this.pkid;
    this.Record.mbl_no = '';
    this.Record.mbl_date = '';
    this.Record.mbl_agent_id = '';
    this.Record.mbl_agent_code = '';
    this.Record.mbl_agent_name = '';
    this.Record.mbl_agent_br_id = '';
    this.Record.mbl_agent_br_no = '';
    this.Record.mbl_agent_br_addr = '';
    this.Record.mbl_carrier_id = '';
    this.Record.mbl_carrier_code = '';
    this.Record.mbl_carrier_name = '';
    this.Record.mbl_freight_status = 'EX-WORK';
    this.Record.mbl_released_date = '';
    this.Record.mbl_coloading = 'NA';
    this.Record.mbl_direct_bl = 'NA';
    this.Record.mbl_grwt = 0;
    this.Record.mbl_chwt = 0;
    this.Record.mbl_chq_req_date = '';
    this.Record.mbl_folder_sent_date = '';
    this.Record.mbl_folder_no = '';
    this.Record.mbl_book_no = '';
    this.Record.mbl_factloc_id = '';
    this.Record.mbl_factloc_code = '';
    this.Record.mbl_factloc_name = '';
    this.Record.mbl_commodity_id = '';
    this.Record.mbl_commodity_code = '';
    this.Record.mbl_commodity_name = '';
    this.Record.mbl_pol_id = '';
    this.Record.mbl_pol_code = '';
    this.Record.mbl_pol_name = '';
    this.Record.mbl_pod_id = '';
    this.Record.mbl_pod_code = '';
    this.Record.mbl_pod_name = '';
    this.Record.mbl_pofd_id = '';
    this.Record.mbl_pofd_code = '';
    this.Record.mbl_pofd_name = '';
    this.Record.mbl_salesman_id = '';
    this.Record.mbl_salesman_code = '';
    this.Record.mbl_salesman_name = '';
    this.Record.mbl_status_id = '';
    this.Record.mbl_nomination = "";
    this.Record.mbl_description = "";

    this.Record.mbl_exp_id = '';
    this.Record.mbl_exp_code = '';
    this.Record.mbl_exp_name = '';
    this.Record.mbl_exp_br_id = '';
    this.Record.mbl_exp_br_no = '';
    this.Record.mbl_exp_br_addr = '';
    this.Record.mbl_imp_id = '';
    this.Record.mbl_imp_code = '';
    this.Record.mbl_imp_name = '';
    this.Record.mbl_imp_br_id = '';
    this.Record.mbl_imp_br_no = '';
    this.Record.mbl_imp_br_addr = '';
    this.Record.lock_record = false;
    this.Record.mbl_released_date = '';
    this.Record.mbl_deliv_date = '';
    this.Record.mbl_pol_eta = '';
    this.Record.mbl_pol_eta_confirm = false;
    this.Record.mbl_deliv_date_confirm = false;
    this.Record.mbl_track_comments = '';
    this.InitLov();
    this.Record.rec_mode = this.mode;
    this.Record.TransitList = new Array<Trackingm>();
    this.NewTransitRecord();
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

  LoadData(_Record: Mblm) {
    this.Record = _Record;
    this.Record.HblList = _Record.HblList;
    this.sAgent_ID = _Record.mbl_agent_id;
    this.sCarrier_ID = _Record.mbl_carrier_id;
    this.foldersent = false;
    this.chk_foldersent = false;
    this.folder_chk = false;
    if (this.Record.mbl_folder_sent_date.length > 0) {
      this.foldersent = true;
      this.chk_foldersent = true;
      this.folder_chk = true;
    }
    this.InitLov();

    this.AGENTRECORD.id = this.Record.mbl_agent_id;
    this.AGENTRECORD.code = this.Record.mbl_agent_code;
    this.AGENTRECORD.name = this.Record.mbl_agent_name;

    this.AGENTADDRECORD.id = this.Record.mbl_agent_br_id;
    this.AGENTADDRECORD.code = this.Record.mbl_agent_br_no;
    this.AGENTADDRECORD.parentid = this.Record.mbl_agent_id;

    this.CARRIERRECORD.id = this.Record.mbl_carrier_id;
    this.CARRIERRECORD.code = this.Record.mbl_carrier_code;
    this.CARRIERRECORD.name = this.Record.mbl_carrier_name;

    this.EXPRECORD.id = this.Record.mbl_exp_id;
    this.EXPRECORD.code = this.Record.mbl_exp_code;
    this.EXPRECORD.name = this.Record.mbl_exp_name;
    this.EXPADDRECORD.id = this.Record.mbl_exp_br_id;
    this.EXPADDRECORD.code = this.Record.mbl_exp_br_no;
    this.EXPADDRECORD.parentid = this.Record.mbl_exp_id;

    this.IMPRECORD.id = this.Record.mbl_imp_id;
    this.IMPRECORD.code = this.Record.mbl_imp_code;
    this.IMPRECORD.name = this.Record.mbl_imp_name;
    this.IMPADDRECORD.id = this.Record.mbl_imp_br_id;
    this.IMPADDRECORD.code = this.Record.mbl_imp_br_no;
    this.IMPADDRECORD.parentid = this.Record.mbl_imp_id;

    this.FACTORYLOCRECORD.id = this.Record.mbl_factloc_id;
    this.FACTORYLOCRECORD.code = this.Record.mbl_factloc_code;
    this.FACTORYLOCRECORD.name = this.Record.mbl_factloc_name;

    this.COMMODITYRECORD.id = this.Record.mbl_commodity_id;
    this.COMMODITYRECORD.code = this.Record.mbl_commodity_code;
    this.COMMODITYRECORD.name = this.Record.mbl_commodity_name;

    this.POLRECORD.id = this.Record.mbl_pol_id;
    this.POLRECORD.code = this.Record.mbl_pol_code;
    this.POLRECORD.name = this.Record.mbl_pol_name;

    this.PODRECORD.id = this.Record.mbl_pod_id;
    this.PODRECORD.code = this.Record.mbl_pod_code;
    this.PODRECORD.name = this.Record.mbl_pod_name;

    this.POFDRECORD.id = this.Record.mbl_pofd_id;
    this.POFDRECORD.code = this.Record.mbl_pofd_code;
    this.POFDRECORD.name = this.Record.mbl_pofd_name;

    this.SALESMANRECORD.id = this.Record.mbl_salesman_id;
    this.SALESMANRECORD.code = this.Record.mbl_salesman_code;
    this.SALESMANRECORD.name = this.Record.mbl_salesman_name;

    this.Record.rec_mode = this.mode;
    if (this.Record.TransitList.length == 0)
      this.NewTransitRecord();
  }

  // Save Data
  Save() {
    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.rec_category = this.type;
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        if (this.mode == 'ADD') {
          this.Record.mbl_bookslno = response.bookslno;
          this.InfoMessage = "New Record " + this.Record.mbl_bookslno + " Generated Successfully";
        } else
          this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.foldersent = response.foldersent;
        this.RefreshList();
        alert(this.InfoMessage);
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
    if (this.gs.isBlank(this.Record.mbl_date)) {
      bret = false;
      sError = " | Mbl Date Cannot Be Blank";
    }

    if (this.gs.isBlank(this.Record.mbl_agent_id)) {
      bret = false;
      sError += "\n\r | Agent Cannot Be Blank";
    }
    if (this.gs.isBlank(this.Record.mbl_carrier_id)) {
      bret = false;
      sError += "\n\r | Carrier Cannot Be Blank";
    }
    if (this.Record.mbl_folder_sent_date.trim().length > 0 && this.Record.mbl_folder_no.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Folder No Cannot Be Blank";
    }
    if (this.Record.mbl_agent_id.trim() != this.sAgent_ID && this.Record.HblList.length > 0) {
      bret = false;
      sError += "\n\r | HBL List not proper, please Click the find button";
    }
    if (this.Record.mbl_carrier_id.trim() != this.sCarrier_ID && this.Record.HblList.length > 0) {
      bret = false;
      sError += "\n\r | HBL List not proper, please Click the find button";
    }

    if (bret === false) {
      this.ErrorMessage = sError;
      alert(this.ErrorMessage);
    }
    return bret;
  }

  RefreshList() {
    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.mbl_pkid == this.Record.mbl_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.mbl_no = this.Record.mbl_no;
      REC.mbl_date = this.gs.ConvertDate2DisplayFormat(this.Record.mbl_date);
      REC.mbl_book_no = this.Record.mbl_book_no;
      REC.mbl_folder_no = this.Record.mbl_folder_no;
      REC.mbl_folder_sent_date = this.gs.ConvertDate2DisplayFormat(this.Record.mbl_folder_sent_date);
      REC.mbl_pol_name = this.Record.mbl_pol_name;
      REC.mbl_pod_name = this.Record.mbl_pod_name;
      REC.mbl_agent_name = this.Record.mbl_agent_name;
      REC.mbl_carrier_name = this.Record.mbl_carrier_name;
      REC.mbl_freight_status = this.Record.mbl_freight_status;
      REC.mbl_grwt = this.Record.mbl_grwt;
      REC.mbl_chwt = this.Record.mbl_chwt;
    }
  }


  OnBlur(field: string) {
    var oldChar2 = / /gi;//replace all blank space in a string
    switch (field) {
      case 'mbl_no':
        {
          this.Record.mbl_no = this.Record.mbl_no.replace(oldChar2, '').toUpperCase();
          break;
        }
      case 'mbl_grwt':
        {
          this.Record.mbl_grwt = this.gs.roundNumber(this.Record.mbl_grwt, 3);
          break;
        }
      case 'mbl_chwt':
        {
          this.Record.mbl_chwt = this.gs.roundNumber(this.Record.mbl_chwt, 3);
          break;
        }
      case 'mbl_folder_no':
        {
          this.Record.mbl_folder_no = this.Record.mbl_folder_no.toUpperCase();
          break;
        }
      case 'mbl_book_no':
        {
          this.Record.mbl_book_no = this.Record.mbl_book_no.toUpperCase();
          break;
        }
      case 'mbl_description':
        {
          this.Record.mbl_description = this.Record.mbl_description.toUpperCase();
          break;
        }
      case 'mbl_flight_no':
        {
          this.Record.mbl_flight_no = this.Record.mbl_flight_no.toUpperCase();
          break;
        }
      case 'searchstring':
        {
          this.searchstring = this.searchstring.toUpperCase();
          break;
        } 
        case 'mbl_track_comments':
        {
          this.Record.mbl_track_comments = this.Record.mbl_track_comments.toUpperCase();
          break;
        }

    }
  }

  Close() {
    this.gs.ClosePage('home');
  }

  GetBrAddress(straddress: string) {
    let AddressSplit = {
      addressbrno: '',
      address: ''
    };
    if (straddress.trim() != "") {
      var temparr = straddress.split(' ');
      AddressSplit.addressbrno = temparr[0];
      AddressSplit.address = straddress.substr(AddressSplit.addressbrno.length).trim();
    }
    return AddressSplit;
  }


  HblList(_Record: Mblm) {

    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.Record.mbl_agent_id.trim().length <= 0) {

      this.ErrorMessage += " | Agent Cannot Be Blank";
    }
    if (this.Record.mbl_carrier_id.trim().length <= 0) {

      this.ErrorMessage += "\n\r | Carrier Cannot Be Blank";
    }

    if (this.ErrorMessage.length > 0)
      return;

    this.sAgent_ID = _Record.mbl_agent_id;
    this.sCarrier_ID = _Record.mbl_carrier_id;

    this.loading = true;
    let SearchData = {
      rowtype: this.type,
      agentid: this.sAgent_ID,
      agent2id: "",
      carrierid: this.sCarrier_ID,
      mblid: _Record.mbl_pkid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.HblList(SearchData)
      .subscribe(response => {
        this.loading = false;
        _Record.HblList = response.list;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  ShowBL() {
    this.currentPage = 'BLPAGE';
  }

  pageChanged() {
    this.currentPage = 'ROOTPAGE';

  }

  PrintCheckList(Id: string, category: string, _type: string) {
    this.folder_id = this.gs.getGuid();
    this.loading = true;
    let SearchData = {
      category: '',
      type: _type,
      pkid: Id,
      report_folder: '',
      folderid: '',
      branch_code: '',
      comp_code: ''
    };
    SearchData.category = category;
    SearchData.type = _type;
    SearchData.pkid = this.pkid;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.folderid = this.folder_id;
    SearchData.comp_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.PrintCheckList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }


  SearchRecord(controlname: string) {
    this.InfoMessage = "";
    this.ErrorMessage = "";
    this.loading = true;
    let SearchData = {
      table: '',
      pkid: '',
      hbl_folder_no: '',
      hbl_folder_sent_date: '',
      hbl_prealert_date: '',
      company_code: '',
      branch_code: '',
      rec_category: '',
      hbl_type: ''
    };

    if (controlname == 'updatemaster') {
      SearchData.table = 'updatemaster';
      SearchData.pkid = this.Record.mbl_pkid;
      SearchData.hbl_folder_no = this.Record.mbl_folder_no;
      SearchData.hbl_folder_sent_date = this.Record.mbl_folder_sent_date;
      SearchData.hbl_prealert_date = "";
      SearchData.company_code = this.gs.globalVariables.comp_code;
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.rec_category = this.type;
      SearchData.hbl_type = 'MBL-AE';
    }

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (controlname == 'updatemaster') {
          if (response.serror.length > 0)
            this.ErrorMessage = response.serror;
          else {
            this.foldersent = response.foldersent;
            this.InfoMessage = 'Save Complete';
          }
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }
  FolderSent() {
    this.folder_chk = !this.folder_chk;
    if (this.folder_chk)
      this.Record.mbl_folder_sent_date = this.gs.defaultValues.today;
    else
      this.Record.mbl_folder_sent_date = "";
  }

  ShowModal(trk: any) {
    this.ErrorMessage = '';
    this.open(trk);
  }
  open(content: any) {
    this.modal = this.modalService.open(content);
  }

  NewTransitRecord() {
    let Rec: Trackingm = new Trackingm;
    Rec.trk_pkid = this.gs.getGuid();
    Rec.trk_parent_id = this.Record.mbl_pkid;
    Rec.rec_category = this.type;
    Rec.trk_vsl_id = '';
    Rec.trk_vsl_code = '';
    Rec.trk_vsl_name = '';
    Rec.trk_voyage = '';
    Rec.trk_pol_id = '';
    Rec.trk_pol_code = '';
    Rec.trk_pol_name = '';
    Rec.trk_pol_etd = '';
    Rec.trk_pol_etd_confirm = false;
    Rec.trk_pod_id = '';
    Rec.trk_pod_code = '';
    Rec.trk_pod_name = '';
    Rec.trk_pod_eta = '';
    Rec.trk_pod_eta_confirm = false;
    this.Record.TransitList.push(Rec);
  }
  ModifiedRecords(params: any) {
    if (params.type == "TRANSIT") {
      if (params.saction == "ADD")
        this.NewTransitRecord();
      if (params.saction == "REMOVE") {
        this.Record.TransitList.splice(this.Record.TransitList.findIndex(rec => rec.trk_pkid == params.sid), 1);
        if (this.Record.TransitList.length == 0)
          this.NewTransitRecord();
      }
    }
  }

  UpdateTracking() {
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.rec_category = this.type;
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.UpdateTracking(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
        alert(this.InfoMessage);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

}
