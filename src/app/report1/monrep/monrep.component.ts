import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { MonRep } from '../models/monrep';
import { RepService } from '../services/report.service';

@Component({
  selector: 'app-monrep',
  templateUrl: './monrep.component.html',
  providers: [RepService]
})

export class MonrepComponent {
  title = 'Monthly Report'
  /*
  Ajith 24/06/2019 nom/sman update implemented
  */


  @Input() menuid: string = '';
  @Input() type: string = '';

  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;

  ErrorMessage = "";
  mode = '';
  pkid = '';

  rec_category: string = "";
  type_date: string = 'SOB';
  from_date: string = '';
  to_date: string = '';
  branch_name: string;
  branch_code: string;
  agent_id: string;
  agent_code: string;
  agent_name: string;
  shipper_id: string;
  consignee_id: string;
  carrier_id: string;
  carriertype: string;
  pol_id: string;
  pod_id: string;
  porttype: string;
  format_type: string = '';

  disableSave = true;
  all: boolean = false;
  pendingInvoice: boolean = false;

  bExcel = false;
  bCompany = false;
  bAdmin = false;
  bEdit = false;
  bEmail = false;

  loading = false;
  currentTab = 'LIST';
  searchstring = '';

  SearchData = {
    type: '',
    rec_category: '',
    pkid: '',
    report_folder: '',
    company_code: '',
    branch_code: '',
    branch_name: '',
    year_code: '',
    searchstring: '',
    from_date: '',
    to_date: '',
    type_date: '',
    agent_id: '',
    agent_code: '',
    agent_name: '',
    shipper_id: '',
    consignee_id: '',
    carrier_id: '',
    pol_id: '',
    pod_id: '',
    all: false,
    badmin: false,
    pendingInvoice: false,
    user_code: '',
    user_name: ''
  };

  // Array For Displaying List
  RecordList: MonRep[] = [];
  // Single Record for add/edit/view details
  Record: MonRep = new MonRep;

  BRRECORD: SearchTable = new SearchTable();
  AGENTRECORD: SearchTable = new SearchTable();
  EXPRECORD: SearchTable = new SearchTable();
  IMPRECORD: SearchTable = new SearchTable();
  CARRIERRECORD: SearchTable = new SearchTable();
  POLRECORD: SearchTable = new SearchTable();
  PODRECORD: SearchTable = new SearchTable();

  constructor(
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
    this.bCompany = false;
    this.bAdmin = false;
    this.bExcel = false;
    this.bEdit = false;
    this.bEmail = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_company)
        this.bCompany = true;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_print)
        this.bExcel = true;
      if (this.menu_record.rights_edit)
        this.bEdit = true;
      if (this.menu_record.rights_email)
        this.bEmail = true;
    }
    if (this.type.toString() == "HBL-SE" || this.type.toString() == "HBL-SI") {
      this.porttype = "SEA PORT";
      this.carriertype = "SEA CARRIER";
    }
    else {
      this.porttype = "AIR PORT";
      this.carriertype = "AIR CARRIER";
    }

    this.Init();
    this.initLov();
    this.LoadCombo();
  }

  Init() {
    this.type_date = "SOB";
    this.RecordList = null;
    this.branch_code = this.gs.globalVariables.branch_code;
    this.branch_name = this.gs.globalVariables.branch_name;
    this.from_date = this.gs.defaultValues.monthbegindate;
    this.to_date = this.gs.defaultValues.today;
    this.agent_id = '';
    this.shipper_id = '';
    this.consignee_id = '';
    this.carrier_id = '';
    this.pol_id = '';
    this.pod_id = '';
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

    this.AGENTRECORD = new SearchTable();
    this.AGENTRECORD.controlname = "AGENT";
    this.AGENTRECORD.where = " CUST_IS_AGENT = 'Y' ";
    this.AGENTRECORD.displaycolumn = "NAME";
    this.AGENTRECORD.type = "CUSTOMER";
    this.AGENTRECORD.id = "";
    this.AGENTRECORD.code = "";
    this.AGENTRECORD.name = "";

    this.EXPRECORD = new SearchTable();
    this.EXPRECORD.controlname = "SHIPPER";
    this.EXPRECORD.displaycolumn = "NAME";
    this.EXPRECORD.type = "CUSTOMER";
    this.EXPRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
    this.EXPRECORD.id = "";
    this.EXPRECORD.code = "";
    this.EXPRECORD.name = "";
    this.EXPRECORD.parentid = "";

    this.IMPRECORD = new SearchTable();
    this.IMPRECORD.controlname = "CONSIGNEE";
    this.IMPRECORD.displaycolumn = "NAME";
    this.IMPRECORD.type = "CUSTOMER";
    this.IMPRECORD.where = " CUST_IS_CONSIGNEE = 'Y' ";
    this.IMPRECORD.id = "";
    this.IMPRECORD.code = "";
    this.IMPRECORD.name = "";
    this.IMPRECORD.parentid = "";

    this.CARRIERRECORD = new SearchTable();
    this.CARRIERRECORD.controlname = "CARRIER";
    this.CARRIERRECORD.displaycolumn = "NAME";
    this.CARRIERRECORD.type = this.carriertype;
    this.CARRIERRECORD.id = "";
    this.CARRIERRECORD.code = "";
    this.CARRIERRECORD.name = "";

    this.POLRECORD = new SearchTable();
    this.POLRECORD.controlname = "POL";
    this.POLRECORD.displaycolumn = "NAME";
    this.POLRECORD.type = this.porttype;
    this.POLRECORD.id = "";
    this.POLRECORD.code = "";
    this.POLRECORD.name = "";


    this.PODRECORD = new SearchTable();
    this.PODRECORD.controlname = "POD";
    this.PODRECORD.displaycolumn = "NAME";
    this.PODRECORD.type = this.porttype;
    this.PODRECORD.id = "";
    this.PODRECORD.code = "";
    this.PODRECORD.name = "";
  }

  LovSelected(_Record: SearchTable) {
    // Company Settings
    if (_Record.controlname == "BRANCH") {
      this.branch_code = _Record.code;
      this.branch_name = _Record.name;
    }
    if (_Record.controlname == "AGENT") {
      this.agent_id = _Record.id;
      this.agent_code = _Record.code;
      this.agent_name = _Record.name;
    }
    if (_Record.controlname == "SHIPPER") {
      this.shipper_id = _Record.id;
      // this.shipper_name = _Record.name;
    }
    if (_Record.controlname == "CONSIGNEE") {
      this.consignee_id = _Record.id;
      //  this.consignee_name = _Record.name;
    }
    if (_Record.controlname == "CARRIER") {
      this.carrier_id = _Record.id;
      // this.carrier_code = _Record.code;
      // this.carrier_name = _Record.name;
    }
    if (_Record.controlname == "POL") {
      this.pol_id = _Record.id;
      // this.pol_code = _Record.code;
      //  this.pol_name = _Record.name;
    }
    if (_Record.controlname == "POD") {
      this.pod_id = _Record.id;
      // this.pod_code = _Record.code;
      // this.pod_name = _Record.name;
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

    if (this.pendingInvoice && this.type_date != 'CREATED') {
      this.ErrorMessage = " Please Select CREATED Date for Pending Invoice and Continue....";
      alert(this.ErrorMessage);
      return;
    }

    if (_type == "MAIL")
      if (!confirm("Do you want to Sent Mail")) {
        return;
      }

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

    this.SearchData.badmin = this.bAdmin;

    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.searchstring = this.searchstring.toUpperCase();
    this.SearchData.type = _type;
    this.SearchData.rec_category = this.rec_category;
    this.SearchData.type_date = this.type_date;
    this.SearchData.from_date = this.from_date;
    this.SearchData.to_date = this.to_date;
    this.SearchData.all = this.all;
    this.SearchData.agent_id = this.agent_id;
    this.SearchData.agent_name = this.agent_name;
    this.SearchData.agent_code = this.agent_code;
    this.SearchData.shipper_id = this.shipper_id;
    this.SearchData.consignee_id = this.consignee_id;
    this.SearchData.carrier_id = this.carrier_id;
    this.SearchData.pol_id = this.pol_id;
    this.SearchData.pod_id = this.pod_id;
    this.SearchData.pendingInvoice = this.pendingInvoice;
    this.SearchData.user_code = this.gs.globalVariables.user_code;
    this.SearchData.user_name = this.gs.globalVariables.user_name;
    this.ErrorMessage = '';
    this.mainService.List(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else if (_type == 'MAIL') {
          if (response.mailmsg.length > 0)
            alert(response.mailmsg);
        }
        else {
          this.RecordList = response.list;
        }
      },
        error => {
          this.loading = false;
          this.RecordList = null;
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
  Close() {
    this.gs.ClosePage('home');
  }

  showMonRepUpdt(rec: MonRep, _type: string = '') {
    this.format_type = _type;

    if (rec.hbl_pkid == null)
      return;
    if (rec.hbl_pkid != '') {
      rec.displayed = !rec.displayed;
    }
  }
  onKeyUp(event: KeyboardEvent): void {



  }

  ModifiedRecords(params: any) {

    if (params.saction == "SALESMAN-ALL") {

      this.ErrorMessage = '';
      if (this.SearchData.shipper_id == null || this.SearchData.shipper_id == "" || this.SearchData.shipper_id == undefined) {
        this.ErrorMessage = "Please Enter the Shipper and Process Report"
        alert(this.ErrorMessage);
        return;
      }
      if (!confirm("Update ALL Records in the List With Sman " + params.smanname))
        return;

      let hbl_ids: string = "";
      let old_sman_names: string = "";
      let hblnos: string = "";
      let shpr: string = "";
      for (let rec of this.RecordList) {
        if (rec.hbl_pkid != null) {
          shpr = rec.shipper_name;
          if (hbl_ids != "") {
            hbl_ids += ",";
            old_sman_names += ",";
            hblnos += ",";
          }
          hbl_ids += rec.hbl_pkid;
          old_sman_names += rec.sman_name;
          hblnos += rec.sino;
        }
      }
      params.SearchData.pkid = hbl_ids;
      params.SearchData.old_smanname = old_sman_names;
      params.SearchData.hblno = hblnos;
      params.SearchData.shipper = shpr;
      params.SearchData.periods = 'From ' + this.from_date + ' to ' + this.to_date;
      this.loading = true;
      this.ErrorMessage = '';
      this.mainService.UpdateMonReport(params.SearchData)
        .subscribe(response => {
          this.loading = false;
          if (response.status == "OK") {
            for (let rec of this.RecordList) {
              rec.sman_id = params.smanid;
              rec.sman_name = params.smanname;
              rec.displayed = false;
            }
          }
        },
          error => {
            this.loading = false;
            this.ErrorMessage = this.gs.getError(error);

          });
    }

  }

}
