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
//EDIT-AJITH-21-10-2021
//EDIT-AJITH-22-10-2021

@Component({
  selector: 'app-dsr',
  templateUrl: './dsr.component.html',
  providers: [RepService]
})

export class DsrComponent {
  title = 'Dsr Report'

  @ViewChild('_from_date') private from_date_ctrl: DateComponent;
  @ViewChild('_to_date') private to_date_ctrl: DateComponent;

  @Input() menuid: string = '';
  @Input() type: string = '';

  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;
  selectedRowIndex = 0;

  ErrorMessage = "";
  mode = '';
  pkid = '';
  modal: any;
  format_type: string = "";
  rec_category: string = "";
  filter_date_type: string = 'JOB';
  type_date: string = '';
  from_date: string = '';
  to_date: string = '';
  branch_name: string;
  branch_code: string;
  job_type: string;
  shipper_id: string;
  shipper_name: string;
  consignee_id: string;
  consignee_name: string;
  agent_id: string;
  agent_code: string;
  agent_name: string;

  carrier_id: string;
  carrier_code: string;
  carrier_name: string;
  carriertype: string;
  pol_id: string;
  pol_code: string;
  pol_name: string;
  pod_id: string;
  pod_code: string;
  pod_name: string;
  porttype: string;

  search_bookingrpt: boolean = false;
  bookingrpt: boolean = false;
  bExcel = false;
  disableSave = true;
  bCompany = false;
  all: boolean = false;
  loading = false;
  bAdmin = false;
  bEmail = false;
  currentTab = 'LIST';
  searchstring = '';

  SearchData = {
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
    filter_date_type: ''
  };

  sSubject: string = '';
  sMsg: string = '';
  sHtml: string = '';
  sTo_ids: string = '';
  AttachList: any[] = [];
  CustomReportList: CustomReportD[] = [];
  // Array For Displaying List
  RecordList: Dsr[] = [];
  // Single Record for add/edit/view details
  Record: Dsr = new Dsr;

  BRRECORD: SearchTable = new SearchTable();
  EXPRECORD: SearchTable = new SearchTable();
  IMPRECORD: SearchTable = new SearchTable();
  AGENTRECORD: SearchTable = new SearchTable();
  CARRIERRECORD: SearchTable = new SearchTable();
  POLRECORD: SearchTable = new SearchTable();
  PODRECORD: SearchTable = new SearchTable();

  constructor(
    private modalService: NgbModal,
    private mainService: RepService,
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
  }

  InitComponent() {
    this.bExcel = false;
    this.bCompany = false;
    this.bAdmin = false;
    this.bEmail = false;
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
    }
    if (this.type.toString() == "SEA EXPORT" || this.type.toString() == "SEA IMPORT") {
      this.porttype = "SEA PORT";
      this.carriertype = "SEA CARRIER";
    }
    else {
      this.porttype = "AIR PORT";
      this.carriertype = "AIR CARRIER";
    }

    this.Init();
    this.initLov();
    this.LoadCombo();
  }

  Init() {

    this.type_date = "DATE";
    this.filter_date_type = "JOB";
    this.job_type = "ALL";
    this.RecordList = null;
    this.branch_code = this.gs.globalVariables.branch_code;
    this.branch_name = this.gs.globalVariables.branch_name;
    this.from_date = this.gs.defaultValues.monthbegindate;
    this.to_date = this.gs.defaultValues.today;
    this.EXPRECORD.id = '';
    this.IMPRECORD.id = '';
    this.shipper_id = '';
    this.shipper_name = '';
    this.consignee_id = '';
    this.consignee_name = '';
    this.agent_id = '';
    this.agent_code = '';
    this.agent_name = '';
    this.carrier_id = '';
    this.carrier_code = '';
    this.carrier_name = '';
    this.pol_id = '';
    this.pol_code = '';
    this.pol_name = '';
    this.pod_id = '';
    this.pod_code = '';
    this.pod_name = '';
    this.format_type = 'GENERAL';
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  initLov(caption: string = '') {

    this.BRRECORD = new SearchTable();
    this.BRRECORD.controlname = "BRANCH";
    this.BRRECORD.displaycolumn = "CODE";
    this.BRRECORD.type = "BRANCH";
    this.BRRECORD.id = "";
    this.BRRECORD.code = this.gs.globalVariables.branch_code;


    this.EXPRECORD = new SearchTable();
    this.EXPRECORD.controlname = "SHIPPER";
    this.EXPRECORD.displaycolumn = "NAME";
    this.EXPRECORD.type = "CUSTOMER";
    this.EXPRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
    this.EXPRECORD.id = "";
    this.EXPRECORD.code = "";
    this.EXPRECORD.name = "";
    this.EXPRECORD.parentid = "";


    this.IMPRECORD = new SearchTable();
    this.IMPRECORD.controlname = "CONSIGNEE";
    this.IMPRECORD.displaycolumn = "NAME";
    this.IMPRECORD.type = "CUSTOMER";
    this.IMPRECORD.where = " CUST_IS_CONSIGNEE = 'Y' ";
    this.IMPRECORD.id = "";
    this.IMPRECORD.code = "";
    this.IMPRECORD.name = "";
    this.IMPRECORD.parentid = "";


    this.AGENTRECORD = new SearchTable();
    this.AGENTRECORD.controlname = "AGENT";
    this.AGENTRECORD.where = " CUST_IS_AGENT = 'Y' ";
    this.AGENTRECORD.displaycolumn = "NAME";
    this.AGENTRECORD.type = "CUSTOMER";
    this.AGENTRECORD.id = "";
    this.AGENTRECORD.code = "";
    this.AGENTRECORD.name = "";

    this.CARRIERRECORD = new SearchTable();
    this.CARRIERRECORD.controlname = "CARRIER";
    this.CARRIERRECORD.displaycolumn = "NAME";
    this.CARRIERRECORD.type = this.carriertype;
    this.CARRIERRECORD.id = "";
    this.CARRIERRECORD.code = "";
    this.CARRIERRECORD.name = "";

    this.POLRECORD = new SearchTable();
    this.POLRECORD.controlname = "POL";
    this.POLRECORD.displaycolumn = "NAME";
    this.POLRECORD.type = this.porttype;
    this.POLRECORD.id = "";
    this.POLRECORD.code = "";
    this.POLRECORD.name = "";


    this.PODRECORD = new SearchTable();
    this.PODRECORD.controlname = "POD";
    this.PODRECORD.displaycolumn = "NAME";
    this.PODRECORD.type = this.porttype;
    this.PODRECORD.id = "";
    this.PODRECORD.code = "";
    this.PODRECORD.name = "";

  }

  LovSelected(_Record: SearchTable) {
    // Company Settings
    if (_Record.controlname == "BRANCH") {
      this.branch_code = _Record.code;
      this.branch_name = _Record.name;
      this.shipper_id = '';
      this.consignee_id = '';
    }
    if (_Record.controlname == "SHIPPER") {
      this.shipper_id = _Record.id;
      this.shipper_name = _Record.name;
    }
    if (_Record.controlname == "CONSIGNEE") {
      this.consignee_id = _Record.id;
      this.consignee_name = _Record.name;
    }
    if (_Record.controlname == "AGENT") {
      this.agent_id = _Record.id;
      this.agent_code = _Record.code;
      this.agent_name = _Record.name;
    }
    if (_Record.controlname == "CARRIER") {
      this.carrier_id = _Record.id;
      this.carrier_code = _Record.code;
      this.carrier_name = _Record.name;
    }
    if (_Record.controlname == "POL") {
      this.pol_id = _Record.id;
      this.pol_code = _Record.code;
      this.pol_name = _Record.name;
    }
    if (_Record.controlname == "POD") {
      this.pod_id = _Record.id;
      this.pod_code = _Record.code;
      this.pod_name = _Record.name;
    }

  }
  LoadCombo() {
    this.CustomReportList = new Array<CustomReportD>();
    this.AddToCustomReport(1, "JOB#", "job_docno");
    this.AddToCustomReport(2, "DATE", "job_date");
    this.AddToCustomReport(3, "REF#", "job_prefix");
    this.AddToCustomReport(4, "SHIPPER", "job_shipper");
    this.AddToCustomReport(5, "CONSIGNEE", "job_consignee");
    this.AddToCustomReport(6, "INV-NO", "job_invoice_nos");
    this.AddToCustomReport(7, "POL", "job_pol");
    this.AddToCustomReport(8, "POD", "job_pod");
    this.AddToCustomReport(9, "JOB/AGENT/CARRIER", "job_liner_agent");
    this.AddToCustomReport(10, "JOB/CNTR", "job_cntr");
    this.AddToCustomReport(11, "COMMODITY", "job_commodity");
    this.AddToCustomReport(12, "SMAN", "salesman");
    this.AddToCustomReport(13, "TYPE", "job_type");
    this.AddToCustomReport(14, "NOMINATION", "job_nomination");
    this.AddToCustomReport(15, "TERMS", "job_terms");
    this.AddToCustomReport(16, "STATUS", "job_status");
    this.AddToCustomReport(17, "SBILL-NO", "opr_sbill_no");
    this.AddToCustomReport(18, "DATE", "opr_sbill_date");
    this.AddToCustomReport(19, "CHA", "job_cha_name");
    this.AddToCustomReport(20, "E/P-RECEIVED-ON", "opr_ep_rec_date");
    this.AddToCustomReport(21, "SI#", "hbl_no");
    this.AddToCustomReport(22, "HBL-NO", "hbl_bl_no");
    this.AddToCustomReport(23, "AGENT", "job_agent_name");
    this.AddToCustomReport(24, "MSL#", "mbl_no");
    this.AddToCustomReport(25, "MBL-NO", "mbl_bl_no");
    this.AddToCustomReport(26, "CBM", "job_cbm");
    this.AddToCustomReport(27, "PKG", "job_pkg");
    this.AddToCustomReport(28, "PCS", "job_pcs");
    this.AddToCustomReport(29, "NTWT", "job_ntwt");
    this.AddToCustomReport(30, "GRWT", "job_grwt");
    this.AddToCustomReport(31, "CARRIER", "liner_name");
    this.AddToCustomReport(32, "CARGO-RECEIVED-ON", "opr_cargo_received_on");
    this.AddToCustomReport(33, "VESSEL", "mbl_vessel_name");
    this.AddToCustomReport(34, "VESSEL-NO", "mbl_vessel_no");
    this.AddToCustomReport(35, "STUFFED-AT", "opr_stuffed_at");
    this.AddToCustomReport(36, "STUFFED-ON", "opr_stuffed_on");
    this.AddToCustomReport(37, "CNTR", "hbl_book_cntr");
    this.AddToCustomReport(38, "SOB", "mbl_pol_etd");
    this.AddToCustomReport(39, "DESTINATION-ETA", "mbl_pofd_eta");
    this.AddToCustomReport(40, "REMARKS", "job_remarks");
    this.AddToCustomReport(41, "OUR INVOICE#", "hbl_ar_invnos");
    this.AddToCustomReport(42, "AMOUNT", "hbl_ar_invamt");
    this.AddToCustomReport(43, "GST-AMOUNT", "hbl_ar_gstamt");
    this.AddToCustomReport(44, "CREATED", "rec_created_date");

  }

  AddToCustomReport(_ctr: number, _caption: string, _filed: string) {
    let _rec = new CustomReportD();
    _rec.rd_pkid = this.gs.getGuid();
    _rec.rd_ctr = _ctr;
    _rec.rd_caption = _caption;
    _rec.rd_field = _filed;
    _rec.rd_selected = true;
    this.CustomReportList.push(_rec);
  }

  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
    this.ErrorMessage = '';
    if (action == 'LIST') {
      this.mode = '';
      this.pkid = '';
      this.currentTab = 'LIST';
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
  List(_type: string, mailsent: any = null) {

    this.search_bookingrpt = this.bookingrpt;
    this.ErrorMessage = '';
    //if (this.from_date.trim().length <= 0) {
    //  this.ErrorMessage = "From Date Cannot Be Blank";
    //  return;
    //}
    //if (this.to_date.trim().length <= 0) {
    //  this.ErrorMessage = "To Date Cannot Be Blank";
    //  return;
    //}

    if (this.format_type == "STATUS") {
      if (this.from_date.trim().length <= 0)
        this.from_date = this.gs.globalVariables.year_start_date;
      if (this.to_date.trim().length <= 0)
        this.to_date = this.gs.globalVariables.year_end_date;
    }

    this.loading = true;
    this.pkid = this.gs.getGuid();
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;

    if (this.bCompany) {
      this.SearchData.branch_code = this.branch_code;
      this.SearchData.branch_name = this.branch_name;
    }
    else {
      this.SearchData.branch_code = this.gs.globalVariables.branch_code;
      this.SearchData.branch_name = this.gs.globalVariables.branch_name;

    }
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.searchstring.toUpperCase();
    this.SearchData.type = _type;
    this.SearchData.rec_category = this.rec_category;
    this.SearchData.type_date = this.type_date;
    this.SearchData.from_date = this.from_date;
    this.SearchData.to_date = this.to_date;
    this.SearchData.job_type = this.job_type;
    this.SearchData.shipper_id = this.shipper_id;
    this.SearchData.shipper_name = this.shipper_name;
    this.SearchData.consignee_id = this.consignee_id;
    this.SearchData.consignee_name = this.consignee_name;
    this.SearchData.agent_id = this.agent_id;
    this.SearchData.agent_name = this.agent_name;
    this.SearchData.agent_code = this.agent_code;
    this.SearchData.carrier_id = this.carrier_id;
    this.SearchData.carrier_code = this.carrier_code;
    this.SearchData.carrier_name = this.carrier_name;
    this.SearchData.pol_id = this.pol_id;
    this.SearchData.pol_code = this.pol_code;
    this.SearchData.pol_name = this.pol_name;
    this.SearchData.pod_id = this.pod_id;
    this.SearchData.pod_code = this.pod_code;
    this.SearchData.pod_name = this.pod_name;
    this.SearchData.all = this.all;
    this.SearchData.format_type = this.format_type;
    this.SearchData.bookingrpt = this.bookingrpt;
    this.SearchData.filter_date_type = this.filter_date_type;
    this.ErrorMessage = '';
    this.mainService.DsrList(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else if (_type == 'MAIL') {
          this.AttachList = new Array<any>();
          this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname, filesize: response.filesize });
          this.sSubject = response.subject;
          this.sMsg = response.message;
          this.sTo_ids = response.toids;
          this.open(mailsent);
        } {
          this.RecordList = response.list;
        }
      },
        error => {
          this.loading = false;
          this.RecordList = null;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }
  OnChange(field: string) {
    this.RecordList = null;

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
    this.modal = this.modalService.open(content);
  }

  mailcallbackevent(params: any) {
    if (params.action == "MAIL") {
      this.MailVolumeReport(params.brcodes)
    }
  }


  MailVolumeReport(sbr_code: string) {

    if (this.from_date.trim().length <= 0) {
      this.ErrorMessage = "From Date Cannot Be Blank";
      return;
    }
    if (this.to_date.trim().length <= 0) {
      this.ErrorMessage = "To Date Cannot Be Blank";
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
      from_date: this.from_date,
      to_date: this.to_date,
      report_folder: this.gs.globalVariables.report_folder,
      user_code: this.gs.globalVariables.user_code,
      user_pkid: this.gs.globalVariables.user_pkid
    };

    this.ErrorMessage = '';
    this.mainService.VolumeReport(SearchData2)
      .subscribe(response => {
        if (response.mailmsg.length > 0)
          alert(response.mailmsg);
      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  customreportcallbackevent(params: any) {

    if (params.saction == "SAVE") {

    }
    
  }
}
