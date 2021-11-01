import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { MarkContacts } from '../models/markcontacts';
import { MarkContactService } from '../services/markcontacts.service';
import { SearchTable } from '../../shared/models/searchtable';
//EDIT-AJITH-29-09-2021

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  providers: [MarkContactService]
})
export class ContactsComponent {

  // Local Variables 
  title = 'Contacts MASTER';


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


  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';


  // Array For Displaying List
  RecordList: MarkContacts[] = [];
  // Single Record for add/edit/view details
  Record: MarkContacts = new MarkContacts;


  CATEGORYRECORD: SearchTable = new SearchTable();
  SALESMANRECORD: SearchTable = new SearchTable();
  CSDRECORD: SearchTable = new SearchTable();


  constructor(
    private modalService: NgbModal,
    private mainService: MarkContactService,
    private route: ActivatedRoute,
    public gs: GlobalService

  ) {


    this.page_count = 0;
    this.page_rows = 25;
    this.page_current = 0;


    this.InitLov();

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
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;

    }
    this.LoadCombo();
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  InitLov() {

    this.CATEGORYRECORD = new SearchTable();
    this.CATEGORYRECORD.controlname = "CONTACT TYPE";
    this.CATEGORYRECORD.type = "CONTACT TYPE";
    this.CATEGORYRECORD.id = "";
    this.CATEGORYRECORD.name = "";

    this.SALESMANRECORD = new SearchTable();
    this.SALESMANRECORD.controlname = "SALESMAN";
    this.SALESMANRECORD.type = "SALESMAN";
    this.SALESMANRECORD.id = "";
    this.SALESMANRECORD.name = "";

    this.CSDRECORD = new SearchTable();
    this.CSDRECORD.controlname = "CSD";
    this.CSDRECORD.type = "SALESMAN";
    this.CSDRECORD.id = "";
    this.CSDRECORD.name = "";

  }



  LoadCombo() {

    // this.loading = true;
    // let SearchData = {
    //   type: 'type',
    //   comp_code: this.gs.globalVariables.comp_code,
    //   branch_code: this.gs.globalVariables.branch_code
    // };

    // this.ErrorMessage = '';
    // this.InfoMessage = '';
    // this.mainService.LoadDefault(SearchData)
    //   .subscribe(response => {
    //     this.loading = false;
    //     this.List("NEW");
    //   },
    //     error => {
    //       this.loading = false;
    //       this.ErrorMessage = this.gs.getError(error);
    //     });
  }


  LovSelected(_Record: any) {

    if (_Record.controlname == "CONTACT TYPE") {
      this.Record.cont_type_id = _Record.id;
      this.Record.cont_type_name = _Record.name;
    }

    if (_Record.controlname == "SALESMAN") {
      this.Record.cont_saleman_id = _Record.id;
      this.Record.cont_saleman_name = _Record.name;
    }

    if (_Record.controlname == "CSD") {
      this.Record.cont_csd_id = _Record.id;
      this.Record.cont_csd_name = _Record.name;
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

    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
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



    this.pkid = this.gs.getGuid();

    this.Record = new MarkContacts();
    // this.Record.cust_pkid = this.pkid;
    // this.Record.cust_code = '';
    // this.Record.cust_name = '';
    // this.Record.cust_iecode = '';
    // this.Record.cust_panno = '';
    // this.Record.cust_tanno = '';
    // this.Record.cust_class = 'N';
    // this.Record.cust_type = 'N';


    // this.Record.cust_iata_limit = false;
    // this.Record.cust_sepz_unit = false;
    // this.Record.cust_linked = false;
    // this.Record.cust_is_shipper = false;
    // this.Record.cust_is_ungst = false;
    // this.Record.cust_is_foreigner = false;
    // this.Record.cust_is_consignee = false;
    // this.Record.cust_is_agent = false;
    // this.Record.cust_is_cha = false;
    // this.Record.cust_is_creditor = false;
    // this.Record.cust_is_others = false;
    // this.Record.rec_locked = true;
    // this.Record.cust_is_editable = true;


    // this.Record.cust_crdays = 1;
    // this.Record.cust_crlimit = 1;

    // this.Record.cust_crdate = '';

    // this.Record.cust_sman_id = '';
    // this.Record.cust_sman_name = '';

    // this.Record.cust_remarks = '';

    // this.Record.cust_csd_id = '';
    // this.Record.cust_csd_name = '';

    // this.Record.cust_referdby = '';

    // this.Record.cust_dbkacno = '';
    // this.Record.cust_adcode = '';
    // this.Record.cust_bank = '';
    // this.Record.cust_bank_branch = '';
    // this.Record.cust_acno = '';
    // this.Record.cust_forexacno = '';
    // this.Record.cust_bank_address1 = '';
    // this.Record.cust_bank_address2 = '';
    // this.Record.cust_bank_address3 = '';

    // this.Record.cust_branch_code = '';

    // this.Record.cust_linked = false;
    // this.Record.cust_alert = false;
    // this.cust_linked = false;

    // this.Record.cust_nomination = 'NA';
    // this.Record.cust_is_incomplete = true;
    // this.Record.cust_incomplete_remarks = '';
    // this.Record.cust_branch_remarks = '';
    // this.Record.cust_uploaded_docs = '';
    // this.Record.cust_caseno = '';
    // this.SMANREC = { 'controlname': 'SALESMAN', 'type': 'SALESMAN', displaycolumn: 'NAME', id: '', code: '', name: '' };
    // this.CSDREC = { 'controlname': 'CSD', 'type': 'SALESMAN', displaycolumn: 'NAME', id: '', code: '', name: '' };


    this.Record.rec_mode = this.mode;

    this.InitLov();



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

  LoadData(_Record: MarkContacts) {
    this.Record = _Record;
    this.Record.rec_mode = "EDIT";

    this.InitLov();

    this.CATEGORYRECORD.id = this.Record.cont_type_id.toString();
    this.CATEGORYRECORD.name = this.Record.cont_type_name;

    this.SALESMANRECORD.id = this.Record.cont_saleman_id.toString();
    this.SALESMANRECORD.name = this.Record.cont_saleman_name;

    this.CSDRECORD.id = this.Record.cont_csd_id.toString();
    this.CSDRECORD.name = this.Record.cont_csd_name;

  }




  // Save Data
  Save() {
    if (!this.allvalid()) {
      alert(this.ErrorMessage);
      return;
    }

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record._globalvariables = this.gs.globalVariables;

    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.InfoMessage = "Save Complete";
        this.RefreshList();
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

    if (this.Record.cont_name.trim().length <= 0) {
      bret = false;
      sError = " | Name Cannot be Blank";
    }

    if (bret) {
      this.Record.cont_name = this.Record.cont_name.toUpperCase().trim();
    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  Isnumeric(i: any) {

    if (i >= 0 && i <= 9) {
      return true;
    }
    else {
      return false;
    }

  }

  RefreshList() {

    if (this.RecordList == null)
      return;
    // var REC = this.RecordList.find(rec => rec.cust_pkid == this.Record.cust_pkid);
    // if (REC == null) {
    //   this.RecordList.push(this.Record);
    // }
    // else {
    //   REC.cust_code = this.Record.cust_code;
    //   REC.cust_name = this.Record.cust_name;
    //   REC.cust_group = this.Record.cust_group;
    //   REC.cust_kyc_status = this.Record.cust_kyc_status;
    //   REC.cust_sman_name = this.Record.cust_sman_name;
    //   REC.cust_docs = this.Record.cust_docs;
    //   REC.rec_locked = this.Record.rec_locked;
    //   REC.cust_is_complete = this.Record.cust_is_incomplete == true ? 'N' : 'Y';
    //   REC.cust_incomplete_remarks = this.Record.cust_incomplete_remarks;
    // }
  }


  OnBlur(field: string) {
    
    // if (field == 'cust_incomplete_remarks') {
    //   this.Record.cust_incomplete_remarks = this.Record.cust_incomplete_remarks.toUpperCase();
    // }
    // if (field == 'cust_branch_remarks') {
    //   this.Record.cust_branch_remarks = this.Record.cust_branch_remarks.toUpperCase();
    // }
  }

  Close() {
    this.gs.ClosePage('home');
  }

  open(content: any) {
    this.modal = this.modalService.open(content);
  }
  ShowHistory(history: any) {
    this.ErrorMessage = '';
    this.open(history);
  }


}
