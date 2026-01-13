import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Costingm } from '../../models/costing';
import { AgentInvoiceService } from '../../services/agentinvoice.service';
import { SearchTable } from '../../../shared/models/searchtable';

@Component({
  selector: 'app-agentinvoice',
  templateUrl: './agentinvoice.component.html',
  providers: [AgentInvoiceService]
})
export class AgentInvoiceComponent {
  // Local Variables 

  title = 'Agent Invoice';
  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  selectedRowIndex: number = 0;

  canprint = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  lock_record: boolean = false;
  lock_date: boolean = false;
  bAdmin = false;


  sub: any;
  urlid: string;

  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';

  AGENTRECORD: SearchTable = new SearchTable();
  AGENTADDRECORD: SearchTable = new SearchTable();
  JVAGENTRECORD: SearchTable = new SearchTable();
  JVAGENTADDRECORD: SearchTable = new SearchTable();
  CURRECORD: SearchTable = new SearchTable();
  // Array For Displaying List
  RecordList: Costingm[] = [];

  // Single Record for add/edit/view details
  Record: Costingm = new Costingm;


  constructor(
    private mainService: AgentInvoiceService,
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
    this.canprint = false;
    this.bAdmin = false;
    this.currentTab = 'LIST';
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_print)
        this.canprint = true;
    }
    this.InitColumns();
    this.InitLov();
    this.List("NEW");
  }

  InitColumns() {
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  InitLov(action: string = '') {

    if (action == '' || action == 'CURRENCY') {
      this.CURRECORD = new SearchTable();
      this.CURRECORD.controlname = "CURRENCY";
      this.CURRECORD.displaycolumn = "CODE";
      this.CURRECORD.type = "CURRENCY";
      this.CURRECORD.id = "";
      this.CURRECORD.code = "";
      this.CURRECORD.name = "";
    }

    if (action == '' || action == 'AGENT') {
      this.AGENTRECORD = new SearchTable();
      this.AGENTRECORD.controlname = "AGENT";
      this.AGENTRECORD.displaycolumn = "CODE";
      this.AGENTRECORD.type = "CUSTOMER";
      this.AGENTRECORD.where = " CUST_IS_AGENT = 'Y' ";
      this.AGENTRECORD.id = "";
      this.AGENTRECORD.code = "";
      this.AGENTRECORD.name = "";
    }

    if (action == '' || action == 'AGENTADDRESS') {
      this.AGENTADDRECORD = new SearchTable();
      this.AGENTADDRECORD.controlname = "AGENTADDRESS";
      this.AGENTADDRECORD.displaycolumn = "CODE";
      this.AGENTADDRECORD.type = "CUSTOMERADDRESS";
      this.AGENTADDRECORD.id = "";
      this.AGENTADDRECORD.code = "";
      this.AGENTADDRECORD.name = "";
      this.AGENTADDRECORD.parentid = "";
    }
    if (action == '' || action == 'JVAGENT') {
      this.JVAGENTRECORD = new SearchTable();
      this.JVAGENTRECORD.controlname = "JVAGENT";
      this.JVAGENTRECORD.displaycolumn = "CODE";
      this.JVAGENTRECORD.type = "CUSTOMER";
      this.JVAGENTRECORD.where = " CUST_IS_AGENT = 'Y' ";
      this.JVAGENTRECORD.id = "";
      this.JVAGENTRECORD.code = "";
      this.JVAGENTRECORD.name = "";
    }

    if (action == '' || action == 'JVAGENTADDRESS') {
      this.JVAGENTADDRECORD = new SearchTable();
      this.JVAGENTADDRECORD.controlname = "JVAGENTADDRESS";
      this.JVAGENTADDRECORD.displaycolumn = "CODE";
      this.JVAGENTADDRECORD.type = "CUSTOMERADDRESS";
      this.JVAGENTADDRECORD.id = "";
      this.JVAGENTADDRECORD.code = "";
      this.JVAGENTADDRECORD.name = "";
      this.JVAGENTADDRECORD.parentid = "";
    }
  }

  LovSelected(_Record: SearchTable) {
    let bchange: boolean = false;
    if (_Record.controlname == "CURRENCY") {
      this.Record.cost_currency_id = _Record.id;
      this.Record.cost_currency_code = _Record.code;
      this.Record.cost_exrate = _Record.rate;
    }

    if (_Record.controlname == "AGENT") {
      bchange = false;
      if (this.Record.cost_agent_id != _Record.id)
        bchange = true;

      this.Record.cost_agent_id = _Record.id;
      this.Record.cost_agent_code = _Record.code;
      this.Record.cost_agent_name = _Record.name;

      if (bchange) {
        this.AGENTADDRECORD = new SearchTable();
        this.AGENTADDRECORD.controlname = "AGENTADDRESS";
        this.AGENTADDRECORD.displaycolumn = "CODE";
        this.AGENTADDRECORD.type = "CUSTOMERADDRESS";
        this.AGENTADDRECORD.id = "";
        this.AGENTADDRECORD.code = "";
        this.AGENTADDRECORD.name = "";
        this.AGENTADDRECORD.parentid = this.Record.cost_agent_id;
        this.Record.cost_agent_br_addr = "";
      }
    }

    if (_Record.controlname == "AGENTADDRESS") {
      this.Record.cost_agent_br_id = _Record.id;
      this.Record.cost_agent_br_no = _Record.code;
      this.Record.cost_agent_br_addr = this.GetBrAddress(_Record.name).address;
    }

    if (_Record.controlname == "JVAGENT") {
      bchange = false;
      if (this.Record.cost_jv_agent_id != _Record.id)
        bchange = true;

      this.Record.cost_jv_agent_id = _Record.id;
      this.Record.cost_jv_agent_code = _Record.code;
      this.Record.cost_jv_agent_name = _Record.name;

      if (bchange) {
        this.JVAGENTADDRECORD = new SearchTable();
        this.JVAGENTADDRECORD.controlname = "JVAGENTADDRESS";
        this.JVAGENTADDRECORD.displaycolumn = "CODE";
        this.JVAGENTADDRECORD.type = "CUSTOMERADDRESS";
        this.JVAGENTADDRECORD.id = "";
        this.JVAGENTADDRECORD.code = "";
        this.JVAGENTADDRECORD.name = "";
        this.JVAGENTADDRECORD.parentid = this.Record.cost_jv_agent_id;
        this.Record.cost_jv_agent_br_addr = "";
      }
    }

    if (_Record.controlname == "JVAGENTADDRESS") {
      this.Record.cost_jv_agent_br_id = _Record.id;
      this.Record.cost_jv_agent_br_no = _Record.code;
      this.Record.cost_jv_agent_br_addr = this.GetBrAddress(_Record.name).address;
    }
  }
  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string, _selectedRowIndex: number = -1) {
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
      this.selectedRowIndex = _selectedRowIndex;
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
    this.selectedRowIndex = -1;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      sortby: '',
      report_folder: this.gs.globalVariables.report_folder,
      from_date: this.gs.globalData.cost_agentinvoice_fromdate,
      to_date: this.gs.globalData.cost_agentinvoice_todate,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
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

    this.lock_record = false;
    this.lock_date = false;

    this.pkid = this.gs.getGuid();
    this.Record = new Costingm();
    this.Record.cost_pkid = this.pkid;
    this.Record.cost_refno = "";
    this.Record.cost_folderno = "";
    this.Record.cost_mblid = "";
    this.Record.cost_agent_id = "";
    this.Record.cost_agent_code = "";
    this.Record.cost_agent_name = "";
    this.Record.cost_agent_br_id = "";
    this.Record.cost_agent_br_no = "";
    this.Record.cost_agent_br_addr = "";
    this.Record.cost_date = this.gs.defaultValues.today;
    this.Record.cost_currency_id = "";
    this.Record.cost_currency_code = "";
    this.Record.cost_exrate = 0;
    this.Record.cost_dramt = 0;
    this.Record.cost_cramt = 0;
    this.Record.cost_drcr_amount = 0;
    this.Record.cost_remarks = "";
    this.Record.cost_drcr = "";
    this.Record.cost_category = "";
    if (this.gs.globalVariables.branch_type == "BOTH")
      this.Record.cost_type = 'SEA';
    else
      this.Record.cost_type = this.gs.globalVariables.branch_type;
    this.Record.cost_source = 'AGENT INVOICE';
    this.Record.cost_book_cntr = '';
    this.Record.cost_jv_agent_id = "";
    this.Record.cost_jv_agent_code = "";
    this.Record.cost_jv_agent_name = "";
    this.Record.cost_jv_agent_br_id = "";
    this.Record.cost_jv_agent_br_no = "";
    this.Record.cost_jv_agent_br_addr = "";
    this.Record.cost_jv_br_inv_id = '';
    this.Record.cost_ddp = false;
    this.Record.rec_mode = this.mode;

    this.InitDetList();
    this.InitLov();
  }

  InitDetList() {

  }
  NewDetRecord(iCtr: number) {

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

  LoadData(_Record: Costingm) {
    this.Record = _Record;
    this.InitLov();
    this.CURRECORD.id = this.Record.cost_currency_id;
    this.CURRECORD.code = this.Record.cost_currency_code;
    this.AGENTRECORD.id = this.Record.cost_agent_id;
    this.AGENTRECORD.code = this.Record.cost_agent_code;
    this.AGENTRECORD.name = this.Record.cost_agent_name;
    this.AGENTADDRECORD.id = this.Record.cost_agent_br_id;
    this.AGENTADDRECORD.code = this.Record.cost_agent_br_no;
    this.AGENTADDRECORD.parentid = this.Record.cost_agent_id;

    this.JVAGENTRECORD.id = this.Record.cost_jv_agent_id;
    this.JVAGENTRECORD.code = this.Record.cost_jv_agent_code;
    this.JVAGENTRECORD.name = this.Record.cost_jv_agent_name;
    this.JVAGENTADDRECORD.id = this.Record.cost_jv_agent_br_id;
    this.JVAGENTADDRECORD.code = this.Record.cost_jv_agent_br_no;
    this.JVAGENTADDRECORD.parentid = this.Record.cost_jv_agent_id;

    this.lock_record = true;
    this.lock_date = true;
    if (this.Record.cost_edit_code.indexOf("{S}") >= 0)
      this.lock_record = false;
    if (this.Record.cost_edit_code.indexOf("{D}") >= 0)
      this.lock_date = false;

    this.Record.rec_mode = this.mode;
  }


  // Save Data
  Save() {
    if (!this.allvalid())
      return;

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.Record.cost_type == "SEA") {
      this.Record.rec_category = "SEA EXPORT";
    }
    if (this.Record.cost_type == "AIR") {
      this.Record.rec_category = "AIR EXPORT";
    }
    this.Record._globalvariables = this.gs.globalVariables;

    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.RefreshList();
        // alert(this.InfoMessage);
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

    if (this.Record.cost_date.trim().length <= 0) {
      bret = false;
      sError += "| Date Cannot Be Blank";
    }


    if (this.Record.cost_currency_code == '' || this.Record.cost_currency_id == '') {
      bret = false;
      sError += "| Currency Cannot Be Blank";
    }

    if (this.Record.cost_exrate <= 0) {
      bret = false;
      sError += "| Invalid Exchange Rate";
    }

    if (this.Record.cost_drcr == '') {
      bret = false;
      sError += "| DN/CN Cannot Be Blank";
    }

    if (this.Record.cost_drcr_amount == 0) {
      bret = false;
      sError += "| Invalid Amount";
    }

    if ( this.gs.isBlank(this.Record.cost_type)) {
      bret = false;
      sError += "| Cost Type Cannot Be Blank";
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
    var REC = this.RecordList.find(rec => rec.cost_pkid == this.Record.cost_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.cost_folderno = this.Record.cost_folderno;
      REC.cost_refno = this.Record.cost_refno;
    }
  }

  OnBlur(field: string) {
    switch (field) {
      case 'cost_folderno':
        {
          this.Record.cost_folderno = this.Record.cost_folderno.toUpperCase();
          this.Record.cost_book_cntr = this.Record.cost_folderno;
          break;
        }
      case 'cost_remarks':
        {
          this.Record.cost_remarks = this.Record.cost_remarks.toUpperCase();
          break;
        }
      case 'cost_exrate':
        {
          this.Record.cost_exrate = this.gs.roundNumber(this.Record.cost_exrate, 5);
          break;
        }
      case 'cost_book_cntr':
        {
          this.Record.cost_book_cntr = this.Record.cost_book_cntr.toUpperCase();
          break;
        }
      case 'cost_drcr_amount':
        {
          this.Record.cost_drcr_amount = this.gs.roundNumber(this.Record.cost_drcr_amount, 2);
          break;
        }
      case 'cost_refno':
        {
          this.Record.cost_refno = this.Record.cost_refno.toUpperCase();
          break;
        }
    }
  }
  OnChange(field: string) {
    switch (field) {

    }
  }

  SearchRecord(controlname: string, controlid: string = "") {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.cost_mblid = '';
    this.Record.cost_mblno = '';
    if (this.Record.cost_category != 'GENERAL JOB' && this.Record.cost_category != 'OTHERS') {
      this.Record.cost_agent_id = '';
      this.Record.cost_agent_name = '';
      this.Record.cost_sob_date = '';
      this.Record.cost_folder_recdon = '';
    }
    if (controlname == 'cost_folderno') {
      if (this.Record.cost_folderno.trim().length <= 0)
        return;
    }

    this.loading = true;
    let SearchData = {
      rowtype: this.type,
      table: 'drcrissue',
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      folder_no: '',
      pkid: controlid
    };
    if (controlname == 'cost_folderno') {
      SearchData.rowtype = this.Record.cost_category;
      SearchData.table = 'drcrissue';
      SearchData.company_code = this.gs.globalVariables.comp_code;
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.year_code = this.gs.globalVariables.year_code;
      SearchData.folder_no = this.Record.cost_folderno;
    }
    if (controlname == 'releasecosting') {
      SearchData.table = 'releasecosting';
      SearchData.pkid = controlid;
    }

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        if (controlname == 'cost_folderno') {
          if (response.drcrissue.length > 0) {
            this.Record.cost_mblid = response.drcrissue[0].cost_mblid;
            if (this.Record.cost_category == "AIR EXPORT MAWBNO" || this.Record.cost_category == "AIR IMPORT MAWBNO")
              this.Record.cost_book_cntr = response.drcrissue[0].cost_mblno;
            else
              this.Record.cost_book_cntr = response.drcrissue[0].cost_book_cntr;

            if (this.Record.cost_category != 'GENERAL JOB' && this.Record.cost_category != 'OTHERS') {
              this.Record.cost_agent_id = response.drcrissue[0].cost_agent_id;
              this.Record.cost_agent_name = response.drcrissue[0].cost_agent_name;
              this.Record.cost_agent_code = response.drcrissue[0].cost_agent_code;
              this.Record.cost_agent_br_id = response.drcrissue[0].cost_agent_br_id;
              this.Record.cost_agent_br_no = response.drcrissue[0].cost_agent_br_no;
              this.Record.cost_agent_br_addr = response.drcrissue[0].cost_agent_br_addr;

              this.Record.cost_jv_agent_id = this.Record.cost_agent_id;
              this.Record.cost_jv_agent_name = this.Record.cost_agent_name;
              this.Record.cost_jv_agent_code = this.Record.cost_agent_code;
              this.Record.cost_jv_agent_br_id = this.Record.cost_agent_br_id;
              this.Record.cost_jv_agent_br_no = this.Record.cost_agent_br_no;
              this.Record.cost_jv_agent_br_addr = this.Record.cost_agent_br_addr;

              this.InitLov('AGENT');
              this.AGENTRECORD.id = this.Record.cost_agent_id;
              this.AGENTRECORD.code = this.Record.cost_agent_code;
              this.AGENTRECORD.name = this.Record.cost_agent_name;
              this.InitLov('AGENTADDRESS');
              this.AGENTADDRECORD.id = this.Record.cost_agent_br_id;
              this.AGENTADDRECORD.code = this.Record.cost_agent_br_no;
              this.AGENTADDRECORD.parentid = this.Record.cost_agent_id;

              this.InitLov('JVAGENT');
              this.JVAGENTRECORD.id = this.Record.cost_jv_agent_id;
              this.JVAGENTRECORD.code = this.Record.cost_jv_agent_code;
              this.JVAGENTRECORD.name = this.Record.cost_jv_agent_name;
              this.InitLov('JVAGENTADDRESS');
              this.JVAGENTADDRECORD.id = this.Record.cost_jv_agent_br_id;
              this.JVAGENTADDRECORD.code = this.Record.cost_jv_agent_br_no;
              this.JVAGENTADDRECORD.parentid = this.Record.cost_jv_agent_id;
            }

          }
          else {
            this.Record.cost_folderno = '';
            this.ErrorMessage = 'Invalid No';
            alert(this.ErrorMessage);
          }
        }
        if (controlname == 'releasecosting') {
          var REC = this.RecordList.find(rec => rec.cost_pkid == controlid)
          if (REC != null) {
            REC.cost_jv_posted = false;
          }
          this.InfoMessage = "Successfully Released";
          alert(this.InfoMessage);
        }
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

  folder_id: string;

  PrintNote(_type: string) {
    this.folder_id = this.gs.getGuid();
    this.loading = true;
    let SearchData = {
      type: _type,
      pkid: this.pkid,
      report_folder: '',
      folderid: '',
      branch_code: '',
      report_caption: '',
      parentid: '',
      comp_code: '',
      incometype: ''
    };
    SearchData.type = _type;
    SearchData.pkid = this.pkid;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.folderid = this.folder_id;
    SearchData.comp_code = this.gs.globalVariables.comp_code;

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.PrintNote(SearchData)
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

  //ReleaseCosting(event: any) {
  //  if (event.selected) {
  //    this.SearchRecord('releasecosting', event.id);
  //  }
  //}

  RemoveList(event: any) {
    if (event.selected) {
      this.RemoveRecord(event.id);
    }
  }

  RemoveRecord(Id: string) {
    this.loading = true;
    let SearchData = {
      rowtype: this.type,
      pkid: Id,
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Deleted Successfully";
        this.RecordList.splice(this.RecordList.findIndex(rec => rec.cost_pkid == Id), 1);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  ReleaseCosting(id: string, _refno: string) {
    let strmsg: string = "";
    strmsg = "RELEASE COSTING \n\n REF# : " + _refno;
    if (confirm(strmsg)) {
      this.SearchRecord('releasecosting', id);
    }
  }

  PrintInvoice(reportformat: string, _type: string = 'PDF', _invid: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (_invid.trim().length <= 0) {
      this.ErrorMessage = "Invalid Invoice ID";
      alert(this.ErrorMessage);
      return;
    }

    // if (_type == "MAIL") {

    //   this.mSubject = "SALES INVOICE  " + this.Record.jvh_docno;
    //   this.mSubject += " - M/S " + this.Record.jvh_acc_name;
    //   this.mSubject += " - DT " + this.jvh_date.GetDisplayDate();
    //   if (this.Record.jvh_cc_code != "") {
    //     this.mSubject += " - " + this.Record.jvh_cc_category + "#" + this.Record.jvh_cc_code;
    //   }

    //   this.mMsg = "Dear Valued Customer,";
    //   this.mMsg += " \n\n";
    //   this.mMsg += "  Pls find the attached sales invoice for your kind reference";
    //   this.mMsg += " \n\n";
    // }


    this.loading = true;
    this.folder_id = this.gs.getGuid();

    let SearchData = {
      type: '',
      araptype: '',
      pkid: '',
      report_folder: '',
      folderid: '',
      company_code: '',
      branch_code: '',
      report_caption: '',
      report_format: '',
      menuadmin: ''
    }

    SearchData.pkid = _invid;
    SearchData.report_format = reportformat;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.folderid = this.folder_id;
    SearchData.report_caption = "INVOICE";
    SearchData.menuadmin = this.bAdmin == true ? "Y" : "N";
    this.ErrorMessage = '';
    this.mainService.GenerateInvoice(SearchData)
      .subscribe(response => {
        this.loading = false;
        // if (_type == 'MAIL') {
        //   this.AttachList = new Array<any>();
        //   this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname });
        //   this.open(mailsent);
        // } else
        this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

}
