import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { MarkContacts } from '../models/markcontacts';
import { MarkContactService } from '../services/markcontacts.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Jobm } from '../../clearing/models/job';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  providers: [MarkContactService]
})
export class ContactsComponent {

  // Local Variables
  title = 'Contacts MASTER';

  @Input() iisModalWindow: string = 'N';
  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() clientType: string = '';
  @Input() clientid: string = '';

  InitCompleted: boolean = false;
  menu_record: any;

  /// selectedRowIndex = 0;

  modal: any;
  disableSave = true;
  loading = false;
  /// currentTab = 'LIST';
  /// searchLeadSource = 'ALL';
  /// searchConvrtStatus = 'NA';
  /// searchSalesperson = '';
  /// searchSalesperson_id = '';
  /// searchstring = '';
  /// searchvalidation = 'NA';
  /// searchsortby = 'a.cont_name';
  /// searchdatetype = 'LAST-VISIT-DATE';
  /// page_count = 0;
  /// page_current = 0;
  /// page_rows = 0;
  /// page_rowcount = 0;

  sub: any;
  urlid: string;

  ActionsRecord = {
    parent_id: '',
    title: '',
    mode_title: ' TO CUSTOMER INFO',
    hide_rem_caption: true,
    hide_plan: true,
    save_everyone: true,
    followupstatus: ''
  };

  jobno: string = '';

  /// reclocked: boolean = false;
  cust_lock: boolean = false;
  activeTabId = 'contactTab';
  /// ErrorMessage = "";
  /// InfoMessage = "";
  bDocs: boolean = false;
  bDocsUpload: boolean = false;
  /// mode = '';
  /// pkid = '';
  /// fromdate = '';
  /// todate = '';
  cust_name = '';
  sman_id = '';
  showclosebutton: boolean = true;
  showDetails: boolean = true;
  IsAdmin: boolean = false;
  bPrint: boolean = false;
  ConvRecList: Jobm[] = [];

  // Array For Displaying List
  /// RecordList: MarkContacts[] = [];
  // Single Record for add/edit/view details
  Record: MarkContacts = new MarkContacts;

  /// cont_is_shipper: boolean = false;
  /// cont_is_consignee: boolean = false;
  /// cont_is_agent: boolean = false;
  /// cont_is_carrier: boolean = false;
  /// cont_is_buyingagent: boolean = false;
  /// cont_is_corporate: boolean = false;
  /// cont_is_convert: boolean = false;

  CATEGORYRECORD: SearchTable = new SearchTable();
  SALESMANRECORD: SearchTable = new SearchTable();
  CSDRECORD: SearchTable = new SearchTable();
  CNTRYRECORD: SearchTable = new SearchTable();

  constructor(
    private modalService: NgbModal,
    public ms: MarkContactService,
    private route: ActivatedRoute,
    public gs: GlobalService

  ) {

    /// this.page_count = 0;
    /// this.page_rows = 25;
    /// this.page_current = 0;

    this.InitLov();

    // URL Query Parameter
    this.sub = this.route.queryParams.subscribe(params => {
      if (params["parameter"] != "") {
        //this.InitCompleted = true;  //new change start end
        var options = JSON.parse(params["parameter"]);
        this.menuid = options.menuid;
        this.type = options.type;
        //this.InitComponent();  //new change start end
      }
    });

  }

  // Init Will be called After executing Constructor
  ngOnInit() {

    if (this.iisModalWindow == "Y") {
      this.InitComponent();
      this.showclosebutton = false;
      this.ms.state.page_rows = 5;
      if (this.gs.isBlank(this.clientid))
        this.ActionHandler('ADD', '');
      else
        this.ActionHandler('EDIT', this.clientid, '', '')
    }
    else {

      if (!this.InitCompleted) {
        this.InitCompleted = true;
        this.InitComponent();
      }
      this.ms.init(this.menuid, this.type);
      //new change start
      if (this.ms.state.mode == "ADD")
        this.ActionHandler('LIST', '');
      else if (this.ms.state.mode == "EDIT")
        this.ActionHandler('EDIT', this.ms.state.pkid)
      //new change end
      if(!this.ms.state.Initialized){
        this.List('NEW');
        this.ms.state.Initialized = true;
      }
    }





  }

  InitComponent() {
    /// this.ms.state.searchSalesperson = this.gs.globalVariables.sman_name;
    /// this.ms.state.searchSalesperson_id = this.gs.globalVariables.sman_id;
    /// this.ms.state.fromdate = "";
    /// this.ms.state.todate = "";
    this.IsAdmin = false;
    this.bPrint = false;
    this.bDocs = false;
    ///this.ms.state.reclocked = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.IsAdmin = true;
      if (this.menu_record.rights_print)
        this.bPrint = true;
      if (this.menu_record.rights_docs)
        this.bDocs = true;
    }
    this.LoadCombo();
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  /// for restore selected row in list
  ngAfterViewInit() {
    this.restoreRowPosition();
  }

  restoreRowPosition(){
    setTimeout(() => {
      this.scrollToRowPosition();
    }, 100);
  }

  scrollToRowPosition() {
    const row = document.getElementById('row-' + this.ms.state.selectedRowIndex);
    if (row) {
      row.scrollIntoView({
        behavior: 'auto',
        block: 'center'
      });
    }
  }

  InitLov() {

    this.CATEGORYRECORD = new SearchTable();
    this.CATEGORYRECORD.controlname = "CONTACT TYPE";
    this.CATEGORYRECORD.displaycolumn = "NAME";
    this.CATEGORYRECORD.type = "CONTACT TYPE";
    this.CATEGORYRECORD.id = "";
    this.CATEGORYRECORD.code = "";
    this.CATEGORYRECORD.name = "";

    this.SALESMANRECORD = new SearchTable();
    this.SALESMANRECORD.controlname = "SALESMAN";
    this.SALESMANRECORD.displaycolumn = "NAME";
    this.SALESMANRECORD.type = "SALESMAN";
    this.SALESMANRECORD.id = "";
    this.SALESMANRECORD.code = "";
    this.SALESMANRECORD.name = "";

    this.CSDRECORD = new SearchTable();
    this.CSDRECORD.controlname = "CSD";
    this.CSDRECORD.displaycolumn = "NAME";
    this.CSDRECORD.type = "SALESMAN";
    this.CSDRECORD.id = "";
    this.CSDRECORD.code = "";
    this.CSDRECORD.name = "";

    this.CNTRYRECORD = new SearchTable();
    this.CNTRYRECORD.controlname = "COUNTRY";
    this.CNTRYRECORD.displaycolumn = "NAME";
    this.CNTRYRECORD.type = "COUNTRY";
    this.CNTRYRECORD.id = "";
    this.CNTRYRECORD.code = "";
    this.CNTRYRECORD.name = "";
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
    // this.ms.LoadDefault(SearchData)
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

    if (_Record.controlname == "COUNTRY") {
      this.Record.cont_country_id = _Record.id;
      this.Record.cont_country_code = _Record.code;
      this.Record.cont_country = _Record.name;
    }

    if (_Record.controlname == "CUST") {
      this.Record.cont_cust_id = _Record.id;
      this.Record.cont_cust_code = _Record.code;
      this.Record.cont_cust_name = _Record.name;
      this.Record.cont_is_converted = true;
    }

    if (_Record.controlname == "SMAN") {
      this.ms.state.searchSalesperson_id = _Record.id;
      this.ms.state.searchSalesperson = _Record.name;
    }

  }



  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string, _name: string = '', _smanid: string = '') {
    this.ms.state.ErrorMessage = '';
    this.ms.state.InfoMessage = '';
    if (action == 'LIST') {
      this.ms.state.mode = '';
      this.ms.state.pkid = '';
      this.ms.state.currentTab = 'LIST';
      this.restoreRowPosition();
    }
    else if (action === 'ADD') {
      this.ms.state.currentTab = 'DETAILS';
      this.ms.state.mode = 'ADD';
      this.cust_name = '';
      this.sman_id = '';
      this.ResetControls();
      this.NewRecord();
      this.ActionsRecord.parent_id = this.ms.state.pkid;
    }
    else if (action === 'EDIT') {
      this.ms.state.currentTab = 'DETAILS';
      this.ms.state.mode = 'EDIT';
      this.ResetControls();
      this.ms.state.pkid = id;
      this.cust_name = _name;
      this.sman_id = _smanid;
      this.GetRecord(id);
      this.ActionsRecord.parent_id = id;
    }
  }


  ResetControls() {
    this.disableSave = true;
    this.showDetails = true;
    if (!this.menu_record)
      return;

    if (this.menu_record.rights_admin)
      this.disableSave = false;

    if (this.ms.state.mode == "ADD" && this.menu_record.rights_add)
      this.disableSave = false;

    if (this.ms.state.mode == "EDIT" && this.menu_record.rights_edit)
      this.disableSave = false;

    return this.disableSave;

  }

  // Query List Data
  List(_type: string) {

    let sCategory: string = "";
    if (this.ms.state.cont_is_shipper)
      sCategory += "SHIPPER";
    if (this.ms.state.cont_is_consignee) {
      if (sCategory != "")
        sCategory += ",";
      sCategory += "CONSIGNEE";
    }
    if (this.ms.state.cont_is_agent) {
      if (sCategory != "")
        sCategory += ",";
      sCategory += "COUNTERPART";
    }
    if (this.ms.state.cont_is_carrier) {
      if (sCategory != "")
        sCategory += ",";
      sCategory += "AIRLINE,LINER";
    }
    if (this.ms.state.cont_is_buyingagent) {
      if (sCategory != "")
        sCategory += ",";
      sCategory += "BUYINGAGENT";
    }


    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.ms.state.searchstring.toUpperCase(),
      searchsalesperson: this.ms.state.searchSalesperson,
      leadsource: this.ms.state.searchLeadSource,
      conversionstatus: this.ms.state.searchConvrtStatus,
      fromdate: this.ms.state.fromdate,
      todate: this.ms.state.todate,
      category: sCategory,
      iscorporate: this.ms.state.cont_is_corporate ? "Y" : "N",
      isconvert: this.ms.state.cont_is_convert ? "Y" : "N",
      page_count: this.ms.state.page_count,
      page_current: this.ms.state.page_current,
      page_rows: this.ms.state.page_rows,
      page_rowcount: this.ms.state.page_rowcount,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      report_folder: this.gs.globalVariables.report_folder,
      searchvalidation: this.ms.state.searchvalidation,
      searchsortby: this.ms.state.searchsortby,
      searchdatetype: this.ms.state.searchdatetype,
      reclocked: this.ms.state.reclocked
    };

    this.ms.state.selectedRowIndex = 0;
    this.restoreRowPosition();
    this.ms.state.ErrorMessage = '';
    this.ms.state.InfoMessage = '';
    this.ms.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.ms.state.RecordList = response.list;
          this.ms.state.page_count = response.page_count;
          this.ms.state.page_current = response.page_current;
          this.ms.state.page_rowcount = response.page_rowcount;
        }
      },
        error => {
          this.loading = false;
          this.ms.state.ErrorMessage = this.gs.getError(error);
          alert(this.ms.state.ErrorMessage);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  NewRecord() {
    this.cust_lock = false;
    this.ms.state.pkid = this.gs.getGuid();
    this.Record = new MarkContacts();
    this.Record.cont_pkid = this.ms.state.pkid;
    this.Record.cont_name = '';
    this.Record.cont_add1 = '';
    this.Record.cont_add2 = '';
    this.Record.cont_add3 = '';
    this.Record.cont_add4 = '';
    this.Record.cont_add5 = '';
    this.Record.cont_state = '';
    this.Record.cont_country_id = '';
    this.Record.cont_country_code = '';
    this.Record.cont_country = '';
    this.Record.cont_tel = '';
    this.Record.cont_fax = '';
    this.Record.cont_mobile = '';
    this.Record.cont_email = '';
    this.Record.cont_web = '';
    this.Record.cont_type_id = '';
    this.Record.cont_type_name = '';
    this.Record.cont_iscorporat = false;
    this.Record.cont_saleman_id = '';
    this.Record.cont_saleman_name = '';
    this.Record.cont_region = '';
    this.Record.cont_remark = '';
    this.Record.cont_iecode = '';
    this.Record.cont_location = '';
    this.Record.cont_cha_name = '';
    this.Record.cont_csd_id = '';
    this.Record.cont_csd_name = '';
    this.Record.cont_type_2 = 'NA';
    this.Record.cont_type2_remarks = '';
    this.Record.cont_target_market = '';
    this.Record.cont_is_seclr = false;
    this.Record.cont_is_sefwd = false;
    this.Record.cont_is_siclr = false;
    this.Record.cont_is_sifwd = false;
    this.Record.cont_is_aeclr = false;
    this.Record.cont_is_aefwd = false;
    this.Record.cont_is_aiclr = false;
    this.Record.cont_is_aifwd = false;
    this.Record.cont_is_pj = false;
    this.Record.cont_is_wh = false;
    this.Record.cont_is_tp = false;
    this.Record.cont_contact = '';
    this.Record.cont_lead_source = 'SELF';
    this.Record.cont_converted = 'NA';
    this.Record.rec_mode = this.ms.state.mode;
    this.Record.rec_locked = false;
    this.Record.cont_is_project = false;
    this.Record.cont_doc_attached = 'N';
    this.Record.cont_is_converted = false;
    this.Record.cont_cust_id = '';
    this.Record.cont_cust_code = '';
    this.Record.cont_cust_name = '';
    this.Record.cont_converted_date = '';
    this.Record.cont_converted_vol = 0;
    this.Record.cont_converted_unit = 'NA';
    this.Record.cont_converted_jobid = '';
    this.Record.cont_converted_jobno = '';
    this.Record.cont_conv_type = "NA";
    this.Record.cont_visit_tot = 0;

    this.InitLov();
    if (!this.gs.isBlank(this.clientType)) {
      if (this.clientType == "SHIPPER" && this.gs.globalVariables.comp_code == "CPL") {
        this.Record.cont_type_id = "4E625CA6-3343-478F-9C54-3A29C5172330";
        this.Record.cont_type_name = "SHIPPER";
      }
      if (this.clientType == "CONSIGNEE" && this.gs.globalVariables.comp_code == "CPL") {
        this.Record.cont_type_id = "5260B605-4D32-4064-BB61-FCDC76D503F1";
        this.Record.cont_type_name = "CONSIGNEE";
      }
      this.CATEGORYRECORD.id = this.Record.cont_type_id;
      this.CATEGORYRECORD.code = this.Record.cont_type_name;
      this.CATEGORYRECORD.name = this.Record.cont_type_name;
    }

    this.SALESMANRECORD.id = this.gs.globalVariables.sman_id;
    this.SALESMANRECORD.code = this.gs.globalVariables.sman_name;
    this.SALESMANRECORD.name = this.gs.globalVariables.sman_name;
  }




  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {

    this.loading = true;
    let SearchData = {
      pkid: Id,
    };

    this.ms.state.ErrorMessage = '';
    this.ms.state.InfoMessage = '';
    this.ms.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.LoadData(response.record);
        this.ConvRecList = response.list;
      },
        error => {
          this.loading = false;
          this.ms.state.ErrorMessage = this.gs.getError(error);
          alert(this.ms.state.ErrorMessage);
        });
  }

  LoadData(_Record: MarkContacts) {
    this.Record = _Record;
    this.Record.rec_mode = "EDIT";
    if (this.ms.state.mode == "ADD") {
      this.Record.cont_pkid = this.ms.state.pkid;
      this.Record.cont_cust_id = '';
      this.Record.cont_cust_name = '';
      this.Record.cont_is_converted = false;
      this.Record.cont_converted_date = '';
      this.Record.cont_converted_unit = '';
      this.Record.cont_converted_jobid = '';
      this.Record.cont_converted_jobno = '';
      this.Record.cont_converted_vol = 0;
      this.Record.rec_mode = "ADD";
    }

    this.cust_lock = false;
    if (this.Record.cont_cust_id && this.gs.globalVariables.user_code != 'ADMIN')
      this.cust_lock = true;

    this.InitLov();

    this.CATEGORYRECORD.id = this.Record.cont_type_id.toString();
    this.CATEGORYRECORD.name = this.Record.cont_type_name;

    this.SALESMANRECORD.id = this.Record.cont_saleman_id.toString();
    this.SALESMANRECORD.name = this.Record.cont_saleman_name;

    this.CSDRECORD.id = this.Record.cont_csd_id.toString();
    this.CSDRECORD.name = this.Record.cont_csd_name;

    this.CNTRYRECORD.id = this.Record.cont_country_id;
    this.CNTRYRECORD.code = this.Record.cont_country_code;
    this.CNTRYRECORD.name = this.Record.cont_country;

  }




  // Save Data
  Save() {
    if (!this.allvalid()) {
      alert(this.ms.state.ErrorMessage);
      return;
    }

    this.loading = true;
    this.ms.state.ErrorMessage = '';
    this.ms.state.InfoMessage = '';
    this.Record._globalvariables = this.gs.globalVariables;
    if (this.gs.isBlank(this.Record.cont_cust_id))
      this.Record.cont_is_converted = false;
    else
      this.Record.cont_is_converted = true;
    this.ms.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        if (this.ms.state.mode == 'ADD')
          this.cust_name = this.Record.cont_name;//visit report searching
        this.ms.state.mode = 'EDIT';
        this.Record.rec_mode = this.ms.state.mode;
        this.ms.state.InfoMessage = "Save Complete";
        alert(this.ms.state.InfoMessage);
        this.RefreshList();
      },
        error => {
          this.loading = false;
          this.ms.state.ErrorMessage = this.gs.getError(error);
          alert(this.ms.state.ErrorMessage);
        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ms.state.ErrorMessage = '';
    this.ms.state.InfoMessage = '';

    // if (this.gs.isBlank(this.Record.cont_name)) {
    //   bret = false;
    //   sError = " | Name Cannot be Blank";
    // }

    // if (this.gs.isBlank(this.Record.cont_type_2)) {
    //   bret = false;
    //   sError += " | Type Cannot be Blank";
    // }

    if (bret) {
      this.Record.cont_name = this.Record.cont_name.toUpperCase().trim();
    }

    // if (bret === false)
    //   this.ErrorMessage = sError;
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

    if (this.ms.state.RecordList == null)
      return;
    var REC = this.ms.state.RecordList.find(rec => rec.cont_pkid == this.Record.cont_pkid);
    if (REC == null) {
      this.ms.state.RecordList.push(this.Record);
      this.ms.state.selectedRowIndex = this.ms.state.RecordList.length - 1;
    }
    else {
      REC.cont_name = this.Record.cont_name;
      REC.cont_add1 = this.Record.cont_add1;
      REC.cont_state = this.Record.cont_state;
      REC.cont_country = this.Record.cont_country;
      REC.cont_tel = this.Record.cont_tel;
      REC.cont_mobile = this.Record.cont_mobile;
      REC.cont_email = this.Record.cont_email;
      REC.cont_lead_source = this.Record.cont_lead_source;
      REC.cont_converted = this.Record.cont_converted;
      REC.rec_locked = this.Record.rec_locked;
    }
  }


  OnBlur(field: string) {

    if (field == 'cont_name') {
      this.Record.cont_name = this.Record.cont_name.toUpperCase();
    }
    if (field == 'cont_add1') {
      this.Record.cont_add1 = this.Record.cont_add1.toUpperCase();
    }
    if (field == 'cont_add2') {
      this.Record.cont_add2 = this.Record.cont_add2.toUpperCase();
    }
    if (field == 'cont_add3') {
      this.Record.cont_add3 = this.Record.cont_add3.toUpperCase();
    }
    if (field == 'cont_add4') {
      this.Record.cont_add4 = this.Record.cont_add4.toUpperCase();
    }
    if (field == 'cont_add5') {
      this.Record.cont_add5 = this.Record.cont_add5.toUpperCase();
    }
    if (field == 'cont_state') {
      this.Record.cont_state = this.Record.cont_state.toUpperCase();
    }
    if (field == 'cont_country') {
      this.Record.cont_country = this.Record.cont_country.toUpperCase();
    }
    if (field == 'cont_tel') {
      this.Record.cont_tel = this.Record.cont_tel.toUpperCase();
    }
    if (field == 'cont_fax') {
      this.Record.cont_fax = this.Record.cont_fax.toUpperCase();
    }
    if (field == 'cont_mobile') {
      this.Record.cont_mobile = this.Record.cont_mobile.toUpperCase();
    }

    if (field == 'cont_email') {
      this.Record.cont_email = this.Record.cont_email.toLowerCase();
    }

    if (field == 'cont_web') {
      this.Record.cont_web = this.Record.cont_web.toUpperCase();
    }

    if (field == 'cont_region') {
      this.Record.cont_region = this.Record.cont_region.toUpperCase();
    }

    if (field == 'cont_remark') {
      this.Record.cont_remark = this.Record.cont_remark.toUpperCase();
    }

    if (field == 'cont_iecode') {
      this.Record.cont_iecode = this.Record.cont_iecode.toUpperCase();
    }

    if (field == 'cont_location') {
      this.Record.cont_location = this.Record.cont_location.toUpperCase();
    }

    if (field == 'cont_cha_name') {
      this.Record.cont_cha_name = this.Record.cont_cha_name.toUpperCase();
    }

    if (field == 'cont_target_market') {
      this.Record.cont_target_market = this.Record.cont_target_market.toUpperCase();
    }

    if (field == 'cont_contact') {
      this.Record.cont_contact = this.Record.cont_contact.toUpperCase();
    }

    if (field == 'searchstring') {
      this.ms.state.searchstring = this.ms.state.searchstring.toUpperCase().trim();
    }
    if (field == 'searchSalesperson') {
      this.ms.state.searchSalesperson = this.ms.state.searchSalesperson.toUpperCase().trim();
    }
    if (field == 'cont_type2_remarks') {
      this.Record.cont_type2_remarks = this.Record.cont_type2_remarks.toUpperCase();
    }

    if (field == 'cont_converted_vol') {
      this.Record.cont_converted_vol = this.gs.roundNumber(this.Record.cont_converted_vol, 3);
    }
  }

  Close() {
    this.gs.ClosePage('home');
  }

  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }

  ShowHide() {
    this.showDetails = !this.showDetails;
  }


  ShowDocuments(doc: any, _rec: MarkContacts = null) {
    this.ms.state.ErrorMessage = '';
    this.bDocsUpload = true;
    if (_rec != null) {
      this.ms.state.pkid = _rec.cont_pkid;
      this.bDocsUpload = false;
    }
    this.open(doc);
  }

  SearchRecord(controlname: string) {
    this.ms.state.ErrorMessage = '';
    if (this.Record.cont_name.trim().length <= 0) {
      this.ms.state.ErrorMessage = 'Please Enter Customer Name and Continue......';
      alert(this.ms.state.ErrorMessage);
      return;
    }
    this.loading = true;
    let SearchData = {
      table: 'contactname',
      rowtype: this.type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      cont_name: ''
    };

    SearchData.table = 'contactname';
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.year_code = this.gs.globalVariables.year_code;
    SearchData.cont_name = this.Record.cont_name;

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;

        this.ms.state.ErrorMessage = '';
        if (!this.gs.isBlank(response.contactname.cont_pkid)) {
          this.GetRecord(response.contactname.cont_pkid);
        }
        else {
          this.ms.state.ErrorMessage = 'Contact Name not Found';
          alert(this.ms.state.ErrorMessage);
        }
      },
        error => {
          this.loading = false;
          this.ms.state.ErrorMessage = this.gs.getError(error);
          alert(this.ms.state.ErrorMessage);
        });
  }

  actionsChanged(comments: any, _rec: MarkContacts) {

    if (comments.saction == "SAVE") {
      for (let rec of this.ms.state.RecordList.filter(rec => rec.cont_pkid == _rec.cont_pkid)) {
        rec.cont_infocount = comments.sfollowupcount;
      }
    }
  }

  ModifiedRecords(params: any) {
    this.Record.cont_converted_jobno = params.jobno;
    this.Record.cont_converted_date = params.jobdate;
    this.Record.cont_converted_vol = params.volume;
    this.Record.cont_converted_unit = params.unit;
    this.Record.cont_cust_id = params.custid;
    this.Record.cont_cust_name = params.custname;
    this.Record.cont_is_converted = true;
  }

  onTabChange(event: any) {
    this.activeTabId = event.nextId;
  }

}
