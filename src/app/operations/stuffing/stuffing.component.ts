
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { StuffingReport } from '../models/stuffingreport';
import { StuffingReportService } from '../services/stuffingreport.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-stuffing',
  templateUrl: './stuffing.component.html',
  providers: [StuffingReportService]
})

export class StuffingComponent {
  // Local Variables 
  title = 'Stuffing / Loading Confirmation';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  selectedRowIndex = 0;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  searchstring = '';
  searchexpid = '';
  searchtype = 'STUFFING CONFIRMATION';
  mailformat = 'DEFAULT';

  modal: any;
  sub: any;
  urlid: string;
  AttachList: any[] = [];
  sTo_ids: string = '';
  sSubject: string = '';
  sHtml: string = '';
  sMsg: string = '';

  ErrorMessage = "";
  mode = '';
  pkid = '';
  cntrpkid = '';

  SearchData = {
    type: '',
    pkid: '',
    report_folder: '',
    company_code: '',
    branch_code: '',
    year_code: '',
    searchstring: '',
    searchexpid: '',
    searchtype: '',
    mailformat: ''
  };

  EXPRECORD: any;
  EXPREC: any = { id: '', code: '', name: '' };
  // Array For Displaying List
  RecordList: StuffingReport[] = [];
  // Single Record for add/edit/view details
  Record: StuffingReport = new StuffingReport;

  constructor(
    private modalService: NgbModal,
    private mainService: StuffingReportService,
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
    this.searchtype = 'STUFFING CONFIRMATION';
    this.mailformat = 'DEFAULT';
    this.cntrpkid = '';
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
    this.initLov();
    this.LoadCombo();
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  initLov(caption: string = '') {
    if (caption == '' || caption == 'SHIPPER')
      this.EXPRECORD = {
        controlname: 'SHIPPER', type: 'CUSTOMER', where: " CUST_IS_SHIPPER = 'Y' ", displaycolumn: 'NAME',
        parentid: '', id: this.EXPREC.id, code: this.EXPREC.code, name: this.EXPREC.name
      };
  }

  LovSelected(_Record: SearchTable) {

    // Company Settings
    if (_Record.controlname == 'SHIPPER') {
      this.searchexpid = _Record.id;
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

  // Query List Data
  List(_type: string, mailsent: any) {
    if (this.searchstring.trim().length <= 0) {
      this.ErrorMessage = 'Container Cannot Be Blank';
      return;
    }

    this.loading = true;
    this.pkid = this.gs.getGuid();
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.searchstring.toUpperCase();
    this.SearchData.searchexpid = this.searchexpid;
    this.SearchData.type = _type;
    this.SearchData.searchtype = this.searchtype;
    this.SearchData.mailformat = this.mailformat;

    this.ErrorMessage = '';
    this.mainService.List(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else if (_type == "MAIL") {

          this.sTo_ids = response.mailto_ids;
          this.sSubject = response.mailsubject;
          this.sHtml = response.mailmessage;
          this.cntrpkid = response.cntrpkid;
          this.AttachList = new Array<any>();
          if (this.mailformat == "NEWFORMAT") {
            this.sMsg = this.sHtml;
            this.sHtml = '';
            this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname, filesize: response.filesize });
          }
          this.open(mailsent);
        }
        else {
          this.RecordList = response.list;
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
  Close() {
    this.gs.ClosePage('home');
  }
  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }
}
