import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Esanchit } from '../models/esanchit';
import { EsanchitService } from '../services/esanchit.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Param } from '../../master/models/param';

@Component({
  selector: 'app-esanchit',
  templateUrl: './esanchit.component.html',
  providers: [EsanchitService]
})
export class EsanchitComponent  {
  // Local Variables 
  title = 'Esanchit';
  
  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  selectedRowIndex = 0;
  
  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  upload_date: string = '';
  irn: string = '';
  drn: string = '';

  sub: any;
  urlid: string;
  modal: any;

  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';

  //esanchitdoclist: Param[] = [];
  DOCUMENTTYPERECORD: SearchTable = new SearchTable();
  // Array For Displaying List
  RecordList: Esanchit[] = [];
  // Single Record for add/edit/view details
  Record: Esanchit = new Esanchit;

  
  constructor(
    private modalService: NgbModal,
    private mainService: EsanchitService,
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {
    this.page_count = 0;
    this.page_rows = 25;
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
    this.upload_date = this.gs.defaultValues.today;
    this.InitLov();
   // this.LoadCombo();
    this.List("NEW");
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  LoadCombo() {
    
    //this.loading = true;
    //let SearchData = {
    //  type: 'type',
    //  comp_code: this.gs.globalVariables.comp_code,
    //  branch_code: this.gs.globalVariables.branch_code
    //};

    //this.ErrorMessage = '';
    //this.InfoMessage = '';
    //this.mainService.LoadDefault(SearchData)
    //  .subscribe(response => {
    //    this.loading = false;
    //    this.esanchitdoclist = response.esanchitdoclist;
        
    //  },
    //  error => {
    //    this.loading = false;
    //    this.ErrorMessage = JSON.parse(error._body).Message;
    //  });
  }

  InitLov() {

    this.DOCUMENTTYPERECORD = new SearchTable();
    this.DOCUMENTTYPERECORD.controlname = "ESANCHITDOCTYPE";
    this.DOCUMENTTYPERECORD.where = " REC_LOCKED = 'N' ";
    this.DOCUMENTTYPERECORD.displaycolumn = "CODE";
    this.DOCUMENTTYPERECORD.type = "ESANCHITDOC";
    this.DOCUMENTTYPERECORD.id = "";
    this.DOCUMENTTYPERECORD.code = "";
    this.DOCUMENTTYPERECORD.name = "";

  }
  LovSelected(_Record: any) {

    if (_Record.controlname == "ESANCHITDOCTYPE") {
      this.Record.doc_type_code = _Record.code;
      this.Record.doc_type_name = _Record.name;
      
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
     
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      upload_date: this.upload_date,
      drn: this.drn,
      irn: this.irn,
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

  GetBeneficiary(Id: string) {
    this.loading = true;

    let SearchData = {
      branch_code: this.gs.globalVariables.branch_code,
      code : this.Record.doc_type_code,
      date : this.Record.doc_upload_date
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetBeneficiary(SearchData)
      .subscribe(response => {
        this.loading = false;
        var _Rec = response.record as Esanchit;
        this.Record.doc_ben_name =   _Rec.doc_ben_name;
        this.Record.doc_ben_add1 =   _Rec.doc_ben_add1;
        this.Record.doc_ben_add2 =   _Rec.doc_ben_add2;
        this.Record.doc_ben_city =   _Rec.doc_ben_city;
        this.Record.doc_ben_pin =   _Rec.doc_ben_pin;
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }




  NewRecord() {

    this.pkid = this.gs.getGuid();

    this.Record = new Esanchit();
    this.Record.doc_pkid = this.pkid;
    this.Record.doc_drn = '';
    this.Record.doc_irn = '';
    this.Record.doc_type_code = '';
    this.Record.doc_file_name = '';
    this.Record.doc_name = '';
    this.Record.doc_ref_no = '';
    this.Record.doc_type_code = '';
    this.Record.doc_issued_at = '';
    this.Record.doc_issued_date ='';
    this.Record.doc_issuer_name = '';
    this.Record.doc_issuer_code = '';
    this.Record.doc_issuer_add1 = '';
    this.Record.doc_issuer_add2 = '';
    this.Record.doc_issuer_city = '';
    this.Record.doc_issuer_pin = '';
    this.Record.doc_ben_name = '';
    this.Record.doc_ben_code = '';
    this.Record.doc_ben_add1 = '';
    this.Record.doc_ben_add2 = '';
    this.Record.doc_ben_city = '';
    this.Record.doc_ben_pin = '';
    this.Record.doc_type_code = '';
    this.Record.doc_file_type = "PDF";
    this.Record.rec_category = " ";
    this.Record.doc_job_no = '';
    this.Record.doc_job_id = '';
    this.Record.doc_job_year = '';
    this.Record.doc_type_name = '';
    this.Record.doc_all_drn_selected = true;
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

  LoadData(_Record: Esanchit) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
    this.InitLov();
    this.DOCUMENTTYPERECORD.code = this.Record.doc_type_code;
    this.DOCUMENTTYPERECORD.name = this.Record.doc_type_name;
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

    if (this.Record.doc_type_code.trim().length <= 0) {
      bret = false;
      sError = "Document Type Cannot Be Blank";
    }
    
    if (this.Record.doc_irn.trim().length <= 0) {
      bret = false;
      sError = " IRN Cannot Be Blank";
    }
    if (this.Record.doc_drn.trim().length <= 0) {
      bret = false;
      sError = " DRN Cannot Be Blank";
    }
    
   
    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {

    if (this.RecordList == null)
      return;
    
    var REC = this.RecordList.find(rec => rec.doc_pkid == this.Record.doc_pkid);
    if (REC == null) {
      var tempdate = this.gs.defaultValues.today.split('-');
      let upyr: string = tempdate[0];
      let upmn: string = tempdate[1];
      let updy: string = tempdate[2];
      
      let upload_date = updy + "/" + upmn + "/" + upyr;
      this.Record.doc_upload_date = upload_date.toUpperCase().toString();
      
      this.RecordList.push(this.Record);
    }
    else {
    //  REC.doc_upload_date = this.Record.doc_upload_date;
      REC.doc_drn = this.Record.doc_drn;
      REC.doc_irn = this.Record.doc_irn;
      REC.doc_type_code = this.Record.doc_type_code;
      REC.doc_type_name = this.Record.doc_type_name;
      REC.doc_file_name = this.Record.doc_file_name;
      REC.doc_ref_no = this.Record.doc_ref_no;
      REC.doc_issuer_name = this.Record.doc_issuer_name;   
      REC.doc_ben_name = this.Record.doc_ben_name;
      REC.rec_category = this.Record.rec_category;
      REC.doc_job_no = this.Record.doc_job_no;
      REC.doc_name = this.Record.doc_name;
    }
  }

  

  OnBlur(field: string) {
    
    if (field == 'doc_drn') {
      this.Record.doc_drn = this.Record.doc_drn.toUpperCase();
    }
    if (field == 'doc_irn') {
      this.Record.doc_irn = this.Record.doc_irn.toUpperCase();
    }
    if (field == 'doc_type_code') {
      this.Record.doc_type_code = this.Record.doc_type_code.toUpperCase();
    }
    if (field == 'doc_file_name') {
      this.Record.doc_file_name = this.Record.doc_file_name.toUpperCase();
    }
    if (field == 'doc_name') {
      this.Record.doc_name = this.Record.doc_name.toUpperCase();
    }
    if (field == 'doc_ref_no') {
      this.Record.doc_ref_no = this.Record.doc_ref_no.toUpperCase();
    }
    if (field == 'doc_file_type') {
      this.Record.doc_file_type = this.Record.doc_file_type.toUpperCase();
    }
   
   
    if (field == 'doc_issued_at') {
      this.Record.doc_issued_at = this.Record.doc_issued_at.toUpperCase();
    }
    if (field == 'doc_issuer_name') {
      this.Record.doc_issuer_name = this.Record.doc_issuer_name.toUpperCase();
    }
    if (field == 'doc_issuer_code') {
      this.Record.doc_issuer_code = this.Record.doc_issuer_code.toUpperCase();
    }
    if (field == 'doc_issuer_add1') {
      this.Record.doc_issuer_add1 = this.Record.doc_issuer_add1.toUpperCase();
    }
    if (field == 'doc_issuer_add2') {
      this.Record.doc_issuer_add2 = this.Record.doc_issuer_add2.toUpperCase();
    }
    if (field == 'doc_issuer_city') {
      this.Record.doc_issuer_city = this.Record.doc_issuer_city.toUpperCase();
    }
    if (field == 'doc_issuer_pin') {
      this.Record.doc_issuer_pin = this.Record.doc_issuer_pin.toUpperCase();
    }
   
    if (field == 'doc_ben_name') {
      this.Record.doc_ben_name = this.Record.doc_ben_name.toUpperCase();
    }
    if (field == 'doc_ben_code') {
      this.Record.doc_ben_code = this.Record.doc_ben_code.toUpperCase();
    }
    if (field == 'doc_ben_add1') {
      this.Record.doc_ben_add1 = this.Record.doc_ben_add1.toUpperCase();
    }
    if (field == 'doc_ben_add2') {
      this.Record.doc_ben_add2 = this.Record.doc_ben_add2.toUpperCase();
    }
    if (field == 'doc_ben_city') {
      this.Record.doc_ben_city = this.Record.doc_ben_city.toUpperCase();
    }
    if (field == 'doc_ben_pin') {
      this.Record.doc_ben_pin = this.Record.doc_ben_pin.toUpperCase();
    }
    
  }
  
  // Upload Data
  Update() {
    
    if (this.Record.rec_category.trim().length <= 0) {
      this.ErrorMessage = "Category Cannot Be Blank";
      return;
    }
    if (this.Record.doc_job_no.trim().length <= 0) {
      this.ErrorMessage = "Job# Cannot Be Blank";
      return;
    }

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    this.Record._globalvariables = this.gs.globalVariables;
    this.Record.doc_job_year = this.gs.globalVariables.year_code;
    this.Record.doc_job_id = '';

    this.mainService.Upload(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Update Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.RefreshList();
        if (response.record.doc_issuer_code != null) {
          //this.Record.doc_issuer_code = response.record.doc_issuer_code;
          this.Record.doc_issuer_name = response.record.doc_issuer_name;
          this.Record.doc_issuer_add1 = response.record.doc_issuer_add1;
         this.Record.doc_issuer_add2 = response.record.doc_issuer_add2;
          this.Record.doc_issuer_city = response.record.doc_issuer_city;
          this.Record.doc_issuer_pin = response.record.doc_issuer_pin;
        //  this.Record.doc_ben_code = response.record.doc_ben_code;
          this.Record.doc_ben_name = response.record.doc_ben_name;
          this.Record.doc_ben_add1 = response.record.doc_ben_add1;
          this.Record.doc_ben_add2 = response.record.doc_ben_add2;
          this.Record.doc_ben_city = response.record.doc_ben_city;
          this.Record.doc_ben_pin = response.record.doc_ben_pin;
        }
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
        
      });
  }

  ClearLink() {
    let sMsg: string = "";
    if (this.Record.doc_all_drn_selected)
      sMsg = " Do you want to Clear ALL links to DRN " + this.Record.doc_drn;
    else
      sMsg = " Do you want to Clear link to IRN " + this.Record.doc_irn;
    if (!confirm(sMsg)) {
      return;
    }

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.doc_job_no = '';
    this.Record.doc_job_id = 'CLEAR';
    this.Record.doc_link_id = '';
    this.Record.doc_link_type = '';
    this.Record._globalvariables = this.gs.globalVariables;
    this.Record.doc_job_year = this.gs.globalVariables.year_code;
    this.mainService.Upload(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.Record.doc_job_id = '';
        if (this.Record.doc_all_drn_selected)
          this.InfoMessage = "Successfully Removed All Links to DRN " + this.Record.doc_drn;
        else
          this.InfoMessage = "Successfully Removed Link to IRN " + this.Record.doc_irn;
        this.RefreshList();
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
        
      });
  }

  Close() {
    this.gs.ClosePage('home');
  }

  DownloadEsanchit(desanchit: any) {
    this.open(desanchit);
  }

  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }

}
