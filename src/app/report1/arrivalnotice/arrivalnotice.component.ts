import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { ArrivalNotice } from '../models/arrivalnotice';
import { ArrivalNoticeService } from '../services/arrivalnotice.service';
import { DateComponent } from '../../shared/date/date.component';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';


@Component({
  selector: 'app-arrivalnotice',
  templateUrl: './arrivalnotice.component.html',
  providers: [ArrivalNoticeService]
})

export class ArrivalNoticeComponent {
  title = 'Arrival Report'

  //@ViewChild('todate') private todate: DateComponent;
  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;

  modal: any;

  selectedRowIndex = 0;
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  ErrorMessage = "";
  mode = '';
  pkid = '';

  chkallselected: boolean = false;
  selectdeselect: boolean = false;
  type_date: string = 'SOB';
  from_date: string = '';
  to_date: string = '';
  branch_name: string;
  branch_code: string;
  shipper_id: string;
  consignee_id: string;
  agent_id: string;
  carrier_id: string;
  carriertype: string;
  pol_id: string;
  pod_id: string;
  porttype: string;
  hbl_pkid: string = "";

  priordays: number = 10;
  bExcel = false;
  disableSave = true;
  bCompany = false;
  all: boolean = false;
  bAdmin = false;
  loading = false;
  currentTab = 'LIST';
  searchstring = '';

  SearchData = {
    type: '',
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
    shipper_id: '',
    consignee_id: '',
    agent_id: '',
    carrier_id: '',
    pol_id: '',
    pod_id: '',
    all: false,
    priordays: 10,
    page_count: this.page_count,
    page_current: this.page_current,
    page_rows: this.page_rows,
    page_rowcount: this.page_rowcount
  };

  sTo_ids: string = '';
  sSubject: string = '';
  sMsg: string = '';
  sHtml: string = '';
  AttachList: any[] = [];

  // Array For Displaying List
  RecordList: ArrivalNotice[] = [];
  //  Single Record for add/edit/view details
  Record: ArrivalNotice = new ArrivalNotice;

  BRRECORD: SearchTable = new SearchTable();
  EXPRECORD: SearchTable = new SearchTable();
  IMPRECORD: SearchTable = new SearchTable();
  AGENTRECORD: SearchTable = new SearchTable();
  CARRIERRECORD: SearchTable = new SearchTable();
  POLRECORD: SearchTable = new SearchTable();
  PODRECORD: SearchTable = new SearchTable();

  constructor(
    private modalService: NgbModal,
    private mainService: ArrivalNoticeService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 20;
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
    this.bExcel = false;
    this.bCompany = false;
    this.bAdmin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_company)
        this.bCompany = true;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_print)
        this.bExcel = true;
    }

    this.porttype = "SEA PORT";
    this.carriertype = "SEA CARRIER";

    this.Init();
    this.initLov();
    this.LoadCombo();
  }

  Init() {
    this.type_date = "SOB";
    this.branch_code = this.gs.globalVariables.branch_code;
    this.branch_name = this.gs.globalVariables.branch_name;
    this.from_date = this.gs.defaultValues.monthbegindate;
    this.to_date = this.gs.defaultValues.today;
    this.shipper_id = '';
    this.consignee_id = '';
    this.agent_id = '';

    this.carrier_id = '';
    this.pol_id = '';
    this.pod_id = '';
  }

  // // Destroy Will be called when this component is closed
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
    }
    if (_Record.controlname == "SHIPPER") {
      this.shipper_id = _Record.id;
      // this.shipper_name = _Record.name;
    }
    if (_Record.controlname == "CONSIGNEE") {
      this.consignee_id = _Record.id;
      //  this.consignee_name = _Record.name;
    }
    if (_Record.controlname == "AGENT") {
      this.agent_id = _Record.id;
      // this.agent_code = _Record.code;
      // this.agent_name = _Record.name;
    }
    if (_Record.controlname == "CARRIER") {
      this.carrier_id = _Record.id;
      // this.carrier_code = _Record.code;
      // this.carrier_name = _Record.name;
    }
    if (_Record.controlname == "POL") {
      this.pol_id = _Record.id;
      // this.pol_code = _Record.code;
      //  this.pol_name = _Record.name;
    }
    if (_Record.controlname == "POD") {
      this.pod_id = _Record.id;
      // this.pod_code = _Record.code;
      // this.pod_name = _Record.name;
    }

  }
  LoadCombo() {
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

  // // Query List Data
  List(_type: string, mailsent: any) {

    this.ErrorMessage = '';
    if (this.shipper_id.trim().length <= 0) {
      this.ErrorMessage = "Shipper Cannot Be Blank";
      return;
    }


    this.loading = true;
    this.SearchData.pkid = this.hbl_pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.branch_name = this.gs.globalVariables.branch_name;
    this.SearchData.priordays = this.priordays;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.searchstring.toUpperCase();
    this.SearchData.type = _type;
    this.SearchData.shipper_id = this.shipper_id;
    this.SearchData.page_count = this.page_count;
    this.SearchData.page_current = this.page_current;
    this.SearchData.page_rows = this.page_rows;
    this.SearchData.page_rowcount = this.page_rowcount;

    this.ErrorMessage = '';
    this.mainService.List(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        this.chkallselected = false;
        this.selectdeselect = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else if (_type == 'MAIL') {
          this.AttachList = new Array<any>();
          // this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname });
          this.setMailBody();
          this.sTo_ids = response.mailto_ids;
          this.sSubject = response.mailsubject;
          this.sHtml = response.mailmessage;
          this.open(mailsent);
        }
        else {
          this.RecordList = response.list;
          this.page_count = response.page_count;
          this.page_current = response.page_current;
          this.page_rowcount = response.page_rowcount;
        }
      },
        error => {
          this.loading = false;
          this.RecordList = null;
          this.ErrorMessage = this.gs.getError(error);
        });
  }
  setMailBody() {

    // this.sSubject = "LINER BOOKING REPORT";

    this.sMsg  = "  Kindly inform your customer to arrange for the delivery immediately upon arrival to avoid any detention / demurrage.";
    this.sMsg += " \n\n";
    this.sMsg += "  Thanks for your understanding and confirmation.";
    this.sMsg += " \n\n";
  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  OnChange(field: string) {
    this.RecordList = null;

  }

  Close() {
    this.gs.ClosePage('home');
  }

  open(content: any) {
    this.modal = this.modalService.open(content);
  }

  SelectDeselect() {
    this.selectdeselect = !this.selectdeselect;
    for (let rec of this.RecordList) {
      rec.hbl_selected = this.selectdeselect;
    }
  }

  Showemail(_id: string, msent: any) {
    this.hbl_pkid = _id;
    this.List('MAIL', msent);
  }
}
