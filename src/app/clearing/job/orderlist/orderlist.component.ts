import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Joborderm } from '../../models/joborder';
import { JobOrder_VM } from '../../models/joborder';
import { OrderListService } from '../../services/orderlist.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { ReconComponent } from '../../../accounts/Recon/recon.component';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  providers: [OrderListService]
})
export class OrderListComponent {
  // Local Variables 
  title = 'Order List';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  modal: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;

  ord_trkids: string = "";
  ord_trkpos: string = "";
  job_docno: string = "";
  ord_po: string = "";
  ord_invoice: string = "";
  from_date: string = '';
  to_date: string = '';
  ord_showpending: boolean = false;
  ord_status: string = "REPORTED";
  sort_colname: string = "a.rec_created_date desc";

  list_exp_id: string = "";
  list_exp_name: string = "";
  list_exp_code: string = "";
  list_imp_id: string = "";
  list_imp_name: string = "";
  list_imp_code: string = "";
  list_agent_id: string = "";
  list_agent_name: string = "";
  list_agent_code: string = "";


  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';


  bShowPasteData: boolean = false;
  bDisabledControl: boolean = false;
  selectcheckbox: boolean = false;
  selectcheck: boolean = false;

  EXPRECORD: SearchTable = new SearchTable();
  IMPRECORD: SearchTable = new SearchTable();
  AGENTRECORD: SearchTable = new SearchTable();
  POLRECORD: SearchTable = new SearchTable();
  PODRECORD: SearchTable = new SearchTable();

  LIST_EXPRECORD: SearchTable = new SearchTable();
  LIST_IMPRECORD: SearchTable = new SearchTable();
  LIST_AGENTRECORD: SearchTable = new SearchTable();

  AttachList: any[] = [];
  SortList: any[] = [];
  // Array For Displaying List
  RecordList: Joborderm[] = [];
  // Single Record for add/edit/view details
  Record: Joborderm = new Joborderm;

  bShowList = false;
  mList: Joborderm[] = [];

  constructor(
    private modalService: NgbModal,
    private mainService: OrderListService,
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {
    this.page_count = 0;
    this.page_rows = 30;
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

    this.LoadCombo();
    this.initLov();
    this.initLov2();
    // this.List("NEW");
  }

  //// Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  initLov(caption: string = '') {

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

    this.POLRECORD = new SearchTable();
    this.POLRECORD.controlname = "POL";
    this.POLRECORD.displaycolumn = "CODE";
    this.POLRECORD.type = "PORT";
    this.POLRECORD.id = "";
    this.POLRECORD.code = "";
    this.POLRECORD.name = "";

    this.PODRECORD = new SearchTable();
    this.PODRECORD.controlname = "POD";
    this.PODRECORD.displaycolumn = "CODE";
    this.PODRECORD.type = "PORT";
    this.PODRECORD.id = "";
    this.PODRECORD.code = "";
    this.PODRECORD.name = "";
  }

  initLov2(caption: string = '') {


    this.LIST_EXPRECORD = new SearchTable();
    this.LIST_EXPRECORD.controlname = "LIST_SHIPPER";
    this.LIST_EXPRECORD.displaycolumn = "NAME";
    this.LIST_EXPRECORD.type = "CUSTOMER";
    this.LIST_EXPRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
    this.LIST_EXPRECORD.id = "";
    this.LIST_EXPRECORD.code = "";
    this.LIST_EXPRECORD.name = "";
    this.LIST_EXPRECORD.parentid = "";

    this.LIST_IMPRECORD = new SearchTable();
    this.LIST_IMPRECORD.controlname = "LIST_CONSIGNEE";
    this.LIST_IMPRECORD.displaycolumn = "NAME";
    this.LIST_IMPRECORD.type = "CUSTOMER";
    this.LIST_IMPRECORD.where = " CUST_IS_CONSIGNEE = 'Y' ";
    this.LIST_IMPRECORD.id = "";
    this.LIST_IMPRECORD.code = "";
    this.LIST_IMPRECORD.name = "";
    this.LIST_IMPRECORD.parentid = "";

    this.LIST_AGENTRECORD = new SearchTable();
    this.LIST_AGENTRECORD.controlname = "LIST_AGENT";
    this.LIST_AGENTRECORD.where = " CUST_IS_AGENT = 'Y' ";
    this.LIST_AGENTRECORD.displaycolumn = "NAME";
    this.LIST_AGENTRECORD.type = "CUSTOMER";
    this.LIST_AGENTRECORD.id = "";
    this.LIST_AGENTRECORD.code = "";
    this.LIST_AGENTRECORD.name = "";

  }



  LovSelected(_Record: SearchTable) {
    // Company Settings

    if (_Record.controlname == "SHIPPER") {
      this.Record.ord_exp_id = _Record.id;
      this.Record.ord_exp_name = _Record.name;
      this.Record.ord_exp_code = _Record.code;

    }
    if (_Record.controlname == "CONSIGNEE") {
      this.Record.ord_imp_id = _Record.id;
      this.Record.ord_imp_name = _Record.name;
      this.Record.ord_imp_code = _Record.code;

    }
    if (_Record.controlname == "AGENT") {
      this.Record.ord_agent_id = _Record.id;
      this.Record.ord_agent_code = _Record.code;
      this.Record.ord_agent_name = _Record.name;

    }


    if (_Record.controlname == "LIST_SHIPPER") {
      this.list_exp_id = _Record.id;
      this.list_exp_name = _Record.name;
      this.list_exp_code = _Record.code;

    }
    if (_Record.controlname == "LIST_CONSIGNEE") {
      this.list_imp_id = _Record.id;
      this.list_imp_name = _Record.name;
      this.list_imp_code = _Record.code;

    }
    if (_Record.controlname == "LIST_AGENT") {
      this.list_agent_id = _Record.id;
      this.list_agent_code = _Record.code;
      this.list_agent_name = _Record.name;

    }

    if (_Record.controlname == "POL") {
      this.Record.ord_pol_id = _Record.id;
      if (_Record.code.length >= 5)
        this.Record.ord_pol = _Record.code.substr(2, 3);
      else
        this.Record.ord_pol = _Record.code;
    }
    else if (_Record.controlname == "POD") {
      this.Record.ord_pod_id = _Record.id;
      if (_Record.code.length >= 5)
        this.Record.ord_pod = _Record.code.substr(2, 3);
      else
        this.Record.ord_pod = _Record.code;
    }

  }

  LoadCombo() {

    this.list_agent_id = "";
    this.list_exp_id = "";
    this.list_imp_id = "";
    this.job_docno = "";
    this.ord_po = "";
    this.ord_invoice = "";
    this.ord_status = "REPORTED";
    this.sort_colname = "a.rec_created_date desc";
    this.SortList = [
      { "colheadername": "CREATED", "colname": "a.rec_created_date desc" },
      { "colheadername": "AGENT,SHIPPER,PO", "colname": "agent.cust_name,exp.cust_name,ord_po" }
    ];
  }

  ////function for handling LIST/NEW/EDIT Buttons
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

  //// Query List Data
  List(_type: string) {



    this.loading = true;

    this.selectcheck = false;
    this.selectcheckbox = false;

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
      job_docno: this.job_docno,
      ord_po: this.ord_po,
      ord_invoice: this.ord_invoice,
      from_date: this.from_date,
      to_date: this.to_date,
      list_exp_id: this.list_exp_id,
      list_imp_id: this.list_imp_id,
      list_agent_id: this.list_agent_id,
      ord_showpending: this.ord_showpending == true ? "Y" : "N",
      report_folder: this.gs.globalVariables.report_folder,
      file_pkid: this.gs.getGuid(),
      ord_status: this.ord_status,
      sort_colname: this.sort_colname
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
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }
  NewRecord() {

    this.mList = [];
    this.bShowList = false;
    this.bDisabledControl = false;
    this.pkid = this.gs.getGuid();
    this.Record = new Joborderm();
    this.Record.ord_pkid = this.pkid;
    this.Record.ord_exp_id = '';
    this.Record.ord_exp_name = '';
    this.Record.ord_imp_id = '';
    this.Record.ord_imp_name = '';
    this.Record.ord_invno = '';
    this.Record.ord_uneco = '';
    this.Record.ord_po = '';
    this.Record.ord_style = '';
    this.Record.ord_cbm = 0;
    this.Record.ord_pcs = 0;
    this.Record.ord_pkg = 0;
    this.Record.ord_grwt = 0;
    this.Record.ord_ntwt = 0;
    this.Record.ord_hs_code = '';
    this.Record.ord_cargo_status = '';
    this.Record.ord_desc = '';
    this.Record.ord_stylename = '';
    this.Record.ord_color = '';
    this.Record.ord_contractno = '';
    this.Record.ord_source = '';
    this.Record.ord_pol = '';
    this.Record.ord_pod = '';
    this.Record.ord_pol_id = '';
    this.Record.ord_pod_id = '';
    this.Record.ord_pol_code = '';
    this.Record.ord_pod_code = ''; 
    this.Record.rec_category = 'SEA EXPORT';

    this.initLov();
    // this.EXPRECORD.id = '';
    // this.EXPRECORD.name = '';
    // this.IMPRECORD.id = '';
    // this.IMPRECORD.name = '';
    this.Record.ord_exp_code = '';
    this.Record.ord_imp_code = '';
    // this.EXPRECORD.code = '';
    // this.IMPRECORD.code = '';
    // this.AGENTRECORD.id = '';
    // this.AGENTRECORD.name = '';
    this.Record.ord_agent_code = '';

    this.Record.rec_mode = this.mode;
    // this.InitLov();
    this.Record.rec_mode = this.mode;
  }




  //// Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;
    this.bShowList = false;
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

  LoadData(_Record: Joborderm) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
    this.initLov();
    this.EXPRECORD.id = this.Record.ord_exp_id;
    this.EXPRECORD.name = this.Record.ord_exp_name;
    this.EXPRECORD.code = this.Record.ord_exp_code;
    this.IMPRECORD.id = this.Record.ord_imp_id;
    this.IMPRECORD.name = this.Record.ord_imp_name;
    this.IMPRECORD.code = this.Record.ord_imp_code;
    this.AGENTRECORD.id = this.Record.ord_agent_id;
    this.AGENTRECORD.name = this.Record.ord_agent_name;
    this.AGENTRECORD.code = this.Record.ord_agent_code;
    this.POLRECORD.id = this.Record.ord_pol_id;
    this.POLRECORD.code = this.Record.ord_pol_code;
    this.PODRECORD.id = this.Record.ord_pod_id;
    this.PODRECORD.code = this.Record.ord_pod_code;

    if (this.Record.job_docno != "") {
      this.bDisabledControl = true;
    }
    else {
      this.bDisabledControl = false;
    }
  }


  //// Save Data
  Save() {

    if (!this.allvalid())
      return;

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    this.Record._globalvariables = this.gs.globalVariables;

    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        if (this.mode == 'ADD')
          this.Record.ord_uid = response.uidno;
        this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.RefreshList();
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

    if (this.AGENTRECORD.id.trim().length <= 0) {
      bret = false;
      sError += " Agent Cannot Be Blank";
    }
    if (this.EXPRECORD.id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Shipper Cannot Be Blank";
    }
    if (this.IMPRECORD.id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Consignee Cannot Be Blank";
    }


    if (this.Record.ord_po.trim().length <= 0) {
      bret = false;
      sError += "\n\r | PO Cannot Be Blank";
    }



    if (bret === false)
      this.ErrorMessage = sError;
    return bret;

  }

  RefreshList() {

    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.ord_pkid == this.Record.ord_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.ord_agent_name = this.Record.ord_agent_name;
      REC.ord_exp_name = this.Record.ord_exp_name;
      REC.ord_imp_name = this.Record.ord_imp_name;
      REC.ord_invno = this.Record.ord_invno;
      REC.ord_po = this.Record.ord_po;
      REC.ord_style = this.Record.ord_style;
      REC.ord_contractno = this.Record.ord_contractno;
      REC.ord_uneco = this.Record.ord_uneco;
      REC.ord_pkg = this.Record.ord_pkg;
      REC.ord_pcs = this.Record.ord_pcs;
      REC.ord_grwt = this.Record.ord_grwt;
      REC.ord_ntwt = this.Record.ord_ntwt;
      REC.ord_cbm = this.Record.ord_cbm;
      REC.ord_desc = this.Record.ord_desc;
      REC.ord_color = this.Record.ord_color;
      REC.ord_hs_code = this.Record.ord_hs_code;
      REC.ord_cargo_status = this.Record.ord_cargo_status;
      REC.rec_created_dte = this.Record.rec_created_dte;
      REC.ord_pol = this.Record.ord_pol;
      REC.ord_pod = this.Record.ord_pod;
      REC.ord_uid = this.Record.ord_uid;
    }
  }


  OnBlur(field: string) {
    switch (field) {

      case 'ord_exp_name':
        {
          this.Record.ord_exp_name = this.Record.ord_exp_name.toUpperCase();
          break;
        }
      case 'ord_imp_nmae':
        {
          this.Record.ord_imp_name = this.Record.ord_imp_name.toUpperCase();
          break;
        }
      case 'ord_invno':
        {
          this.Record.ord_invno = this.Record.ord_invno.toUpperCase();
          break;
        }
      case 'ord_uneco':
        {
          this.Record.ord_uneco = this.Record.ord_uneco.toUpperCase();
          break;
        }
      case 'ord_po':
        {
          this.Record.ord_po = this.Record.ord_po.toUpperCase();
          this.FindContractNo();
          break;
        }
      case 'ord_style':
        {
          this.Record.ord_style = this.Record.ord_style.toUpperCase();
          this.FindContractNo();
          break;
        }
      case 'ord_hs_code':
        {
          this.Record.ord_hs_code = this.Record.ord_hs_code.toUpperCase();
          break;
        }
      case 'ord_cargo_status':
        {
          this.Record.ord_cargo_status = this.Record.ord_cargo_status.toUpperCase();
          break;
        }
      case 'ord_desc':
        {
          this.Record.ord_desc = this.Record.ord_desc.toUpperCase();
          break;
        }

      case 'ord_cbm':
        {
          this.Record.ord_cbm = this.gs.roundWeight(this.Record.ord_cbm, "CBM");
          break;
        }
      case 'ord_pcs':
        {
          this.Record.ord_pcs = this.gs.roundWeight(this.Record.ord_pcs, "PCS");
          break;
        }
      case 'ord_pkg':
        {
          this.Record.ord_pkg = this.gs.roundWeight(this.Record.ord_pkg, "PKG");
          break;
        }
      case 'ord_grwt':
        {
          this.Record.ord_grwt = this.gs.roundWeight(this.Record.ord_grwt, "GRWT");
          break;
        }
      case 'ord_ntwt':
        {
          this.Record.ord_ntwt = this.gs.roundWeight(this.Record.ord_ntwt, "NTWT");
          break;
        }
      case 'ord_color':
        {
          this.Record.ord_color = this.Record.ord_color.toUpperCase();
          this.FindContractNo();
          break;
        }
      case 'ord_stylename':
        {
          this.Record.ord_stylename = this.Record.ord_stylename.toUpperCase();
          break;
        }
      case 'ord_contractno':
        {
          this.Record.ord_contractno = this.Record.ord_contractno.toUpperCase();
          break;
        }
      case 'ordr_po':
        {
          this.ord_po = this.ord_po.toUpperCase();
          break;
        }
      case 'job_docno':
        {
          this.job_docno = this.job_docno.toUpperCase();
          break;
        }
      case 'ord_invoice':
        {
          this.ord_invoice = this.ord_invoice.toUpperCase();
          break;
        }
      case 'ord_pol':
        {
          this.Record.ord_pol = this.Record.ord_pol.toUpperCase();
          break;
        }
      case 'ord_pod':
        {
          this.Record.ord_pod = this.Record.ord_pod.toUpperCase();
          break;
        }
    }
  }

  FindContractNo() {
    let sContract: string = "";
    sContract = this.Record.ord_po;
    if (this.Record.ord_style.trim() != "") {
      if (sContract.trim() != "")
        sContract += "/";
      sContract += this.Record.ord_style;
    }
    if (this.Record.ord_color.trim() != "") {
      if (sContract.trim() != "")
        sContract += "-";
      sContract += this.Record.ord_color;
    }
    this.Record.ord_contractno = sContract.trim();
  }

  PasteData() {
    this.bShowPasteData = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
  }

  PasteDataClosed(cbdata: string) {

    let col_inv = -1;
    let col_desc = -1;
    let col_po = -1;
    let col_style = -1;
    let col_color = -1;
    let col_pkg = -1;
    let col_pcs = -1;
    let col_ntwt = -1;
    let col_grwt = -1;
    let col_cbm = -1;
    let col_hscode = -1;

    let col_bkd = -1;
    let col_rnd = -1;
    let col_por = -1;
    let col_cr = -1;
    let col_fcr = -1;
    let col_insp = -1;
    let col_stf = -1;
    let col_whd = -1;
    let col_dlv_pol = -1;
    let col_dlv_pod = -1;
    let col_port_pol = -1;
    let col_port_pod = -1;

    if (cbdata != null) {

      let mRec: Joborderm = new Joborderm;

      this.mList = [];

      var ar1 = cbdata.split("\n");
      var ar2;

      if (ar1.length > 0) {
        ar2 = ar1[0].split("\t");
        for (var i = 0; i < ar2.length; i++) {
          if (ar2[i].toUpperCase().indexOf("IN") >= 0) {
            col_inv = i;
          }
          if (ar2[i].toUpperCase().indexOf("DESC") >= 0 || ar2[i].toUpperCase().indexOf("ITEM") >= 0 || ar2[i].toUpperCase().indexOf("NAME") >= 0) {
            col_desc = i;
          }
          if (ar2[i].toUpperCase().indexOf("PO") >= 0) {
            col_po = i;
          }
          if (ar2[i].toUpperCase().indexOf("STY") >= 0) {
            col_style = i;
          }
          if (ar2[i].toUpperCase().indexOf("COL") >= 0) {
            col_color = i;
          }
          if (ar2[i].toUpperCase().indexOf("CTN") >= 0 || ar2[i].toUpperCase().indexOf("PKG") >= 0 || ar2[i].toUpperCase().indexOf("CAR") >= 0 || ar2[i].toUpperCase().indexOf("PACK") >= 0) {
            col_pkg = i;
          }
          if (ar2[i].toUpperCase().indexOf("PCS") >= 0) {
            col_pcs = i;
          }
          if (ar2[i].toUpperCase().indexOf("NT") >= 0 || ar2[i].toUpperCase().indexOf("NET") >= 0) {
            col_ntwt = i;
          }
          if (ar2[i].toUpperCase().indexOf("GR") >= 0) {
            col_grwt = i;
          }
          if (ar2[i].toUpperCase().indexOf("CBM") >= 0 || ar2[i].toUpperCase().indexOf("VOL") >= 0) {
            col_cbm = i;
          }
          if (ar2[i].toUpperCase().indexOf("HS") >= 0) {
            col_hscode = i;
          }

          if (ar2[i].toUpperCase().indexOf("BOOKING DATE") >= 0) {//BKD
            col_bkd = i;
          }
          if (ar2[i].toUpperCase().indexOf("RANDOM DATE") >= 0) { //RND
            col_rnd = i;
          }
          if (ar2[i].toUpperCase().indexOf("RELEASE DATE") >= 0) {//POR
            col_por = i;
          }
          if (ar2[i].toUpperCase().indexOf("READY DATE") >= 0) { //CR
            col_cr = i;
          }
          if (ar2[i].toUpperCase().indexOf("FCR DATE") >= 0) {//FCR
            col_fcr = i;
          }
          if (ar2[i].toUpperCase().indexOf("INSPECTION DATE") >= 0) { //INSP
            col_insp = i;
          }
          if (ar2[i].toUpperCase().indexOf("STUFFING DATE") >= 0) {
            col_stf = i;
          }
          if (ar2[i].toUpperCase().indexOf("WARE HOUSE DATE") >= 0) {
            col_whd = i;
          }
          if (ar2[i].toUpperCase().indexOf("DELIVERY POL DATE") >= 0) {
            col_dlv_pol = i;
          }
          if (ar2[i].toUpperCase().indexOf("DELIVERY POD DATE") >= 0) {
            col_dlv_pod = i;
          }
          if (ar2[i].toUpperCase().indexOf("PORT-POL") >= 0) {
            col_port_pol = i;
          }
          if (ar2[i].toUpperCase().indexOf("PORT-POD") >= 0) {
            col_port_pod = i;
          }
        };
      }

      for (var i = 1; i < ar1.length; i++) {

        if (ar1[i] != '') {
          ar2 = ar1[i].split("\t");
          mRec = new Joborderm;
          mRec.ord_pkid = '';
          mRec.ord_invno = '';
          mRec.ord_desc = '';
          mRec.ord_po = '';
          mRec.ord_style = '';
          mRec.ord_color = '';
          mRec.ord_pkg = 0;
          mRec.ord_pcs = 0;
          mRec.ord_ntwt = 0;
          mRec.ord_grwt = 0;
          mRec.ord_cbm = 0;
          mRec.ord_hs_code = '';
          mRec.ord_exp_id = '';
          mRec.ord_exp_name = '';
          mRec.ord_imp_id = '';
          mRec.ord_imp_name = '';
          mRec.ord_agent_id = '';
          mRec.ord_agent_name = '';
          mRec.rec_category = '';
          mRec.remove = '';

          mRec.ord_booking_date = '';
          mRec.ord_rnd_insp_date = '';
          mRec.ord_po_rel_date = '';
          mRec.ord_cargo_ready_date = '';
          mRec.ord_fcr_date = '';
          mRec.ord_insp_date = '';
          mRec.ord_stuf_date = '';
          mRec.ord_whd_date = '';
          mRec.ord_delvi_date = '';
          mRec.ord_dlv_pol_date = '';
          mRec.ord_dlv_pod_date = '';
          mRec.ord_pol = '';
          mRec.ord_pod = '';

          mRec.ord_pkid = this.gs.getGuid();
          mRec.rec_category = this.type;

          if (col_inv > -1)
            mRec.ord_invno = ar2[col_inv].toUpperCase();
          if (col_desc > -1)
            mRec.ord_desc = ar2[col_desc].toUpperCase();
          if (col_po > -1)
            mRec.ord_po = ar2[col_po].toUpperCase();
          if (col_style > -1)
            mRec.ord_style = ar2[col_style].toUpperCase();
          if (col_color > -1)
            mRec.ord_color = ar2[col_color].toUpperCase();
          if (col_pkg > -1) {

            if (ar2[col_pkg] != "") {
              mRec.ord_pkg = parseFloat(ar2[col_pkg]);
            }
            else {
              mRec.ord_pkg = 0;
            }

          }

          if (col_pcs > -1) {

            if (ar2[col_pcs] != "") {
              mRec.ord_pcs = parseFloat(ar2[col_pcs]);
            }
            else {
              mRec.ord_pcs = 0;
            }

          }

          if (col_ntwt > -1) {

            if (ar2[col_ntwt] != "") {
              mRec.ord_ntwt = parseFloat(ar2[col_ntwt]);
            }
            else {
              mRec.ord_ntwt = 0;
            }
          }

          if (col_grwt > -1) {

            if (ar2[col_grwt] != "") {
              mRec.ord_grwt = parseFloat(ar2[col_grwt]);
            }
            else {
              mRec.ord_grwt = 0;
            }
          }

          if (col_cbm > -1) {
            if (ar2[col_cbm] != "") {
              mRec.ord_cbm = parseFloat(ar2[col_cbm]);
            }
            else {
              mRec.ord_cbm = 0;
            }
          }

          if (col_hscode > -1)
            mRec.ord_hs_code = ar2[col_hscode].toUpperCase();

          if (col_bkd > -1)
            mRec.ord_booking_date = ar2[col_bkd].toUpperCase();
          if (col_rnd > -1)
            mRec.ord_rnd_insp_date = ar2[col_rnd].toUpperCase();
          if (col_por > -1)
            mRec.ord_po_rel_date = ar2[col_por].toUpperCase();
          if (col_cr > -1)
            mRec.ord_cargo_ready_date = ar2[col_cr].toUpperCase();
          if (col_fcr > -1)
            mRec.ord_fcr_date = ar2[col_fcr].toUpperCase();
          if (col_insp > -1)
            mRec.ord_insp_date = ar2[col_insp].toUpperCase();
          if (col_stf > -1)
            mRec.ord_stuf_date = ar2[col_stf].toUpperCase();
          if (col_whd > -1)
            mRec.ord_whd_date = ar2[col_whd].toUpperCase();
          if (col_dlv_pol > -1)
            mRec.ord_dlv_pol_date = ar2[col_dlv_pol].toUpperCase();
          if (col_dlv_pod > -1)
            mRec.ord_dlv_pod_date = ar2[col_dlv_pod].toUpperCase();
          if (col_port_pol > -1)
            mRec.ord_pol = ar2[col_port_pol].toUpperCase();
          if (col_port_pod > -1)
            mRec.ord_pod = ar2[col_port_pod].toUpperCase();

          if (mRec.ord_po != '') {
            let sContract: string = "";

            sContract = mRec.ord_po;
            if (mRec.ord_style.trim() != "") {
              if (sContract.trim() != "")
                sContract += "/";
              sContract += mRec.ord_style;
            }
            if (mRec.ord_color.trim() != "") {
              if (sContract.trim() != "")
                sContract += "-";
              sContract += mRec.ord_color;
            }
            mRec.ord_contractno = sContract.trim().toUpperCase();
            mRec.remove = "";

            this.mList.push(mRec);
          }
        }
      }
      if (this.mList.length > 0) {
        this.bShowList = true;
      }

    }
    this.bShowPasteData = false;
  }

  //upload
  Upload() {

    if (this.mList.length <= 0) {
      this.InfoMessage = '';
      this.ErrorMessage = 'Data Cannot Be Blank';
      return;
    }

    if (this.AGENTRECORD.id.trim().length <= 0) {
      this.ErrorMessage = 'Agent Cannot Be Blank';
      return;
    }
    if (this.EXPRECORD.id.trim().length <= 0) {
      this.ErrorMessage = 'Shipper Cannot Be Blank';
      return;
    }
    if (this.IMPRECORD.id.trim().length <= 0) {
      this.ErrorMessage = 'Consignee Cannot Be Blank';
      return;
    }

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';


    let VM = new JobOrder_VM;
    VM.JobOrder = this.mList;
    VM.globalvariables = this.gs.globalVariables;
    VM.ord_exp_id = this.EXPRECORD.id;
    VM.ord_imp_id = this.IMPRECORD.id;
    VM.ord_agent_id = this.AGENTRECORD.id;
    VM.ord_source = "ORDER";

    this.mainService.Upload(VM)
      .subscribe(response => {
        this.loading = false;
        if (response.list.length <= 0) {
          this.InfoMessage = "Upload Complete";
        }
        else {
          this.ErrorMessage = "Cannot Insert, All These PO's Already Exist!";
        }


        for (var i = 0; i < this.mList.length; i++) {
          this.mList[i].remove = "Y";
        }

        for (var j = 0; j < response.list.length; j++) {
          for (var i = 0; i < this.mList.length; i++) {
            if (response.list[j].ord_pkid == this.mList[i].ord_pkid) {
              this.mList[i].remove = "N";
            }
          }
        }

        for (var i = this.mList.length - 1; i >= 0; i--) {

          if (this.mList[i].remove == "Y") {
            this.mList.splice(i);
          }
        }

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  SelectCheckbox() {

    this.selectcheckbox = !this.selectcheckbox;

    for (var i = 0; i < this.RecordList.length; i++) {
      this.RecordList[i].ord_selected = this.selectcheckbox;
    }

  }

  Close() {
    this.gs.ClosePage('home');
  }

  open(content: any) {
    this.modal = this.modalService.open(content);
  }

  TrackOrders(trkorder: any) {
    this.ErrorMessage = "";
    this.ord_trkids = "";
    this.ord_trkpos = "";
    for (let rec of this.RecordList) {

      if (rec.ord_selected) {

        if (this.ord_trkids != "")
          this.ord_trkids += ",";
        this.ord_trkids += rec.ord_pkid;

        if (this.ord_trkpos != "")
          this.ord_trkpos += ", ";
        this.ord_trkpos += rec.ord_po;

      }
    }
    if (this.ord_trkids == "") {
      this.ErrorMessage = " Please select PO and continue.....";
      alert(this.ErrorMessage);
      return;
    }
    this.open(trkorder);
  }

  ApprovedOrders(approvedorder: any) {
    this.open(approvedorder);
  }

  MailOrders(ftpsent: any) {
    this.InfoMessage = '';
    this.ErrorMessage = '';
    if (this.pkid.trim().length <= 0) {
      this.ErrorMessage = "\n\r | Invalid ID";
      return;
    }
    this.loading = true;
    this.ErrorMessage = '';
    let SearchData = {
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      type: '',
      pkid: '',
      filedisplayname: ''
    };

    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.type = 'ORDERLIST';
    SearchData.pkid = this.pkid;
    SearchData.filedisplayname = '';
    this.mainService.GenerateXmlEdiMexico(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.AttachList = new Array<any>();
        this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname });
        this.AttachList.push({ filename: response.filenameack, filetype: response.filetypeack, filedisplayname: response.filedisplaynameack });
        this.open(ftpsent);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert( this.ErrorMessage);
        });
  }
}
