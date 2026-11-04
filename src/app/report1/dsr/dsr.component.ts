import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Dsr } from '../models/dsr';
import { RepService } from '../services/report.service';
import { DateComponent } from '../../shared/date/date.component';
import { CustomReportD } from '../../shared/models/customreporth';
import { User } from '../../admin/models/user';
import { CustomReportComponent } from '../../shared/customreport/customreport.component';
//EDIT-AJITH-21-10-2021
//EDIT-AJITH-22-10-2021
/*
1. In dsr model create interface iDsrModel and initialState: iDsrModel.
*/
@Component({
  selector: 'app-dsr',
  templateUrl: './dsr.component.html',
  providers: [RepService]
})

export class DsrComponent {

  @ViewChild('_from_date') private from_date_ctrl: DateComponent;
  @ViewChild('_to_date') private to_date_ctrl: DateComponent;
  @ViewChild('CustRpt') private _CustRpt: CustomReportComponent;

  @Input() menuid: string = '';
  @Input() type: string = '';

  title: string = 'Dsr Report';
  InitCompleted: boolean = false;
  menu_record: any;
  urlid: string = '';
  modal: any;
  sub: any;


  hbl_menuid: string = "";
  hbl_menu_record: any;
  canEditHouse: boolean = false;

  rec_category: string = '';
  loading: boolean = false;
  bAdmin: boolean = false;
  bEmail: boolean = false;
  bExcel: boolean = false;
  disableSave: boolean = false;
  bCompany: boolean = false;
  bSman: boolean = false;
  carriertype: string = '';
  porttype: string = '';
  CustomReportList: any[] = [];
  TpList: User[] = [];

  // BRRECORD: SearchTable;
  // EXPRECORD: SearchTable;
  // IMPRECORD: SearchTable;
  // AGENTRECORD: SearchTable;
  // CARRIERRECORD: SearchTable;
  // POLRECORD: SearchTable;
  // PODRECORD: SearchTable;

  constructor(
    private modalService: NgbModal,
    public ms: RepService,
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
        this.rec_category = this.type;
        this.InitComponent();
      }
    });

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    if (!this.InitCompleted) {
      this.InitComponent();
    }
    this.ms.init(this.menuid);
  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.restoreRowPosition();
    }, 100);
  }

  restoreRowPosition() {

    const row = document.getElementById(this.ms.state.selectedRowIndex.toString());

    if (row) {
      row.scrollIntoView({
        behavior: 'auto',
        block: 'center'
      });
    }
  }


  InitComponent() {
    this.bExcel = false;
    this.bCompany = false;
    this.bAdmin = false;
    this.bEmail = false;
    this.bSman = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_company)
        this.bCompany = true;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_print)
        this.bExcel = true;
      if (this.menu_record.rights_email)
        this.bEmail = true;
      if (this.menu_record.rights_approval.toString().includes("{SMAN}"))
        this.bSman = true;
    }

    this.hbl_menuid = '';
    this.canEditHouse = false;
    if (this.type.toString() == "SEA EXPORT") {
      this.porttype = "SEA PORT";
      this.carriertype = "SEA CARRIER";
      this.hbl_menuid = "SISEAEXPORT";
    } else if (this.type.toString() == "SEA IMPORT") {
      this.porttype = "SEA PORT";
      this.carriertype = "SEA CARRIER";
      this.hbl_menuid = "SISEAIMPORT";
    } else if (this.type.toString() == "AIR EXPORT") {
      this.porttype = "AIR PORT";
      this.carriertype = "AIR CARRIER";
      this.hbl_menuid = "SIAIREXPORT";
    } else if (this.type.toString() == "AIR IMPORT") {
      this.porttype = "AIR PORT";
      this.carriertype = "AIR CARRIER";
      this.hbl_menuid = "SIAIRIMPORT";
    }

    if (this.hbl_menuid) {
      this.hbl_menu_record = this.gs.getMenu(this.hbl_menuid);
      if (this.hbl_menu_record) {
        if (this.hbl_menu_record.rights_edit)
          this.canEditHouse = true;
      }
    }

    this.initLov();
    this.LoadCombo();
    this.Loadtplist();
  }

  // Init() {

  //   this.ms.state.type_date = "DATE";
  //   this.ms.state.filter_date_type = "JOB";
  //   this.ms.state.job_type = "ALL";
  //   this.ms.state.RecordList = [];
  //   this.ms.state.branch_code = this.gs.globalVariables.branch_code;
  //   this.ms.state.branch_name = this.gs.globalVariables.branch_name;
  //   this.ms.state.from_date = this.gs.defaultValues.monthbegindate;
  //   this.ms.state.to_date = this.gs.defaultValues.today;
  //   this.ms.state.EXPRECORD.id = '';
  //   this.ms.state.IMPRECORD.id = '';
  //   this.ms.state.shipper_id = '';
  //   this.ms.state.shipper_name = '';
  //   this.ms.state.consignee_id = '';
  //   this.ms.state.consignee_name = '';
  //   this.ms.state.agent_id = '';
  //   this.ms.state.agent_code = '';
  //   this.ms.state.agent_name = '';
  //   this.ms.state.carrier_id = '';
  //   this.ms.state.carrier_code = '';
  //   this.ms.state.carrier_name = '';
  //   this.ms.state.pol_id = '';
  //   this.ms.state.pol_code = '';
  //   this.ms.state.pol_name = '';
  //   this.ms.state.pod_id = '';
  //   this.ms.state.pod_code = '';
  //   this.ms.state.pod_name = '';
  //   this.ms.state.sman_id = this.gs.globalVariables.sman_id;
  //   this.ms.state.sman_code = '';
  //   this.ms.state.sman_name = this.gs.globalVariables.sman_name;
  //   this.ms.state.format_type = 'GENERAL';
  // }

  // Destroy Will be called when this component is closed 
  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  initLov(caption: string = '') {

    // this.BRRECORD = new SearchTable();
    // this.BRRECORD.controlname = "BRANCH";
    // this.BRRECORD.displaycolumn = "CODE";
    // this.BRRECORD.type = "BRANCH";
    // this.BRRECORD.id = "";
    // this.BRRECORD.code = this.gs.globalVariables.branch_code;


    // this.EXPRECORD = new SearchTable();
    // this.EXPRECORD.controlname = "SHIPPER";
    // this.EXPRECORD.displaycolumn = "NAME";
    // this.EXPRECORD.type = "CUSTOMER";
    // this.EXPRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
    // this.EXPRECORD.id = "";
    // this.EXPRECORD.code = "";
    // this.EXPRECORD.name = "";
    // this.EXPRECORD.parentid = "";


    // this.IMPRECORD = new SearchTable();
    // this.IMPRECORD.controlname = "CONSIGNEE";
    // this.IMPRECORD.displaycolumn = "NAME";
    // this.IMPRECORD.type = "CUSTOMER";
    // this.IMPRECORD.where = " CUST_IS_CONSIGNEE = 'Y' ";
    // this.IMPRECORD.id = "";
    // this.IMPRECORD.code = "";
    // this.IMPRECORD.name = "";
    // this.IMPRECORD.parentid = "";


    // this.AGENTRECORD = new SearchTable();
    // this.AGENTRECORD.controlname = "AGENT";
    // this.AGENTRECORD.where = " CUST_IS_AGENT = 'Y' ";
    // this.AGENTRECORD.displaycolumn = "NAME";
    // this.AGENTRECORD.type = "CUSTOMER";
    // this.AGENTRECORD.id = "";
    // this.AGENTRECORD.code = "";
    // this.AGENTRECORD.name = "";

    // this.CARRIERRECORD = new SearchTable();
    // this.CARRIERRECORD.controlname = "CARRIER";
    // this.CARRIERRECORD.displaycolumn = "NAME";
    // this.CARRIERRECORD.type = this.carriertype;
    // this.CARRIERRECORD.id = "";
    // this.CARRIERRECORD.code = "";
    // this.CARRIERRECORD.name = "";

    // this.POLRECORD = new SearchTable();
    // this.POLRECORD.controlname = "POL";
    // this.POLRECORD.displaycolumn = "NAME";
    // this.POLRECORD.type = this.porttype;
    // this.POLRECORD.id = "";
    // this.POLRECORD.code = "";
    // this.POLRECORD.name = "";


    // this.PODRECORD = new SearchTable();
    // this.PODRECORD.controlname = "POD";
    // this.PODRECORD.displaycolumn = "NAME";
    // this.PODRECORD.type = this.porttype;
    // this.PODRECORD.id = "";
    // this.PODRECORD.code = "";
    // this.PODRECORD.name = "";

  }

  LovSelected(_Record: SearchTable) {
    // Company Settings
    if (_Record.controlname == "BRANCH") {
      this.ms.state.branch_code = _Record.code;
      this.ms.state.branch_name = _Record.name;
      this.ms.state.shipper_id = '';
      this.ms.state.consignee_id = '';
    }
    if (_Record.controlname == "SHIPPER") {
      this.ms.state.shipper_id = _Record.id;
      this.ms.state.shipper_name = _Record.name;
    }
    if (_Record.controlname == "CONSIGNEE") {
      this.ms.state.consignee_id = _Record.id;
      this.ms.state.consignee_name = _Record.name;
    }
    if (_Record.controlname == "AGENT") {
      this.ms.state.agent_id = _Record.id;
      this.ms.state.agent_code = _Record.code;
      this.ms.state.agent_name = _Record.name;
    }
    if (_Record.controlname == "CARRIER") {
      this.ms.state.carrier_id = _Record.id;
      this.ms.state.carrier_code = _Record.code;
      this.ms.state.carrier_name = _Record.name;
    }
    if (_Record.controlname == "POL") {
      this.ms.state.pol_id = _Record.id;
      this.ms.state.pol_code = _Record.code;
      this.ms.state.pol_name = _Record.name;
    }
    if (_Record.controlname == "POD") {
      this.ms.state.pod_id = _Record.id;
      this.ms.state.pod_code = _Record.code;
      this.ms.state.pod_name = _Record.name;
    }

    if (_Record.controlname == "SMAN") {
      this.ms.state.sman_id = _Record.id;
      this.ms.state.sman_code = _Record.code;
      this.ms.state.sman_name = _Record.name;
    }

  }

  LoadCombo() {

    if (this.type == "SEA EXPORT") {
      this.CustomReportList = [
        { "rd_ctr": 1, "rd_code": "SLNO", "rd_caption": "SL#", "rd_field": "job_docno", "rd_sort_order": 1, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 2, "rd_code": "JOBNO", "rd_caption": "JOB#", "rd_field": "job_docno", "rd_sort_order": 5, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 3, "rd_code": "JOBDATE", "rd_caption": "JOB DATE", "rd_field": "job_date", "rd_sort_order": 10, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 4, "rd_code": "REFERENCE", "rd_caption": "REF#", "rd_field": "job_prefix", "rd_sort_order": 15, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 5, "rd_code": "SHIPPER", "rd_caption": "SHIPPER", "rd_field": "job_shipper", "rd_sort_order": 20, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 6, "rd_code": "CONSIGNEE", "rd_caption": "CONSIGNEE", "rd_field": "job_consignee", "rd_sort_order": 25, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 7, "rd_code": "JOB-AGENT-CARRIER", "rd_caption": "JOB/AGENT/CARRIER", "rd_field": "job_liner_agent", "rd_sort_order": 30, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 8, "rd_code": "NOMINATION", "rd_caption": "NOMINATION", "rd_field": "job_nomination", "rd_sort_order": 35, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 9, "rd_code": "JOB-TYPE", "rd_caption": "JOB TYPE", "rd_field": "job_type", "rd_sort_order": 40, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 10, "rd_code": "POL", "rd_caption": "POL", "rd_field": "job_pol", "rd_sort_order": 45, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 11, "rd_code": "POD", "rd_caption": "POD", "rd_field": "job_pod", "rd_sort_order": 50, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 12, "rd_code": "TERMS", "rd_caption": "TERMS", "rd_field": "job_terms", "rd_sort_order": 55, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 13, "rd_code": "JOB-INVOICE-NO", "rd_caption": "JOB INVOICE-NO", "rd_field": "job_invoice_nos", "rd_sort_order": 60, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 14, "rd_code": "JOB-INVOICE-AMT", "rd_caption": "JOB INVOICE-AMT", "rd_field": "job_invoice_amt", "rd_sort_order": 65, "rd_col_width": 15, "rd_data_type": "N-2" },
        { "rd_ctr": 15, "rd_code": "PCS", "rd_caption": "PCS", "rd_field": "job_pcs", "rd_sort_order": 70, "rd_col_width": 15, "rd_data_type": "N-0" },
        { "rd_ctr": 16, "rd_code": "PKG", "rd_caption": "PKG", "rd_field": "job_pkg", "rd_sort_order": 75, "rd_col_width": 15, "rd_data_type": "N-3" },
        { "rd_ctr": 17, "rd_code": "NTWT", "rd_caption": "NTWT", "rd_field": "job_ntwt", "rd_sort_order": 80, "rd_col_width": 15, "rd_data_type": "N-3" },
        { "rd_ctr": 18, "rd_code": "GRWT", "rd_caption": "GRWT", "rd_field": "job_grwt", "rd_sort_order": 85, "rd_col_width": 15, "rd_data_type": "N-3" },
        { "rd_ctr": 19, "rd_code": "CBM", "rd_caption": "CBM", "rd_field": "job_cbm", "rd_sort_order": 90, "rd_col_width": 15, "rd_data_type": "N-3" },
        { "rd_ctr": 20, "rd_code": "COMMODITY", "rd_caption": "COMMODITY", "rd_field": "job_commodity", "rd_sort_order": 95, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 21, "rd_code": "NATURE-SHIPMENT-MODE", "rd_caption": "NATURE/SHIPMENT MODE", "rd_field": "job_nature", "rd_sort_order": 100, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 22, "rd_code": "JOB-CNTR- SIZE-TYPE", "rd_caption": "JOB CONTAINER SIZE/TYPE", "rd_field": "job_cntr_type", "rd_sort_order": 105, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 23, "rd_code": "SBILL-NO", "rd_caption": "SBILL-NO", "rd_field": "opr_sbill_no", "rd_sort_order": 110, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 24, "rd_code": "SBILL-DATE", "rd_caption": "SBILL-DATE", "rd_field": "opr_sbill_date", "rd_sort_order": 115, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 25, "rd_code": "CHA", "rd_caption": "CHA", "rd_field": "job_cha_name", "rd_sort_order": 120, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 26, "rd_code": "CARGO-RECEIVED-ON", "rd_caption": "CARGO-RECEIVED-ON", "rd_field": "opr_cargo_received_on", "rd_sort_order": 125, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 27, "rd_code": "BOOKING-NUMBER", "rd_caption": "BOOKING NUMBER", "rd_field": "mbl_book_no", "rd_sort_order": 130, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 28, "rd_code": "BOOKING-DATE", "rd_caption": "BOOKING DATE", "rd_field": "mbl_book_date", "rd_sort_order": 135, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 29, "rd_code": "STUFFED-AT", "rd_caption": "STUFFED-AT", "rd_field": "opr_stuffed_at", "rd_sort_order": 140, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 30, "rd_code": "STUFFED-ON", "rd_caption": "STUFFED-ON", "rd_field": "opr_stuffed_on", "rd_sort_order": 145, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 31, "rd_code": "VESSEL", "rd_caption": "VESSEL", "rd_field": "mbl_vessel_name", "rd_sort_order": 150, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 32, "rd_code": "VESSEL-NO", "rd_caption": "VESSEL-NO", "rd_field": "mbl_vessel_no", "rd_sort_order": 155, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 33, "rd_code": "ETD", "rd_caption": "ETD", "rd_field": "mbl_pol_etd", "rd_sort_order": 160, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 34, "rd_code": "ETA", "rd_caption": "ETA", "rd_field": "mbl_pod_eta", "rd_sort_order": 165, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 35, "rd_code": "JOB-CONTAINER", "rd_caption": "JOB/CONTAINER", "rd_field": "job_cntr", "rd_sort_order": 170, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 36, "rd_code": "SI-FILED-ON", "rd_caption": "SI FILED ON", "rd_field": "mbl_book_date", "rd_sort_order": 175, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 37, "rd_code": "SOB", "rd_caption": "SOB", "rd_field": "mbl_pol_etd", "rd_sort_order": 180, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 38, "rd_code": "DESTINATION-ETA", "rd_caption": "DESTINATION-ETA", "rd_field": "mbl_pofd_eta", "rd_sort_order": 185, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 39, "rd_code": "SINO", "rd_caption": "SI#", "rd_field": "hbl_no", "rd_sort_order": 190, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 40, "rd_code": "HBL-NO", "rd_caption": "HBL-NO", "rd_field": "hbl_bl_no", "rd_sort_order": 195, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 41, "rd_code": "AGENT", "rd_caption": "AGENT", "rd_field": "job_agent_name", "rd_sort_order": 200, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 42, "rd_code": "CARRIER", "rd_caption": "CARRIER", "rd_field": "liner_name", "rd_sort_order": 205, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 43, "rd_code": "CONTAINER", "rd_caption": "CONTAINER", "rd_field": "hbl_book_cntr", "rd_sort_order": 210, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 44, "rd_code": "HBL-RELEASED-ON", "rd_caption": "HBL RELEASED ON", "rd_field": "hbl_released_date", "rd_sort_order": 215, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 45, "rd_code": "MBLBKNO", "rd_caption": "MBLBK#", "rd_field": "mbl_no", "rd_sort_order": 220, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 46, "rd_code": "MBL-NO", "rd_caption": "MBL-NO", "rd_field": "mbl_bl_no", "rd_sort_order": 225, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 47, "rd_code": "MBL-RELEASED-ON", "rd_caption": "MBL RELEASED ON", "rd_field": "mbl_released_date", "rd_sort_order": 230, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 48, "rd_code": "PRE-ALERT-SEND-ON", "rd_caption": "PRE-ALERT SEND ON", "rd_field": "mbl_prealert_date", "rd_sort_order": 235, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 49, "rd_code": "OUR-INVOICE-NO", "rd_caption": "OUR INVOICE#", "rd_field": "hbl_ar_invnos", "rd_sort_order": 240, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 50, "rd_code": "INV-AMOUNT", "rd_caption": "AMOUNT", "rd_field": "hbl_ar_invamt", "rd_sort_order": 245, "rd_col_width": 15, "rd_data_type": "N-2" },
        { "rd_ctr": 51, "rd_code": "GST-AMOUNT", "rd_caption": "GST-AMOUNT", "rd_field": "hbl_ar_gstamt", "rd_sort_order": 250, "rd_col_width": 15, "rd_data_type": "N-2" },
        { "rd_ctr": 52, "rd_code": "JOB-STATUS", "rd_caption": "JOB STATUS", "rd_field": "job_status", "rd_sort_order": 255, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 53, "rd_code": "TOTAL-NO-OF-TUES", "rd_caption": "TOTAL NUMBER OF TUES", "rd_field": "job_cntr_teu", "rd_sort_order": 260, "rd_col_width": 15, "rd_data_type": "N-0" },
        { "rd_ctr": 54, "rd_code": "SALESMAN", "rd_caption": "SALESMAN", "rd_field": "salesman", "rd_sort_order": 265, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 55, "rd_code": "REMARKS", "rd_caption": "REMARKS", "rd_field": "job_remarks", "rd_sort_order": 270, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 56, "rd_code": "EP-RECEIVED-ON", "rd_caption": "E/P-RECEIVED-ON", "rd_field": "opr_ep_rec_date", "rd_sort_order": 275, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 57, "rd_code": "VESSEL2", "rd_caption": "VESSEL2", "rd_field": "mbl_vessel2", "rd_sort_order": 280, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 58, "rd_code": "SCHEME", "rd_caption": "SCHEME", "rd_field": "job_billtype_id", "rd_sort_order": 285, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 59, "rd_code": "PONOS", "rd_caption": "PO NOS", "rd_field": "job_po_nos", "rd_sort_order": 290, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 60, "rd_code": "CARGO-READY-DATE", "rd_caption": "CARGO READY DATE", "rd_field": "opr_cargo_ready_date", "rd_sort_order": 295, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 61, "rd_code": "CARGO-RECEIVED-AT", "rd_caption": "CARGO RECEIVED AT", "rd_field": "opr_cargo_received_at", "rd_sort_order": 300, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 62, "rd_code": "CLEARED-DATE", "rd_caption": "CLEARED ON", "rd_field": "opr_cleared_date", "rd_sort_order": 305, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 63, "rd_code": "STACKED-ON", "rd_caption": "STACKED ON", "rd_field": "opr_stacked_on", "rd_sort_order": 310, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 64, "rd_code": "PICKUP-LOCATION", "rd_caption": "PICKUP LOCATION", "rd_field": "opr_pickup_location", "rd_sort_order": 315, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 65, "rd_code": "SCHEDULED-PICKUP-DATE", "rd_caption": "SCHEDULED PICKUP DATE", "rd_field": "opr_scheduled_pickup_date", "rd_sort_order": 320, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 66, "rd_code": "ACTUAL-PICKUP-DATE", "rd_caption": "ACTUAL PICKUP DATE", "rd_field": "opr_actual_pickup_date", "rd_sort_order": 325, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 67, "rd_code": "VEHICLE-RELEASED-DATE", "rd_caption": "VEHICLE RELEASED DATE", "rd_field": "opr_vehicle_released_date", "rd_sort_order": 330, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 68, "rd_code": "DETENTION-DAYS", "rd_caption": "DETENTION DAYS", "rd_field": "opr_detention_days", "rd_sort_order": 335, "rd_col_width": 15, "rd_data_type": "N-0" },
        { "rd_ctr": 69, "rd_code": "VEHICLE-TYPE", "rd_caption": "VEHICLE TYPE", "rd_field": "opr_vehicle_type", "rd_sort_order": 340, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 70, "rd_code": "VEHICLE-NO", "rd_caption": "VEHICLE NO", "rd_field": "opr_vehicle_no", "rd_sort_order": 345, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 71, "rd_code": "TRANSPORTER-NAME", "rd_caption": "TRANSPORTER NAME", "rd_field": "opr_transporter_name", "rd_sort_order": 350, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 72, "rd_code": "EP-SENT-DATE", "rd_caption": "EP SENT DATE", "rd_field": "opr_ep_sent_date", "rd_sort_order": 355, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 73, "rd_code": "DRAWBACK-SLNO", "rd_caption": "DRAWBACK SLNO", "rd_field": "opr_drawback_slno", "rd_sort_order": 360, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 74, "rd_code": "DRAWBACK-DATE", "rd_caption": "DRAWBACK DATE", "rd_field": "opr_drawback_date", "rd_sort_order": 365, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 75, "rd_code": "DRAWBACK-AMOUNT", "rd_caption": "DRAWBACK AMOUNT", "rd_field": "opr_drawback_amt", "rd_sort_order": 370, "rd_col_width": 15, "rd_data_type": "N-2" },
        { "rd_ctr": 76, "rd_code": "EGM-NO", "rd_caption": "EGM NO", "rd_field": "opr_egmno", "rd_sort_order": 375, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 77, "rd_code": "EGM-DATE", "rd_caption": "EGM DATE", "rd_field": "opr_egmdt", "rd_sort_order": 380, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 78, "rd_code": "EGM-STATUS", "rd_caption": "EGM STATUS", "rd_field": "opr_egm_status", "rd_sort_order": 385, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 79, "rd_code": "POL-ATD", "rd_caption": "POL ATD", "rd_field": "pol_atd", "rd_sort_order": 390, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 80, "rd_code": "POD-ATA", "rd_caption": "POD ATA", "rd_field": "pod_ata", "rd_sort_order": 395, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 81, "rd_code": "POFD-ATA", "rd_caption": "POFD ATA", "rd_field": "pofd_ata", "rd_sort_order": 400, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 82, "rd_code": "TS1-PORT", "rd_caption": "TS1 PORT", "rd_field": "trk_ts1_port_name", "rd_sort_order": 405, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 83, "rd_code": "TS1-VESSEL", "rd_caption": "TS1 VESSEL", "rd_field": "trk_ts1_vessel_name", "rd_sort_order": 410, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 84, "rd_code": "TS1-VOYAGE", "rd_caption": "TS1 VOYAGE", "rd_field": "trk_ts1_voyage", "rd_sort_order": 415, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 85, "rd_code": "TS1-ETD", "rd_caption": "TS1 ETD", "rd_field": "trk_ts1_etd", "rd_sort_order": 420, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 86, "rd_code": "TS1-ETA", "rd_caption": "TS1 ETA", "rd_field": "trk_ts1_eta", "rd_sort_order": 425, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 87, "rd_code": "TS2-PORT", "rd_caption": "TS2 PORT", "rd_field": "trk_ts2_port_name", "rd_sort_order": 430, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 88, "rd_code": "TS2-VESSEL", "rd_caption": "TS2 VESSEL", "rd_field": "trk_ts2_vessel_name", "rd_sort_order": 435, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 89, "rd_code": "TS2-VOYAGE", "rd_caption": "TS2 VOYAGE", "rd_field": "trk_ts2_voyage", "rd_sort_order": 440, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 90, "rd_code": "TS2-ETD", "rd_caption": "TS2 ETD", "rd_field": "trk_ts2_etd", "rd_sort_order": 445, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 91, "rd_code": "TS2-ETA", "rd_caption": "TS2 ETA", "rd_field": "trk_ts2_eta", "rd_sort_order": 450, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 92, "rd_code": "TS3-PORT", "rd_caption": "TS3 PORT", "rd_field": "trk_ts3_port_name", "rd_sort_order": 455, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 93, "rd_code": "TS3-VESSEL", "rd_caption": "TS3 VESSEL", "rd_field": "trk_ts3_vessel_name", "rd_sort_order": 460, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 94, "rd_code": "TS3-VOYAGE", "rd_caption": "TS3 VOYAGE", "rd_field": "trk_ts3_voyage", "rd_sort_order": 465, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 95, "rd_code": "TS3-ETD", "rd_caption": "TS3 ETD", "rd_field": "trk_ts3_etd", "rd_sort_order": 470, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 96, "rd_code": "TS3-ETA", "rd_caption": "TS3 ETA", "rd_field": "trk_ts3_eta", "rd_sort_order": 475, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 97, "rd_code": "POL-ETD1", "rd_caption": "POL ETD1", "rd_field": "trk_pol_etd1", "rd_sort_order": 480, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 98, "rd_code": "POL-ETD2", "rd_caption": "POL ETD2", "rd_field": "trk_pol_etd2", "rd_sort_order": 485, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 99, "rd_code": "POL-ETD3", "rd_caption": "POL ETD3", "rd_field": "trk_pol_etd3", "rd_sort_order": 490, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 100, "rd_code": "POD-ETA1", "rd_caption": "POD ETA1", "rd_field": "trk_pod_eta1", "rd_sort_order": 495, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 101, "rd_code": "POD-ETA2", "rd_caption": "POD ETA2", "rd_field": "trk_pod_eta2", "rd_sort_order": 500, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 102, "rd_code": "POD-ETA3", "rd_caption": "POD ETA3", "rd_field": "trk_pod_eta3", "rd_sort_order": 505, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 103, "rd_code": "POFD-ETA1", "rd_caption": "POFD ETA1", "rd_field": "trk_pofd_eta1", "rd_sort_order": 510, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 104, "rd_code": "POFD-ETA2", "rd_caption": "POFD ETA2", "rd_field": "trk_pofd_eta2", "rd_sort_order": 515, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 105, "rd_code": "POFD-ETA3", "rd_caption": "POFD ETA3", "rd_field": "trk_pofd_eta3", "rd_sort_order": 520, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 106, "rd_code": "BRANCH", "rd_caption": "BRANCH", "rd_field": "branch", "rd_sort_order": 525, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 107, "rd_code": "SI-CUT-OFF", "rd_caption": "SI CUT OFF", "rd_field": "mbl_si_cutoff", "rd_sort_order": 530, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 108, "rd_code": "CY-CUT-OFF", "rd_caption": "CY CUT OFF", "rd_field": "mbl_cy_cutoff", "rd_sort_order": 535, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 109, "rd_code": "GATE-IN-DATE", "rd_caption": "GATE IN DATE", "rd_field": "mgate_in_date", "rd_sort_order": 540, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 110, "rd_code": "TRK-VESSEL-VOYAGE1", "rd_caption": "TRK VESSEL VOYAGE1", "rd_field": "trk_vessel_voyage1", "rd_sort_order": 545, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 111, "rd_code": "TRK-VESSEL-VOYAGE2", "rd_caption": "TRK VESSEL VOYAGE2", "rd_field": "trk_vessel_voyage2", "rd_sort_order": 550, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 112, "rd_code": "TRK-VESSEL-VOYAGE3", "rd_caption": "TRK VESSEL VOYAGE3", "rd_field": "trk_vessel_voyage3", "rd_sort_order": 555, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 113, "rd_code": "TS-OR-DIRECT", "rd_caption": "TS OR DIRECT", "rd_field": "ts_or_direct", "rd_sort_order": 560, "rd_col_width": 15, "rd_data_type": "S" }
      ];
    } else if (this.type == "AIR EXPORT") {
      this.CustomReportList = [
        { "rd_ctr": 1, "rd_code": "JOBNO", "rd_caption": "JOB#", "rd_field": "job_docno", "rd_sort_order": 1, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 2, "rd_code": "JOBDATE", "rd_caption": "JOB DATE", "rd_field": "job_date", "rd_sort_order": 5, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 3, "rd_code": "REFERENCE", "rd_caption": "REF#", "rd_field": "job_prefix", "rd_sort_order": 10, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 4, "rd_code": "SHIPPER", "rd_caption": "SHIPPER", "rd_field": "job_shipper", "rd_sort_order": 15, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 5, "rd_code": "CONSIGNEE", "rd_caption": "CONSIGNEE", "rd_field": "job_consignee", "rd_sort_order": 20, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 6, "rd_code": "INVOICE-NO", "rd_caption": "INVOICE-NO", "rd_field": "job_invoice_nos", "rd_sort_order": 25, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 7, "rd_code": "INVOICE-AMT", "rd_caption": "INVOICE-AMT", "rd_field": "job_invoice_amt", "rd_sort_order": 30, "rd_col_width": 15, "rd_data_type": "N-2" },
        { "rd_ctr": 8, "rd_code": "POL", "rd_caption": "POL", "rd_field": "job_pol", "rd_sort_order": 35, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 9, "rd_code": "POD", "rd_caption": "POD", "rd_field": "job_pod", "rd_sort_order": 40, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 10, "rd_code": "JOB-AGENT-CARRIER", "rd_caption": "JOB/AGENT/CARRIER", "rd_field": "job_liner_agent", "rd_sort_order": 45, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 11, "rd_code": "COMMODITY", "rd_caption": "COMMODITY", "rd_field": "job_commodity", "rd_sort_order": 50, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 12, "rd_code": "JOB-TYPE", "rd_caption": "JOB TYPE", "rd_field": "job_type", "rd_sort_order": 55, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 13, "rd_code": "NOMINATION", "rd_caption": "NOMINATION", "rd_field": "job_nomination", "rd_sort_order": 60, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 14, "rd_code": "TERMS", "rd_caption": "TERMS", "rd_field": "job_terms", "rd_sort_order": 65, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 15, "rd_code": "JOB-STATUS", "rd_caption": "JOB STATUS", "rd_field": "job_status", "rd_sort_order": 70, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 16, "rd_code": "SBILL-NO", "rd_caption": "SBILL-NO", "rd_field": "opr_sbill_no", "rd_sort_order": 75, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 17, "rd_code": "SBILL-DATE", "rd_caption": "SBILL-DATE", "rd_field": "opr_sbill_date", "rd_sort_order": 80, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 18, "rd_code": "CHA", "rd_caption": "CHA", "rd_field": "job_cha_name", "rd_sort_order": 85, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 19, "rd_code": "POFD", "rd_caption": "POFD", "rd_field": "job_pofd_name", "rd_sort_order": 90, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 20, "rd_code": "SALESMAN", "rd_caption": "SALESMAN", "rd_field": "salesman", "rd_sort_order": 95, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 21, "rd_code": "CARGO-RECEIVED-ON", "rd_caption": "CARGO-RECEIVED-ON", "rd_field": "opr_cargo_received_on", "rd_sort_order": 100, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 22, "rd_code": "CLEARED", "rd_caption": "CLEARED", "rd_field": "opr_cleared_date", "rd_sort_order": 105, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 23, "rd_code": "CHWT", "rd_caption": "CHWT", "rd_field": "job_chwt", "rd_sort_order": 110, "rd_col_width": 15, "rd_data_type": "N-3" },
        { "rd_ctr": 24, "rd_code": "GRWT", "rd_caption": "GRWT", "rd_field": "job_grwt", "rd_sort_order": 115, "rd_col_width": 15, "rd_data_type": "N-3" },
        { "rd_ctr": 25, "rd_code": "NTWT", "rd_caption": "NTWT", "rd_field": "job_ntwt", "rd_sort_order": 120, "rd_col_width": 15, "rd_data_type": "N-3" },
        { "rd_ctr": 26, "rd_code": "SINO", "rd_caption": "SI#", "rd_field": "hbl_no", "rd_sort_order": 125, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 27, "rd_code": "HOUSE", "rd_caption": "HOUSE", "rd_field": "hbl_bl_no", "rd_sort_order": 130, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 28, "rd_code": "HOUSE-DATE", "rd_caption": "HOUSE DATE", "rd_field": "hbl_date", "rd_sort_order": 135, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 29, "rd_code": "AGENT", "rd_caption": "AGENT", "rd_field": "job_agent_name", "rd_sort_order": 140, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 30, "rd_code": "MAWBKNO", "rd_caption": "MAWBK#", "rd_field": "mbl_no", "rd_sort_order": 145, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 31, "rd_code": "MASTER", "rd_caption": "MASTER", "rd_field": "mbl_bl_no", "rd_sort_order": 150, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 32, "rd_code": "MASTER-DATE", "rd_caption": "MASTER DATE", "rd_field": "mbl_date", "rd_sort_order": 155, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 33, "rd_code": "CARRIER", "rd_caption": "CARRIER", "rd_field": "liner_name", "rd_sort_order": 160, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 34, "rd_code": "MBL-CHWT", "rd_caption": "MBL-CHWT", "rd_field": "mbl_chwt", "rd_sort_order": 165, "rd_col_width": 15, "rd_data_type": "N-3" },
        { "rd_ctr": 35, "rd_code": "MBL-GRWT", "rd_caption": "MBL-GRWT", "rd_field": "mbl_grwt", "rd_sort_order": 170, "rd_col_width": 15, "rd_data_type": "N-3" },
        { "rd_ctr": 36, "rd_code": "FOLDER-NO", "rd_caption": "FOLDER-NO", "rd_field": "mbl_folder_no", "rd_sort_order": 175, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 37, "rd_code": "FOLDER-SENT", "rd_caption": "FOLDER-SENT", "rd_field": "mbl_folder_sent_date", "rd_sort_order": 180, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 38, "rd_code": "TOTAL-CARTONS", "rd_caption": "TOTAL CARTONS", "rd_field": "job_pkg", "rd_sort_order": 185, "rd_col_width": 15, "rd_data_type": "N-0" },
        { "rd_ctr": 39, "rd_code": "REMARKS", "rd_caption": "REMARKS", "rd_field": "job_remarks", "rd_sort_order": 190, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 40, "rd_code": "OUR-INVOICENO", "rd_caption": "OUR INVOICE#", "rd_field": "hbl_ar_invnos", "rd_sort_order": 195, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 41, "rd_code": "INV-AMOUNT", "rd_caption": "INV-AMOUNT", "rd_field": "hbl_ar_invamt", "rd_sort_order": 200, "rd_col_width": 15, "rd_data_type": "N-2" },
        { "rd_ctr": 42, "rd_code": "GST-AMOUNT", "rd_caption": "GST-AMOUNT", "rd_field": "hbl_ar_gstamt", "rd_sort_order": 205, "rd_col_width": 15, "rd_data_type": "N-2" },
        { "rd_ctr": 43, "rd_code": "CREATED-DATE", "rd_caption": "CREATED DATE", "rd_field": "rec_created_date", "rd_sort_order": 210, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 44, "rd_code": "PONOS", "rd_caption": "PO NOS", "rd_field": "job_po_nos", "rd_sort_order": 215, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 45, "rd_code": "CARGO-READY-DATE", "rd_caption": "CARGO READY DATE", "rd_field": "opr_cargo_ready_date", "rd_sort_order": 220, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 46, "rd_code": "CARGO-RECEIVED-AT", "rd_caption": "CARGO RECEIVED AT", "rd_field": "opr_cargo_received_at", "rd_sort_order": 225, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 47, "rd_code": "CLEARED-DATE", "rd_caption": "CLEARED ON", "rd_field": "opr_cleared_date", "rd_sort_order": 230, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 48, "rd_code": "STACKED-ON", "rd_caption": "STACKED ON", "rd_field": "opr_stacked_on", "rd_sort_order": 235, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 49, "rd_code": "PICKUP-LOCATION", "rd_caption": "PICKUP LOCATION", "rd_field": "opr_pickup_location", "rd_sort_order": 240, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 50, "rd_code": "SCHEDULED-PICKUP-DATE", "rd_caption": "SCHEDULED PICKUP DATE", "rd_field": "opr_scheduled_pickup_date", "rd_sort_order": 245, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 51, "rd_code": "ACTUAL-PICKUP-DATE", "rd_caption": "ACTUAL PICKUP DATE", "rd_field": "opr_actual_pickup_date", "rd_sort_order": 250, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 52, "rd_code": "VEHICLE-RELEASED-DATE", "rd_caption": "VEHICLE RELEASED DATE", "rd_field": "opr_vehicle_released_date", "rd_sort_order": 255, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 53, "rd_code": "DETENTION-DAYS", "rd_caption": "DETENTION DAYS", "rd_field": "opr_detention_days", "rd_sort_order": 260, "rd_col_width": 15, "rd_data_type": "N-0" },
        { "rd_ctr": 54, "rd_code": "VEHICLE-TYPE", "rd_caption": "VEHICLE TYPE", "rd_field": "opr_vehicle_type", "rd_sort_order": 265, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 55, "rd_code": "VEHICLE-NO", "rd_caption": "VEHICLE NO", "rd_field": "opr_vehicle_no", "rd_sort_order": 270, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 56, "rd_code": "TRANSPORTER-NAME", "rd_caption": "TRANSPORTER NAME", "rd_field": "opr_transporter_name", "rd_sort_order": 275, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 57, "rd_code": "EP-SENT-DATE", "rd_caption": "EP SENT DATE", "rd_field": "opr_ep_sent_date", "rd_sort_order": 280, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 58, "rd_code": "DRAWBACK-SLNO", "rd_caption": "DRAWBACK SLNO", "rd_field": "opr_drawback_slno", "rd_sort_order": 285, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 59, "rd_code": "DRAWBACK-DATE", "rd_caption": "DRAWBACK DATE", "rd_field": "opr_drawback_date", "rd_sort_order": 290, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 60, "rd_code": "DRAWBACK-AMOUNT", "rd_caption": "DRAWBACK AMOUNT", "rd_field": "opr_drawback_amt", "rd_sort_order": 295, "rd_col_width": 15, "rd_data_type": "N-2" },
        { "rd_ctr": 61, "rd_code": "EGM-NO", "rd_caption": "EGM NO", "rd_field": "opr_egmno", "rd_sort_order": 300, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 62, "rd_code": "EGM-DATE", "rd_caption": "EGM DATE", "rd_field": "opr_egmdt", "rd_sort_order": 305, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 63, "rd_code": "EGM-STATUS", "rd_caption": "EGM STATUS", "rd_field": "opr_egm_status", "rd_sort_order": 310, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 64, "rd_code": "POL-ATD", "rd_caption": "POL ATD", "rd_field": "pol_atd", "rd_sort_order": 315, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 65, "rd_code": "POD-ATA", "rd_caption": "POD ATA", "rd_field": "pod_ata", "rd_sort_order": 320, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 66, "rd_code": "POFD-ATA", "rd_caption": "POFD ATA", "rd_field": "pofd_ata", "rd_sort_order": 325, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 67, "rd_code": "TS1-PORT", "rd_caption": "TS1 PORT", "rd_field": "trk_ts1_port_name", "rd_sort_order": 330, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 68, "rd_code": "TS1-VESSEL", "rd_caption": "TS1 VESSEL", "rd_field": "trk_ts1_vessel_name", "rd_sort_order": 335, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 69, "rd_code": "TS1-VOYAGE", "rd_caption": "TS1 VOYAGE", "rd_field": "trk_ts1_voyage", "rd_sort_order": 340, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 70, "rd_code": "TS1-ETD", "rd_caption": "TS1 ETD", "rd_field": "trk_ts1_etd", "rd_sort_order": 345, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 71, "rd_code": "TS1-ETA", "rd_caption": "TS1 ETA", "rd_field": "trk_ts1_eta", "rd_sort_order": 350, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 72, "rd_code": "TS2-PORT", "rd_caption": "TS2 PORT", "rd_field": "trk_ts2_port_name", "rd_sort_order": 355, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 73, "rd_code": "TS2-VESSEL", "rd_caption": "TS2 VESSEL", "rd_field": "trk_ts2_vessel_name", "rd_sort_order": 360, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 74, "rd_code": "TS2-VOYAGE", "rd_caption": "TS2 VOYAGE", "rd_field": "trk_ts2_voyage", "rd_sort_order": 365, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 75, "rd_code": "TS2-ETD", "rd_caption": "TS2 ETD", "rd_field": "trk_ts2_etd", "rd_sort_order": 370, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 76, "rd_code": "TS2-ETA", "rd_caption": "TS2 ETA", "rd_field": "trk_ts2_eta", "rd_sort_order": 375, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 77, "rd_code": "TS3-PORT", "rd_caption": "TS3 PORT", "rd_field": "trk_ts3_port_name", "rd_sort_order": 380, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 78, "rd_code": "TS3-VESSEL", "rd_caption": "TS3 VESSEL", "rd_field": "trk_ts3_vessel_name", "rd_sort_order": 385, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 79, "rd_code": "TS3-VOYAGE", "rd_caption": "TS3 VOYAGE", "rd_field": "trk_ts3_voyage", "rd_sort_order": 390, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 80, "rd_code": "TS3-ETD", "rd_caption": "TS3 ETD", "rd_field": "trk_ts3_etd", "rd_sort_order": 395, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 81, "rd_code": "TS3-ETA", "rd_caption": "TS3 ETA", "rd_field": "trk_ts3_eta", "rd_sort_order": 400, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 82, "rd_code": "POL-ETD1", "rd_caption": "POL ETD1", "rd_field": "trk_pol_etd1", "rd_sort_order": 405, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 83, "rd_code": "POL-ETD2", "rd_caption": "POL ETD2", "rd_field": "trk_pol_etd2", "rd_sort_order": 410, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 84, "rd_code": "POL-ETD3", "rd_caption": "POL ETD3", "rd_field": "trk_pol_etd3", "rd_sort_order": 415, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 85, "rd_code": "POD-ETA1", "rd_caption": "POD ETA1", "rd_field": "trk_pod_eta1", "rd_sort_order": 420, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 86, "rd_code": "POD-ETA2", "rd_caption": "POD ETA2", "rd_field": "trk_pod_eta2", "rd_sort_order": 425, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 87, "rd_code": "POD-ETA3", "rd_caption": "POD ETA3", "rd_field": "trk_pod_eta3", "rd_sort_order": 430, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 88, "rd_code": "POFD-ETA1", "rd_caption": "POFD ETA1", "rd_field": "trk_pofd_eta1", "rd_sort_order": 435, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 89, "rd_code": "POFD-ETA2", "rd_caption": "POFD ETA2", "rd_field": "trk_pofd_eta2", "rd_sort_order": 440, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 90, "rd_code": "POFD-ETA3", "rd_caption": "POFD ETA3", "rd_field": "trk_pofd_eta3", "rd_sort_order": 445, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 91, "rd_code": "BRANCH", "rd_caption": "BRANCH", "rd_field": "branch", "rd_sort_order": 450, "rd_col_width": 15, "rd_data_type": "S" }
      ];
    } else if (this.type == "SEA IMPORT" || this.type == "AIR IMPORT") {

      this.CustomReportList = [
        { "rd_ctr": 1, "rd_code": "MASTER-DATE", "rd_caption": "MASTER DATE", "rd_field": "mbl_date", "rd_sort_order": 1, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 2, "rd_code": "MBLBKNO", "rd_caption": "MBLBK#", "rd_field": "mbl_no", "rd_sort_order": 5, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 3, "rd_code": "MASTERNO", "rd_caption": "MASTER#", "rd_field": "mbl_bl_no", "rd_sort_order": 10, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 4, "rd_code": "SINO", "rd_caption": "SI#", "rd_field": "hbl_no", "rd_sort_order": 15, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 5, "rd_code": "HOUSE-DATE", "rd_caption": "HOUSE DATE", "rd_field": "hbl_date", "rd_sort_order": 20, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 6, "rd_code": "HOUSENO", "rd_caption": "HOUSE#", "rd_field": "hbl_bl_no", "rd_sort_order": 25, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 7, "rd_code": "EXPORTER", "rd_caption": "EXPORTER", "rd_field": "hbl_exporter_name", "rd_sort_order": 30, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 8, "rd_code": "IMPORTER", "rd_caption": "IMPORTER", "rd_field": "hbl_importer_name", "rd_sort_order": 35, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 9, "rd_code": "AGENT", "rd_caption": "AGENT", "rd_field": "hbl_agent_name", "rd_sort_order": 40, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 10, "rd_code": "SALESMAN", "rd_caption": "SALESMAN", "rd_field": "salesman", "rd_sort_order": 45, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 11, "rd_code": "INVOICE-NO", "rd_caption": "INVOICE-NO", "rd_field": "hbl_invoice_nos", "rd_sort_order": 50, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 12, "rd_code": "PKG", "rd_caption": "PKG", "rd_field": "hbl_pkg", "rd_sort_order": 55, "rd_col_width": 15, "rd_data_type": "N-0" },
        { "rd_ctr": 13, "rd_code": "CBM", "rd_caption": "CBM", "rd_field": "hbl_cbm", "rd_sort_order": 60, "rd_col_width": 15, "rd_data_type": "N-3" },
        { "rd_ctr": 14, "rd_code": "GRWT", "rd_caption": "GRWT", "rd_field": "hbl_grwt", "rd_sort_order": 65, "rd_col_width": 15, "rd_data_type": "N-3" },
        { "rd_ctr": 15, "rd_code": "CHWT", "rd_caption": "CHWT", "rd_field": "hbl_chwt", "rd_sort_order": 70, "rd_col_width": 15, "rd_data_type": "N-3" },
        { "rd_ctr": 16, "rd_code": "POL", "rd_caption": "POL", "rd_field": "mbl_pol", "rd_sort_order": 75, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 17, "rd_code": "POD", "rd_caption": "POD", "rd_field": "mbl_pod", "rd_sort_order": 80, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 18, "rd_code": "POD-ETA", "rd_caption": "POD-ETA", "rd_field": "hbl_pod_eta", "rd_sort_order": 85, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 19, "rd_code": "BE-TYPE", "rd_caption": "BE TYPE", "rd_field": "impj_be_type", "rd_sort_order": 90, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 20, "rd_code": "NOMINATION", "rd_caption": "NOMINATION", "rd_field": "job_nomination", "rd_sort_order": 95, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 21, "rd_code": "DOCS-REQUIRED", "rd_caption": "DOCS-REQUIRED", "rd_field": "impj_docs_required", "rd_sort_order": 100, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 22, "rd_code": "EDI-CHECKLIST-SENT", "rd_caption": "EDI-CHECKLIST-SENT", "rd_field": "impj_edichklst_sent_on", "rd_sort_order": 105, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 23, "rd_code": "BE-NO", "rd_caption": "BE.NO", "rd_field": "hbl_beno", "rd_sort_order": 110, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 24, "rd_code": "BE-DATE", "rd_caption": "BE.DATE", "rd_field": "hbl_bedate", "rd_sort_order": 115, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 25, "rd_code": "WAYBILL-NO", "rd_caption": "WAYBILL.NO", "rd_field": "impj_waybill_no", "rd_sort_order": 120, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 26, "rd_code": "WAYBILL-DATE", "rd_caption": "WAYBILL.DATE", "rd_field": "impj_waybill_date", "rd_sort_order": 125, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 27, "rd_code": "CURRENT-STATUS", "rd_caption": "CURRENT STATUS", "rd_field": "impj_status", "rd_sort_order": 130, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 28, "rd_code": "CURRENT-STATUS-DATE", "rd_caption": "CURRENT STATUS DATE", "rd_field": "impj_status_date", "rd_sort_order": 135, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 29, "rd_code": "CLEARED-DATE", "rd_caption": "CLEARED DATE", "rd_field": "impj_cleared_on", "rd_sort_order": 140, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 30, "rd_code": "REMARKS", "rd_caption": "REMARKS", "rd_field": "hbl_remarks", "rd_sort_order": 145, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 31, "rd_code": "CARRIER", "rd_caption": "CARRIER", "rd_field": "liner_name", "rd_sort_order": 150, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 32, "rd_code": "DOC-RECEIVED", "rd_caption": "DOC-RECEIVED", "rd_field": "impj_doc_recvd_date", "rd_sort_order": 155, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 33, "rd_code": "DOC-SENT", "rd_caption": "DOC-SENT", "rd_field": "impj_doc_send_date", "rd_sort_order": 160, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 34, "rd_code": "OUR-INVOICE#", "rd_caption": "OUR INVOICE#", "rd_field": "hbl_ar_invnos", "rd_sort_order": 165, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 35, "rd_code": "AMOUNT", "rd_caption": "AMOUNT", "rd_field": "hbl_ar_invamt", "rd_sort_order": 170, "rd_col_width": 15, "rd_data_type": "N-2" },
        { "rd_ctr": 36, "rd_code": "GST-AMOUNT", "rd_caption": "GST-AMOUNT", "rd_field": "hbl_ar_gstamt", "rd_sort_order": 175, "rd_col_width": 15, "rd_data_type": "N-2" },
        { "rd_ctr": 37, "rd_code": "CHA", "rd_caption": "CHA", "rd_field": "cha_name", "rd_sort_order": 180, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 38, "rd_code": "JOB-STATUS", "rd_caption": "JOB-STATUS", "rd_field": "job_status", "rd_sort_order": 185, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 39, "rd_code": "CREATED-DATE", "rd_caption": "CREATED DATE", "rd_field": "rec_created_date", "rd_sort_order": 190, "rd_col_width": 15, "rd_data_type": "D" },
        { "rd_ctr": 40, "rd_code": "CONTAINER", "rd_caption": "CONTAINER", "rd_field": "hbl_book_cntr", "rd_sort_order": 195, "rd_col_width": 15, "rd_data_type": "S" },
        { "rd_ctr": 41, "rd_code": "BRANCH", "rd_caption": "BRANCH", "rd_field": "branch", "rd_sort_order": 200, "rd_col_width": 15, "rd_data_type": "S" }
      ];
    }

  }

  Loadtplist() {

    let SearchData = {
      type: 'TPLIST',
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      tp_code: this.gs.globalVariables.tp_code,
      tp_name: this.gs.globalVariables.tp_name,
      istp: this.gs.globalVariables.istp
    };

    SearchData.comp_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.ms.state.ErrorMessage = '';
    this.loading = true;
    this.ms.Loadtplist(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.TpList = response.tplist;
        if (!this.gs.isBlank(this.TpList)) {
          if (this.TpList.length > 0)
            this.ms.state.tp_code = this.TpList[0].user_tp_code;
        }
      },
        error => {
          this.loading = false;
          this.ms.state.ErrorMessage = this.gs.getError(error);
          alert(this.ms.state.ErrorMessage);
        });

  }

  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
    this.ms.state.ErrorMessage = '';
    if (action == 'LIST') {
      this.ms.state.mode = '';
      this.ms.state.pkid = '';
      this.ms.state.currentTab = 'LIST';
    }
  }

  ResetControls() {
    this.disableSave = true;
    if (!this.menu_record)
      return;

    if (this.menu_record.rights_admin)
      this.disableSave = false;
    if (this.ms.state.mode == "ADD" && this.menu_record.rights_add)
      this.disableSave = false;
    if (this.ms.state.mode == "EDIT" && this.menu_record.rights_edit)
      this.disableSave = false;

    return this.disableSave;
  }

  // Query List Data
  List(_type: string, mailsent: any = null) {

    let SearchData = {
      type: '',
      rec_category: '',
      pkid: '',
      report_folder: '',
      company_code: '',
      branch_code: '',
      branch_name: '',
      year_code: '',
      searchstring: '',
      from_date: '',
      to_date: '',
      type_date: '',
      job_type: '',
      shipper_id: '',
      shipper_name: '',
      consignee_id: '',
      consignee_name: '',
      agent_id: '',
      agent_code: '',
      agent_name: '',
      carrier_id: '',
      carrier_code: '',
      carrier_name: '',
      pol_id: '',
      pol_code: '',
      pol_name: '',
      pod_id: '',
      pod_code: '',
      pod_name: '',
      all: false,
      format_type: '',
      bookingrpt: false,
      filter_date_type: '',
      sman_id: '',
      sman_code: '',
      sman_name: '',
      tp_code: this.gs.globalVariables.tp_code
    };

    this.ms.state.selectedRowIndex = 0;
    this.ms.state.all_br_list = this.ms.state.all;
    this.ms.state.search_bookingrpt = this.ms.state.bookingrpt;
    this.ms.state.ErrorMessage = '';
    //if (this.from_date.trim().length <= 0) {
    //  this.ErrorMessage = "From Date Cannot Be Blank";
    //  return;
    //}
    //if (this.to_date.trim().length <= 0) {
    //  this.ErrorMessage = "To Date Cannot Be Blank";
    //  return;
    //}

    if (this.bSman) {
      if (this.gs.isBlank(this.ms.state.sman_id)) {
        this.ms.state.ErrorMessage = "Salesperson Cannot Be Blank";
        alert(this.ms.state.ErrorMessage);
        return;
      }
    }

    if (this.ms.state.format_type == "STATUS") {
      if (this.ms.state.from_date.trim().length <= 0)
        this.ms.state.from_date = this.gs.globalVariables.year_start_date;
      if (this.ms.state.to_date.trim().length <= 0)
        this.ms.state.to_date = this.gs.globalVariables.year_end_date;
    }

    this.loading = true;
    this.ms.state.pkid = this.gs.getGuid();
    SearchData.pkid = this.ms.state.pkid;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;

    if (this.bCompany) {
      SearchData.branch_code = this.ms.state.branch_code;
      SearchData.branch_name = this.ms.state.branch_name;
    }
    else {
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.branch_name = this.gs.globalVariables.branch_name;

    }
    SearchData.year_code = this.gs.globalVariables.year_code;
    SearchData.searchstring = this.ms.state.searchstring.toUpperCase();
    SearchData.type = _type;
    SearchData.rec_category = this.rec_category;
    SearchData.type_date = this.ms.state.type_date;
    SearchData.from_date = this.ms.state.from_date;
    SearchData.to_date = this.ms.state.to_date;
    SearchData.job_type = this.ms.state.job_type;
    SearchData.shipper_id = this.ms.state.shipper_id;
    SearchData.shipper_name = this.ms.state.shipper_name;
    SearchData.consignee_id = this.ms.state.consignee_id;
    SearchData.consignee_name = this.ms.state.consignee_name;
    SearchData.agent_id = this.ms.state.agent_id;
    SearchData.agent_name = this.ms.state.agent_name;
    SearchData.agent_code = this.ms.state.agent_code;
    SearchData.carrier_id = this.ms.state.carrier_id;
    SearchData.carrier_code = this.ms.state.carrier_code;
    SearchData.carrier_name = this.ms.state.carrier_name;
    SearchData.pol_id = this.ms.state.pol_id;
    SearchData.pol_code = this.ms.state.pol_code;
    SearchData.pol_name = this.ms.state.pol_name;
    SearchData.pod_id = this.ms.state.pod_id;
    SearchData.pod_code = this.ms.state.pod_code;
    SearchData.pod_name = this.ms.state.pod_name;
    SearchData.all = this.ms.state.all;
    SearchData.format_type = this.ms.state.format_type;
    SearchData.bookingrpt = this.ms.state.bookingrpt;
    SearchData.filter_date_type = this.ms.state.filter_date_type;
    SearchData.sman_id = this.ms.state.sman_id;
    SearchData.tp_code = this.ms.state.tp_code;
    this.ms.state.ErrorMessage = '';
    this.ms.DsrList(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else if (_type == 'MAIL') {
          this.ms.state.AttachList = new Array<any>();
          this.ms.state.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname, filesize: response.filesize });
          this.ms.state.sSubject = response.subject;
          this.ms.state.sMsg = response.message;
          this.ms.state.sTo_ids = response.toids;
          this.open(mailsent);
        } else {
          this.ms.state.RecordList = response.list;
          this.ms.state.feildList = response.feildlist;
          if (!this.gs.isBlank(this.ms.state.feildList))
            this.setColFormat();
          this.restoreRowPosition();
        }

      },
        error => {
          this.loading = false;
          this.ms.state.RecordList = [];
          this.ms.state.ErrorMessage = this.gs.getError(error);
          alert(this.ms.state.ErrorMessage);
        });
  }

  setColFormat() {
    this.ms.state.feildList.forEach(col => {
      // number format
      col.rd_isright = false;
      if (col.rd_data_type && col.rd_data_type.indexOf('N-') !== -1) {
        col.rd_isright = true;
        const d = col.rd_data_type.split('-')[1];
        col.rd_format = '1.' + d + '-' + d;
      } else {
        col.rd_format = '';
      }
    });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  OnChange(field: string) {
    let _format: string = "GENERAL";
    if (field == "all" || field == "bookingrpt")
      this.ms.state.RecordList = [];
    if (field == "tp_code") {
      if (this.ms.state.tp_code == "NA")
        _format = "GENERAL";
      else
        _format = this.getTpname(this.ms.state.tp_code);
      if (!this.gs.isBlank(this._CustRpt)) {
        this._CustRpt.setFormat(_format);
      }
    }
  }

  getTpname(_tpcode: string) {
    let _str = "GENERAL";
    if (this.TpList != null) {
      var REC = this.TpList.find(rec => rec.user_tp_code == _tpcode);
      if (REC != null) {
        _str = REC.user_tp_name;
      }
    }
    return _str;
  }
  showRemarks(rec: Dsr) {
    if (rec.job_pkid == null)
      return;
    if (rec.job_pkid !== '') {
      rec.displayed = !rec.displayed;
    }
  }

  Close() {
    this.gs.ClosePage('home');
  }

  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }

  mailcallbackevent(params: any) {
    if (params.action == "MAIL") {
      this.MailVolumeReport(params.brcodes)
    }
  }


  MailVolumeReport(sbr_code: string) {

    if (this.ms.state.from_date.trim().length <= 0) {
      this.ms.state.ErrorMessage = "From Date Cannot Be Blank";
      return;
    }
    if (this.ms.state.to_date.trim().length <= 0) {
      this.ms.state.ErrorMessage = "To Date Cannot Be Blank";
      return;
    }

    let msg = "Do you want to Send Volume Report ";
    if (!this.gs.isBlank(this.from_date_ctrl) && !this.gs.isBlank(this.to_date_ctrl))
      msg += "from " + this.from_date_ctrl.GetDisplayDate() + " to " + this.to_date_ctrl.GetDisplayDate();
    if (!confirm(msg)) {
      return;
    }

    let SearchData2 = {
      mailtype: this.type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: sbr_code,
      from_date: this.ms.state.from_date,
      to_date: this.ms.state.to_date,
      report_folder: this.gs.globalVariables.report_folder,
      user_code: this.gs.globalVariables.user_code,
      user_pkid: this.gs.globalVariables.user_pkid
    };

    this.ms.state.ErrorMessage = '';
    this.ms.VolumeReport(SearchData2)
      .subscribe(response => {
        if (response.mailmsg.length > 0)
          alert(response.mailmsg);
      },
        error => {
          this.ms.state.ErrorMessage = this.gs.getError(error);
        });
  }

  customreportcallbackevent(params: any) {
    this.ms.state.format_type = params.format;
  }

  EditHouse() {
    if (this.gs.isBlank(this.ms.state.hbl_id)) {
      alert("Shipping Instruction not found");
      return;
    }

    if (this.ms.state.branch_code != this.gs.globalVariables.branch_code) {
      alert("Cannot Edit details from another branch");
      return;
    }

    let param = {
      menuid: this.hbl_menuid,
      type: this.rec_category,
      pkid: this.ms.state.hbl_id
    }
    if (this.rec_category == "SEA EXPORT" || this.rec_category == "AIR EXPORT")
      this.gs.Naviagete("operations/hblseaair", JSON.stringify(param));
    else
      this.gs.Naviagete("operations/imphblseaair", JSON.stringify(param));
  }

  getSwhere(_type: string) {
    let _retstr = "";

    if (_type == "AGENT")
      _retstr = " CUST_IS_AGENT = 'Y' ";
    else if (_type == "SHIPPER")
      _retstr = " CUST_IS_SHIPPER = 'Y' ";
    else if (_type == "CONSIGNEE")
      _retstr = " CUST_IS_CONSIGNEE = 'Y' ";

    return _retstr;
  }

  setSelectedIndex(_rec: Dsr, _i: number) {
    this.ms.state.selectedRowIndex = _i;
    this.ms.state.job_id = _rec.job_pkid;
    this.ms.state.hbl_id = _rec.hbl_pkid;
    this.ms.state.mbl_id = _rec.mbl_pkid;
  }

}
