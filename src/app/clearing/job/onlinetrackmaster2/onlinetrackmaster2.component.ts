import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Joborderm } from '../../models/joborder';
import { JobOrder_VM } from '../../models/joborder';
import { OnlineTrackMaster2Service } from '../../services/onlinetrackmaster2.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { User } from '../../../admin/models/user';

@Component({
  selector: 'app-onlinetrackmaster2',
  templateUrl: './onlinetrackmaster2.component.html',
  providers: [OnlineTrackMaster2Service]
})
export class OnlineTrackMaster2Component {
  // Local Variables 
  title = 'Tracking List';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  modal: any;

  bAdmin = false;
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

  list_opr_type: string = "AIR EXPORT,SEA EXPORT";
  list_tp_code: string = "ALL";
  ord_trkids: string = "";
  ord_trkpos: string = "";
  job_docno: string = "";
  master_no: string = "";
  house_no: string = "";
  ord_po: string = "";
  ord_invoice: string = "";
  from_date: string = '';
  to_date: string = '';
  ord_showpending: boolean = false;
  ord_status: string = "ALL";
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
  ftp_agent_name: string = "";
  ftp_agent_code: string = "";

  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';


  bShowPasteData: boolean = false;
  bDisabledControl: boolean = false;
  selectcheckbox: boolean = false;
  selectcheck: boolean = false;


  LIST_EXPRECORD: SearchTable = new SearchTable();
  LIST_IMPRECORD: SearchTable = new SearchTable();
  LIST_AGENTRECORD: SearchTable = new SearchTable();

  TpList: User[] = [];
  OrdColList: any[] = [];
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
    private mainService: OnlineTrackMaster2Service,
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
    this.from_date = this.gs.getNewdate(60);
    this.to_date = "";
    if (this.gs.globalVariables.istp)
      this.list_tp_code = this.gs.globalVariables.tp_code;
    this.bAdmin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
    }
    this.LoadCombo();
    this.initLov();
    this.List("NEW");
  }

  //// Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  initLov(caption: string = '') {

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



  }

  LoadCombo() {

    this.list_agent_id = "";
    this.list_exp_id = "";
    this.list_imp_id = "";
    this.job_docno = "";
    this.ord_po = "";
    this.ord_invoice = "";
    this.ord_status = "ALL";
    this.sort_colname = "a.rec_created_date desc";
    this.SortList = [
      { "colheadername": "CREATED", "colname": "a.rec_created_date desc" },
      { "colheadername": "AGENT,SHIPPER,PO", "colname": "agent.cust_name,exp.cust_name,ord_po" }
    ];

    this.loading = true;
    let SearchData = {
      type: 'TPLIST',
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
    };

    SearchData.comp_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.LoadDefault(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.TpList = response.tplist;

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });

  }

  ////function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
  }




  //// Query List Data
  List(_type: string) {
    this.loading = true;
    this.selectcheck = false;
    this.selectcheckbox = false;

    let SearchData = {
      type: _type,
      rowtype: this.list_opr_type,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      job_docno: this.job_docno,
      house_no: this.house_no,
      master_no: this.master_no,
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
      sort_colname: this.sort_colname,
      tp_code: this.gs.globalVariables.tp_code,
      tp_name: this.gs.globalVariables.tp_name,
      istp: this.gs.globalVariables.istp,
      root_folder: this.gs.defaultValues.root_folder,
      list_tp_code: this.list_tp_code
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


  OnBlur(field: string) {
    switch (field) {
      case 'master_no':
        {
          this.master_no = this.master_no.toUpperCase();
          break;
        }
      case 'house_no':
        {
          this.house_no = this.house_no.toUpperCase();
          break;
        }
    }
  }


  ShowPage(_rec: Joborderm) {
    _rec.row_displayed = !_rec.row_displayed;
  }



  Close() {
    this.gs.ClosePage('home');
  }



  ModifiedRecords(params: any) {
    // if (params.type == "MAIL-PO-CHECKLIST") {
    //   this.MailOrders('','MULTIPLE','CHECK-LIST');
    // }
  }

  ShowFile(id: string) {
    this.gs.DownloadFileDirect(id);
  }


}
