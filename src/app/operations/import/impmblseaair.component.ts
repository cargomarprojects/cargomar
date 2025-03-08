import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Mblm } from '../models/mbl';
import { ImpMblService } from '../services/impmbl.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Param } from '../../master/models/param';
import { Trackingm } from '../models/tracking';

//EDIT-AJITH-01-12-2021

@Component({
  selector: 'app-impmblseaair',
  templateUrl: './impmblseaair.component.html',
  providers: [ImpMblService]
})
export class ImpMblSeaAirComponent {
  // Local Variables 
  title = 'MASTER';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  selectedRowIndex = 0;

  bPrint = false;
  bAdmin = false;
  bDocs = false;
  modal: any;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  lblmblno = 'MBL#';
  lblmbldate = 'MBL.Date';
  lblvesselno = 'Voyage';
  searchstring = '';
  porttype = 'SEA PORT';
  carriertype = 'SEA CARRIER';
  searchby = "";
  lockChar = "";

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;
  sAgent_ID = "";
  sCarrier_ID = "";

  ErrorMessage = "";
  InfoMessage = "";


  folder_id: string;
  chk_foldersent: boolean = false;
  foldersent: boolean = false;
  folder_chk: boolean = false;

  mode = '';
  pkid = '';

  StatusList: Param[] = [];

  // Array For Displaying List
  RecordList: Mblm[] = [];
  // Single Record for add/edit/view details
  Record: Mblm = new Mblm;

  LINERRECORD: SearchTable = new SearchTable();
  AGENTRECORD: SearchTable = new SearchTable();
  AGENTADDRECORD: SearchTable = new SearchTable();
  CHARECORD: SearchTable = new SearchTable();
  SHIPPERRECORD: SearchTable = new SearchTable();
  FACTORYLOCRECORD: SearchTable = new SearchTable();
  CONSIGNEERECORD: SearchTable = new SearchTable();
  COMMODITYRECORD: SearchTable = new SearchTable();
  POLRECORD: SearchTable = new SearchTable();
  PODRECORD: SearchTable = new SearchTable();
  POFDRECORD: SearchTable = new SearchTable();
  VESSELRECORD: SearchTable = new SearchTable();
  SALESMANRECORD: SearchTable = new SearchTable();
  FORWARDERRECORD: SearchTable = new SearchTable();
  COUNTRYORGRECORD: SearchTable = new SearchTable();
  COLOADERRECORD: SearchTable = new SearchTable();

  constructor(
    private modalService: NgbModal,
    private mainService: ImpMblService,
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
    this.searchby = "ALL";
    this.foldersent = false;
    this.chk_foldersent = false;
    this.folder_chk = false;
    this.bDocs = false;
    this.bPrint = false;
    this.bAdmin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_docs)
        this.bDocs = true;
      this.bPrint = this.menu_record.rights_print
    }

    if (this.type == "SEA IMPORT") {
      this.lblmblno = "MBL#";
      this.lblmbldate = 'MBL.Date';
      this.lblvesselno = "Voyage";
      this.porttype = "SEA PORT";
      this.carriertype = "SEA CARRIER";
    } else {
      this.lblmblno = "MAWB#";
      this.lblmbldate = 'MAWB.Date';
      this.lblvesselno = "Flight No.";
      this.porttype = "AIR PORT";
      this.carriertype = "AIR CARRIER";
    }

    this.InitLov();
    this.LoadCombo();
    this.currentTab = 'LIST';
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

    //this.List("NEW");
  }


  InitLov() {

    this.LINERRECORD = new SearchTable();
    this.LINERRECORD.controlname = "LINER";
    this.LINERRECORD.displaycolumn = "CODE";
    this.LINERRECORD.type = this.carriertype;
    this.LINERRECORD.id = "";
    this.LINERRECORD.code = "";
    this.LINERRECORD.name = "";

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

    this.CHARECORD = new SearchTable();
    this.CHARECORD.controlname = "CHA";
    this.CHARECORD.displaycolumn = "CODE";
    this.CHARECORD.type = "CUSTOMER";
    this.CHARECORD.where = " CUST_IS_CHA = 'Y' ";
    this.CHARECORD.id = "";
    this.CHARECORD.code = "";
    this.CHARECORD.name = "";

    this.SHIPPERRECORD = new SearchTable();
    this.SHIPPERRECORD.controlname = "SHIPPER";
    this.SHIPPERRECORD.displaycolumn = "CODE";
    this.SHIPPERRECORD.type = "CUSTOMER";
    // this.SHIPPERRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
    // this.SHIPPERRECORD.where = " CUST_IS_CONSIGNEE = 'Y' ";
    this.SHIPPERRECORD.id = "";
    this.SHIPPERRECORD.code = "";
    this.SHIPPERRECORD.name = "";

    this.FACTORYLOCRECORD = new SearchTable();
    this.FACTORYLOCRECORD.controlname = "FACTORYLOCATION";
    this.FACTORYLOCRECORD.displaycolumn = "CODE";
    this.FACTORYLOCRECORD.type = "CITY";
    this.FACTORYLOCRECORD.id = "";
    this.FACTORYLOCRECORD.code = "";
    this.FACTORYLOCRECORD.name = "";

    this.CONSIGNEERECORD = new SearchTable();
    this.CONSIGNEERECORD.controlname = "CONSIGNEE";
    this.CONSIGNEERECORD.displaycolumn = "CODE";
    this.CONSIGNEERECORD.type = "CUSTOMER";
    // this.CONSIGNEERECORD.where = " CUST_IS_CONSIGNEE = 'Y' ";
    // this.CONSIGNEERECORD.where = " CUST_IS_SHIPPER = 'Y' ";
    this.CONSIGNEERECORD.id = "";
    this.CONSIGNEERECORD.code = "";
    this.CONSIGNEERECORD.name = "";

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
    this.POLRECORD.type = this.porttype;
    this.POLRECORD.id = "";
    this.POLRECORD.code = "";
    this.POLRECORD.name = "";

    this.PODRECORD = new SearchTable();
    this.PODRECORD.controlname = "POD";
    this.PODRECORD.displaycolumn = "CODE";
    this.PODRECORD.type = this.porttype;
    this.PODRECORD.id = "";
    this.PODRECORD.code = "";
    this.PODRECORD.name = "";

    this.POFDRECORD = new SearchTable();
    this.POFDRECORD.controlname = "POFD";
    this.POFDRECORD.displaycolumn = "CODE";
    this.POFDRECORD.type = this.porttype;
    this.POFDRECORD.id = "";
    this.POFDRECORD.code = "";
    this.POFDRECORD.name = "";

    this.VESSELRECORD = new SearchTable();
    this.VESSELRECORD.controlname = "VSL";
    this.VESSELRECORD.displaycolumn = "CODE";
    this.VESSELRECORD.type = "VESSEL";
    this.VESSELRECORD.id = "";
    this.VESSELRECORD.code = "";
    this.VESSELRECORD.name = "";

    this.SALESMANRECORD = new SearchTable();
    this.SALESMANRECORD.controlname = "SALESMAN";
    this.SALESMANRECORD.displaycolumn = "CODE";
    this.SALESMANRECORD.type = "SALESMAN";
    this.SALESMANRECORD.id = "";
    this.SALESMANRECORD.code = "";
    this.SALESMANRECORD.name = "";

    this.FORWARDERRECORD = new SearchTable();
    this.FORWARDERRECORD.controlname = "FORWARDER";
    this.FORWARDERRECORD.displaycolumn = "CODE";
    this.FORWARDERRECORD.type = "CUSTOMER";
    this.FORWARDERRECORD.where = " CUST_IS_CHA = 'Y' ";
    this.FORWARDERRECORD.id = "";
    this.FORWARDERRECORD.code = "";
    this.FORWARDERRECORD.name = "";

    this.COUNTRYORGRECORD = new SearchTable();
    this.COUNTRYORGRECORD.controlname = "COUNTRYORIGIN";
    this.COUNTRYORGRECORD.displaycolumn = "CODE";
    this.COUNTRYORGRECORD.type = "COUNTRY";
    this.COUNTRYORGRECORD.id = "";
    this.COUNTRYORGRECORD.code = "";
    this.COUNTRYORGRECORD.name = "";

    this.COLOADERRECORD = new SearchTable();
    this.COLOADERRECORD.controlname = "COLOADER";
    this.COLOADERRECORD.displaycolumn = "CODE";
    this.COLOADERRECORD.type = "CUSTOMER";
    this.COLOADERRECORD.id = "";
    this.COLOADERRECORD.code = "";
    this.COLOADERRECORD.name = "";
  }

  LovSelected(_Record: SearchTable) {

    let bchange: boolean = false;

    if (_Record.controlname == "LINER") {
      this.Record.mbl_carrier_id = _Record.id;
      this.Record.mbl_carrier_code = _Record.code;
      this.Record.mbl_carrier_name = _Record.name;
    }

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
    }
    if (_Record.controlname == "AGENTADDRESS") {
      this.Record.mbl_agent_br_id = _Record.id;
      this.Record.mbl_agent_br_no = _Record.code;
      this.Record.mbl_agent_br_addr = this.GetBrAddress(_Record.name).address;
    }
    if (_Record.controlname == "CHA") {
      this.Record.mbl_cha_id = _Record.id;
      this.Record.mbl_cha_code = _Record.code;
      this.Record.mbl_cha_name = _Record.name;
    }

    if (_Record.controlname == "SHIPPER") {
      this.Record.mbl_exp_id = _Record.id;
      this.Record.mbl_exp_code = _Record.code;
      this.Record.mbl_exp_name = _Record.name;
    }

    if (_Record.controlname == "FACTORYLOCATION") {
      this.Record.mbl_factloc_id = _Record.id;
      this.Record.mbl_factloc_code = _Record.code;
      this.Record.mbl_factloc_name = _Record.name;
    }

    if (_Record.controlname == "CONSIGNEE") {
      this.Record.mbl_imp_id = _Record.id;
      this.Record.mbl_imp_code = _Record.code;
      this.Record.mbl_imp_name = _Record.name;
    }

    if (_Record.controlname == "COMMODITY") {
      this.Record.mbl_commodity_id = _Record.id;
      this.Record.mbl_commodity_code = _Record.code;
      this.Record.mbl_commodity_name = _Record.name;
    }

    if (_Record.controlname == "POL") {
      this.Record.mbl_pol_id = _Record.id;
      this.Record.mbl_pol_code = _Record.code;
      this.Record.mbl_pol_name = _Record.name;
    }

    if (_Record.controlname == "POD") {
      this.Record.mbl_pod_id = _Record.id;
      this.Record.mbl_pod_code = _Record.code;
      this.Record.mbl_pod_name = _Record.name;
    }

    if (_Record.controlname == "POFD") {
      this.Record.mbl_pofd_id = _Record.id;
      this.Record.mbl_pofd_code = _Record.code;
      this.Record.mbl_pofd_name = _Record.name;
    }

    if (_Record.controlname == "VSL") {
      this.Record.mbl_vessel_id = _Record.id;
      this.Record.mbl_vessel_code = _Record.code;
      this.Record.mbl_vessel_name = _Record.name;
    }

    if (_Record.controlname == "SALESMAN") {
      this.Record.mbl_salesman_id = _Record.id;
      this.Record.mbl_salesman_code = _Record.code;
      this.Record.mbl_salesman_name = _Record.name;
    }

    if (_Record.controlname == "FORWARDER") {
      this.Record.mbl_forwarder_id = _Record.id;
      this.Record.mbl_forwarder_code = _Record.code;
      this.Record.mbl_forwarder_name = _Record.name;
    }
    if (_Record.controlname == "COUNTRYORIGIN") {
      this.Record.mbl_origin_country_id = _Record.id;
      this.Record.mbl_origin_country_code = _Record.code;
      this.Record.mbl_origin_country_name = _Record.name;
    }
    if (_Record.controlname == "COLOADER") {
      this.Record.mbl_coloader_id = _Record.id;
      this.Record.mbl_coloader_code = _Record.code;
      this.Record.mbl_coloader_name = _Record.name;
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
    this.lockChar = "";
    this.foldersent = false;
    this.chk_foldersent = false;
    this.folder_chk = false;
    this.sAgent_ID = "";
    this.sCarrier_ID = "";
    this.pkid = this.gs.getGuid();
    this.Record = new Mblm();
    this.Record.mbl_pkid = this.pkid;
    this.Record.mbl_bookslno = null;
    this.Record.mbl_date = this.gs.defaultValues.today;
    this.Record.mbl_carrier_id = '';
    this.Record.mbl_carrier_code = '';
    this.Record.mbl_carrier_name = '';
    this.Record.mbl_book_no = '';
    this.Record.mbl_no = '';
    this.Record.mbl_agent_id = '';
    this.Record.mbl_agent_code = '';
    this.Record.mbl_agent_name = '';
    this.Record.mbl_agent_br_id = '';
    this.Record.mbl_agent_br_no = '';
    this.Record.mbl_agent_br_addr = '';
    this.Record.mbl_cha_id = '';
    this.Record.mbl_cha_code = '';
    this.Record.mbl_cha_name = '';
    this.Record.mbl_exp_id = '';
    this.Record.mbl_exp_code = '';
    this.Record.mbl_exp_name = '';
    this.Record.mbl_factloc_id = '';
    this.Record.mbl_factloc_code = '';
    this.Record.mbl_factloc_name = '';
    this.Record.mbl_imp_id = '';
    this.Record.mbl_imp_code = '';
    this.Record.mbl_imp_name = '';
    this.Record.mbl_nomination = 'NA';
    this.Record.mbl_commodity_id = '';
    this.Record.mbl_commodity_code = '';
    this.Record.mbl_commodity_name = '';
    this.Record.mbl_description = '';
    this.Record.mbl_pol_id = '';
    this.Record.mbl_pol_code = '';
    this.Record.mbl_pol_name = '';
    this.Record.mbl_pod_id = '';
    this.Record.mbl_pod_code = '';
    this.Record.mbl_pod_name = '';
    this.Record.mbl_pofd_id = '';
    this.Record.mbl_pofd_code = '';
    this.Record.mbl_pofd_name = '';
    this.Record.mbl_vessel_id = '';
    this.Record.mbl_vessel_code = '';
    this.Record.mbl_vessel_name = '';
    this.Record.mbl_vessel_no = '';
    this.Record.mbl_vessel_eta = '';
    this.Record.mbl_etd = '';
    this.Record.mbl_eta = '';
    this.Record.mbl_pofd_eta = '';
    this.Record.mbl_etd_confirm = false;
    this.Record.mbl_eta_confirm = false;
    this.Record.mbl_pofd_eta_confirm = false;
    this.Record.mbl_salesman_id = '';
    this.Record.mbl_salesman_code = '';
    this.Record.mbl_salesman_name = '';
    this.Record.mbl_status_id = '';
    this.Record.mbl_freight_status = '';
    this.Record.mbl_folder_no = '';
    this.Record.mbl_folder_sent_date = '';
    this.Record.mbl_igmno = '';
    this.Record.mbl_igmdate = '';
    this.Record.mbl_despatchdate = '';
    this.Record.mbl_jobtype = '';
    this.Record.mbl_terms = '';
    this.Record.mbl_forwarder_id = '';
    this.Record.mbl_forwarder_code = '';
    this.Record.mbl_forwarder_name = '';
    this.Record.mbl_grwt = 0;
    this.Record.mbl_chwt = 0;

    this.Record.mbl_origin_country_id = '';
    this.Record.mbl_origin_country_code = '';
    this.Record.mbl_origin_country_name = '';
    this.Record.mbl_cf_date = this.gs.defaultValues.today;
    this.Record.mbl_coloader_id = '';
    this.Record.mbl_coloader_code = '';
    this.Record.mbl_coloader_name = '';
    this.Record.mbl_ship_conf_date = '';
    this.Record.mbl_cargo_handover_date = '';
    this.Record.mbl_track_comments = '';

    this.InitDefault();
    this.InitLov();
    this.Record.lock_record = false;
    this.Record.rec_mode = this.mode;
    this.Record.TransitList = new Array<Trackingm>();
    this.NewTransitRecord();
  }

  InitDefault() {
    if (this.StatusList == null)
      return;
    var REC = this.StatusList.find(rec => rec.param_name == 'PENDING');
    if (REC != null) {
      this.Record.mbl_status_id = REC.param_pkid;
    }
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
    this.lockChar = this.Record.lock_record ? "*" : "";
    this.InitLov();

    this.LINERRECORD.id = this.Record.mbl_carrier_id;
    this.LINERRECORD.code = this.Record.mbl_carrier_code;
    this.LINERRECORD.name = this.Record.mbl_carrier_name;

    this.AGENTRECORD.id = this.Record.mbl_agent_id;
    this.AGENTRECORD.code = this.Record.mbl_agent_code;
    this.AGENTRECORD.name = this.Record.mbl_agent_name;
    this.AGENTADDRECORD.id = this.Record.mbl_agent_br_id;
    this.AGENTADDRECORD.code = this.Record.mbl_agent_br_no;
    this.AGENTADDRECORD.parentid = this.Record.mbl_agent_id;

    this.CHARECORD.id = this.Record.mbl_cha_id;
    this.CHARECORD.code = this.Record.mbl_cha_code;
    this.CHARECORD.name = this.Record.mbl_cha_name;

    this.SHIPPERRECORD.id = this.Record.mbl_exp_id;
    this.SHIPPERRECORD.code = this.Record.mbl_exp_code;
    this.SHIPPERRECORD.name = this.Record.mbl_exp_name;

    this.FACTORYLOCRECORD.id = this.Record.mbl_factloc_id;
    this.FACTORYLOCRECORD.code = this.Record.mbl_factloc_code;
    this.FACTORYLOCRECORD.name = this.Record.mbl_factloc_name;

    this.CONSIGNEERECORD.id = this.Record.mbl_imp_id;
    this.CONSIGNEERECORD.code = this.Record.mbl_imp_code;
    this.CONSIGNEERECORD.name = this.Record.mbl_imp_name;

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

    this.VESSELRECORD.id = this.Record.mbl_vessel_id;
    this.VESSELRECORD.code = this.Record.mbl_vessel_code;
    this.VESSELRECORD.name = this.Record.mbl_vessel_name;

    this.SALESMANRECORD.id = this.Record.mbl_salesman_id;
    this.SALESMANRECORD.code = this.Record.mbl_salesman_code;
    this.SALESMANRECORD.name = this.Record.mbl_salesman_name;

    this.FORWARDERRECORD.id = this.Record.mbl_forwarder_id;
    this.FORWARDERRECORD.code = this.Record.mbl_forwarder_code;
    this.FORWARDERRECORD.name = this.Record.mbl_forwarder_name;

    this.COUNTRYORGRECORD.id = this.Record.mbl_origin_country_id;
    this.COUNTRYORGRECORD.code = this.Record.mbl_origin_country_code;
    this.COUNTRYORGRECORD.name = this.Record.mbl_origin_country_name;

    this.COLOADERRECORD.id = this.Record.mbl_coloader_id;
    this.COLOADERRECORD.code = this.Record.mbl_coloader_code;
    this.COLOADERRECORD.name = this.Record.mbl_coloader_name;

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
    if (this.gs.isBlank(this.Record.mbl_no)) {
      bret = false;
      if (this.type == "SEA IMPORT")
        sError = " | MBL Number Cannot Be Blank";
      else
        sError = " | MAWB Number Cannot Be Blank";
    }
    if (this.gs.isBlank(this.Record.mbl_cf_date)) {
      bret = false;
      sError += "\n\r | Date Cannot Be Blank";
    }
    if (this.gs.isBlank(this.Record.mbl_date)) {
      bret = false;
      if (this.type == "SEA IMPORT")
        sError += "\n\r | MBL Date Cannot Be Blank";
      else
        sError += "\n\r | MAWB Date Cannot Be Blank";
    }

    if (this.gs.isBlank(this.Record.mbl_agent_id)) {
      bret = false;
      sError += "\n\r | Agent Cannot Be Blank";
    }
    if (this.type == "SEA IMPORT" && this.gs.isBlank(this.Record.mbl_vessel_id)) {
      bret = false;
      sError += "\n\r | Vessel Cannot Be Blank";
    }

    if (this.Record.mbl_pol_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | POL Cannot Be Blank";
    }

    if (this.gs.isBlank(this.Record.mbl_carrier_id)) {
      bret = false;
      sError += "\n\r | Carrier Cannot Be Blank";
    }

    if (this.Record.mbl_pod_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | POD Cannot Be Blank";
    }
    if (this.Record.mbl_pofd_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | POFD Cannot Be Blank";
    }

    if (this.Record.mbl_igmno.trim().length > 0 && this.Record.mbl_igmdate.trim().length <= 0) {
      bret = false;
      sError += "\n\r | IGM Date Cannot Be Blank";
    }
    if (this.Record.mbl_igmno.trim().length <= 0 && this.Record.mbl_igmdate.trim().length > 0) {
      bret = false;
      sError += "\n\r | IGM Number Cannot Be Blank";
    }

    if (this.Record.mbl_folder_sent_date.trim().length > 0 && this.Record.mbl_folder_no.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Folder No Cannot Be Blank";
    }

    if (this.Record.mbl_agent_id.trim() != this.sAgent_ID && this.Record.HblList.length > 0) {
      bret = false;
      if (this.type == "SEA IMPORT")
        sError += "\n\r | HBL List not proper, please Click the find button";
      else
        sError += "\n\r | HAWB List not proper, please Click the find button";
    }
    if (this.Record.mbl_carrier_id.trim() != this.sCarrier_ID && this.Record.HblList.length > 0) {
      bret = false;
      if (this.type == "SEA IMPORT")
        sError += "\n\r | HBL List not proper, please Click the find button";
      else
        sError += "\n\r | HAWB List not proper, please Click the find button";
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
      REC.mbl_bookslno = this.Record.mbl_bookslno;
      REC.mbl_cf_date = this.gs.ConvertDate2DisplayFormat(this.Record.mbl_cf_date);
      REC.mbl_date = this.gs.ConvertDate2DisplayFormat(this.Record.mbl_date);
      REC.mbl_carrier_name = this.Record.mbl_carrier_name;
      REC.mbl_pol_name = this.Record.mbl_pol_name;
      REC.mbl_pod_name = this.Record.mbl_pod_name;
      REC.mbl_pofd_name = this.Record.mbl_pofd_name;
      REC.mbl_grwt = this.Record.mbl_grwt;
      REC.mbl_chwt = this.Record.mbl_chwt;
    }
  }


  OnBlur(field: string) {
    if (field == 'mbl_book_no') {
      this.Record.mbl_book_no = this.Record.mbl_book_no.toUpperCase();
    }
    if (field == 'mbl_description') {
      this.Record.mbl_description = this.Record.mbl_description.toUpperCase();
    }
    if (field == 'mbl_vessel_no') {
      this.Record.mbl_vessel_no = this.Record.mbl_vessel_no.toUpperCase();
    }
    if (field == 'mbl_no') {
      this.Record.mbl_no = this.Record.mbl_no.toUpperCase();
    }
    if (field == 'mbl_folder_no') {
      this.Record.mbl_folder_no = this.Record.mbl_folder_no.toUpperCase();
    }
    if (field == 'mbl_igmno') {
      this.Record.mbl_igmno = this.Record.mbl_igmno.toUpperCase();
    }
    if (field == 'mbl_grwt') {
      this.Record.mbl_grwt = this.gs.roundWeight(this.Record.mbl_grwt, "GRWT");
    }
    if (field == 'mbl_chwt') {
      this.Record.mbl_chwt = this.gs.roundWeight(this.Record.mbl_chwt, "CHWT");
    }
    if (field == 'mbl_track_comments') {
      this.Record.mbl_track_comments = this.Record.mbl_track_comments.toUpperCase();
    }
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

    if (this.ErrorMessage.length > 0) {
      alert(this.ErrorMessage);
      return;
    }

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
      mbl_igmno: '',
      mbl_igmdate: '',
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
      SearchData.mbl_igmno = this.Record.mbl_igmno;
      SearchData.mbl_igmdate = this.Record.mbl_igmdate;
      SearchData.company_code = this.gs.globalVariables.comp_code,
        SearchData.branch_code = this.gs.globalVariables.branch_code,
        SearchData.rec_category = this.type;
      if (this.type == 'SEA IMPORT')
        SearchData.hbl_type = 'MBL-SI';
      else
        SearchData.hbl_type = 'MBL-AI';
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

  GenerateFolderNo(_id: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';

    if (!confirm("Do you want to Generate Folder No")) {
      return;
    }

    this.loading = true;
    let SearchData = {
      type: "MBL-SE",
      pkid: _id,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      category: "SEA IMPORT",
      user_code: this.gs.globalVariables.user_code,
      mbl_slno: this.Record.mbl_bookslno
    };

    this.mainService.GenerateFolderNumber(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.serror.length > 0) {
          this.ErrorMessage = response.serror;
          alert(this.ErrorMessage);
        } else
          this.Record.mbl_folder_no = response.newno;
        if (response.dupfolder.length > 0)
          alert(response.dupfolder);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
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
  ShowModal(trk: any) {
    this.ErrorMessage = '';
    this.open(trk);
  }
  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
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
