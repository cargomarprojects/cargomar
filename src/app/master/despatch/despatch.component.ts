import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Despatchm } from '../models/despatch';
import { DespatchService } from '../services/despatch.service';
import { SearchTable } from '../../shared/models/searchtable';
import { DateComponent } from '../../shared/date/date.component';


@Component({
  selector: 'app-despatch',
  templateUrl: './despatch.component.html',
  providers: [DespatchService]
})
export class DespatchComponent {
  // Local Variables 
  title = 'Despatch Details';

  @ViewChild('dm_waybill_date') private dm_waybill_date: DateComponent;
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

  modal: any;

  sub: any;
  urlid: string;

  sSub: string = '';
  sMsg: string = '';
  sHtml: string = '';
  AttachList: any[] = [];

  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';

  //  Array For Displaying List
  RecordList: Despatchm[] = [];
  //Single Record for add/edit/view details
  Record: Despatchm = new Despatchm;

  CUSTRECORD: SearchTable = new SearchTable();
  CUSTADDRECORD: SearchTable = new SearchTable();
  PARTYRECORD: SearchTable = new SearchTable();
  COURIERRECORD: SearchTable = new SearchTable();

  constructor(
    private modalService: NgbModal,
    private mainService: DespatchService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 10;
    this.page_current = 0;
    //  URL Query Parameter 
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

  //  Init Will be called After executing Constructor
  ngOnInit() {
    if (!this.InitCompleted) {
      this.InitComponent();
    }
  }

  InitComponent() {

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
    this.InitLov();
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
    //    this.StatusList = response.statuslist;

    //    this.List("NEW");
    //  },
    //  error => {
    //    this.loading = false;
    //    this.ErrorMessage = JSON.parse(error._body).Message;
    //  });

    this.List("NEW");
  }


  InitLov(saction: string = "") {

    if (saction == "" || saction == "PARTY") {

      this.CUSTRECORD = new SearchTable();
      this.CUSTRECORD.controlname = "CUSTOMER";
      this.CUSTRECORD.displaycolumn = "CODE";
      this.CUSTRECORD.type = "CUSTOMER";
      this.CUSTRECORD.id = "";
      this.CUSTRECORD.code = "";
      this.CUSTRECORD.name = "";

      this.CUSTADDRECORD = new SearchTable();
      this.CUSTADDRECORD.controlname = "CUSTADDRESS";
      this.CUSTADDRECORD.displaycolumn = "CODE";
      this.CUSTADDRECORD.type = "CUSTOMERADDRESS";
      this.CUSTADDRECORD.id = "";
      this.CUSTADDRECORD.code = "";
      this.CUSTADDRECORD.name = "";
      this.CUSTADDRECORD.parentid = "";

      this.PARTYRECORD = new SearchTable();
      this.PARTYRECORD.controlname = "PARTY";
      this.PARTYRECORD.displaycolumn = "CODE";
      this.PARTYRECORD.type = "CUSTOMER";
      this.PARTYRECORD.id = "";
      this.PARTYRECORD.code = "";
      this.PARTYRECORD.name = "";
    }

    if (saction == "") {
      this.COURIERRECORD = new SearchTable();
      this.COURIERRECORD.controlname = "COURIER";
      this.COURIERRECORD.displaycolumn = "CODE";
      this.COURIERRECORD.type = "COURIER COMPANY";
      this.COURIERRECORD.id = "";
      this.COURIERRECORD.code = "";
      this.COURIERRECORD.name = "";
    }
  }

  LovSelected(_Record: SearchTable) {
    let bchange: boolean = false;
    if (_Record.controlname == 'CUSTOMER') {
      this.Record.dm_cust_id = _Record.id;
      this.Record.dm_cust_code = _Record.code;
      this.Record.dm_cust_name = _Record.name;
      this.Record.dm_cust_add1 = '';
      this.Record.dm_cust_add2 = '';
      this.Record.dm_cust_add3 = '';
      this.Record.dm_cust_add4 = '';

      this.CUSTADDRECORD = new SearchTable();
      this.CUSTADDRECORD.controlname = "CUSTADDRESS";
      this.CUSTADDRECORD.displaycolumn = "CODE";
      this.CUSTADDRECORD.type = "CUSTOMERADDRESS";
      this.CUSTADDRECORD.id = "";
      this.CUSTADDRECORD.code = "";
      this.CUSTADDRECORD.name = "";
      this.CUSTADDRECORD.parentid = this.Record.dm_cust_id;
    } else if (_Record.controlname == "CUSTADDRESS") {

      this.Record.dm_cust_br_id = _Record.id;
      this.SearchRecord("CUSTADDRESS", this.Record.dm_cust_br_id, this.Record.dm_cust_id);
    }
    else if (_Record.controlname == "PARTY") {
      this.Record.dm_party_id = _Record.id;
      this.Record.dm_party_code = _Record.code;
      this.Record.dm_party_name = _Record.name;
    }
    else if (_Record.controlname == "COURIER") {
      this.Record.dm_courier_id = _Record.id;
      this.Record.dm_courier_code = _Record.code;
      this.Record.dm_courier_name = _Record.name;
    }
  }

  // function for handling LIST/NEW/EDIT Buttons
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
    if (this.mode == "EDIT")
      return this.disableSave;
  }

  //   Query List Data
  List(_type: string) {

    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
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

  NewRecord() {
    this.pkid = this.gs.getGuid();
    this.Record = new Despatchm();
    this.Record.dm_pkid = this.pkid;
    this.Record.dm_refdate = this.gs.defaultValues.today;
    this.Record.dm_slno = null;
    this.Record.dm_refno = '';
    this.Record.dm_cust_id = '';
    this.Record.dm_cust_code = '';
    this.Record.dm_cust_name = '';
    this.Record.dm_cust_br_id = '';
    this.Record.dm_cust_br_no = '';
    this.Record.dm_cust_br_addr = '';
    this.Record.dm_cust_add1 = '';
    this.Record.dm_cust_add2 = '';
    this.Record.dm_cust_add3 = '';
    this.Record.dm_cust_add4 = '';
    this.Record.dm_cust_tel = '';
    this.Record.dm_cust_email = '';
    this.Record.dm_party_id = '';
    this.Record.dm_party_code = '';
    this.Record.dm_party_name = '';
    this.Record.dm_inv_no = '';
    this.Record.dm_tot_ctns = 0;
    this.Record.dm_containers = '';
    this.Record.dm_grwt = '';
    this.Record.dm_volume = '';
    this.Record.dm_doc_attach = '';
    this.Record.dm_remarks = '';
    this.Record.dm_courier_id = '';
    this.Record.dm_courier_code = '';
    this.Record.dm_courier_name = '';
    this.Record.dm_waybill_no = '';
    this.Record.dm_waybill_date = '';
    this.Record.dm_si_nos = '';
    this.Record.dm_mail_sent = 'N';
    this.Record.rec_category = 'AIREXP-SI';
    this.Record.dm_is_sbill_1 = false;
    this.Record.dm_is_invoice_2 = false;
    this.Record.dm_is_pkglst_3 = false;
    this.Record.dm_is_awb_4 = false;
    this.Record.dm_is_epcopy_5 = false;
    this.Record.dm_is_are1_6 = false;
    this.Record.dm_is_servicebill_7 = false;
    this.Record.dm_is_bl_8 = false;
    this.Record.dm_is_deec_9 = false;
    this.Record.dm_is_be_10 = false;
    this.Record.dm_is_exportercopy_11 = false;

    this.Record.dm_is_cfsinv_12 = false;
    this.Record.dm_is_fumicert_13 = false;
    this.Record.dm_is_degascert_14 = false;
    this.Record.dm_is_pqcert_15 = false;
    this.Record.dm_is_gspcert_16 = false;
    this.Record.dm_is_mccicert_17 = false;
    this.Record.dm_is_transcert_18 = false;
    this.Record.dm_is_linertaxcert_19 = false;
    this.Record.dm_is_fumitaxcert_20 = false;
    this.Record.dm_is_othcert_21 = false;
    this.InitLov();
    this.Record.rec_mode = this.mode;
  }

  //  Load a single Record for VIEW/EDIT
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

  LoadData(_Record: Despatchm) {
    this.Record = _Record;
    this.InitLov();

    this.CUSTRECORD.id = this.Record.dm_cust_id;
    this.CUSTRECORD.code = this.Record.dm_cust_code;
    this.CUSTRECORD.name = this.Record.dm_cust_name;

    this.CUSTADDRECORD.id = this.Record.dm_cust_br_id;
    this.CUSTADDRECORD.code = this.Record.dm_cust_br_no;
    this.CUSTADDRECORD.parentid = this.Record.dm_cust_id;

    this.PARTYRECORD.id = this.Record.dm_party_id;
    this.PARTYRECORD.code = this.Record.dm_party_code;
    this.PARTYRECORD.name = this.Record.dm_party_name;

    this.COURIERRECORD.id = this.Record.dm_courier_id;
    this.COURIERRECORD.code = this.Record.dm_courier_code;
    this.COURIERRECORD.name = this.Record.dm_courier_name;

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
        if (this.mode == 'ADD') {
          this.Record.dm_slno = response.dmslno;
          this.Record.dm_refno = response.dmrefno;
        }
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

    if (this.Record.dm_si_nos.endsWith(",")) {
      bret = false;
      sError = " | Incomplete SI Numbers ";
    }
    if (this.Record.dm_cust_name.length <= 0) {
      bret = false;
      sError += " | Customer Name Cannot be Blank ";
    }

    if (this.Record.dm_cust_add1.length <= 0) {
      bret = false;
      sError += " | Customer Address Cannot be Blank ";
    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {
    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.dm_pkid == this.Record.dm_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.dm_refdate = this.Record.dm_refdate;
      REC.dm_refno = this.Record.dm_refno;
      REC.rec_category = this.Record.rec_category;
      REC.dm_si_nos = this.Record.dm_si_nos;
      REC.dm_mail_sent = this.Record.dm_mail_sent;
      REC.dm_cust_name = this.Record.dm_cust_name;
      REC.dm_cust_add1 = this.Record.dm_cust_add1;
      REC.dm_cust_tel = this.Record.dm_cust_tel;
      REC.dm_cust_email = this.Record.dm_cust_email;
      REC.dm_party_name = this.Record.dm_party_name;
      REC.dm_courier_name = this.Record.dm_courier_name;
      REC.dm_waybill_no = this.Record.dm_waybill_no;
      REC.dm_waybill_date = this.Record.dm_waybill_date;
      REC.dm_remarks = this.Record.dm_remarks;
    }
  }


  OnBlur(field: string) {
    if (field == 'dm_cust_name') {
      this.Record.dm_cust_name = this.Record.dm_cust_name.toUpperCase();
    }
  }

  Close() {
    this.gs.ClosePage('home');
  }

  GetBrAddress(straddress: string) {
    let AddressSplit = {
      addressbrno: '',
      address: ''
    };
    if (straddress.trim() != "") {
      var temparr = straddress.split(' ');
      AddressSplit.addressbrno = temparr[0];
      AddressSplit.address = straddress.substr(AddressSplit.addressbrno.length).trim();
    }
    return AddressSplit;
  }


  folder_id: string;
  PrintDespatch(_type: string = 'PDF', mailsent: any) {
    this.ErrorMessage = ''

    if (this.pkid.length <= 0) {
      this.ErrorMessage = "\n\r | Invalid ID";
    }

    if (this.ErrorMessage.length > 0)
      return;

    if (_type == "MAIL") {

      this.sSub = "DESPATCH DETAILS " + this.Record.dm_refno;
      this.sSub += " - M/S " + this.Record.dm_cust_name;
      this.sSub += " - DT " + this.Record.dm_refdate_display;    // Dt_RefDate.Value.ToString("dd/MM/yyyy");
      if (this.Record.dm_si_nos != "")// For General category
      {
        this.sSub += " - SI# : " + this.Record.dm_si_nos;
      }

      this.sMsg = "Dear Valued Customer,";
      this.sMsg += " \n\n";
      this.sMsg += "  Please find the attached despatch details for your kind reference";
      this.sMsg += " \n\n";
      if (this.Record.dm_waybill_no.trim() != "") {
        this.sMsg += "  Courier Company : " + (this.Record.dm_courier_name == "NIL" ? "" : this.Record.dm_courier_name);
        this.sMsg += " \n\n";
        this.sMsg += "  Waybill Number : " + this.Record.dm_waybill_no;
        if (this.Record.dm_waybill_date) {
          this.sMsg += "  Date : " + this.dm_waybill_date.GetDisplayDate();
        }
        this.sMsg += " \n\n";
      }
      if (this.Record.dm_is_servicebill_7 == true) {
        this.sMsg += "  Also attaching the Service Bill(s) for your reference.";
        this.sMsg += " \n\n";
      }
    }

    this.loading = true;
    this.folder_id = this.gs.getGuid();
    let SearchData = {
      type: '',
      pkid: '',
      report_folder: '',
      folderid: '',
      company_code: '',
      branch_code: '',
      year_code: ''
    }

    SearchData.type = _type;
    SearchData.pkid = this.pkid;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.year_code = this.gs.globalVariables.year_code;
    SearchData.folderid = this.folder_id;

    this.ErrorMessage = '';
    this.mainService.PrintDespatch(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'MAIL') {
          this.AttachList = new Array<any>();
          this.AttachList = response.mailattachments;
          // this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname });
          this.open(mailsent);
        } else
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  SearchRecord(controlname: string, controlid: string, controlparentid: string) {
    this.ErrorMessage = '';
    if (controlname == 'DESPATCHDEFAULT') {
      if (this.Record.dm_si_nos.trim().length <= 0) {
        this.ErrorMessage = " SI# cannot be blank ";
        return;
      }
    } else {

      if (controlid.trim().length <= 0)
        return;
    }

    this.loading = true;
    let SearchData = {
      table: 'customeraddress',
      rowtype: this.type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      add_pkid: '',
      add_parent_id: '',
      si_nos: ''
    };

    if (controlname == 'DESPATCHDEFAULT') {
      SearchData.table = 'despatchdefault';
      SearchData.company_code = this.gs.globalVariables.comp_code;
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.year_code = this.gs.globalVariables.year_code;
      SearchData.si_nos = this.Record.dm_si_nos;
      SearchData.rowtype = this.Record.rec_category;
    } else {
      SearchData.table = 'customeraddress';
      SearchData.company_code = this.gs.globalVariables.comp_code;
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.year_code = this.gs.globalVariables.year_code;
      SearchData.add_pkid = controlid;
      SearchData.add_parent_id = controlparentid;
    }

    this.ErrorMessage = '';
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = '';

        if (controlname == 'CUSTADDRESS') {
          this.Record.dm_cust_add1 = '';
          this.Record.dm_cust_add2 = '';
          this.Record.dm_cust_add3 = '';
          this.Record.dm_cust_add4 = '';
          this.Record.dm_cust_tel = '';
          this.Record.dm_cust_email = '';
          if (response.customeraddress.length > 0) {
            this.Record.dm_cust_add1 = response.customeraddress[0].add_line1;
            this.Record.dm_cust_add2 = response.customeraddress[0].add_line2;
            this.Record.dm_cust_add3 = response.customeraddress[0].add_line3;
            this.Record.dm_cust_add4 = response.customeraddress[0].add_line4;
            this.Record.dm_cust_tel = response.customeraddress[0].add_tel;
            this.Record.dm_cust_email = response.customeraddress[0].add_email;
          }
          else {
            this.ErrorMessage = 'Invalid Address';
          }
        } else if (controlname == 'DESPATCHDEFAULT') {

          if (response.despatchdefault.length > 0) {

            if (this.Record.rec_category == "AIREXP-SI" || this.Record.rec_category == "SEAEXP-SI") {
              this.Record.dm_cust_id = response.despatchdefault[0].hbl_exp_id;
              this.Record.dm_cust_br_id = response.despatchdefault[0].hbl_exp_br_id;
              this.Record.dm_cust_code = response.despatchdefault[0].hbl_exp_code;
              this.Record.dm_cust_name = response.despatchdefault[0].hbl_exp_name;
              this.Record.dm_cust_br_no = response.despatchdefault[0].hbl_exp_br_no;
              this.Record.dm_cust_add1 = response.despatchdefault[0].hbl_exp_br_addr1;
              this.Record.dm_cust_add2 = response.despatchdefault[0].hbl_exp_br_addr2;
              this.Record.dm_cust_add3 = response.despatchdefault[0].hbl_exp_br_addr3;
              this.Record.dm_cust_tel = response.despatchdefault[0].hbl_exp_br_tel;
              this.Record.dm_cust_email = response.despatchdefault[0].hbl_exp_br_email;
              if (this.Record.dm_si_nos.indexOf(",") < 0) { //If multiple sinos then consignee could not loaded
                this.Record.dm_party_id = response.despatchdefault[0].hbl_imp_id;
                this.Record.dm_party_code = response.despatchdefault[0].hbl_imp_code;
                this.Record.dm_party_name = response.despatchdefault[0].hbl_imp_name;
              }

              this.InitLov("PARTY");

              this.CUSTRECORD.id = this.Record.dm_cust_id;
              this.CUSTRECORD.code = this.Record.dm_cust_code;
              this.CUSTRECORD.name = this.Record.dm_cust_name;
              this.CUSTADDRECORD.id = this.Record.dm_cust_br_id;
              this.CUSTADDRECORD.code = this.Record.dm_cust_br_no;
              this.CUSTADDRECORD.parentid = this.Record.dm_cust_id;
              if (this.Record.dm_si_nos.indexOf(",") < 0) {
                this.PARTYRECORD.id = this.Record.dm_party_id;
                this.PARTYRECORD.code = this.Record.dm_party_code;
                this.PARTYRECORD.name = this.Record.dm_party_name;
              }
            } else if (this.Record.rec_category == "AIRIMP-SI" || this.Record.rec_category == "SEAIMP-SI") {

              this.Record.dm_cust_id = response.despatchdefault[0].hbl_imp_id;
              this.Record.dm_cust_br_id = response.despatchdefault[0].hbl_imp_br_id;
              this.Record.dm_cust_code = response.despatchdefault[0].hbl_imp_code;
              this.Record.dm_cust_name = response.despatchdefault[0].hbl_imp_name;
              this.Record.dm_cust_br_no = response.despatchdefault[0].hbl_imp_br_no;
              this.Record.dm_cust_add1 = response.despatchdefault[0].hbl_imp_br_addr1;
              this.Record.dm_cust_add2 = response.despatchdefault[0].hbl_imp_br_addr2;
              this.Record.dm_cust_add3 = response.despatchdefault[0].hbl_imp_br_addr3;
              this.Record.dm_cust_tel = response.despatchdefault[0].hbl_imp_br_tel;
              this.Record.dm_cust_email = response.despatchdefault[0].hbl_imp_br_email;
              if (this.Record.dm_si_nos.indexOf(",") < 0) {
                this.Record.dm_party_id = response.despatchdefault[0].hbl_exp_id;
                this.Record.dm_party_code = response.despatchdefault[0].hbl_exp_code;
                this.Record.dm_party_name = response.despatchdefault[0].hbl_exp_name;
              }
              this.InitLov("PARTY");

              this.CUSTRECORD.id = this.Record.dm_cust_id;
              this.CUSTRECORD.code = this.Record.dm_cust_code;
              this.CUSTRECORD.name = this.Record.dm_cust_name;
              this.CUSTADDRECORD.id = this.Record.dm_cust_br_id;
              this.CUSTADDRECORD.code = this.Record.dm_cust_br_no;
              this.CUSTADDRECORD.parentid = this.Record.dm_cust_id;
              if (this.Record.dm_si_nos.indexOf(",") < 0) {
                this.PARTYRECORD.id = this.Record.dm_party_id;
                this.PARTYRECORD.code = this.Record.dm_party_code;
                this.PARTYRECORD.name = this.Record.dm_party_name;
              }
            }

            if (this.Record.dm_si_nos.indexOf(",") < 0) {
              this.Record.dm_containers = response.despatchdefault[0].hbl_book_cntr;
              this.Record.dm_inv_no = response.despatchdefault[0].hbl_ar_invnos;
              this.Record.dm_tot_ctns = response.despatchdefault[0].hbl_pkg;
              this.Record.dm_volume = response.despatchdefault[0].hbl_cbm;
              this.Record.dm_grwt = response.despatchdefault[0].hbl_grwt;
            }
          }
          else {
            this.ErrorMessage = ' Invalid SI NOS ';
          }
        }
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }

  open(content: any) {
    this.modal = this.modalService.open(content);
  }

  ModifiedRecords(params: any) {
    for (let rec of this.RecordList.filter(rec => rec.dm_pkid == params.sid)) {
      if (params.saction == "Mail Sent Successfully")
        rec.dm_mail_sent = "Y";
    }
  }

}
