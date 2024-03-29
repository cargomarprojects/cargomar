import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Drawback } from '../models/drawback';
import { DrawbackService } from '../services/drawback.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-drawback',
  templateUrl: './drawback.component.html',
  providers: [DrawbackService]
})
export class DrawbackComponent {
  // Local Variables 
  title = 'Drawback Details';

  @ViewChild('addressComponent') addressComponent: any;


  mdate: string;

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  selectedRowIndex = 0;

  ispercent = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  dbkmode = '';
  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;
  modal: any;

  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';

  // Array For Displaying List
  RecordList: Drawback[] = [];
  // Single Record for add/edit/view details
  Record: Drawback = new Drawback;

  constructor(
    private modalService: NgbModal,
    private mainService: DrawbackService,
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
    this.dbkmode = 'A';
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
    this.LoadCombo();

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

    //    this.List("NEW");
    //  },
    //  error => {
    //    this.loading = false;
    //    this.ErrorMessage = JSON.parse(error._body).Message;
    //  });

    this.List("NEW");
  }


  LovSelected(_Record: any) {
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
        this.RecordList = response.list;
        this.page_count = response.page_count;
        this.page_current = response.page_current;
        this.page_rowcount = response.page_rowcount;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }


  NewRecord() {

    this.pkid = this.gs.getGuid();

    this.Record = new Drawback();
    this.Record.dbk_id = this.pkid;
    this.Record.dbk_slno = '';
    this.Record.dbk_name = '';
    this.Record.dbk_unit = '';
    this.Record.dbk_rate_excise = 0;
    this.Record.dbk_rate_custom = 0;
    this.Record.dbk_valuecap = 0;
    this.Record.dbk_state_rt = 0;
    this.Record.dbk_state_valuecap = 0;
    this.Record.dbk_ctl_rt = 0;
    this.Record.dbk_ctl_valuecap = 0;
    this.Record.dbk_is_verified = 'N';
    this.Record.dbk_verified_by = '';
    this.Record.dbk_verified_date = '';
    this.Record.rec_mode = this.mode;

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

  LoadData(_Record: Drawback) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
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
          alert(this.ErrorMessage);
        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.Record.dbk_slno.trim().length <= 0) {
      bret = false;
      sError = " | Drawback Code Cannot Be Blank";
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
    var REC = this.RecordList.find(rec => rec.dbk_id == this.Record.dbk_id);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.dbk_slno = this.Record.dbk_slno;
      REC.dbk_name = this.Record.dbk_name;
      REC.dbk_unit = this.Record.dbk_unit;
      REC.dbk_rate_excise = this.Record.dbk_rate_excise;
      REC.dbk_rate_custom = this.Record.dbk_rate_custom;
      REC.dbk_valuecap = this.Record.dbk_valuecap;
      REC.dbk_state_rt = this.Record.dbk_state_rt;
      REC.dbk_state_valuecap = this.Record.dbk_state_valuecap;
      REC.dbk_ctl_rt = this.Record.dbk_ctl_rt;
      REC.dbk_ctl_valuecap = this.Record.dbk_ctl_valuecap;
    }
  }


  OnBlur(field: string) {
    if (field == 'dbk_slno') {
      this.Record.dbk_slno = this.Record.dbk_slno.toUpperCase();
    }
    if (field == 'dbk_name') {
      this.Record.dbk_name = this.Record.dbk_name.toUpperCase();
    }
    if (field == 'dbk_unit') {
      this.Record.dbk_unit = this.Record.dbk_unit.toUpperCase();
    }
    if (field == 'dbk_rate_excise') {
      this.Record.dbk_rate_excise = this.gs.roundWeight(this.Record.dbk_rate_excise, "RATE");
    }
    if (field == 'dbk_rate_custom') {
      this.Record.dbk_rate_custom = this.gs.roundWeight(this.Record.dbk_rate_custom, "RATE");
    }
    if (field == 'dbk_valuecap') {
      this.Record.dbk_valuecap = this.gs.roundWeight(this.Record.dbk_valuecap, "RATE");
    }
    if (field == 'dbk_state_rt') {
      this.Record.dbk_state_rt = this.gs.roundWeight(this.Record.dbk_state_rt, "RATE");
    }
    if (field == 'dbk_state_valuecap') {
      this.Record.dbk_state_valuecap = this.gs.roundWeight(this.Record.dbk_state_valuecap, "RATE");
    }
    if (field == 'dbk_ctl_rt') {
      this.Record.dbk_ctl_rt = this.gs.roundWeight(this.Record.dbk_ctl_rt, "RATE");
    }
    if (field == 'dbk_ctl_valuecap') {
      this.Record.dbk_ctl_valuecap = this.gs.roundWeight(this.Record.dbk_ctl_valuecap, "RATE");
    }
  }

  Close() {
    this.gs.ClosePage('home');
  }


  SearchRecord(controlname: string) {
    this.InfoMessage = '';
    this.loading = true;
    let SearchData = {
      pkid: '',
      parentid: '',
      table: 'DBK-UPDATE-FILE'
    };

    if (controlname == 'DBK-UPDATE-FILE') {
      SearchData.pkid = '';
      SearchData.parentid = '';
      SearchData.table = 'dbk-update-file';
    }

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.serror.length > 0)
        {
          this.ErrorMessage = response.serror;
          alert(this.ErrorMessage);
        }
        else {
          let strmsg: string = "";
          strmsg = "PROCESS DBK RATES  \n\n FILE NAME : " + response.filename + " \n\n UPLOADED ON : " + response.uploaddate;
          if (confirm(strmsg)) {
            this.ProcessDbkRates();
          }
        }
      },
        error => {
          this.loading = false;
          this.InfoMessage = this.gs.getError(error);
        });
  }

  ProcessDbkRates() {
    this.loading = true;
    let SearchData = {
      pkid: '',
      dbkmode: '',
      comp_code: '',
      user_code: '',
      ispercent: 'N',
      root_folder: ''
    };

    SearchData.dbkmode = this.dbkmode;
    SearchData.comp_code = this.gs.globalVariables.comp_code;
    SearchData.user_code = this.gs.globalVariables.user_code;
    SearchData.ispercent = this.ispercent == true ? 'Y' : 'N';
    SearchData.root_folder = this.gs.defaultValues.root_folder;


    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.ProcessDrawbackRates(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Process Complete";
        alert(this.InfoMessage);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });

  }
  ShowDocuments(doc: any) {
    this.ErrorMessage = '';
    this.open(doc);
  }

  open(content: any) {
    this.modal = this.modalService.open(content);
  }
  
  VerifiedRecord() {

    if (!confirm("Details Verified")) {
      return
    }

    let SearchData = {
      pkid: this.Record.dbk_id,
      branch_code: this.gs.globalVariables.branch_code,
      company_code: this.gs.globalVariables.comp_code,
      user_code: this.gs.globalVariables.user_code
    };

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.VerifiedRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.status == "OK") {
          this.Record.dbk_is_verified = 'Y';
          alert('Successfully Verified');
        }

      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

}
