import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../core/services/global.service';
import { Param } from '../models/param';
import { ParamService } from '../services/param.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
  selector: 'app-param',
  templateUrl: './param.component.html',
  providers: [ParamService]
})
export class ParamComponent {
  /*Ajith 19/06/2019 LOcked TAN Enabled
   */
  // Local Variables 
  title = 'Param MASTER';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  selectedRowIndex: number = -1;

  param_rate_caption: string = '';

  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  modal: any;

  sortby: boolean = false;
  bPrint = false;
  bDocs: boolean = false;
  showDocs: boolean = false;

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;

  Comments: string = '';
  ListCode: string = 'CODE';
  ListName: string = 'NAME';
  idCode: string = 'Code';
  idName: string = 'Name';
  id1: string = '';
  id2: string = '';
  id3: string = '';
  id4: string = '';
  id5: string = '';
  id5_lovtype = '';

  email: string = '';


  ErrorMessage = "";

  mode = '';
  pkid = '';

  code_length: number = 10;
  name_length: number = 60;

  ID5RECORD: SearchTable = new SearchTable();

  // Array For Displaying List
  RecordList: Param[] = [];
  // Single Record for add/edit/view details
  Record: Param = new Param;

  constructor(
    private modalService: NgbModal,
    private mainService: ParamService,
    private route: ActivatedRoute,
    public gs: GlobalService
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
    this.bDocs = false;
    this.bPrint = false;
    this.currentTab = 'LIST';
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_print)
        this.bPrint = true;
      if (this.menu_record.rights_docs)
        this.bDocs = true;
    }
    this.InitLov();
    this.InitColumns();
    this.List("NEW");
  }

  InitColumns() {
    this.Comments = '';
    this.idCode = 'Code';
    this.idName = 'Name';
    this.id1 = '';
    this.id2 = '';
    this.id3 = '';
    this.id4 = '';
    this.id5 = '';
    this.id5_lovtype = '';
    this.email = '';
    this.showDocs = false;

    this.code_length = 15;

    if (this.type == 'USER HIERARCHY') {
      this.idCode = 'Description';
      this.idName = 'Main User';
      this.id1 = "Sub Users";
      this.ListCode = 'DESCRIPTION';
      this.ListName = 'MAIN USER';
      this.Comments = 'MARKETING';
    }


    if (this.type == 'ACCSETTINGS') {
      this.code_length = 100;
      this.id1 = "Value";
    }


    if (this.type == 'SAC') {
      this.id1 = "SAC Code";
    }

    if (this.type == 'CHALIC') {
      this.id1 = "Branch code";
      this.id2 = "Cha#";
      this.id3 = "IceGateID";
      this.id4 = "Email Pwd";
      this.email = "e-Mail";
    }


    if (this.type == 'SALESMAN') {
      this.email = "e-Mail";
      this.id5 = "Branch";
      this.id5_lovtype = "BRANCH";
    }


    if (this.type == 'AIR CARRIER') {
      this.id1 = "3DigitCode";
      this.id2 = "Type";
      this.id3 = "SCAC";
    }
    if (this.type == 'SEA CARRIER') {
      this.id3 = "SCAC";
    }

    if (this.type == 'VESSEL') {
      this.id1 = "Vessel Flag";
    }

    if (this.type == 'PAN') {
      this.id1 = "Location";
      this.id2 = "Aadhaar Linked";
      this.showDocs = true;
    }

    if (this.type == 'CONTAINER TYPE') {
      this.id1 = "Size(20/40/45)";
      this.id3 = "Description";
    }

    if (this.type == 'CURRENCY') {
      this.id1 = 'Ex.Rate - CLR';
      this.param_rate_caption = 'Ex.Rate - FWD';
    }

    if (this.type == 'COUNTRY') {
      this.id1 = "Region";
    }

    if (this.type == 'APP-DOC-TYPES') {
      this.id1 = "Doc Type";
    }

    if (this.type == 'PARAM') {
      this.id1 = "Customer Code";
      this.id2 = "Type";
    }
    if (this.type == 'SERVICE CONTRACT') {
      this.id3 = "Group";
    }
    if (this.type == 'DISTRICT') {
      this.id1 = "State Code";
    }
    if (this.type == 'TRADE AGREEMENTS') {
      this.id3 = "Agreement Signing Date";
    }

    if (this.type == 'INFO-QLFR') {
      this.id1 = "Next Indicator"
      this.id5 = "Info Type";
      this.id5_lovtype = "INFO-TYPE";
    }

    if (this.type == 'INFO-CODE') {
      this.id1 = "PGA UQC"
      this.id5 = "Info Qualifier";
      this.id5_lovtype = "INFO-QLFR";
    }

    if (this.type == 'CTRL-RESULT') {
      this.id5 = "Control Type";
      this.id5_lovtype = "CTRL-TYPE";
    }

    if (this.type == 'AIR TRACKING EVENTS' || this.type == 'SEA TRACKING EVENTS') {
      this.id1 = "Type(DATE/TEXT)"
      this.id2 = "Update Column";
      this.id3 = "Order";
    }

    if (this.type == 'SALESAGENT') {
      this.id5 = "Agent";
      this.id5_lovtype = "CUSTOMER";
      this.email = "e-Mail";
    }

    if (this.type == 'MAILING TYPE') {
      this.code_length = 50;
    }
    if (this.type == 'GOOGLE CUSTOMS SCRIPT') {
      this.name_length = 200;
    }

    if (this.type == 'EMPLOYEE DOCUMENTS') {
      this.id1 = 'Group';
      this.id2 = 'File Type';
      this.id3 = 'File Size(KB)';
      this.param_rate_caption = 'Order';
    }
    if (this.type == 'EMPLOYEE GRADE') {
      this.id5 = "Travel Rules";
      this.id5_lovtype = "TRAVELRULES";
    }
    if (this.type == 'LUT') {
      this.ListName = 'LUT#';
      this.idName = 'LUT#';
      this.id1 = 'GSTIN#';
      this.id2 = 'FIN-YEAR';
      this.id5 = "STATE";
      this.id5_lovtype = "STATE";
    }
    if (this.type == 'ANALYSIS-CITY') {
      this.id5 = "Region";
      this.id5_lovtype = "ANALYSIS-REGION";
    }
    if (this.type == 'QUOTATION-CATEGORY') {
      this.param_rate_caption = 'Order';
    }
  }

  InitLov() {

    this.ID5RECORD = new SearchTable();
    this.ID5RECORD.controlname = "ID5";
    this.ID5RECORD.displaycolumn = "CODE";
    this.ID5RECORD.type = this.id5_lovtype;
    if (this.type == 'SALESAGENT')
      this.ID5RECORD.where = " CUST_IS_AGENT = 'Y' ";
    else
      this.ID5RECORD.where = "";
    this.ID5RECORD.id = "";
    this.ID5RECORD.code = "";
    this.ID5RECORD.name = "";
    this.ID5RECORD.parentid = "";
  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "ID5") {
      this.Record.param_id5 = _Record.id;
      this.Record.param_id5_code = _Record.code;
      this.Record.param_id5_name = _Record.name;
    }
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string, _selectedRowIndex: number = -1) {
    this.ErrorMessage = '';
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
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount
    };

    SearchData.sortby = "name";
    if (this.sortby)
      SearchData.sortby = "code";

    this.ErrorMessage = '';
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
          alert(this.ErrorMessage);
        });
  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }
  NewRecord() {

    this.pkid = this.gs.getGuid();

    this.Record = new Param();
    this.Record.param_pkid = this.pkid;
    this.Record.param_code = '';
    this.Record.param_name = '';
    this.Record.param_id1 = '';
    this.Record.param_id2 = '';
    this.Record.param_id3 = '';
    this.Record.param_id4 = '';
    this.Record.param_id5 = '';
    this.Record.param_id5_code = '';
    this.Record.param_id5_name = '';
    this.Record.param_email = '';
    this.Record.param_rate = 0;
    this.Record.param_type = this.type;
    this.Record.rec_locked = false;
    this.Record.rec_mode = this.mode;
    if (this.type == "LUT") {
      // this.Record.param_id1 = this.gs.globalVariables.gstin;
      this.Record.param_id2 = this.gs.globalVariables.year_code;
    }
    if (this.type == "PAN")
      this.Record.param_id2 = "N";

    this.InitLov();
  }

  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;

    let SearchData = {
      pkid: Id,
    };

    this.ErrorMessage = '';
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

  LoadData(_Record: Param) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
    this.InitLov();

    this.ID5RECORD.id = this.Record.param_id5;
    this.ID5RECORD.code = this.Record.param_id5_code;
    this.ID5RECORD.name = this.Record.param_id5_name;
  }


  // Save Data
  Save() {
    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';

    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.RefreshList();
        // alert(this.ErrorMessage);
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
    if (this.Record.param_code.trim().length <= 0) {
      bret = false;
      sError = "Code Cannot Be Blank";
    }
    if (this.Record.param_name.trim().length <= 0) {
      bret = false;
      sError += "\n\rName Cannot Be Blank";
    }
    if (this.type == 'SEA TRACKING EVENTS' || this.type == 'AIR TRACKING EVENTS') {
      if (this.Record.param_id1 != 'DATE' && this.Record.param_id1 != 'TEXT') {
        bret = false;
        sError += "\n\rTYPE CAN BE DATE OR TEXT";
      }
    }
    if (this.type == 'SAC') {
      if (this.Record.param_id1 == '') {
        bret = false;
        sError += "\n\rSAC Code cannot be blank";
      }
    }

    if (this.type == 'ACCSETTINGS') {
      if (this.Record.param_id1 == '') {
        bret = false;
        sError += "\n\rValue Cannot be blank";
      }
    }


    if (this.type == 'CONTAINER TYPE') {
      if (this.Record.param_id1 != "20" && this.Record.param_id1 != "40" && this.Record.param_id1 != "45") {
        bret = false;
        sError += "\n\rSize Can Be 20 / 40 / 45";
      }
    }
    this.Record.param_code = this.Record.param_code.toUpperCase().trim();

    if (this.type == 'PAN') {

      if (this.Record.param_code.length != 10) {
        bret = false;
        sError += "\n\r | Pan# Need To Be 10 Characters  ";
      }
      else {

        for (var i = 0; i <= 9; i++) {

          if (i <= 4) {
            if (this.Isnumeric(this.Record.param_code[i]) == true) {
              bret = false;
              sError += "\n\r | Invalid Pan#, Format XXXXX9999X ";
              break;
            }
          }
          else if (i <= 8) {
            if (this.Isnumeric(this.Record.param_code[i]) == false) {
              bret = false;
              sError += "\n\r | Invalid Pan#, Format XXXXX9999X ";
              break;
            }
          }
          else if (i == 9) {
            if (this.Isnumeric(this.Record.param_code[i]) == true) {
              bret = false;
              sError += "\n\r | Invalid Pan#, Format XXXXX9999X ";

            }
          }
        }

      }
    }

    if (this.type == 'TAN') {

      if (this.Record.param_code.length != 10) {
        bret = false;
        sError += "\n\r | Tan# Need To Be 10 Characters ";
      }
      else {

        for (var i = 0; i <= 9; i++) {

          if (i <= 3) {
            if (this.Isnumeric(this.Record.param_code[i]) == true) {
              bret = false;
              sError += "\n\r | Invalid Tan#, Format XXXX99999X ";
              break;
            }
          }
          else if (i <= 8) {
            if (this.Isnumeric(this.Record.param_code[i]) == false) {
              bret = false;
              sError += "\n\r | Invalid Tan#, Format XXXX99999X ";
              break;
            }
          }
          else if (i == 9) {
            if (this.Isnumeric(this.Record.param_code[i]) == true) {
              bret = false;
              sError += "\n\r | Invalid Tan#, Format XXXX99999X ";
            }
          }
        }
      }

    }

    if (this.type == 'SALESMAN') {
      if (this.gs.isBlank(this.Record.param_id5)) {
        bret = false;
        sError += "\n\r | Branch Cannot be blank";
      }
    }


    //if (this.Record.user_password.trim().length <= 0) {
    //    bret = false;
    //    sError += "\n\rPassword Cannot Be Blank";
    //}

    if (bret) {
      if (this.type == 'MAILING TYPE')
        this.Record.param_code = this.Record.param_code.toUpperCase();
      else
        this.Record.param_code = this.Record.param_code.toUpperCase().replace(' ', '');
      if (this.type != 'GOOGLE CUSTOMS SCRIPT' && this.type != 'MENU HEADING')
        this.Record.param_name = this.Record.param_name.toUpperCase().trim();
      this.Record.param_id1 = this.Record.param_id1.toUpperCase().trim();
      this.Record.param_id2 = this.Record.param_id2.toUpperCase().trim();
      this.Record.param_id3 = this.Record.param_id3.toUpperCase().trim();
      this.Record.param_email = this.Record.param_email.trim();

    }

    if (bret === false) {
      this.ErrorMessage = sError;
      alert(this.ErrorMessage);
    }
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
    var REC = this.RecordList.find(rec => rec.param_pkid == this.Record.param_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.param_code = this.Record.param_code;
      REC.param_name = this.Record.param_name;
      REC.param_id1 = this.Record.param_id1;
      REC.param_id2 = this.Record.param_id2;
      REC.param_id3 = this.Record.param_id3;
      REC.param_id4 = this.Record.param_id4;
      REC.param_email = this.Record.param_email;
      REC.param_rate = this.Record.param_rate;
      REC.param_id5_code = this.Record.param_id5_code;

    }
  }

  Close() {
    this.gs.ClosePage('home');
  }

  ShowDocuments(doc: any) {
    this.ErrorMessage = '';
    this.open(doc);
  }

  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }
  
  ImportData(content: any) {
    this.open(content);
  }
  CloseParamImport(params: any) {
    this.modal.close();
    this.List("NEW");
  }
}
