import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';

import { Rebate  } from '../models/rebate';
import { RepService } from '../services/report.service';

@Component({
  selector: 'app-rebate',
  templateUrl: './rebate.component.html',
  providers: [RepService]
})

export class RebateComponent {
  title = 'Rebate Report'

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  
  modal: any;
  sub: any;
  urlid: string;

  ErrorMessage = "";
  mode = '';
  pkid = '';

  jvno: string = '';
  jvid: string = '';
  jvdate: string = '';


  bShowDlg: boolean = false;

  hbl_type: string = 'SEA EXPORT';
  from_date: string = '';
  to_date: string = '';
  branch_name: string;
  branch_code: string;

  disableSave = true;
  bAdmin = false;
  bCompany = false;
  all: boolean = false;
  loading = false;
  currentTab = 'LIST';
  searchstring = '';

  showpaid: boolean = false;
  paymentwise: boolean = false;



  SearchData = {
    type: '',
    rebate_type  :'',
    pkid: '',
    report_folder: '',
    company_code: '',
    branch_code: '',
    branch_name: '',
    year_code: '',
    searchstring: '',
    hbl_type: '',
    from_date: '',
    to_date: '',
    all: false,
    showpaid: false
  };


  // Array For Displaying List
  RecordList: Rebate[] = [];
  // Single Record for add/edit/view details
  Record: Rebate = new Rebate;


  SelectedList: Rebate[] = [];

  BRRECORD: SearchTable = new SearchTable();

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
    this.bAdmin = false;
    this.bCompany = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;

      if (this.menu_record.rights_company)
        this.bCompany = true;

      if (this.menu_record.rights_admin)
        this.bAdmin = true;

      if (this.bCompany)
        this.bAdmin = false;

      if (this.gs.globalVariables.user_code == "ADMIN")
        this.bAdmin = true;
    }

    this.Init();
    this.initLov();
    this.LoadCombo();
  }

  Init() {
    this.hbl_type = "ALL";
    this.branch_code = this.gs.globalVariables.branch_code;
    this.branch_name = this.gs.globalVariables.branch_name;
    this.from_date = this.gs.defaultValues.monthbegindate;
    this.to_date = this.gs.defaultValues.today;
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
  }

  LovSelected(_Record: SearchTable) {
    // Company Settings
    if (_Record.controlname == "BRANCH") {
      this.branch_code = _Record.code;
      this.branch_name = _Record.name;
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
  List(_type: string) {

    this.ErrorMessage = '';
    //if (this.from_date.trim().length <= 0) {
    //  this.ErrorMessage = "From Date Cannot Be Blank";
    //  return;
    //}
    //if (this.to_date.trim().length <= 0) {
    //  this.ErrorMessage = "To Date Cannot Be Blank";
    //  return;
    //}

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
    this.SearchData.hbl_type = this.hbl_type;
    this.SearchData.from_date = this.from_date;
    this.SearchData.to_date = this.to_date;
    this.SearchData.all = this.all;
    this.SearchData.showpaid = this.showpaid;

    this.SearchData.rebate_type = this.type;

    this.ErrorMessage = '';
    this.mainService.RebateReport(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
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
  Close() {
    this.gs.ClosePage('home');
  }

  ShowDlg(content:any) {
    let sid: string = '';
    let bok: boolean = true;
    let serr: string = '';

    this.mode = 'ADD';

    this.jvid = "";
    this.jvno = "0";

    this.SelectedList = new Array<Rebate>();
    this.RecordList.forEach(rec => {
      if (rec.selected) {
        this.SelectedList.push(rec);
        if (sid == '') {
          sid = rec.hbl_pkid;
        }

        if (rec.inv_date_original != '')
          this.jvdate = rec.inv_date_original;

        if (sid != rec.hbl_pkid) {
          bok = false;
          serr = 'Different SI Nos cannot be selected';
        }
        if (rec.inv_rebate_jvid != '') {
          bok = false;
          serr = 'One or more records already posted';
        }
      }
    });

    if (bok)
    {
      this.bShowDlg = true;
      this.modal = this.modalService.open(content);
    }
    else
      alert(serr);
  }

  

  EditDlg(_record  : Rebate,content:any) {

    let sid: string = '';
    let bok: boolean = true;
    let serr: string = '';

    this.jvid = '';

    if (_record.inv_rebate_jvid == null) {
      alert('Invalid Selection');
      return;
    }

    if (_record.inv_rebate_jvid == '') {
      alert('Invalid Selection');
      return;
    }


    this.mode = 'EDIT';

    this.jvid = _record.inv_rebate_jvid;
    this.jvdate = _record.inv_rebate_jvdate_original;
    this.jvno = _record.inv_rebate_jvno;


    let _selected_id = _record.inv_rebate_jvid;
    this.SelectedList = new Array<Rebate>();
    this.RecordList.forEach(rec => {
      rec.selected = false;
      if (rec.inv_rebate_jvid == _selected_id) {
        rec.selected = true;
        this.SelectedList.push(rec);
      }
    });

    if (bok)
    {
      this.bShowDlg = true;
      this.modal = this.modalService.open(content);
    }
    else
      alert(serr);

  }

  OnChange(field: string) {
    this.RecordList = null;

  }

  DlgClosed(irec : any ) {
    this.bShowDlg = false;
    this.closeModal();
    if (irec.status == 'OK') {

      this.RecordList.forEach(rec => {
        if (rec.selected) {
          rec.inv_rebate_jvid = irec.jvid;
          rec.inv_rebate_jvno = irec.jvno;
        }
      });
      alert("Posting Completed JV# " + irec.jvno);

      if (this.mode == 'EDIT')
        return;

      this.RecordList.forEach(rec => {
        if (rec.selected) {
          rec.selected = false;
        }
      });


    }
  }

  OnChange2(field: string) {
    this.paymentwise = this.showpaid;
   
  }

closeModal() {
    this.modal.close();
 
  }
} 



