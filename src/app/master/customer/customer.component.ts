import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Customerm } from '../models/customer';
import { CustomerService } from '../services/customer.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-customerm',
  templateUrl: './customer.component.html',
  providers: [CustomerService]
})
export class CustomerComponent {
  /*
  Ajith 08/06/2019 new tab Beneficiary Details 
   Ajith 13/08/2019 add  customer Unregistered 
  */
  // Local Variables 
  title = 'Address MASTER';

  @ViewChild('addressComponent') addressComponent: any;


  mdate: string;

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;


  bCreditLimit: boolean = false;
  showalert = false;
  CrList: any[];


  bAdmin = false;//for detail part
  bDocs = false;
  bDocsUpload = false;
  canadd = true;
  bPrint = false;
  bAdmin2 = false;//for list part
  bDelete = false;

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

  cust_linked: boolean = false;
  Is_Shipper: boolean = false;
  Is_Consignee: boolean = false;
  Is_Agent: boolean = false;
  Is_Cha_Forwarder: boolean = false;
  Is_Creditor: boolean = false;
  Is_Others: boolean = false;
  Last_Bill_date: boolean = false;

  rec_category: string;
  // Array For Displaying List
  RecordList: Customerm[] = [];
  // Single Record for add/edit/view details
  Record: Customerm = new Customerm;


  TypeList: any[] = [];
  ClassList: any[] = [];
  StateList: any[] = [];
  CountryList: any[] = [];
  fStateList: any[] = [];

  // Acc Group , Acc Type
  AcGrpList: any[] = [];
  AcTypeList: any[] = [];


  SMANREC: any = {};
  CSDREC: any = {};
  COMPRECORD: SearchTable = new SearchTable();



  constructor(
    private modalService: NgbModal,
    private mainService: CustomerService,
    private route: ActivatedRoute,
    private gs: GlobalService

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
        this.rec_category = this.type;
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
    this.bDelete = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin2 = true;
      if (this.menu_record.rights_delete)
        this.bDelete = true;
    }

    if (this.gs.globalVariables.user_code == "ADMIN")
      this.bAdmin2 = true;



    this.LoadCombo();

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  InitLov() {

    this.COMPRECORD = new SearchTable();
    this.COMPRECORD.controlname = "BRANCH";
    this.COMPRECORD.displaycolumn = "CODE";
    this.COMPRECORD.type = "BRANCH";
    this.COMPRECORD.id = "";
    this.COMPRECORD.code = "";

  }



  LoadCombo() {

    this.ClassList = [{ "name": "Private" }, { "name": "Public" }];

    this.loading = true;
    let SearchData = {
      type: 'type',
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.LoadDefault(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.StateList = response.statelist;
        this.CountryList = response.countrylist;
        this.fStateList = response.fstatelist;
        this.AcGrpList = response.acgroupm;
        this.AcTypeList = response.actypem;
        this.List("NEW");
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  LovSelected(_Record: any) {

    if (_Record.controlname == "SALESMAN") {
      this.Record.cust_sman_id = _Record.id;
      this.Record.cust_sman_name = _Record.name;
    }

    if (_Record.controlname == "CSD") {
      this.Record.cust_csd_id = _Record.id;
      this.Record.cust_csd_name = _Record.name;
    }

    if (_Record.controlname == "BRANCH") {
      this.Record.cust_branch_code = _Record.code;
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


    this.canadd = true;
    this.bAdmin = true;
    this.bDocs = true;
    this.bDocsUpload = true;

    if (!this.menu_record)
      return;

    if (this.menu_record.rights_admin)
      this.disableSave = false;

    if (this.mode == "ADD" && this.menu_record.rights_add)
      this.disableSave = false;

    if (this.mode == "EDIT" && this.menu_record.rights_edit)
      this.disableSave = false;

    this.bAdmin = false;
    if (this.mode == "EDIT" && this.menu_record.rights_admin)
      this.bAdmin = true;

    this.bDocs = false;
    if (this.mode == "EDIT" && this.menu_record.rights_docs)
      this.bDocs = true;

    this.bDocsUpload = false;
    if (this.mode == "EDIT" && this.menu_record.rights_docs_upload)
      this.bDocsUpload = true;


    if (this.gs.globalVariables.user_code == "ADMIN")
      this.bAdmin = true;


    this.canadd = this.menu_record.rights_add;


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
      branch_code: this.gs.globalVariables.branch_code,
      Is_Shipper: this.Is_Shipper,
      Is_Consignee: this.Is_Consignee,
      Is_Agent: this.Is_Agent,
      Is_Cha_Forwarder: this.Is_Cha_Forwarder,
      Is_Creditor: this.Is_Creditor,
      Is_Others: this.Is_Others,
      Last_Bill_date: this.Last_Bill_date,
      report_folder: this.gs.globalVariables.report_folder,
      rec_category: this.rec_category,
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

    this.Record = new Customerm();
    this.Record.cust_pkid = this.pkid;
    this.Record.cust_code = '';
    this.Record.cust_name = '';
    this.Record.cust_iecode = '';
    this.Record.cust_panno = '';
    this.Record.cust_tanno = '';
    this.Record.cust_class = 'N';
    this.Record.cust_type = 'N';


    this.Record.cust_sepz_unit = false;
    this.Record.cust_linked = false;
    this.Record.cust_is_shipper = false;
    this.Record.cust_is_ungst = false;
    this.Record.cust_is_foreigner = false;
    this.Record.cust_is_consignee = false;
    this.Record.cust_is_agent = false;
    this.Record.cust_is_cha = false;
    this.Record.cust_is_creditor = false;
    this.Record.cust_is_others = false;
    this.Record.rec_locked = true;

    this.Record.cust_crdays = 1;
    this.Record.cust_crlimit = 1;

    this.Record.cust_crdate = '';

    this.Record.cust_sman_id = '';
    this.Record.cust_sman_name = '';

    this.Record.cust_remarks = '';

    this.Record.cust_csd_id = '';
    this.Record.cust_csd_name = '';

    this.Record.cust_referdby = '';

    this.Record.cust_dbkacno = '';
    this.Record.cust_adcode = '';
    this.Record.cust_bank = '';
    this.Record.cust_bank_branch = '';
    this.Record.cust_acno = '';
    this.Record.cust_forexacno = '';
    this.Record.cust_bank_address1 = '';
    this.Record.cust_bank_address2 = '';
    this.Record.cust_bank_address3 = '';

    this.Record.cust_branch_code = '';

    this.Record.cust_linked = false;

    this.cust_linked = false;

    this.Record.cust_nomination = 'NA';


    this.SMANREC = { 'controlname': 'SALESMAN', 'type': 'SALESMAN', displaycolumn: 'NAME', id: '', code: '', name: '' };
    this.CSDREC = { 'controlname': 'CSD', 'type': 'SALESMAN', displaycolumn: 'NAME', id: '', code: '', name: '' };


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

  LoadData(_Record: Customerm) {
    this.Record = _Record;

    this.cust_linked = this.Record.cust_linked;
    this.Record.AddressList = _Record.AddressList;

    this.SMANREC = { 'controlname': 'SALESMAN', 'type': 'SALESMAN', displaycolumn: 'NAME', id: this.Record.cust_sman_id, code: '', name: this.Record.cust_sman_name };
    this.CSDREC = { 'controlname': 'CSD', 'type': 'SALESMAN', displaycolumn: 'NAME', id: this.Record.cust_csd_id, code: '', name: this.Record.cust_csd_name };

    this.Record.rec_mode = this.mode;

    this.InitLov();

    this.COMPRECORD.code = this.Record.cust_branch_code;


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
        if (this.mode == "ADD") {
          this.InfoMessage = "Save Complete," + response.mailerror;
          alert(this.InfoMessage);
        } else
          this.InfoMessage = "Save Complete";

        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;


        if (response.STATUS == "SPECIAL CHARACTER") {
          alert("Specical Character Found In Address, Pls Re-Check Data");
        }
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

    if (this.Record.cust_code.trim().length <= 0) {
      bret = false;
      sError = " | Code Cannot Be Blank";
    }
    if (this.Record.cust_name.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Name Cannot Be Blank";
    }

    if (this.Record.cust_is_foreigner) {
      if (this.Record.cust_is_shipper == false) {
        bret = false;
        sError += "\n\r | Shipper Need To Be Selected";
      }
    }

    if (this.Record.cust_linked) {

      if (!this.Record.acc_group_id || !this.Record.acc_type_id || !this.Record.acc_against_invoice) {
        bret = false;
        sError += "\n\r | A/c Details Not Complete";
      }
      else if (this.Record.acc_group_id.toString().length <= 0 || this.Record.acc_type_id.toString().length <= 0 || this.Record.acc_against_invoice.toString().length <= 0) {
        bret = false;
        sError += "\n\r | A/c Details Not Complete";
      }

    }


    if (this.Record.cust_is_consignee) {
      if (this.Record.cust_nomination == 'NA') {
        bret = false;
        sError += "| Nomination Need To Be Selected";
      }
    }

    if (!this.Record.cust_is_consignee) {
      if (this.Record.cust_nomination != 'NA') {
        bret = false;
        sError += "| Invalid Nomination Status";
      }
    }

    if (this.addressComponent) {
      if (this.addressComponent.currentTab != 'LIST') {
        bret = false;
        sError += "\n\r | Save/Cancel Address Record";
      }
    }

    this.Record.cust_panno = this.Record.cust_panno.toUpperCase().trim();

    if (this.gs.globalVariables.user_code != 'ADMIN') {
      if (this.Record.cust_is_foreigner == false && this.Record.cust_is_shipper && this.Record.cust_panno == "" && this.gs.globalVariables.comp_code == 'CPL') {
        bret = false;
        sError += "\n\r | Pan No Cannot be Blank  ";
      }
    }

    if (this.Record.cust_panno != "" && this.Record.cust_panno != "NA") {

      if (this.Record.cust_panno.length != 10) {
        bret = false;
        sError += "\n\r | Pan# Need To Be 10 Characters  ";
      }
      else {

        for (var i = 0; i <= 9; i++) {

          if (i <= 4) {
            if (this.Isnumeric(this.Record.cust_panno[i]) == true) {
              bret = false;
              sError += "\n\r | Invalid Pan#, Format XXXXX9999X ";
              break;
            }
          }
          else if (i <= 8) {
            if (this.Isnumeric(this.Record.cust_panno[i]) == false) {
              bret = false;
              sError += "\n\r | Invalid Pan#, Format XXXXX9999X ";
              break;
            }
          }
          else if (i == 9) {
            if (this.Isnumeric(this.Record.cust_panno[i]) == true) {
              bret = false;
              sError += "\n\r | Invalid Pan#, Format XXXXX9999X ";

            }
          }
        }

      }
    }

    this.Record.cust_tanno = this.Record.cust_tanno.toUpperCase().trim();

    if (this.Record.cust_tanno != "" && this.Record.cust_tanno != "NA") {

      if (this.Record.cust_tanno.length != 10) {
        bret = false;
        sError += "\n\r | Tan# Need To Be 10 Characters ";
      }
      else {

        for (var i = 0; i <= 9; i++) {

          if (i <= 3) {
            if (this.Isnumeric(this.Record.cust_tanno[i]) == true) {
              bret = false;
              sError += "\n\r | Invalid Tan#, Format XXXX99999X ";
              break;
            }
          }
          else if (i <= 8) {
            if (this.Isnumeric(this.Record.cust_tanno[i]) == false) {
              bret = false;
              sError += "\n\r | Invalid Tan#, Format XXXX99999X ";
              break;
            }
          }
          else if (i == 9) {
            if (this.Isnumeric(this.Record.cust_tanno[i]) == true) {
              bret = false;
              sError += "\n\r | Invalid Tan#, Format XXXX99999X ";
            }
          }
        }
      }
    }


    if (bret) {
      this.Record.cust_code = this.Record.cust_code.toUpperCase().replace(' ', '');
      this.Record.cust_name = this.Record.cust_name.toUpperCase().trim();
      this.Record.cust_iecode = this.Record.cust_iecode.toUpperCase().trim();

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
    var REC = this.RecordList.find(rec => rec.cust_pkid == this.Record.cust_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.cust_code = this.Record.cust_code;
      REC.cust_name = this.Record.cust_name;
    }
  }


  OnBlur(field: string) {
    if (field == 'cust_crdays') {
      this.Record.cust_crdays = this.Record.cust_crdays;
    }
    if (field == 'cust_crlimit') {
      this.Record.cust_crlimit = this.Record.cust_crlimit;
    }


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

  Unlink(Id: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';

    if (this.gs.globalVariables.user_code != "ADMIN")
      return;

    this.loading = true;
    let SearchData = {
      pkid: Id,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code
    };

    SearchData.pkid = Id;
    this.mainService.UnlinkAccounts(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.error.length > 0) {
          this.ErrorMessage = response.error;
          alert(this.ErrorMessage);
        }
        else {
          this.InfoMessage = "Successfully Unlinked";
          alert(this.InfoMessage);
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  CheckCrLimit(bCallSave: boolean = false) {


    let SearchData = {
      searchfrom: 'SI-IMPORT',
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      customerid: this.pkid,
      billtoid: ''
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetCreditLimit(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.CrList = response.list;
        this.bCreditLimit = response.retvalue;

        if (!this.bCreditLimit) {
          this.ErrorMessage = response.message;

          this.showalert = true;
          //alert(response.message);

        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  UnlockCustomer(locktype: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';

    this.loading = true;
    let SearchData = {
      type: locktype,
      pkid: '',
      company_code: '',
      branch_code: '',
      branch_name:'',
      year_code: '',
      user_pkid:'',
      user_code: '',
      cust_code: '',
      cust_name: '',
      remarks: ''
    };

    SearchData.type = locktype;
    SearchData.pkid = this.pkid;
    SearchData.remarks = ''
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.branch_name = this.gs.globalVariables.branch_name;
    SearchData.year_code = this.gs.globalVariables.year_code;
    SearchData.user_pkid = this.gs.globalVariables.user_pkid;
    SearchData.user_code = this.gs.globalVariables.user_code;
    SearchData.cust_code = this.Record.cust_code;
    SearchData.cust_name = this.Record.cust_name;

    this.mainService.UnlockCustomer(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (locktype == 'UNLOCKED') {
          this.Record.rec_locked = false;
          this.InfoMessage = " Unlocked Successfully, " + response.mailerror;
        }
        else {
          this.Record.rec_locked = true;
          this.InfoMessage = " Locked Successfully ";
        }
        alert(this.InfoMessage);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


}
