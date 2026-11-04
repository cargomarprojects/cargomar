import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Tonnage, TblColumns } from '../models/tonnage';

import { TonnageService } from '../services/tonnage.service';

@Component({
  selector: 'app-tonnage',
  templateUrl: './tonnage.component.html',
  providers: [TonnageService]
})

export class TonnageComponent {
  title = 'Tonnage Report'

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;

  ErrorMessage = "";
  mode = '';
  pkid = '';
  //selectedRowIndex = 0;

  //list_format: string = 'GENERAL';
  //report_format: string = 'GENERAL';
  //type_date: string = 'MAWB DATE';
  //from_date: string = '';
  //to_date: string = '';

  //branch_name: string = '';
  //branch_code: string = '';
  //year_code: string = '';
  //shipper_id: string;
  //shipper_name: string;
  //consignee_id: string;
  //consignee_name: string;
  //agent_id: string;
  //agent_code: string;
  //agent_name: string;
  //carrier_id: string;
  //carrier_name: string;
  //pol_id: string;
  //pol_name: string;
  //pod_id: string;
  //pod_name: string;
  //all: boolean = false;
  rec_category: string;

  //this.carriertype = "AIR CARRIER";
  //this.porttype = "AIR PORT";
  porttype: string = 'AIR PORT';
  carriertype: string = 'AIR CARRIER';

  bExcel = false;
  disableSave = true;
  loading = false;
  bCompany = false;

  isAirExport: boolean = false;

  currentTab = 'LIST';
  searchstring = '';


  //ColNames: any[] = [];
  //YearList: any[] = [];
  //HeaderList: TblColumns[] = [];
  //RecordList: Tonnage[] = [];

  Record: Tonnage = new Tonnage;


  SearchData = {
    type: '',
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
    shipper_id: '',
    shipper_name: '',
    consignee_id: '',
    consignee_name: '',
    agent_id: '',
    agent_code: '',
    agent_name: '',
    carrier_id: '',
    pol_id: '',
    pod_id: '',
    rec_category: '',
    all: false,
    report_format: this.mainService.state.report_format
  };



  // BRRECORD: SearchTable = new SearchTable();
  // EXPRECORD: SearchTable = new SearchTable();
  // IMPRECORD: SearchTable = new SearchTable();
  // AGENTRECORD: SearchTable = new SearchTable();
  // CARRIERRECORD: SearchTable = new SearchTable();
  // POLRECORD: SearchTable = new SearchTable();
  // PODRECORD: SearchTable = new SearchTable();

  constructor(
    public mainService: TonnageService,
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
      this.InitCompleted = true;
      this.InitComponent();
    }
    this.mainService.init(this.menuid);
  }

  InitComponent() {
    this.bExcel = false;
    this.bCompany = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_company)
        this.bCompany = true;
      if (this.menu_record.rights_print)
        this.bExcel = true;
    }

    //this.porttype = "AIR PORT";
    //this.carriertype = "AIR CARRIER";

    this.Init();
    //this.initLov();
    this.LoadCombo();
  }

  Init() {
    if (this.type == "AIR IMPORT") {
      this.isAirExport = false;
      this.mainService.state.type_date = "ETA";
    }
    else {
      this.isAirExport = true;
      this.mainService.state.type_date = "MAWB DATE";
    }
    this.mainService.state.report_format = "GENERAL";
    this.mainService.state.branch_code = this.gs.globalVariables.branch_code;
    this.mainService.state.branch_name = this.gs.globalVariables.branch_name;
    this.mainService.state.from_date = this.gs.defaultValues.monthbegindate;
    this.mainService.state.to_date = this.gs.defaultValues.today;
    this.mainService.state.RecordList = [];
    this.mainService.state.shipper_id = '';
    this.mainService.state.consignee_id = '';
    this.mainService.state.agent_id = '';
    this.mainService.state.carrier_id = '';
    this.mainService.state.pol_id = '';
    this.mainService.state.pod_id = '';

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.restoreRowPosition();
    }, 100);
  }

  restoreRowPosition() {

    const row = document.getElementById('row-' + this.mainService.state.selectedRowIndex);

    if (row) {
      row.scrollIntoView({
        behavior: 'auto',
        block: 'center'
      });
    }
  }



  shipper_where = " CUST_IS_SHIPPER = 'Y' ";
  consingee_where = " CUST_IS_CONSIGNEE = 'Y' ";
  agent_where = " CUST_IS_AGENT = 'Y' ";

  initLov(caption: string = '') {

    // this.BRRECORD = new SearchTable();
    // this.BRRECORD.controlname = "BRANCH";
    // this.BRRECORD.displaycolumn = "CODE";
    // this.BRRECORD.type = "BRANCH";
    // this.BRRECORD.id = "";
    // this.BRRECORD.code = this.gs.globalVariables.branch_code;


    // this.EXPRECORD = new SearchTable();
    // this.EXPRECORD.controlname = "SHIPPER";
    // this.EXPRECORD.displaycolumn = "NAME";
    // this.EXPRECORD.type = "CUSTOMER";
    // this.EXPRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
    // this.EXPRECORD.id = "";
    // this.EXPRECORD.code = "";
    // this.EXPRECORD.name = "";
    // this.EXPRECORD.parentid = "";


    // this.IMPRECORD = new SearchTable();
    // this.IMPRECORD.controlname = "CONSIGNEE";
    // this.IMPRECORD.displaycolumn = "NAME";
    // this.IMPRECORD.type = "CUSTOMER";
    // this.IMPRECORD.where = " CUST_IS_CONSIGNEE = 'Y' ";
    // this.IMPRECORD.id = "";
    // this.IMPRECORD.code = "";
    // this.IMPRECORD.name = "";
    // this.IMPRECORD.parentid = "";


    // this.AGENTRECORD = new SearchTable();
    // this.AGENTRECORD.controlname = "AGENT";
    // this.AGENTRECORD.where = " CUST_IS_AGENT = 'Y' ";
    // this.AGENTRECORD.displaycolumn = "NAME";
    // this.AGENTRECORD.type = "CUSTOMER";
    // this.AGENTRECORD.id = "";
    // this.AGENTRECORD.code = "";
    // this.AGENTRECORD.name = "";

    // this.CARRIERRECORD = new SearchTable();
    // this.CARRIERRECORD.controlname = "CARRIER";
    // this.CARRIERRECORD.displaycolumn = "NAME";
    // this.CARRIERRECORD.type = this.carriertype;
    // this.CARRIERRECORD.id = "";
    // this.CARRIERRECORD.code = "";
    // this.CARRIERRECORD.name = "";

    // this.POLRECORD = new SearchTable();
    // this.POLRECORD.controlname = "POL";
    // this.POLRECORD.displaycolumn = "NAME";
    // this.POLRECORD.type = this.porttype;
    // this.POLRECORD.id = "";
    // this.POLRECORD.code = "";
    // this.POLRECORD.name = "";


    // this.PODRECORD = new SearchTable();
    // this.PODRECORD.controlname = "POD";
    // this.PODRECORD.displaycolumn = "NAME";
    // this.PODRECORD.type = this.porttype;
    // this.PODRECORD.id = "";
    // this.PODRECORD.code = "";
    // this.PODRECORD.name = "";

  }

  LovSelected(_Record: SearchTable) {
    // Company Settings
    if (_Record.controlname == "BRANCH") {
      this.mainService.state.branch_code = _Record.code;
      this.mainService.state.branch_name = _Record.name;
    }
    if (_Record.controlname == "SHIPPER") {
      this.mainService.state.shipper_id = _Record.id;
      this.mainService.state.shipper_name = _Record.name;
    }
    if (_Record.controlname == "CONSIGNEE") {
      this.mainService.state.consignee_id = _Record.id;
      this.mainService.state.consignee_name = _Record.name;
    }
    if (_Record.controlname == "AGENT") {
      this.mainService.state.agent_id = _Record.id;
      this.mainService.state.agent_code = _Record.code;
      this.mainService.state.agent_name = _Record.name;
    }
    if (_Record.controlname == "CARRIER") {
      this.mainService.state.carrier_id = _Record.id;
      this.mainService.state.carrier_name = _Record.name;
    }
    if (_Record.controlname == "POL") {
      this.mainService.state.pol_id = _Record.id;
      this.mainService.state.pol_name = _Record.name;
    }
    if (_Record.controlname == "POD") {
      this.mainService.state.pod_id = _Record.id;
      this.mainService.state.pod_name = _Record.name;
    }


  }
  LoadCombo() {

    this.loading = true;

    let SearchData2 = {
      type: 'YEAR',
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
    };

    SearchData2.comp_code = this.gs.globalVariables.comp_code;
    SearchData2.branch_code = this.gs.globalVariables.branch_code;

    this.ErrorMessage = '';
    this.mainService.LoadDefault(SearchData2)
      .subscribe(response => {
        this.loading = false;
        this.mainService.state.YearList = response.yearlist;
        //this.mainService.state.year_code = this.gs.globalVariables.year_code;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
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

    this.mainService.state.list_format = this.mainService.state.report_format;
    if (this.mainService.state.report_format == "BRANCH MONTH WISE" || this.mainService.state.report_format == "CUSTOMER MONTH WISE" || this.mainService.state.report_format == "CONSIGNEE MONTH WISE" ||
      this.mainService.state.report_format == "AGENT MONTH WISE" || this.mainService.state.report_format == "POL MONTH WISE" || this.mainService.state.report_format == "POD MONTH WISE")
      this.mainService.state.list_format = "SUMMARY";

    this.ErrorMessage = '';
    //if (this.from_date.trim().length <= 0) {
    //  this.ErrorMessage = "From Date Cannot Be Blank";
    //  return;
    //}
    //if (this.to_date.trim().length <= 0) {
    //  this.ErrorMessage = "To Date Cannot Be Blank";
    //  return;
    //}

    this.mainService.state.selectedRowIndex = 0;
    this.restoreRowPosition()

    this.loading = true;
    this.pkid = this.gs.getGuid();
    this.SearchData.pkid = this.pkid;
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;

    if (this.bCompany) {
      this.SearchData.branch_code = this.mainService.state.branch_code;
      this.SearchData.branch_name = this.mainService.state.branch_name;
    }
    else {
      this.SearchData.branch_code = this.gs.globalVariables.branch_code;
      this.SearchData.branch_name = this.gs.globalVariables.branch_name;

    }
    //this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.SearchData.year_code = this.mainService.state.year_code;
    this.SearchData.searchstring = this.searchstring.toUpperCase();
    this.SearchData.type = _type;
    this.SearchData.type_date = this.mainService.state.type_date;
    if (this.mainService.state.type_date == 'FIN-YEAR') {
      this.SearchData.from_date = this.gs.globalVariables.year_start_date;
      this.SearchData.to_date = this.gs.globalVariables.year_end_date;
    } else {
      this.SearchData.from_date = this.mainService.state.from_date;
      this.SearchData.to_date = this.mainService.state.to_date;
    }
    this.SearchData.shipper_id = this.mainService.state.shipper_id;
    this.SearchData.consignee_id = this.mainService.state.consignee_id;
    this.SearchData.agent_id = this.mainService.state.agent_id;
    this.SearchData.agent_name = this.mainService.state.agent_name;
    this.SearchData.agent_code = this.mainService.state.agent_code;
    this.SearchData.carrier_id = this.mainService.state.carrier_id;
    this.SearchData.pol_id = this.mainService.state.pol_id;
    this.SearchData.pod_id = this.mainService.state.pod_id;
    this.SearchData.all = this.mainService.state.all;
    this.SearchData.rec_category = this.rec_category;
    this.SearchData.report_format = this.mainService.state.report_format;

    this.ErrorMessage = '';
    this.mainService.List(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        this.mainService.state.ColNames = response.colnames;
        this.mainService.state.HeaderList = response.headerlist;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.mainService.state.RecordList = response.list;
        }
      },
        error => {
          this.loading = false;
          this.mainService.state.RecordList = [];
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  OnChange(field: string) {
    this.mainService.state.RecordList = [];
  }

  Close() {
    this.gs.ClosePage('home');
  }
}
