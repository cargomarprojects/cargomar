import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Costingm } from '../../models/costing';
import { Costingd } from '../../models/costing';
import { DrCrService } from '../../services/drcr.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { FileDetails } from '../../models/filedetails';

@Component({
  selector: 'app-drcr',
  templateUrl: './drcr.component.html',
  providers: [DrCrService]
})
export class DrCrComponent {
  // Local Variables 

  title = 'DrCr Issue';
  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  modal: any;
  selectedRowIndex: number = -1;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  printfcbank: boolean = false;
  lock_record: boolean = false;
  lock_date: boolean = false;
  bAdmin = false;

  sSubject: string = '';
  ftpUpdtSql: string = '';
  ftpTransfertype: string = 'DRCR ISSUE';
  FtpAttachList: any[] = [];
  FileList: FileDetails[] = [];
  ftp_agent_name: string = "";
  ftp_agent_code: string = "";
  AttachList: any[] = [];
  canftp: boolean = false;
  mMsg: string = "";

  sub: any;
  urlid: string;

  ErrorMessage = "";
  InfoMessage = "";

  refno = '';
  mode = '';
  pkid = '';

  AGENTRECORD: SearchTable = new SearchTable();
  AGENTADDRECORD: SearchTable = new SearchTable();
  JVAGENTRECORD: SearchTable = new SearchTable();
  JVAGENTADDRECORD: SearchTable = new SearchTable();
  CURRECORD: SearchTable = new SearchTable();
  // Array For Displaying List
  RecordList: Costingm[] = [];
  RecordDetList: Costingd[] = [];
  // Single Record for add/edit/view details
  Record: Costingm = new Costingm;
  RecordDet: Costingd = new Costingd;

  constructor(
    private modalService: NgbModal,
    private mainService: DrCrService,
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
    this.AttachList = new Array<any>();
    this.bAdmin = false;
    this.currentTab = 'LIST';
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
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
      from_date: this.gs.globalData.cost_drcr_fromdate,
      to_date: this.gs.globalData.cost_drcr_todate,
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
    this.Record.cost_type = 'SEA';
    this.Record.cost_source = 'DRCR ISSUE';
    this.Record.cost_book_cntr = '';
    this.Record.cost_jv_agent_id = "";
    this.Record.cost_jv_agent_code = "";
    this.Record.cost_jv_agent_name = "";
    this.Record.cost_jv_agent_br_id = "";
    this.Record.cost_jv_agent_br_no = "";
    this.Record.cost_jv_agent_br_addr = "";
    this.Record.cost_jv_br_inv_id = '';

    this.Record.rec_mode = this.mode;
    this.NewDetRecord(1);
    //this.InitDetList();
    this.InitLov('');
  }


  InitDetList() {
    this.RecordDetList = new Array<Costingd>();
    this.NewDetRecord(1);
    this.RecordDetList.push(this.RecordDet);
    this.NewDetRecord(2);
    this.RecordDetList.push(this.RecordDet);
    this.NewDetRecord(3);
    this.RecordDetList.push(this.RecordDet);
    this.NewDetRecord(4);
    this.RecordDetList.push(this.RecordDet);
    this.NewDetRecord(5);
    this.RecordDetList.push(this.RecordDet);
    this.NewDetRecord(6);
    this.RecordDetList.push(this.RecordDet);
    this.NewDetRecord(7);
    this.RecordDetList.push(this.RecordDet);
  }
  NewDetRecord(iCtr: number) {
    this.RecordDet = new Costingd();
    this.RecordDet.costd_pkid = this.gs.getGuid();
    this.RecordDet.costd_parent_id = this.Record.cost_pkid;
    this.RecordDet.costd_category = "INVOICE";
    this.RecordDet.costd_blno = "";
    this.RecordDet.costd_acc_name = "";
    this.RecordDet.costd_remarks = "";
    this.RecordDet.costd_acc_qty = 1;
    this.RecordDet.costd_acc_rate = 1;
    this.RecordDet.costd_acc_amt = 0;
    this.RecordDet.costd_srate = 0;
    this.RecordDet.costd_brate = 0;
    this.RecordDet.costd_split = 0;
    this.Record.DetailList.push(this.RecordDet);
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

  LoadData(_Record: Costingm) {
    this.Record = _Record;
    // this.InitDetList();
    //for (let rec of _Record.DetailList) {
    //  this.RecordDetList[rec.costd_ctr - 1].costd_pkid = rec.costd_pkid;
    //  this.RecordDetList[rec.costd_ctr - 1].costd_parent_id = rec.costd_parent_id;
    //  this.RecordDetList[rec.costd_ctr - 1].costd_acc_id = rec.costd_acc_id;
    //  this.RecordDetList[rec.costd_ctr - 1].costd_acc_name = rec.costd_acc_name;
    //  this.RecordDetList[rec.costd_ctr - 1].costd_acc_amt = rec.costd_acc_amt;
    //  this.RecordDetList[rec.costd_ctr - 1].costd_ctr = rec.costd_ctr;
    //}
    this.InitLov('CURRENCY');
    this.CURRECORD.id = this.Record.cost_currency_id;
    this.CURRECORD.code = this.Record.cost_currency_code;
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

    this.FindTotal();

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
    //this.Record.DetailList = this.RecordDetList;

    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        if (this.mode == 'ADD') {
          this.Record.cost_refno = response.docno;
        }
        this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.RefreshList();
        //  alert(this.InfoMessage);
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
    }
  }
  OnChange(field: string) {
    switch (field) {

    }
  }

  OnBlurTableCell(field: string, fieldid: string) {
    var REC = this.RecordDetList.find(rec => rec.costd_pkid == fieldid);
    if (REC != null) {
      if (field == "costd_acc_name")
        REC.costd_acc_name = REC.costd_acc_name.toUpperCase();
      if (field == "costd_acc_amt") {
        REC.costd_acc_amt = this.gs.roundNumber(REC.costd_acc_amt, 2);
        this.FindTotal();
      }
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
          }
        }
        if (controlname == 'releasecosting') {
          var REC = this.RecordList.find(rec => rec.cost_pkid == controlid)
          if (REC != null) {
            REC.cost_jv_posted = false;
          }
          this.InfoMessage = "Successfully Released";
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  Close() {
    this.gs.ClosePage('home');
  }

  FindTotal() {
    let drcramt = 0;
    //for (let rec of this.RecordDetList) {
    //  drcramt += rec.costd_acc_amt;
    //}
    for (let rec of this.Record.DetailList) {
      drcramt += rec.costd_acc_amt;
    }
    drcramt = this.gs.roundNumber(drcramt, 2);
    this.Record.cost_drcr_amount = drcramt;
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
      incometype: '',
      printfcbank: 'N'
    };
    SearchData.type = _type;
    SearchData.pkid = this.pkid;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.folderid = this.folder_id;
    SearchData.comp_code = this.gs.globalVariables.comp_code;
    SearchData.printfcbank = this.printfcbank == true ? 'Y' : 'N';

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
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  open(content: any) {
    this.modal = this.modalService.open(content);
  }

  ShowCostSent(costsent: any, id: string, _refno: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.pkid = id;
    this.refno = _refno;
    this.open(costsent);
  }

  ModifiedRecords(params: any) {
    //var REC = this.RecordList.find(rec => rec.cost_pkid == params.sid);
    //if (REC != null) {
    //  if (params.saction == "SENT-ON")
    //    REC.cost_sent_on = params.sdate;
    //  if (params.saction == "CHECKED-ON")
    //    REC.cost_checked_on = params.sdate;
    //}
    for (let rec of this.RecordList.filter(rec => rec.cost_pkid == params.sid)) {
      if (params.saction == "SENT-ON")
        rec.cost_sent_on = params.sdate;
      if (params.saction == "CHECKED-ON")
        rec.cost_checked_on = params.sdate;
    }
    this.modal.close();
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

  ShowInvoice(costinvoice: any, _sid: string) {
    this.ErrorMessage = '';
    this.pkid = _sid;
    this.open(costinvoice);
  }

  GenerateXml(ftpsent: any) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
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
      agent_code: this.Record.cost_jv_agent_code,
      agent_name: this.Record.cost_jv_agent_name,
      cost_pkid: this.pkid
    };

    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.cost_pkid = this.pkid;
    SearchData.agent_code = this.Record.cost_jv_agent_code;
    SearchData.agent_name = this.Record.cost_jv_agent_name;

    this.mainService.GenerateXmlCostingInvoice(SearchData)
      .subscribe(response => {
        this.loading = false;
        // this.InfoMessage = response.savemsg;
        this.sSubject = "REF#-" + this.Record.cost_refno;
        this.mMsg = response.mailmsg;
        this.canftp = response.canftp;
        this.ftp_agent_code = this.Record.cost_jv_agent_code;
        this.ftp_agent_name = this.Record.cost_jv_agent_name;
        this.FtpAttachList = new Array<any>();
        this.FileList = response.filelist;
        this.AttachList = new Array<any>();
        for (let rec of this.FileList) {
          if (rec.filetype === "PDF")
            this.AttachList.push({ filename: rec.filename, filetype: rec.filetype, filedisplayname: rec.filedisplayname, filecategory: '', fileftpfolder: '', fileisack: 'N', fileprocessid: '', filesize: rec.filesize });
          this.FtpAttachList.push({ filename: rec.filename, filetype: rec.filetype, filedisplayname: rec.filedisplayname, filecategory: rec.filecategory, fileftpfolder: 'FTP-FOLDER-COSTING', fileisack: 'N', fileprocessid: rec.fileprocessid, filesize: rec.filesize, fileftptype: 'BL-FTP' });
        }
        this.open(ftpsent);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  PrintInvoice(reportformat: string, _type: string = 'PDF', _invid: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (_invid.trim().length <= 0) {
      this.ErrorMessage = "Invalid Invoice ID";
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
        });
  }
}
