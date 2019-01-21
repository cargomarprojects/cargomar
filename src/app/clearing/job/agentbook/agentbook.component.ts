import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { AgentBookingm } from '../../models/agentbooking';
import { AgentbookingService } from '../../services/agentbooking.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { DateComponent } from '../../../shared/date/date.component';

@Component({
  selector: 'app-agentbook',
  templateUrl: './agentbook.component.html',
  providers: [AgentbookingService]
})
export class AgentBookComponent {
  // Local Variables 
  title = 'AGENTBOOK MASTER';

  @ViewChild('ab_book_date') private ab_book_date: DateComponent;

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  modal: any;

  ord_selected = false;
  chkselected = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  JobTab = 'LIST';

  ord_po = "";
  searchstring = '';
  ord_trkids = "";
  ord_trkpos = "";

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;


  book_id: string;

  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';

  // Array For Displaying List
  RecordList: AgentBookingm[] = [];
  // Single Record for add/edit/view details
  Record: AgentBookingm = new AgentBookingm;

  // Shipper
  EXPRECORD: SearchTable = new SearchTable();
  AGENTRECORD: SearchTable = new SearchTable();
  IMPRECORD: SearchTable = new SearchTable();

  constructor(
    private modalService: NgbModal,
    private mainService: AgentbookingService,
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
    this.ord_po = "";
    this.ord_trkids = "";
    this.ord_trkpos = "";
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;

    this.InitLov();
    this.LoadCombo();
    this.currentTab = 'LIST';
    this.List("NEW");
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  LoadCombo() {

  }


  InitLov() {

    this.EXPRECORD = new SearchTable();
    this.EXPRECORD.controlname = "SHIPPER";
    this.EXPRECORD.displaycolumn = "CODE";
    this.EXPRECORD.type = "CUSTOMER";
    this.EXPRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
    this.EXPRECORD.id = "";
    this.EXPRECORD.code = "";
    this.EXPRECORD.name = "";

    this.AGENTRECORD = new SearchTable();
    this.AGENTRECORD.controlname = "AGENT";
    this.AGENTRECORD.displaycolumn = "CODE";
    this.AGENTRECORD.type = "CUSTOMER";
    this.AGENTRECORD.where = " CUST_IS_AGENT = 'Y' ";
    this.AGENTRECORD.id = "";
    this.AGENTRECORD.code = "";
    this.AGENTRECORD.name = "";

    this.IMPRECORD = new SearchTable();
    this.IMPRECORD.controlname = "CONSIGNEE";
    this.IMPRECORD.displaycolumn = "CODE";
    this.IMPRECORD.type = "CUSTOMER";
    this.IMPRECORD.where = " CUST_IS_CONSIGNEE = 'Y' ";
    this.IMPRECORD.id = "";
    this.IMPRECORD.code = "";
    this.IMPRECORD.name = "";
    this.IMPRECORD.parentid = "";
  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "SHIPPER") {
      this.Record.ab_exp_id = _Record.id;
      this.Record.ab_exp_code = _Record.code;
      this.Record.ab_exp_name = _Record.name;
    }
    else if (_Record.controlname == "AGENT") {
      this.Record.ab_agent_id = _Record.id;
      this.Record.ab_agent_code = _Record.code;
      this.Record.ab_agent_name = _Record.name;
    }
    else if (_Record.controlname == "CONSIGNEE") {
      this.Record.ab_imp_id = _Record.id;
      this.Record.ab_imp_code = _Record.code;
      this.Record.ab_imp_name = _Record.name;
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
      this.pkid = id;
      this.mode = 'EDIT';
      this.ResetControls();
      this.GetRecord(id, '');
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
      from_date: '',
      to_date: ''
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
    this.ord_po = "";
    this.chkselected = false;
    this.ord_selected = false;
    this.pkid = this.gs.getGuid();
    this.Record = new AgentBookingm();
    this.Record.ab_pkid = this.pkid;
    this.Record.ab_book_no = null;
    this.Record.ab_book_date = this.gs.defaultValues.today;
    this.Record.ab_agent_id = '';
    this.Record.ab_agent_code = '';
    this.Record.ab_agent_name = '';
    this.Record.ab_exp_id = '';
    this.Record.ab_exp_code = '';
    this.Record.ab_exp_name = '';
    this.Record.ab_imp_id = '';
    this.Record.ab_imp_code = '';
    this.Record.ab_imp_name = '';
    this.Record.ab_remarks = '';
    this.Record.ab_approved = false;
    this.InitLov();
    this.Record.rec_mode = this.mode;
  }
  //book_id: string;
  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string, _type: string) {
    this.loading = true;

    //if (_type != "EXCEL") {
    //  //this.book_id = '';
    //  this.book_id = Id;
    //}
    let SearchData = {
      pkid: Id,
      report_folder: this.gs.globalVariables.report_folder,
      file_pkid: this.gs.getGuid(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      Type: _type,

    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL' || _type == 'BOOKING-CSV')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.LoadData(response.record);
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  LoadData(_Record: AgentBookingm) {
    this.ord_po = "";
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
    this.Record.OrderList = _Record.OrderList;
    this.ord_selected = false;
    if (this.Record.OrderList.length > 0)
      this.ord_selected = true;
    this.chkselected = this.ord_selected;

    this.InitLov();

    this.EXPRECORD.id = this.Record.ab_exp_id;
    this.EXPRECORD.code = this.Record.ab_exp_code;
    this.EXPRECORD.name = this.Record.ab_exp_name;
    this.AGENTRECORD.id = this.Record.ab_agent_id;
    this.AGENTRECORD.code = this.Record.ab_agent_code;
    this.AGENTRECORD.name = this.Record.ab_agent_name;
    this.IMPRECORD.id = this.Record.ab_imp_id;
    this.IMPRECORD.code = this.Record.ab_imp_code;
    this.IMPRECORD.name = this.Record.ab_imp_name;
  }

  // Save Data
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
        if (this.mode == 'ADD') {
          this.Record.ab_book_no = response.bookno;
          this.InfoMessage = "New Record " + this.Record.ab_book_no + " Generated Successfully";
        } else
          this.InfoMessage = "Save Complete";

        this.mode = 'EDIT';
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

    if (this.Record.ab_book_date.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Date Cannot Be Blank";
    }
    if (this.Record.ab_agent_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Agent Cannot Be Blank";
    }
    //if (this.Record.ab_exp_id.trim().length <= 0) {
    //    bret = false;
    //    sError += "\n\r | Exporter Cannot Be Blank";
    //}

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {
    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.ab_pkid == this.Record.ab_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
      REC = this.RecordList.find(rec => rec.ab_pkid == this.Record.ab_pkid);
      REC.ab_book_date = this.ab_book_date.GetDisplayDate();
    }
    else {
      REC.ab_agent_name = this.Record.ab_agent_name;
      REC.ab_exp_name = this.Record.ab_exp_name;
      REC.ab_imp_name = this.Record.ab_imp_name;
      REC.ab_book_date = this.ab_book_date.GetDisplayDate();
      REC.ab_remarks = this.Record.ab_remarks;
    }
  }


  OnBlur(field: string) {
    switch (field) {

      case 'ord_po':
        {
          this.ord_po = this.ord_po.toUpperCase();
          break;
        }
      case 'ab_remarks':
        {
          this.Record.ab_remarks = this.Record.ab_remarks.toUpperCase();
          break;
        }
    }
  }
  OnBlurTableCell(field: string, fieldid: string) {
    var REC = this.Record.OrderList.find(rec => rec.ord_pkid == fieldid);
    if (REC != null) {
      if (field == "ord_booking_no")
        REC.ord_booking_no = REC.ord_booking_no.toUpperCase();
    }
  }
  Close() {
    this.gs.ClosePage('home');
  }

  OrderList(_Record: AgentBookingm) {

    this.ErrorMessage = '';
    this.InfoMessage = '';
    //if (this.ord_po.trim().length <= 0) {

    //  this.ErrorMessage += " | PO Cannot Be Blank";
    //}
    if (this.ErrorMessage)
      return;

    this.loading = true;
    let SearchData = {
      rowtype: this.type,
      ordpo: this.ord_po,
      bookid: _Record.ab_pkid,
      agentid: _Record.ab_agent_id,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code

    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.OrderList(SearchData)
      .subscribe(response => {
        this.loading = false;
        var REC = null;

        for (let Rec of response.list) {
          REC = this.Record.OrderList.find(a => a.ord_pkid == Rec.ord_pkid);
          if (REC == null) {
            this.Record.OrderList.push(Rec);
          }
        }


        // this.Record.OrderList = response.list;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  SelectDeselect() {
    this.chkselected = !this.chkselected;
    for (let rec of this.Record.OrderList) {
      rec.ord_selected = this.chkselected;
    }
  }

  open(content: any) {
    this.modal = this.modalService.open(content);
  }

  TrackOrders(trkorder: any) {
    this.ErrorMessage = "";
    this.ord_trkids = "";
    this.ord_trkpos = "";
    for (let rec of this.Record.OrderList) {

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
}
