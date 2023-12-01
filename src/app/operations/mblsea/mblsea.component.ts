import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { LinerBkm } from '../models/linerbkm';
import { LinerBkmService } from '../services/linerbkm.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Param } from '../../master/models/param';
import { BkmCntrtype } from '../models/bkmcntrtype';
import { BkmPayment } from '../models/bkmpayment';
import { BkmCargo } from '../models/bkmcargo';
import { FileDetails } from '../models/filedetails';
import { PreAlertReportService } from '../services/prealertreport.service';
import { Trackingm } from '../models/tracking';
import { HblBkmParty } from '../models/hblbkmparty';
import { transition } from '@angular/core/src/animation/dsl';
import { Hblm } from '../models/hbl';
import { isNull } from 'util';
//EDIT-AJITH-01-12-2021
//EDIT-AJITH-20-12-2021
//EDIT-AJITH-05-01-2022

//TEST-JOY

@Component({
  selector: 'app-mblsea',
  templateUrl: './mblsea.component.html',
  providers: [LinerBkmService, PreAlertReportService]
})
export class MblSeaComponent {
  // Local Variables
  title = 'BOOKING MASTER';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  selectedRowIndex = 0;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  currentPage = 'ROOTPAGE';

  bChanged: boolean;

  bAdmin = false;
  bDocs = false;
  bPrint = false;
  default_ftptype: string = 'BL-FTP';
  default_mailftp_rootpage: string = 'MAILPAGE';

  mMsg: string = '';
  sSubject: string = '';
  folder_id: string;
  chk_foldersent: boolean = false;
  foldersent: boolean = false;
  folder_chk: boolean = false;
  modal: any;
  searchby = '';
  searchstring = '';
  trk_vsl_1_eta: string = '';
  trk_vsl_1_eta_confirm: boolean = false;

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;

  ErrorMessage = "";
  InfoMessage = "";

  bookno = "";
  sDefaultCntrType_ID = "";
  sAgent_ID = "";
  sAgent_ID2 = "";
  sCarrier_ID = "";

  mode = '';
  pkid = '';

  PoFtpAttachList: any[] = [];
  FtpAttachList: any[] = [];
  AttachList: any[] = [];
  FileList: FileDetails[] = [];
  PoFtpError: string = "";
  StatusList: Param[] = [];
  ContainerList: Param[] = [];
  // Array For Displaying List
  RecordList: LinerBkm[] = [];
  // Single Record for add/edit/view details
  Record: LinerBkm = new LinerBkm;

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
    private modalService: NgbModal,
    private mainService: LinerBkmService,
    private prealertService: PreAlertReportService,
    private route: ActivatedRoute,
    public gs: GlobalService
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
    this.bookno = "";
    this.foldersent = false;
    this.chk_foldersent = false;
    this.folder_chk = false;
    this.bAdmin = false;
    this.bDocs = false;
    this.bPrint = false;
    this.AttachList = new Array<any>();
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {

      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_docs)
        this.bDocs = true;
      this.bPrint = this.menu_record.rights_print

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
          alert(this.ErrorMessage);
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

    if (this.searchby == "FOLDERSENT")
      this.searchstring = "";

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
    this.bookno = "";
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
    this.Record.book_ftp_agent = false;
    this.Record.book_move = '';
    this.Record.book_partner_email = '';
    this.Record.book_cust_comments = '';
    this.Record.book_agent_br_email = '';
    this.Record.book_ftp_agent_folder = false;
    this.Record.book_pol_eta = '';
    this.Record.book_pol_eta_confirm = false;
    this.Record.book_inland_haulage_status = 'NA';
    this.Record.book_dest_charges_status = 'NA';
    this.Record.book_free_days = 0;
    this.Record.book_si_cutoff = '';
    this.Record.book_cy_cutoff = '';
    this.Record.book_vgmwt = 0;
    this.Record.book_track_comments = '';
    this.Record.BkmCntrList = new Array<BkmCntrtype>();
    this.Record.BkmPayList = new Array<BkmPayment>();
    this.Record.BkmCargoList = new Array<BkmCargo>();
    this.Record.TransitList = new Array<Trackingm>();
    this.Record.HblBkmPartyList = new Array<HblBkmParty>();
    this.NewPayRecord();
    this.NewCargoRecord();
    this.NewTransitRecord();
    this.NewHblBkmRecord();
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
          alert(this.ErrorMessage);
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
    if (this.Record.BkmCargoList.length == 0)
      this.NewCargoRecord();
    if (this.Record.BkmPayList.length == 0)
      this.NewPayRecord();
    if (this.Record.TransitList.length == 0)
      this.NewTransitRecord();
    if (this.Record.HblBkmPartyList.length == 0)
      this.NewHblBkmRecord();

    //Fill Duplicate Job
    if (this.mode == "ADD") {
      this.foldersent = false;
      this.chk_foldersent = false;
      this.folder_chk = false;

      this.Record.book_pkid = this.pkid;
      this.Record.book_slno = null;
      this.Record.book_no = '';
      this.Record.book_mblno = '';
      this.Record.book_booked_on = this.gs.defaultValues.today;
      this.Record.book_folder_no = '';
      this.Record.book_folder_sent_date = '';
      this.Record.lock_record = false;
      this.Record.book_edit_code = '{S}';
      this.Record.book_cntr = '';
      this.Record.book_total_container = 0;
      this.Record.book_mdesc = '';
      this.Record.book_por_etd = '';
      this.Record.book_pofdc_eta = '';
      this.Record.book_cutoff_on = '';
      this.Record.book_vsl_eta = '';
      this.Record.book_vessel_name = '';
      this.Record.book_vessel_no = '';
      this.Record.book_etd = '';
      this.Record.book_etd_confirm = false;
      this.Record.book_pol_eta = '';
      this.Record.book_pol_eta_confirm = false;
      this.Record.book_eta = '';
      this.Record.book_eta_confirm = false;
      this.Record.book_pofd_eta = '';
      this.Record.book_pofd_eta_confirm = false;
      this.Record.book_si_cutoff = '';
      this.Record.book_cy_cutoff = '';
      this.Record.book_vgmwt = 0;
      this.Record.book_track_comments = '';
      this.Record.book_released_date = '';
      this.VESSELRECORD.id = '';
      this.VESSELRECORD.code = '';
      this.VESSELRECORD.name = '';

      this.Record.HblList = new Array<Hblm>();
      this.Record.BkmCntrList = new Array<BkmCntrtype>();
      this.Record.BkmPayList = new Array<BkmPayment>();
      this.Record.BkmCargoList = new Array<BkmCargo>();
      this.Record.TransitList = new Array<Trackingm>();
      this.Record.HblBkmPartyList = new Array<HblBkmParty>();
      this.NewPayRecord();
      this.NewCargoRecord();
      this.NewTransitRecord();
      this.NewHblBkmRecord();
      this.InitDefault();
    }
  }

  // Save Data
  Save() {
    if (!this.allvalid())
      return;

    this.FindCntrTotal();
    this.FindVolTotal();
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.rec_category = this.type;
    this.Record._globalvariables = this.gs.globalVariables;
    //Saving Shipper and consignee to master
    this.Record.book_exporter_id = '';
    this.Record.book_consignee_id = '';
    if (!this.gs.isBlank(this.Record.HblBkmPartyList)) {
      for (let rec of this.Record.HblBkmPartyList) {
        if (rec.hp_bkm_status != 'CANCELLED') {
          for (let rec2 of this.Record.HblBkmPartyList.filter(x => x.hp_pkid == this.Record.book_pkid)) { //for master ref record pkid and parentid are same
            rec2.hp_pkid = this.gs.getGuid();
          }
          rec.hp_pkid = this.Record.book_pkid;
          this.Record.book_exporter_id = rec.hp_exp_id;
          this.Record.book_consignee_id = rec.hp_imp_id;
          break;
        }
      }
    }

    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        if (this.mode == 'ADD') {
          this.Record.book_slno = response.bookslno;
          this.InfoMessage = "New Record " + this.Record.book_slno + " Generated Successfully";
        } else {
          this.InfoMessage = "Save Complete";
          if (response.mailmsg.length > 0)
            this.InfoMessage += ", " + response.mailmsg;
        }
        this.mode = 'EDIT';
        this.foldersent = response.foldersent;
        this.Record.rec_mode = this.mode;
        this.RefreshList();
        for (let rec of this.Record.HblBkmPartyList) {
          if (this.gs.isZero(rec.hp_order)) { //After saving hp_order is set for new records
            for (let rec2 of response.bkmlist.filter(x => x.hp_pkid == rec.hp_pkid)) {
              rec.hp_order = rec2.hp_order;
            }
          }
        }
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

    // if (this.Record.book_shipment_type.trim() == "LCL") {

    //   if (this.Record.book_mcbm <= 0) {
    //     bret = false;
    //     sError += "\n\r | Cbm Cannot Be Blank or Zero";
    //   }
    // } else {
    //   if (this.Record.book_mteu <= 0) {
    //     bret = false;
    //     sError += "\n\r | TEU Cannot Be Blank  or Zero";
    //   }
    // }

    if (bret === false) {
      this.ErrorMessage = sError;
      alert(this.ErrorMessage);
    }
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
      REC.book_booked_on = this.gs.ConvertDate2DisplayFormat(this.Record.book_booked_on);
      REC.book_no = this.Record.book_no;
      REC.book_liner_name = this.Record.book_liner_name;
      REC.book_pol_name = this.Record.book_pol_name;
      REC.book_pod_name = this.Record.book_pod_name;
      REC.book_pofd_name = this.Record.book_pofd_name;
      REC.book_folder_no = this.Record.book_folder_no;
      REC.book_folder_sent_date = this.gs.ConvertDate2DisplayFormat(this.Record.book_folder_sent_date);
      REC.book_shipper_name = this.Record.book_shipper_name;
      REC.book_consignee_name = this.Record.book_consignee_name;
      REC.book_agent_name = this.Record.book_agent_name;
      REC.book_m20 = this.Record.book_m20;
      REC.book_m40 = this.Record.book_m40;
      REC.book_mcbm = this.Record.book_mcbm;
      REC.book_mteu = this.Record.book_mteu;

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
    if (field == 'searchstring') {
      this.searchstring = this.searchstring.toUpperCase();
    }
    if (field == 'book_vgmwt') {
      this.Record.book_vgmwt = this.gs.roundWeight(this.Record.book_vgmwt, "GRWT");
    }
    if (field == 'book_track_comments') {
      this.Record.book_track_comments = this.Record.book_track_comments.toUpperCase();
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
      comp_code: '',
      hide_ho_entries: ''
    };
    SearchData.category = category;
    SearchData.type = _type;
    SearchData.pkid = this.pkid;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.folderid = this.folder_id;
    SearchData.comp_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.hide_ho_entries = this.gs.globalVariables.hide_ho_entries;

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

  HblList(_Record: LinerBkm) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.Record.book_agent_id.trim().length <= 0) {

      this.ErrorMessage += " | Agent Cannot Be Blank";
    }
    if (this.Record.book_liner_id.trim().length <= 0) {

      this.ErrorMessage += "\n\r | Liner Cannot Be Blank";
    }

    if (this.ErrorMessage.length > 0) {
      alert(this.ErrorMessage);
      return;
    }

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
      hbl_type: '',
      hbl_book_cntr_mdesc: '',
      hbl_released_date: '',
      hbl_buy_remarks: '',
      year_code: '',
      rowtype: '',
      book_slno: '',
      book_free_days: 0
    };

    if (controlname == 'updatemaster') {
      SearchData.table = 'updatemaster';
      SearchData.pkid = this.Record.book_pkid;
      SearchData.hbl_folder_no = this.Record.book_folder_no;
      SearchData.hbl_folder_sent_date = this.Record.book_folder_sent_date;
      SearchData.hbl_prealert_date = this.Record.book_prealert_date;
      SearchData.company_code = this.gs.globalVariables.comp_code;
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.rec_category = this.type;
      SearchData.hbl_type = 'MBL-SE';
      SearchData.hbl_book_cntr_mdesc = this.Record.book_mdesc;
      SearchData.hbl_released_date = this.Record.book_released_date;
      SearchData.hbl_buy_remarks = this.Record.book_cust_comments;
      SearchData.book_free_days = this.Record.book_free_days;
    }

    if (controlname == 'bookno') {
      SearchData.table = 'LINERBKM';
      SearchData.company_code = this.gs.globalVariables.comp_code;
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.year_code = this.gs.globalVariables.year_code;
      SearchData.book_slno = this.bookno;
      SearchData.rowtype = 'SEA EXPORT';
    }

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (controlname == 'updatemaster') {
          if (response.serror.length > 0) {
            this.ErrorMessage = response.serror;
            alert(this.ErrorMessage);
          }
          else {
            this.foldersent = response.foldersent;
            this.InfoMessage = 'Save Complete';
            alert(this.InfoMessage);
          }
        }
        if (controlname == 'bookno') {
          if (response.linerbkm.length > 0) {
            this.GetRecord(response.linerbkm[0].book_pkid);
          }
          else {
            this.ErrorMessage = 'Invalid MBLBK#';
            alert(this.ErrorMessage);
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
    this.FindCntrTotal();
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

    if (this.Record.BkmCntrList.length >= 1) {
      this.Record.book_m20 = n20;
      this.Record.book_m40 = n40;
      TotTeu = this.Record.book_m20 + (this.Record.book_m40 * 2);
      this.Record.book_mteu = TotTeu;
    }
  }

  NewPayRecord() {
    let Rec: BkmPayment = new BkmPayment;
    Rec.bpay_pkid = this.gs.getGuid();
    Rec.bpay_parent_id = this.Record.book_pkid;
    Rec.bpay_type = '0';
    Rec.bpay_term = '0';
    Rec.bpay_payer = '0';
    Rec.bpay_loc_id = '';
    this.Record.BkmPayList.push(Rec);
  }
  NewCargoRecord() {
    let Rec: BkmCargo = new BkmCargo;
    Rec.bc_pkid = this.gs.getGuid();
    Rec.bc_parent_id = this.Record.book_pkid;
    Rec.bc_desc = '';
    Rec.bc_ritc_id = '';
    Rec.bc_ritc_code = '';
    Rec.bc_ritc_name = '';
    Rec.bc_wt = 0;
    Rec.bc_wt_unit = 'KG';
    Rec.bc_cbm = 0;
    Rec.bc_cbm_unit = 'CBM';
    Rec.bc_pkg = 0;
    Rec.bc_pkg_id = '';
    Rec.bc_pkg_code = '';
    Rec.bc_pkg_name = '';
    this.Record.BkmCargoList.push(Rec);
  }

  NewTransitRecord() {
    let Rec: Trackingm = new Trackingm;
    Rec.trk_pkid = this.gs.getGuid();
    Rec.trk_parent_id = this.Record.book_pkid;
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
    Rec.trk_vsl_count = 0;
    Rec.trk_si_cutoff = '';
    Rec.trk_cy_cutoff = '';
    Rec.row_colour = 'darkslategray';
    this.Record.TransitList.push(Rec);
  }

  NewHblBkmRecord() {
    let Rec: HblBkmParty = new HblBkmParty;
    Rec.hp_pkid = this.gs.getGuid();
    Rec.hp_parent_id = this.Record.book_pkid;
    Rec.rec_category = 'SEA EXPORT';
    Rec.hp_exp_id = '';
    Rec.hp_exp_code = '';
    Rec.hp_exp_name = '';
    Rec.hp_imp_id = '';
    Rec.hp_imp_code = '';
    Rec.hp_imp_name = '';
    Rec.hp_notify_id = '';
    Rec.hp_notify_code = '';
    Rec.hp_notify_name = '';
    Rec.hp_bkm_status = 'BOOKED';
    Rec.hp_cbm = 0;
    Rec.hp_pcs = 0;
    Rec.hp_kgs = 0;
    Rec.rec_deleted = 'N';
    Rec.row_colour = 'darkslategray';
    Rec.hp_booking_locked = false;
    this.Record.HblBkmPartyList.push(Rec);
  }
  ModifiedRecords(params: any) {
    if (params.type == "PAYMENT") {
      if (params.saction == "ADD")
        this.NewPayRecord();
      if (params.saction == "REMOVE") {
        this.Record.BkmPayList.splice(this.Record.BkmPayList.findIndex(rec => rec.bpay_pkid == params.sid), 1);
        if (this.Record.BkmPayList.length == 0)
          this.NewPayRecord();
      }
    }
    if (params.type == "CARGO-DESC") {
      if (params.saction == "ADD")
        this.NewCargoRecord();
      if (params.saction == "REMOVE") {
        this.Record.BkmCargoList.splice(this.Record.BkmCargoList.findIndex(rec => rec.bc_pkid == params.sid), 1);
        if (this.Record.BkmCargoList.length == 0)
          this.NewCargoRecord();
      }
    }

    if (params.type == "TRANSIT") {
      if (params.saction == "ADD")
        this.NewTransitRecord();
      if (params.saction == "REMOVE") {
        this.Record.TransitList.splice(this.Record.TransitList.findIndex(rec => rec.trk_pkid == params.sid), 1);
        if (this.Record.TransitList.length == 0)
          this.NewTransitRecord();
      }
    }

    if (params.type == "MAIL-PO-CHECKLIST") {
      this.GenerateXmlPO('CHECK-LIST', '');
    }

    if (params.type == "SHIP-TRACK-MBL-RLEASE-UPDT") {
      this.Record.book_released_date = params.mblreleasedate;
    }

    if (params.type == "BKMPARTY") {
      if (params.saction == "ADD")
        this.NewHblBkmRecord();
      if (params.saction == "REMOVE") {
        if (this.Record.HblBkmPartyList.length == 1)
          return;
        for (let rec of this.Record.HblBkmPartyList.filter(rec => rec.hp_pkid == params.sid)) {
          rec.rec_deleted = 'Y';
          rec.row_colour = 'red';
        }
        // this.Record.HblBkmPartyList.splice(this.Record.HblBkmPartyList.findIndex(rec => rec.hp_pkid == params.sid), 1);
        // if (this.Record.HblBkmPartyList.length == 0)
        //   this.NewHblBkmRecord();
      }
    }
  }

  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }

  BookingFtp(ftpsent: any) {
    this.default_ftptype = 'BOOKING-FTP';
    this.default_mailftp_rootpage = 'FTPPAGE';
    this.ErrorMessage = '';
    if (this.Record.book_agent_id.trim().length <= 0) {
      this.ErrorMessage = "\n\r | Agent Cannot Be Blank";
      alert(this.ErrorMessage);
      return;
    }

    this.loading = true;
    this.ErrorMessage = '';
    let SearchData = {
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      branch_name: this.gs.globalVariables.branch_name,
      branch_number: this.gs.globalVariables.branch_number,
      agent_id: this.Record.book_agent_id,
      agent_code: this.Record.book_agent_code,
      agent_name: this.Record.book_agent_name,
      pre_alert_date: '',
      hbl_nos: '',
      type: '',
      mbl_id: ''
    };

    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.branch_name = this.gs.globalVariables.branch_name;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_number = this.gs.globalVariables.branch_number;
    SearchData.agent_id = this.Record.book_agent_id;
    SearchData.agent_code = this.Record.book_agent_code;
    SearchData.agent_name = this.Record.book_agent_name;
    SearchData.hbl_nos = '';
    SearchData.mbl_id = this.Record.book_pkid;
    this.mainService.GenerateXmlBooking(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.sSubject = "BOOKING - " + this.gs.globalVariables.branch_number.toString() + this.gs.globalVariables.year_code + this.Record.book_slno.toString();
        this.FtpAttachList = new Array<any>();
        this.FileList = response.filelist;
        for (let rec of this.FileList) {
          this.FtpAttachList.push({ filename: rec.filename, filetype: rec.filetype, filedisplayname: rec.filedisplayname, filecategory: rec.filecategory, fileftpfolder: 'FTP-FOLDER', fileisack: 'N', fileprocessid: rec.fileprocessid, filesize: rec.filesize, fileftptype: 'BOOKING-FTP' });
        }
        this.PoFtpAttachList = new Array<any>();
        this.open(ftpsent);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  MailFtp(ftpsent: any, _includeISF: string = "N") {
    this.default_ftptype = 'BL-FTP';
    this.default_mailftp_rootpage = 'MAILPAGE';
    if (this.Record.book_cntr.trim().length > 11) {
      // var cntrarry = this.Record.book_cntr.split('/');
      // this.PrealertList(cntrarry[0].toString(), ftpsent);
      this.PrealertList(this.Record.book_cntr.toString(), ftpsent, _includeISF);
    } else {
      this.GenerateXml(ftpsent);
    }
  }
  GenerateXml(ftpsent: any) {
    this.ErrorMessage = '';
    if (this.Record.book_agent_id.trim().length <= 0) {
      this.ErrorMessage = "\n\r | Agent Cannot Be Blank";
      alert(this.ErrorMessage);
      return;
    }
    // if (this.Record.book_agent_name.indexOf("RITRA") < 0) {
    //   this.ErrorMessage = "\n\r | Invalid Agent Selected";
    //   return;
    // }
    this.loading = true;
    this.ErrorMessage = '';
    let SearchData = {
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      branch_name: this.gs.globalVariables.branch_name,
      branch_number: this.gs.globalVariables.branch_number,
      agent_id: this.Record.book_agent_id,
      agent_code: this.Record.book_agent_code,
      agent_name: this.Record.book_agent_name,
      pre_alert_date: '',
      hbl_nos: '',
      type: '',
      mbl_id: ''
    };

    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.branch_name = this.gs.globalVariables.branch_name;
    SearchData.branch_number = this.gs.globalVariables.branch_number;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.agent_id = this.Record.book_agent_id;
    SearchData.agent_code = this.Record.book_agent_code;
    SearchData.agent_name = this.Record.book_agent_name;
    SearchData.hbl_nos = '';
    SearchData.mbl_id = this.Record.book_pkid;
    this.mainService.GenerateXmlEdi(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.sSubject += ", " + response.subject + ", MBL- " + this.Record.book_mblno;
        this.FtpAttachList = new Array<any>();
        this.FileList = response.filelist;
        for (let rec of this.FileList) {
          this.FtpAttachList.push({ filename: rec.filename, filetype: rec.filetype, filedisplayname: rec.filedisplayname, filecategory: rec.filecategory, fileftpfolder: 'FTP-FOLDER', fileisack: 'N', fileprocessid: rec.fileprocessid, filesize: rec.filesize, fileftptype: 'BL-FTP' });
        }
        if (response.poftpexist)
          this.GenerateXmlPO('FTP', ftpsent);
        else {
          this.PoFtpAttachList = new Array<any>();
          this.open(ftpsent);
        }

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  GenerateXmlPO(_type: string, ftpsent: any) {
    this.loading = true;
    this.ErrorMessage = '';
    let SearchData = {
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      type: 'MBL-SE',
      rowtype: _type,
      pkid: '',
      filedisplayname: '',
      doc_upload: 'N',
      agent_code: '',
      ftp_type: ''
    };

    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.type = 'MBL-SE';
    SearchData.pkid = this.Record.book_pkid;
    SearchData.filedisplayname = this.Record.book_slno.toString();
    SearchData.agent_code = this.Record.book_agent_code;
    SearchData.ftp_type = 'PO-FTP';

    this.mainService.GenerateXmlEdiMexico(SearchData)
      .subscribe(response => {
        this.loading = false;

        if (_type == 'FTP') {
          this.PoFtpAttachList = new Array<any>();
          if (this.FtpAttachList == null || this.FtpAttachList == undefined)
            this.FtpAttachList = new Array<any>();

          if (response.errormsg.length > 0)
            this.PoFtpError = response.errormsg;
          else {
            this.FtpAttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname, filecategory: 'BLINFO', fileftpfolder: 'FTP-FOLDER-VSL-DATA', fileisack: 'N', fileprocessid: response.processid, filesize: response.filesize, fileftptype: 'PO-FTP' });
            this.PoFtpAttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname, filecategory: 'BLINFO', fileftpfolder: 'FTP-FOLDER-VSL-DATA', fileisack: 'N', fileprocessid: response.processid, filesize: response.filesize });
          }
          this.open(ftpsent);
        } else {
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }



  ShowFtpHistory(ftphistory: any) {
    this.ErrorMessage = '';
    this.open(ftphistory);
  }
  ShowHistory(history: any) {
    this.ErrorMessage = '';
    this.open(history);
  }

  PrealertList(_cntrno: string, ftpsent: any, _includeISF: string = "N") {
    this.loading = true;
    let SearchData = {
      type: '',
      pkid: '',
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: '',
      searchcontainer: '',
      root_folder: this.gs.defaultValues.root_folder,
      docattach: 'Y',
      mbl_id: '',
      include_isf: 'N'
    };
    SearchData.pkid = this.gs.getGuid();
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.year_code = this.gs.globalVariables.year_code;
    SearchData.searchcontainer = _cntrno.toUpperCase();
    SearchData.type = "EXCEL";
    SearchData.docattach = "Y";
    SearchData.root_folder = this.gs.defaultValues.root_folder;
    SearchData.mbl_id = this.Record.book_pkid;
    SearchData.include_isf = _includeISF;

    this.ErrorMessage = '';
    this.prealertService.PreAlertBookingSea(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_includeISF == "Y") {
          this.sSubject = "ISF FOR " + this.Record.book_vessel_name + "/" + this.Record.book_vessel_no;
        }
        else {
          this.sSubject = "PRE-ALERT FOR " + this.Record.book_vessel_name + "/" + this.Record.book_vessel_no;
        }
        let _hblnos: string = '';
        for (let rec of this.Record.HblList) {
          if (_hblnos != '')
            _hblnos += ", ";
          _hblnos += rec.hbl_bl_no;
        }

        if (_includeISF == "Y") {
          this.mMsg = "Dear Sir/Madam, ";
          this.mMsg += " \n\n";
          this.mMsg += " VESSEL: " + this.Record.book_vessel_name + "/" + this.Record.book_vessel_no;
          this.mMsg += " \n\n";
          this.mMsg += " CNTR# " + this.Record.book_cntr;
          this.mMsg += " \n\n";
          this.mMsg += " MBL# " + this.Record.book_mblno;
          this.mMsg += " \n\n";
          this.mMsg += " HBL# - PO#";
          this.mMsg += " \n";
          for (let rec of this.Record.HblList) {
            this.mMsg += rec.hbl_bl_no + ' - ' + rec.hbl_itm_po;
            this.mMsg += " \n";
          }
          this.mMsg += " \n";
          this.mMsg += " We here by attach the ISF files for your kind reference";
        } else {
          this.mMsg = "Dear Sir/Madam, ";
          this.mMsg += " \n\n";
          this.mMsg += " VESSEL: " + this.Record.book_vessel_name + "/" + this.Record.book_vessel_no;
          this.mMsg += " \n\n";
          this.mMsg += " CNTR# " + this.Record.book_cntr;
          this.mMsg += " \n\n";
          this.mMsg += " HBL# " + _hblnos;
          this.mMsg += " \n\n";
          this.mMsg += " MBL# " + this.Record.book_mblno;
          this.mMsg += " \n\n";
          this.mMsg += " We here by attach the Pre-Alert and HBL copy for your kind reference";
        }

        this.AttachList = new Array<any>();
        // this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname, filecategory: '', fileftpfolder: '', fileisack: 'N', fileprocessid: '', filesize: response.filesize });
        for (let rec of response.filelist) {
          this.AttachList.push({ filename: rec.filename, filetype: rec.filetype, filedisplayname: rec.filedisplayname, filecategory: rec.filecategory, fileftpfolder: '', fileisack: 'N', fileprocessid: '', filesize: rec.filesize });
        }
        if (this.Record.book_ftp_agent) {// this.Record.book_ftp_agent is true when FTP Folder for BL exist in system settings of trading partner
          this.GenerateXml(ftpsent);
        } else {
          this.GenerateXmlPO('FTP', ftpsent);
        }
        // this.open(ftpsent);
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
      category: "SEA EXPORT",
      user_code: this.gs.globalVariables.user_code,
      mbl_slno: this.Record.book_slno
    };

    this.mainService.GenerateFolderNumber(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.serror.length > 0) {
          this.ErrorMessage = response.serror;
          alert(this.ErrorMessage);
        } else
          this.Record.book_folder_no = response.newno;
        if (response.dupfolder.length > 0)
          alert(response.dupfolder);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }
  AddTransit() {
    this.NewTransitRecord();
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
        if (response.mailmsg.length > 0)
          this.InfoMessage += ", " + response.mailmsg;
        alert(this.InfoMessage);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  FindVolTotal() {
    let mcbm: number = 0;
    let mpcs: number = 0;
    let mkgs: number = 0;
    if (!this.gs.isBlank(this.Record.HblBkmPartyList)) {
      for (let rec of this.Record.HblBkmPartyList) {
        if (rec.hp_bkm_status != 'CANCELLED') {
          mcbm += rec.hp_cbm;
          mpcs += rec.hp_pcs;
          mkgs += rec.hp_kgs;
        }
      }
    }
    this.Record.book_mcbm = this.gs.roundNumber(mcbm, 3);
    this.Record.book_mpcs = this.gs.roundNumber(mpcs, 3);
    this.Record.book_mkgs = this.gs.roundNumber(mkgs, 3);
  }

  UpdateRecord(_rec: Hblm) {
    this.loading = true;
    let SearchData = {
      mblid: this.pkid,
      hblid: _rec.hbl_pkid,
      bkslno: _rec.hbl_book_slno
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.UpdateHblRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        alert("Save Complete");
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  UpdateBkmContainer() {

    if (!confirm("Update Booking Container?")) {
      return;
    }

    this.loading = true;
    let SearchData = {
      company_code: this.gs.globalVariables.comp_code,
      from_date: this.gs.globalData.mbl_fromdate,
      to_date: this.gs.globalData.mbl_todate
    };
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.UpdateBkmContainer(SearchData)
      .subscribe(response => {
        this.loading = false;
        alert("Save Complete");
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }
}
