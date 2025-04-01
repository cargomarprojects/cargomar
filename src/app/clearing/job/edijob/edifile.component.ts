import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { XmlJobHeader } from '../../models/xmljobheader';
import { EdijobService } from '../../services/edijob.service';
import { DateComponent } from '../../../shared/date/date.component';

@Component({
  selector: 'app-edifile',
  templateUrl: './edifile.component.html',
  providers: [EdijobService]
})

export class EdifileComponent {
  title = 'Edi Files'

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;

  modal: any;

  selectedRowIndex = 0;
  InfoMessage = "";
  ErrorMessage = "";
  mode = '';
  pkid = '';

  bExcel = false;
  bCompany = false;
  bAdmin = false;
  bDelete = false;
  loading = false;
  currentTab = 'LIST';
  searchstring = '';
  searchprocessed: string = 'ALL';

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sSubject: string = '';
  sMsg: string = '';
  sHtml: string = '';

  AttachList: any[] = [];
  FileList: any[] = [];
  // Array For Displaying List
  RecordList: XmlJobHeader[] = [];
  //  Single Record for add/edit/view details
  Record: XmlJobHeader = new XmlJobHeader;
  // RecordList2: Linkm2[] = [];

  constructor(
    private modalService: NgbModal,
    private mainService: EdijobService,
    private route: ActivatedRoute,
    public gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 15;
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
    this.searchprocessed = "ALL";
    this.bExcel = false;
    this.bCompany = false;
    this.bAdmin = false;
    this.bDelete = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_company)
        this.bCompany = true;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_print)
        this.bExcel = true;
      this.bDelete = this.menu_record.rights_delete;
    }
    this.Init();
    this.initLov();
    this.LoadCombo();
  }

  Init() {

  }

  // // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  initLov(caption: string = '') {




  }

  LovSelected(_Record: SearchTable) {


  }
  LoadCombo() {
    this.List('NEW');
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

  }

  // // Query List Data
  List(_type: string) {

    this.ErrorMessage = '';
    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      user_code: this.gs.globalVariables.user_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      report_folder: this.gs.globalVariables.report_folder,
      searchprocessed: this.searchprocessed
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.FileList(SearchData)
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
      }, error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
        alert(this.ErrorMessage);
      });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }



  OnChange(field: string) {
    this.RecordList = null;

  }
  OnBlur(field: string) {
    switch (field) {
      case 'searchstring':
        {
          this.searchstring = this.searchstring.toUpperCase();
          break;
        }
    }
  }

  Close() {
    this.gs.ClosePage('home');
  }

  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }

  ImportData(_id: string = '') {

    if (_id && !confirm("Process selected File")) {
      return;
    }

    this.loading = true;
    let eSearchData = {
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      user_code: this.gs.globalVariables.user_code,
      report_folder: this.gs.globalVariables.report_folder,
      file_pkid: _id
    };

    this.ErrorMessage = '';
    this.mainService.ImportData(eSearchData)
      .subscribe(response => {
        this.loading = false;
        if (_id) {
          if (this.RecordList != null) {
            var REC = this.RecordList.find(rec => rec.file_pkid == _id);
            if (REC != null) {
              REC.processed = response.processed;
            }
          }
        } else {
          this.List('NEW');
        }
        if (response.error)
          alert(response.error);

        // alert('Download Complete');
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  DownloadData() {
    this.loading = true;
    let eSearchData = {
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      user_code: this.gs.globalVariables.user_code,
      report_folder: this.gs.globalVariables.report_folder,
      caption: 'SB-SHIPPER-INVOICE'
    };

    this.ErrorMessage = '';
    this.mainService.InwardEdiEmailDownload(eSearchData)
      .subscribe(response => {
        this.loading = false;
        this.List('NEW');
        // alert('Download Complete');
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });

  }

  ProcessDocuments(_file_id) {

    this.loading = true;
    let eSearchData = {
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      user_code: this.gs.globalVariables.user_code,
      report_folder: this.gs.globalVariables.report_folder,
      file_pkid: _file_id,
      printcsv: 'Y'
    };

    this.ErrorMessage = '';
    this.mainService.ProcessDocuments(eSearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.error)
          alert(response.error);

        if (response.filename)
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  RemoveList(event: any) {
    if (event.selected) {
      this.RemoveRecord(event.id);
    }
  }

  RemoveRecord(Id: string) {
    this.loading = true;
    let SearchData = {
      pkid: Id
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList.splice(this.RecordList.findIndex(rec => rec.file_pkid == Id), 1);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  AutoFill() {
    this.loading = true;
    let eSearchData = {
      company_code: 'CPL',
      branch_code: 'CHNSF',
      user_code: 'ADMIN',
      report_folder: this.gs.globalVariables.report_folder,
      caption: 'SB-SHIPPER-INVOICE'
    };

    this.ErrorMessage = '';
    this.mainService.ProcessSb(eSearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.error)
          alert(response.error);

        // alert('Download Complete');
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

}
