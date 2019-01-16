import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { LinerBkm } from '../models/linerbkm';
import { LinerBkmService } from '../services/linerbkm.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Param } from '../../master/models/param';
import { BkmCntrtype } from '../models/bkmcntrtype';
import { BkmPayment } from '../models/bkmpayment';

@Component({
  selector: 'app-mblsea',
  templateUrl: './mblsea.component.html',
  providers: [LinerBkmService]
})
export class MblSeaComponent {
  // Local Variables 
  title = 'BOOKING MASTER';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  bChanged: boolean;

  bAdmin = false;
  bDocs = false;

  folder_id: string;
  chk_foldersent: boolean = false;
  foldersent: boolean = false;
  folder_chk: boolean = false;

  searchstring = '';

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;

  ErrorMessage = "";
  InfoMessage = "";

  sDefaultCntrType_ID = "";
  sAgent_ID = "";
  sAgent_ID2 = "";
  sCarrier_ID = "";

  mode = '';
  pkid = '';

  StatusList: Param[] = [];
  ContainerList: Param[] = [];
  // Array For Displaying List
  RecordList: LinerBkm[] = [];
  // Single Record for add/edit/view details
  Record: LinerBkm = new LinerBkm;
  RecPayment: BkmPayment = new BkmPayment;


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
  COLOADERRECORD: SearchTable = new SearchTable();
  AGENT2RECORD: SearchTable = new SearchTable();
  PORRECORD: SearchTable = new SearchTable();
  POFDCRECORD: SearchTable = new SearchTable();

  constructor(
    private mainService: LinerBkmService,
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
    this.foldersent = false;
    this.chk_foldersent = false;
    this.folder_chk = false;
    this.bAdmin = false;
    this.bDocs = false;

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {

      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_docs)
        this.bDocs = true;
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
        this.ContainerList = response.containerlist;
        if (this.ContainerList != null) {
          var REC = this.ContainerList.find(rec => rec.param_id3 == '20 Dry Bulk (22B0)');
          if (REC != null) {
            this.sDefaultCntrType_ID = REC.param_pkid;
          }
        }
        this.List("NEW");
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });

    //this.List("NEW");
  }


  InitLov() {

    this.LINERRECORD = new SearchTable();
    this.LINERRECORD.controlname = "LINER";
    this.LINERRECORD.displaycolumn = "CODE";
    this.LINERRECORD.type = "SEA CARRIER";
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
    //   this.SHIPPERRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
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
    //  this.CONSIGNEERECORD.where = " CUST_IS_CONSIGNEE = 'Y' ";
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
    this.POLRECORD.type = "SEA PORT";
    this.POLRECORD.id = "";
    this.POLRECORD.code = "";
    this.POLRECORD.name = "";

    this.PODRECORD = new SearchTable();
    this.PODRECORD.controlname = "POD";
    this.PODRECORD.displaycolumn = "CODE";
    this.PODRECORD.type = "SEA PORT";
    this.PODRECORD.id = "";
    this.PODRECORD.code = "";
    this.PODRECORD.name = "";

    this.POFDRECORD = new SearchTable();
    this.POFDRECORD.controlname = "POFD";
    this.POFDRECORD.displaycolumn = "CODE";
    this.POFDRECORD.type = "SEA PORT";
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

    this.COLOADERRECORD = new SearchTable();
    this.COLOADERRECORD.controlname = "COLOADER";
    this.COLOADERRECORD.displaycolumn = "CODE";
    this.COLOADERRECORD.type = "CUSTOMER";
    this.COLOADERRECORD.id = "";
    this.COLOADERRECORD.code = "";
    this.COLOADERRECORD.name = "";

    this.AGENT2RECORD = new SearchTable();
    this.AGENT2RECORD.controlname = "AGENT2";
    this.AGENT2RECORD.displaycolumn = "CODE";
    this.AGENT2RECORD.type = "CUSTOMER";
    this.AGENT2RECORD.where = " CUST_IS_AGENT = 'Y' ";
    this.AGENT2RECORD.id = "";
    this.AGENT2RECORD.code = "";
    this.AGENT2RECORD.name = "";

    this.PORRECORD = new SearchTable();
    this.PORRECORD.controlname = "POR";
    this.PORRECORD.displaycolumn = "CODE";
    this.PORRECORD.type = "SEA PORT";
    this.PORRECORD.id = "";
    this.PORRECORD.code = "";
    this.PORRECORD.name = "";

    this.POFDCRECORD = new SearchTable();
    this.POFDCRECORD.controlname = "POFDC";
    this.POFDCRECORD.displaycolumn = "CODE";
    this.POFDCRECORD.type = "SEA PORT";
    this.POFDCRECORD.id = "";
    this.POFDCRECORD.code = "";
    this.POFDCRECORD.name = "";
  }

  LovSelected(_Record: SearchTable) {

    let bchange: boolean = false;

    if (_Record.controlname == "LINER") {
      this.Record.book_liner_id = _Record.id;
      this.Record.book_liner_code = _Record.code;
      this.Record.book_liner_name = _Record.name;
    }

    if (_Record.controlname == "AGENT") {
      bchange = false;
      if (this.Record.book_agent_id != _Record.id)
        bchange = true;

      this.Record.book_agent_id = _Record.id;
      this.Record.book_agent_code = _Record.code;
      this.Record.book_agent_name = _Record.name;

      if (bchange) {
        this.AGENTADDRECORD = new SearchTable();
        this.AGENTADDRECORD.controlname = "AGENTADDRESS";
        this.AGENTADDRECORD.displaycolumn = "CODE";
        this.AGENTADDRECORD.type = "CUSTOMERADDRESS";
        this.AGENTADDRECORD.id = "";
        this.AGENTADDRECORD.code = "";
        this.AGENTADDRECORD.name = "";
        this.AGENTADDRECORD.parentid = this.Record.book_agent_id;
        this.Record.book_agent_br_addr = "";
      }

    }
    if (_Record.controlname == "AGENTADDRESS") {
      this.Record.book_agent_br_id = _Record.id;
      this.Record.book_agent_br_no = _Record.code;
      this.Record.book_agent_br_addr = this.GetBrAddress(_Record.name).address;
    }
    if (_Record.controlname == "CHA") {
      this.Record.book_cha_id = _Record.id;
      this.Record.book_cha_code = _Record.code;
      this.Record.book_cha_name = _Record.name;
    }

    if (_Record.controlname == "SHIPPER") {
      this.Record.book_exporter_id = _Record.id;
      this.Record.book_exporter_code = _Record.code;
      this.Record.book_exporter_name = _Record.name;
    }

    if (_Record.controlname == "FACTORYLOCATION") {
      this.Record.book_factloc_id = _Record.id;
      this.Record.book_factloc_code = _Record.code;
      this.Record.book_factloc_name = _Record.name;
    }

    if (_Record.controlname == "CONSIGNEE") {
      this.Record.book_consignee_id = _Record.id;
      this.Record.book_consignee_code = _Record.code;
      this.Record.book_consignee_name = _Record.name;
    }

    if (_Record.controlname == "COMMODITY") {
      this.Record.book_commodity_id = _Record.id;
      this.Record.book_commodity_code = _Record.code;
      this.Record.book_commodity_name = _Record.name;
    }

    if (_Record.controlname == "POL") {
      this.Record.book_pol_id = _Record.id;
      this.Record.book_pol_code = _Record.code;
      this.Record.book_pol_name = _Record.name;
    }

    if (_Record.controlname == "POD") {
      this.Record.book_pod_id = _Record.id;
      this.Record.book_pod_code = _Record.code;
      this.Record.book_pod_name = _Record.name;
    }

    if (_Record.controlname == "POFD") {
      this.Record.book_pofd_id = _Record.id;
      this.Record.book_pofd_code = _Record.code;
      this.Record.book_pofd_name = _Record.name;
    }

    if (_Record.controlname == "VSL") {
      this.Record.book_vessel_id = _Record.id;
      this.Record.book_vessel_code = _Record.code;
      this.Record.book_vessel_name = _Record.name;
    }

    if (_Record.controlname == "SALESMAN") {
      this.Record.book_salesman_id = _Record.id;
      this.Record.book_salesman_code = _Record.code;
      this.Record.book_salesman_name = _Record.name;
    }
    if (_Record.controlname == "COLOADER") {
      this.Record.book_coloader_id = _Record.id;
      this.Record.book_coloader_code = _Record.code;
      this.Record.book_coloader_name = _Record.name;
    }

    if (_Record.controlname == "AGENT2") {

      this.Record.book_agent2_id = _Record.id;
      this.Record.book_agent2_code = _Record.code;
      this.Record.book_agent2_name = _Record.name;
    }

    if (_Record.controlname == "POR") {
      this.Record.book_por_id = _Record.id;
      this.Record.book_por_code = _Record.code;
      this.Record.book_por_name = _Record.name;
    }
    if (_Record.controlname == "POFDC") {
      this.Record.book_pofdc_id = _Record.id;
      this.Record.book_pofdc_code = _Record.code;
      this.Record.book_pofdc_name = _Record.name;
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
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      from_date: this.gs.globalData.mbl_fromdate,
      to_date: this.gs.globalData.mbl_todate
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
        });
  }

  NewRecord() {
    this.foldersent = false;
    this.chk_foldersent = false;
    this.folder_chk = false;
    this.sAgent_ID = "";
    this.sAgent_ID2 = "";
    this.sCarrier_ID = "";
    this.pkid = this.gs.getGuid();
    this.Record = new LinerBkm();
    this.Record.book_pkid = this.pkid;
    this.Record.book_slno = null;
    this.Record.book_booked_on = this.gs.defaultValues.today;
    this.Record.book_no = "";
    this.Record.book_nomination = "NA";
    this.Record.book_description = "";
    this.Record.book_total_container = 0;
    this.Record.book_cutoff_on = '';
    this.Record.book_vsl_eta = '';
    this.Record.book_etd = '';
    this.Record.book_eta = '';
    this.Record.book_pofd_eta = '';
    this.Record.book_vessel_no = '';
    this.Record.book_etd_confirm = false;
    this.Record.book_eta_confirm = false;
    this.Record.book_pofd_eta_confirm = false;
    this.Record.book_terminal = '';
    this.Record.book_by = '';
    this.Record.book_stuffedat = '';
    this.Record.book_liner_id = '';
    this.Record.book_liner_code = '';
    this.Record.book_liner_name = '';
    this.Record.book_agent_id = '';
    this.Record.book_agent_code = '';
    this.Record.book_agent_name = '';
    this.Record.book_agent_br_id = '';
    this.Record.book_agent_br_no = '';
    this.Record.book_agent_br_addr = '';
    this.Record.book_cha_id = '';
    this.Record.book_cha_code = '';
    this.Record.book_cha_name = '';
    this.Record.book_exporter_id = '';
    this.Record.book_exporter_code = '';
    this.Record.book_exporter_name = '';
    this.Record.book_factloc_id = '';
    this.Record.book_factloc_code = '';
    this.Record.book_factloc_name = '';
    this.Record.book_consignee_id = '';
    this.Record.book_consignee_code = '';
    this.Record.book_consignee_name = '';
    this.Record.book_commodity_id = '';
    this.Record.book_commodity_code = '';
    this.Record.book_commodity_name = '';
    this.Record.book_pol_id = '';
    this.Record.book_pol_code = '';
    this.Record.book_pol_name = '';
    this.Record.book_pod_id = '';
    this.Record.book_pod_code = '';
    this.Record.book_pod_name = '';
    this.Record.book_pofd_id = '';
    this.Record.book_pofd_code = '';
    this.Record.book_pofd_name = '';
    this.Record.book_vessel_id = '';
    this.Record.book_vessel_code = '';
    this.Record.book_vessel_name = '';
    this.Record.book_salesman_id = '';
    this.Record.book_salesman_code = '';
    this.Record.book_salesman_name = '';

    this.Record.book_coloader_id = '';
    this.Record.book_coloader_code = '';
    this.Record.book_coloader_name = '';
    this.Record.book_cntr = '';
    this.Record.book_status_id = '';
    this.Record.book_nature = '';
    this.Record.book_terms = '';
    this.Record.book_shipment_type = '';
    this.Record.book_mblno = '';
    this.Record.book_folder_no = '';
    this.Record.book_folder_sent_date = '';
    this.Record.book_prealert_date = '';

    this.Record.book_m20 = 0;
    this.Record.book_m40 = 0;
    this.Record.book_mteu = 0;
    this.Record.book_mcbm = 0;
    this.Record.book_mdesc = '';
    this.Record.lock_record = false;
    this.Record.book_edit_code = '{S}';
    this.Record.book_released_date = '';

    this.Record.book_agent2_id = '';
    this.Record.book_agent2_name = '';
    this.Record.book_agent2_code = '';

    this.Record.book_por_id = '';
    this.Record.book_por_code = '';
    this.Record.book_por_name = '';
    this.Record.book_por_etd = '';

    this.Record.book_pofdc_id = '';
    this.Record.book_pofdc_code = '';
    this.Record.book_pofdc_name = '';
    this.Record.book_pofdc_eta = '';

    this.Record.book_move = '';
    this.Record.BkmCntrList = new Array<BkmCntrtype>();
    this.Record.BkmPayList = new Array<BkmPayment>();
    this.InitDefault();

    this.InitLov();
    this.Record.rec_mode = this.mode;

  }

  InitDefault() {
    if (this.StatusList != null) {
      var REC = this.StatusList.find(rec => rec.param_name == 'PENDING');
      if (REC != null) {
        this.Record.book_status_id = REC.param_pkid;
      }
    }
    //  
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
        });
  }

  LoadData(_Record: LinerBkm) {
    this.Record = _Record;
    this.Record.HblList = _Record.HblList;
    this.sAgent_ID = _Record.book_agent_id;
    this.sAgent_ID2 = _Record.book_agent2_id;
    this.sCarrier_ID = _Record.book_liner_id;
    this.foldersent = false;
    this.chk_foldersent = false;
    this.folder_chk = false;
    if (this.Record.book_folder_sent_date.length > 0) {
      this.foldersent = true;
      this.chk_foldersent = true;
      this.folder_chk = true;
    }
    this.InitLov();

    this.LINERRECORD.id = this.Record.book_liner_id;
    this.LINERRECORD.code = this.Record.book_liner_code;
    this.LINERRECORD.name = this.Record.book_liner_name;

    this.AGENTRECORD.id = this.Record.book_agent_id;
    this.AGENTRECORD.code = this.Record.book_agent_code;
    this.AGENTRECORD.name = this.Record.book_agent_name;
    this.AGENTADDRECORD.id = this.Record.book_agent_br_id;
    this.AGENTADDRECORD.code = this.Record.book_agent_br_no;
    this.AGENTADDRECORD.parentid = this.Record.book_agent_id;


    this.CHARECORD.id = this.Record.book_cha_id;
    this.CHARECORD.code = this.Record.book_cha_code;
    this.CHARECORD.name = this.Record.book_cha_name;

    this.SHIPPERRECORD.id = this.Record.book_exporter_id;
    this.SHIPPERRECORD.code = this.Record.book_exporter_code;
    this.SHIPPERRECORD.name = this.Record.book_exporter_name;

    this.FACTORYLOCRECORD.id = this.Record.book_factloc_id;
    this.FACTORYLOCRECORD.code = this.Record.book_factloc_code;
    this.FACTORYLOCRECORD.name = this.Record.book_factloc_name;

    this.CONSIGNEERECORD.id = this.Record.book_consignee_id;
    this.CONSIGNEERECORD.code = this.Record.book_consignee_code;
    this.CONSIGNEERECORD.name = this.Record.book_consignee_name;

    this.COMMODITYRECORD.id = this.Record.book_commodity_id;
    this.COMMODITYRECORD.code = this.Record.book_commodity_code;
    this.COMMODITYRECORD.name = this.Record.book_commodity_name;

    this.POLRECORD.id = this.Record.book_pol_id;
    this.POLRECORD.code = this.Record.book_pol_code;
    this.POLRECORD.name = this.Record.book_pol_name;

    this.PODRECORD.id = this.Record.book_pod_id;
    this.PODRECORD.code = this.Record.book_pod_code;
    this.PODRECORD.name = this.Record.book_pod_name;

    this.POFDRECORD.id = this.Record.book_pofd_id;
    this.POFDRECORD.code = this.Record.book_pofd_code;
    this.POFDRECORD.name = this.Record.book_pofd_name;

    this.VESSELRECORD.id = this.Record.book_vessel_id;
    this.VESSELRECORD.code = this.Record.book_vessel_code;
    this.VESSELRECORD.name = this.Record.book_vessel_name;

    this.SALESMANRECORD.id = this.Record.book_salesman_id;
    this.SALESMANRECORD.code = this.Record.book_salesman_code;
    this.SALESMANRECORD.name = this.Record.book_salesman_name;

    this.COLOADERRECORD.id = this.Record.book_coloader_id;
    this.COLOADERRECORD.code = this.Record.book_coloader_code;
    this.COLOADERRECORD.name = this.Record.book_coloader_name;

    this.AGENT2RECORD.id = this.Record.book_agent2_id
    this.AGENT2RECORD.code = this.Record.book_agent2_code;
    this.AGENT2RECORD.name = this.Record.book_agent2_name;

    this.PORRECORD.id = this.Record.book_por_id;
    this.PORRECORD.code = this.Record.book_por_code;
    this.PORRECORD.name = this.Record.book_por_name;

    this.POFDCRECORD.id = this.Record.book_pofdc_id;
    this.POFDCRECORD.code = this.Record.book_pofdc_code;
    this.POFDCRECORD.name = this.Record.book_pofdc_name;

    this.Record.rec_mode = this.mode;
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
          this.Record.book_slno = response.bookslno;
          this.InfoMessage = "New Record " + this.Record.book_slno + " Generated Successfully";
        } else
          this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.foldersent = response.foldersent;
        this.Record.rec_mode = this.mode;
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
    if (this.Record.book_booked_on.trim().length <= 0) {
      bret = false;
      sError = " | Mbl Date Cannot Be Blank";
    }
    if (this.Record.book_liner_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Carrier Cannot Be Blank";
    }
    if (this.Record.book_agent_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Agent Cannot Be Blank";
    }
    if (this.Record.book_vessel_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Vessel Cannot Be Blank";
    }
    if (this.Record.book_pol_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | POL Cannot Be Blank";
    }
    if (this.Record.book_etd.trim().length <= 0) {
      bret = false;
      sError += "\n\r | ETD Cannot Be Blank";
    }
    if (this.Record.book_pod_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | POD Cannot Be Blank";
    }
    if (this.Record.book_eta.trim().length <= 0) {
      bret = false;
      sError += "\n\r | ETA Cannot Be Blank";
    }
    if (this.Record.book_pofd_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | POFD Cannot Be Blank";
    }
    if (this.Record.book_pofd_eta.trim().length <= 0) {
      bret = false;
      sError += "\n\r | POFD ETA Cannot Be Blank";
    }

    /*
    if (this.Record.book_agent_id == 'E5A80C01-0528-4759-A0E3-CBE5DDDD5621')//RITRA AGENT
    {
      if (this.Record.book_eta.trim().length <= 0) {
        bret = false;
        sError += "\n\r | ETA Cannot Be Blank";
      }

      if (this.Record.book_pofd_id.trim().length <= 0) {
        bret = false;
        sError += "\n\r | POFD Cannot Be Blank";
      }

      if (this.Record.book_pofd_eta.trim().length <= 0) {
        bret = false;
        sError += "\n\r | POFD ETA Cannot Be Blank";
      }
    }
    */

    if (this.Record.book_nature.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Nature Cannot Be Blank";
    }
    if (this.Record.book_terms.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Terms Cannot Be Blank";
    }
    if (this.Record.book_shipment_type.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Shipment Type Cannot Be Blank";
    }


    //if (this.Record.book_pod_id.trim().length > 0 && this.Record.book_eta.trim().length <= 0) {
    //  bret = false;
    //  sError += "\n\r | ETA Cannot Be Blank"; 
    //}

    //if (this.Record.book_pofd_id.trim().length > 0 && this.Record.book_pofd_eta.trim().length <= 0) {
    //  bret = false;
    //  sError += "\n\r | POFD ETA Cannot Be Blank";
    //}

    //if (this.Record.book_stuffedat.trim().length <= 0) {
    //  bret = false;
    //  sError += "\n\r | Stuffed At Cannot Be Blank";
    //}
    //if (this.Record.job_type != "CLEARING" && this.Record.job_agent_id.trim().length <= 0) {
    //  bret = false;
    //  sError += "\n\r | Agent Cannot Be Blank";
    //}
    //if (this.Record.job_type != "CLEARING" && this.Record.job_cha_id.trim().length <= 0) {
    //  bret = false;
    //  sError += "\n\r | CHA Cannot Be Blank";
    //}

    if (this.Record.book_folder_sent_date.trim().length > 0 && this.Record.book_folder_no.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Folder No Cannot Be Blank";
    }

    if (this.Record.book_agent_id.trim() != this.sAgent_ID && this.Record.HblList.length > 0) {
      bret = false;
      sError += "\n\r | House List not proper, please Click the find button";
    }


    if (this.Record.book_agent2_id.trim() != this.sAgent_ID2 && this.Record.HblList.length > 0) {
      bret = false;
      sError += "\n\r | House List not proper, please Click the find button";
    }


    if (this.Record.book_liner_id.trim() != this.sCarrier_ID && this.Record.HblList.length > 0) {
      bret = false;
      sError += "\n\r | House List not proper, please Click the find button";
    }

    if (this.Record.book_shipment_type.trim() == "LCL") {

      if (this.Record.book_mcbm <= 0) {
        bret = false;
        sError += "\n\r | Cbm Cannot Be Blank or Zero";
      }
    } else {
      if (this.Record.book_mteu <= 0) {
        bret = false;
        sError += "\n\r | TEU Cannot Be Blank  or Zero";
      }
    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {
    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.book_pkid == this.Record.book_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.book_slno = this.Record.book_slno;
      REC.book_booked_on = this.Record.book_booked_on;
      REC.book_no = this.Record.book_no;
      REC.book_liner_name = this.Record.book_liner_name;
      REC.book_pol_name = this.Record.book_pol_name;
      REC.book_pod_name = this.Record.book_pod_name;
      REC.book_pofd_name = this.Record.book_pofd_name;
      //REC.job_exp_name = this.Record.job_exp_name;
      //REC.job_imp_name = this.Record.job_imp_name;
      //REC.job_pol_name = this.Record.job_pol_name;
      //REC.job_pod_name = this.Record.job_pod_name;
      //REC.job_agent_name = this.Record.job_agent_name;
      //REC.job_commodity_name = this.Record.job_commodity_name;
      //REC.job_type = this.Record.job_type;
      //REC.job_nomination = this.Record.job_nomination;
      //REC.job_terms = this.Record.job_terms;
      //REC.job_status = this.Record.job_status;
    }
  }


  OnBlur(field: string) {
    var oldChar2 = / /gi;//replace all blank space in a string
    if (field == 'book_exporter_name') {
      this.Record.book_exporter_name = this.Record.book_exporter_name.toUpperCase();
    }
    if (field == 'book_consignee_name') {
      this.Record.book_consignee_name = this.Record.book_consignee_name.toUpperCase();
    }
    if (field == 'book_description') {
      this.Record.book_description = this.Record.book_description.toUpperCase();
    }
    if (field == 'book_terminal') {
      this.Record.book_terminal = this.Record.book_terminal.toUpperCase();
    }
    if (field == 'book_by') {
      this.Record.book_by = this.Record.book_by.toUpperCase();
    }
    if (field == 'book_stuffedat') {
      this.Record.book_stuffedat = this.Record.book_stuffedat.toUpperCase();
    }
    if (field == 'book_vessel_no') {
      this.Record.book_vessel_no = this.Record.book_vessel_no.toUpperCase();
    }
    if (field == 'book_no') {
      this.Record.book_no = this.Record.book_no.toUpperCase();
    }
    if (field == 'book_mblno') {
      this.Record.book_mblno = this.Record.book_mblno.replace(oldChar2, '').toUpperCase();
    }
    if (field == 'book_folder_no') {
      this.Record.book_folder_no = this.Record.book_folder_no.replace(oldChar2, '').toUpperCase();
    }
    if (field == 'book_mdesc') {
      this.Record.book_mdesc = this.Record.book_mdesc.replace(oldChar2, '').toUpperCase();
    }
    if (field == 'book_mcbm') {
      this.Record.book_mcbm = this.gs.roundWeight(this.Record.book_mcbm, "CBM");
    }
  }

  OnChange(field: string) {
    let TotTeu: number = 0;

    if (field == 'book_m20' || field == 'book_m40') {
      TotTeu = this.Record.book_m20 + (this.Record.book_m40 * 2);
      this.Record.book_mteu = TotTeu;
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
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  HblList(_Record: LinerBkm) {

    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.Record.book_agent_id.trim().length <= 0) {

      this.ErrorMessage += " | Agent Cannot Be Blank";
    }
    if (this.Record.book_liner_id.trim().length <= 0) {

      this.ErrorMessage += "\n\r | Liner Cannot Be Blank";
    }

    if (this.ErrorMessage.length > 0)
      return;

    this.sAgent_ID = _Record.book_agent_id;
    this.sAgent_ID2 = _Record.book_agent2_id;
    this.sCarrier_ID = _Record.book_liner_id;

    this.loading = true;
    let SearchData = {
      rowtype: this.type,
      agentid: this.sAgent_ID,
      agent2id: this.sAgent_ID2,
      carrierid: this.sCarrier_ID,
      mblid: _Record.book_pkid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
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
        });
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
      hbl_prealert_date: ''
    };

    if (controlname == 'updatemaster') {
      SearchData.table = 'updatemaster';
      SearchData.pkid = this.Record.book_pkid;
      SearchData.hbl_folder_no = this.Record.book_folder_no;
      SearchData.hbl_folder_sent_date = this.Record.book_folder_sent_date;
      SearchData.hbl_prealert_date = this.Record.book_prealert_date;
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
        });
  }

  FolderSent() {
    this.folder_chk = !this.folder_chk;
    if (this.folder_chk)
      this.Record.book_folder_sent_date = this.gs.defaultValues.today;
    else
      this.Record.book_folder_sent_date = "";
  }

  NewCntrRecord() {
    let Rec: BkmCntrtype = new BkmCntrtype;
    Rec.bcntr_pkid = this.gs.getGuid();
    Rec.bcntr_parent_id = this.Record.book_pkid;
    Rec.bcntr_qty = 0;
    Rec.bcntr_remarks = '';
    Rec.bcntr_type_id = this.sDefaultCntrType_ID;
    Rec.bcntr_shpr_own = false;
    this.Record.BkmCntrList.push(Rec);
  }
  RemoveCntrRecord(_rec: BkmCntrtype) {
    this.Record.BkmCntrList.splice(this.Record.BkmCntrList.findIndex(rec => rec.bcntr_pkid == _rec.bcntr_pkid), 1);
  }

  OnFocusTableCell(field: string, _rec: BkmCntrtype) {
    if (field == "bcntr_qty" || field == "bcntr_type")
      this.bChanged = false;
  }

  OnChangeTableCell(field: string, _rec: BkmCntrtype) {
    if (field == "bcntr_qty" || field == "bcntr_type")
      this.bChanged = true;
  }

  OnBlurTableCell(field: string, _rec: BkmCntrtype) {

    if (field == "bcntr_type") {
      if (this.bChanged) {
        this.FindCntrTotal();
      }
    }
    if (field == "bcntr_remarks")
      _rec.bcntr_remarks = _rec.bcntr_remarks.toUpperCase();

    if (field == "bcntr_qty") {
      if (this.bChanged) {
        this.FindCntrTotal();
      }
    }

  }
  FindCntrTotal() {
    let TotTeu: number = 0;
    let n20: number = 0;
    let n40: number = 0;
    var temparr = null;
    for (let rec of this.Record.BkmCntrList) {
      if (rec.bcntr_type_id != "") {
        if (this.ContainerList != null) {
          var REC = this.ContainerList.find(_rec => _rec.param_pkid == rec.bcntr_type_id);
          if (REC != null) {
            if (+REC.param_id1 == 20)
              n20 += rec.bcntr_qty;
            if (+REC.param_id1 == 40)
              n40 += rec.bcntr_qty;
          }
        }
      }
    }

    this.Record.book_m20 = n20;
    this.Record.book_m40 = n40;
    TotTeu = this.Record.book_m20 + (this.Record.book_m40 * 2);
    this.Record.book_mteu = TotTeu;
  }
  
  NewPayRecord() {
    let Rec: BkmPayment = new BkmPayment;
    Rec.bpay_pkid = this.gs.getGuid();
    Rec.bpay_parent_id = this.Record.book_pkid;
    Rec.bpay_type = '';
    Rec.bpay_term = '';
    Rec.bpay_payer = '' ;
    Rec.bpay_loc_id = '' ;
    this.Record.BkmPayList.push(Rec);
  }

}
