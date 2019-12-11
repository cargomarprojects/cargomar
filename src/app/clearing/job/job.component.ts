import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Jobm } from '../models/job';
import { JobService } from '../services/job.service';
import { SearchTable } from '../../shared/models/searchtable';


@Component({
  selector: 'app-jobm',
  templateUrl: './job.component.html',
  providers: [JobService]
})
export class JobComponent {
  // Local Variables 
  title = 'JOB MASTER';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  selectedRowIndex: number = -1;

  CrList : any[];

  modal: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  currentPage = 'ROOTPAGE';

  disableNatureofCargo = false;

  job_edi_no = "";
  job_no = "";
  bDocs: boolean = false;
  bAdmin: boolean = false;

  searchstring = '';
  jobtype = 'ALL';
  porttype = 'SEA PORT';
  carriertype = 'SEA CARRIER';

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;


  old_shipper_id = '';
  old_billto_id = '';

  bCreditLimit: boolean = false;
  showalert = false;


  sub: any;
  urlid: string;

  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';

  Mail_type: string = '';
  sTo_ids: string = '';
  sSubject: string = '';
  sHtml: string = '';

  // Array For Displaying List
  RecordList: Jobm[] = [];
  // Single Record for add/edit/view details
  Record: Jobm = new Jobm;

  // JobTypeList: any[] = [];

  BILLTORECORD: SearchTable = new SearchTable();
  EXPRECORD: SearchTable = new SearchTable();
  EXPADDRECORD: SearchTable = new SearchTable();
  IMPRECORD: SearchTable = new SearchTable();
  IMPADDRECORD: SearchTable = new SearchTable();
  BUYERRECORD: SearchTable = new SearchTable();
  BUYERADDRECORD: SearchTable = new SearchTable();
  STATEORGRECORD: SearchTable = new SearchTable();
  COUNTRYORGRECORD: SearchTable = new SearchTable();
  PRECARRIAGERECORD: SearchTable = new SearchTable();
  PLACERECEIPTRECORD: SearchTable = new SearchTable();
  POLRECORD: SearchTable = new SearchTable();
  PODRECORD: SearchTable = new SearchTable();
  POFDRECORD: SearchTable = new SearchTable();
  PODCOUNTRYRECORD: SearchTable = new SearchTable();
  POFDCOUNTRYRECORD: SearchTable = new SearchTable();
  SEACARRIERRECORD: SearchTable = new SearchTable();
  CHARECORD: SearchTable = new SearchTable();
  AGENTRECORD: SearchTable = new SearchTable();
  FORWARDERRECORD: SearchTable = new SearchTable();
  COMMODITYRECORD: SearchTable = new SearchTable();

  SALESMANRECORD: SearchTable = new SearchTable();
  EDIRECORD: SearchTable = new SearchTable();

  PKGUNITRECORD: SearchTable = new SearchTable();
  NETUNITRECORD: SearchTable = new SearchTable();
  GRUNITRECORD: SearchTable = new SearchTable();
  SCHEMERECORD: SearchTable = new SearchTable();

  constructor(
    private modalService: NgbModal,
    private mainService: JobService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.page_count = 0;
    this.page_rows = 10;
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
    this.job_no = "";
    this.bAdmin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
    }
    if (this.type.toString() == "SEA EXPORT" || this.type.toString() == "SEA IMPORT") {
      this.porttype = "SEA PORT";
      this.carriertype = "SEA CARRIER";

    }
    else {
      this.porttype = "AIR PORT";
      this.carriertype = "AIR CARRIER";
    }
    this.Mail_type = "JOB " + this.type.toString();
    this.InitLov();
    this.LoadCombo();
    this.currentPage = 'ROOTPAGE';
    this.currentTab = 'LIST';
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  LoadCombo() {

    // this.JobTypeList = [{ "name": "ALL" }, { "name": "BOTH" }, { "name": "CLEARING" }, { "name": "FORWARDING" }];
    //this.loading = true;
    //let SearchData = {
    //    type: 'type'
    //};

    //this.ErrorMessage = '';
    //this.InfoMessage = '';
    //this.mainService.LoadDefault(SearchData)
    //    .subscribe(response => {
    //        this.loading = false;
    //        this.CityList = response.citylist;
    //        this.StateList = response.statelist;
    //        this.CountryList = response.countrylist;
    //        this.List("NEW");
    //    },
    //    error => {
    //        this.loading = false;
    //        this.ErrorMessage = this.gs.getError(error);
    //    });

    this.List("NEW");
  }


  InitLov() {

    this.BILLTORECORD = new SearchTable();
    this.BILLTORECORD.controlname = "BILLTO";
    this.BILLTORECORD.displaycolumn = "CODE";
    this.BILLTORECORD.type = "CUSTOMER";
    this.BILLTORECORD.where = " CUST_IS_SHIPPER = 'Y' ";
    this.BILLTORECORD.id = "";
    this.BILLTORECORD.code = "";
    this.BILLTORECORD.name = "";
    this.BILLTORECORD.parentid = "";



    this.EXPRECORD = new SearchTable();
    this.EXPRECORD.controlname = "SHIPPER";
    this.EXPRECORD.displaycolumn = "CODE";
    this.EXPRECORD.type = "CUSTOMER";
    this.EXPRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
    this.EXPRECORD.id = "";
    this.EXPRECORD.code = "";
    this.EXPRECORD.name = "";
    this.EXPRECORD.parentid = "";

    this.EXPADDRECORD = new SearchTable();
    this.EXPADDRECORD.controlname = "SHIPPERADDRESS";
    this.EXPADDRECORD.displaycolumn = "CODE";
    this.EXPADDRECORD.type = "CUSTOMERADDRESS";
    this.EXPADDRECORD.id = "";
    this.EXPADDRECORD.code = "";
    this.EXPADDRECORD.name = "";
    this.EXPADDRECORD.parentid = "";

    this.IMPRECORD = new SearchTable();
    this.IMPRECORD.controlname = "CONSIGNEE";
    this.IMPRECORD.displaycolumn = "CODE";
    this.IMPRECORD.type = "CUSTOMER";
    this.IMPRECORD.where = " CUST_IS_CONSIGNEE = 'Y' ";
    this.IMPRECORD.id = "";
    this.IMPRECORD.code = "";
    this.IMPRECORD.name = "";
    this.IMPRECORD.parentid = "";

    this.IMPADDRECORD = new SearchTable();
    this.IMPADDRECORD.controlname = "CONSIGNEEADDRESS";
    this.IMPADDRECORD.displaycolumn = "CODE";
    this.IMPADDRECORD.type = "CUSTOMERADDRESS";
    this.IMPADDRECORD.id = "";
    this.IMPADDRECORD.code = "";
    this.IMPADDRECORD.name = "";
    this.IMPADDRECORD.parentid = "";

    this.BUYERRECORD = new SearchTable();
    this.BUYERRECORD.controlname = "BUYER";
    this.BUYERRECORD.displaycolumn = "CODE";
    this.BUYERRECORD.type = "CUSTOMER";
    this.BUYERRECORD.id = "";
    this.BUYERRECORD.code = "";
    this.BUYERRECORD.name = "";
    this.BUYERRECORD.parentid = "";

    this.BUYERADDRECORD = new SearchTable();
    this.BUYERADDRECORD.controlname = "BUYERADDRESS";
    this.BUYERADDRECORD.displaycolumn = "CODE";
    this.BUYERADDRECORD.type = "CUSTOMERADDRESS";
    this.BUYERADDRECORD.id = "";
    this.BUYERADDRECORD.code = "";
    this.BUYERADDRECORD.name = "";
    this.BUYERADDRECORD.parentid = "";

    this.STATEORGRECORD = new SearchTable();
    this.STATEORGRECORD.controlname = "STATEORIGIN";
    this.STATEORGRECORD.displaycolumn = "CODE";
    this.STATEORGRECORD.type = "STATE";
    this.STATEORGRECORD.id = "";
    this.STATEORGRECORD.code = "";
    this.STATEORGRECORD.name = "";

    this.COUNTRYORGRECORD = new SearchTable();
    this.COUNTRYORGRECORD.controlname = "COUNTRYORIGIN";
    this.COUNTRYORGRECORD.displaycolumn = "CODE";
    this.COUNTRYORGRECORD.type = "COUNTRY";
    this.COUNTRYORGRECORD.id = "";
    this.COUNTRYORGRECORD.code = "";
    this.COUNTRYORGRECORD.name = "";


    this.PRECARRIAGERECORD = new SearchTable();
    this.PRECARRIAGERECORD.controlname = "PRECARRIAGE";
    this.PRECARRIAGERECORD.displaycolumn = "CODE";
    this.PRECARRIAGERECORD.type = "PRE CARRIAGE";
    this.PRECARRIAGERECORD.id = "";
    this.PRECARRIAGERECORD.code = "";
    this.PRECARRIAGERECORD.name = "";

    this.PLACERECEIPTRECORD = new SearchTable();
    this.PLACERECEIPTRECORD.controlname = "PLACERECEIPT";
    this.PLACERECEIPTRECORD.displaycolumn = "CODE";
    this.PLACERECEIPTRECORD.type = "CITY";
    this.PLACERECEIPTRECORD.id = "";
    this.PLACERECEIPTRECORD.code = "";
    this.PLACERECEIPTRECORD.name = "";

    //this.PLACERECEIPTRECORD.id = this.gs.defaultValues.sea_job_place_receipt_id;
    //this.PLACERECEIPTRECORD.code = this.gs.defaultValues.sea_job_place_receipt_code;
    //this.PLACERECEIPTRECORD.name = this.gs.defaultValues.sea_job_place_receipt_name;


    this.POLRECORD = new SearchTable();
    this.POLRECORD.controlname = "POL";
    this.POLRECORD.displaycolumn = "CODE";
    this.POLRECORD.type = this.porttype;
    this.POLRECORD.id = "";
    this.POLRECORD.code = "";
    this.POLRECORD.name = "";

    this.PODRECORD = new SearchTable();
    this.PODRECORD.controlname = "POD";
    this.PODRECORD.displaycolumn = "CODE";
    this.PODRECORD.type = this.porttype;
    this.PODRECORD.id = "";
    this.PODRECORD.code = "";
    this.PODRECORD.name = "";

    this.POFDRECORD = new SearchTable();
    this.POFDRECORD.controlname = "POFD";
    this.POFDRECORD.displaycolumn = "CODE";
    this.POFDRECORD.type = this.porttype;
    this.POFDRECORD.id = "";
    this.POFDRECORD.code = "";
    this.POFDRECORD.name = "";

    this.PODCOUNTRYRECORD = new SearchTable();
    this.PODCOUNTRYRECORD.controlname = "PODCOUNTRY";
    this.PODCOUNTRYRECORD.displaycolumn = "CODE";
    this.PODCOUNTRYRECORD.type = "COUNTRY";
    this.PODCOUNTRYRECORD.id = "";
    this.PODCOUNTRYRECORD.code = "";
    this.PODCOUNTRYRECORD.name = "";

    this.POFDCOUNTRYRECORD = new SearchTable();
    this.POFDCOUNTRYRECORD.controlname = "POFDCOUNTRY";
    this.POFDCOUNTRYRECORD.displaycolumn = "CODE";
    this.POFDCOUNTRYRECORD.type = "COUNTRY";
    this.POFDCOUNTRYRECORD.id = "";
    this.POFDCOUNTRYRECORD.code = "";
    this.POFDCOUNTRYRECORD.name = "";

    this.SEACARRIERRECORD = new SearchTable();
    this.SEACARRIERRECORD.controlname = "SEACARRIER";
    this.SEACARRIERRECORD.displaycolumn = "CODE";
    this.SEACARRIERRECORD.type = this.carriertype;
    this.SEACARRIERRECORD.id = "";
    this.SEACARRIERRECORD.code = "";
    this.SEACARRIERRECORD.name = "";

    this.CHARECORD = new SearchTable();
    this.CHARECORD.controlname = "CHA";
    this.CHARECORD.displaycolumn = "CODE";
    this.CHARECORD.type = "CUSTOMER";
    this.CHARECORD.where = " CUST_IS_CHA = 'Y' ";
    this.CHARECORD.id = "";
    this.CHARECORD.code = "";
    this.CHARECORD.name = "";

    this.AGENTRECORD = new SearchTable();
    this.AGENTRECORD.controlname = "AGENT";
    this.AGENTRECORD.where = " CUST_IS_AGENT = 'Y' ";
    this.AGENTRECORD.displaycolumn = "CODE";
    this.AGENTRECORD.type = "CUSTOMER";
    this.AGENTRECORD.id = "";
    this.AGENTRECORD.code = "";
    this.AGENTRECORD.name = "";

    this.FORWARDERRECORD = new SearchTable();
    this.FORWARDERRECORD.controlname = "FORWARDER";
    this.FORWARDERRECORD.where = " CUST_IS_CHA = 'Y' ";
    this.FORWARDERRECORD.displaycolumn = "CODE";
    this.FORWARDERRECORD.type = "CUSTOMER";
    this.FORWARDERRECORD.id = "";
    this.FORWARDERRECORD.code = "";
    this.FORWARDERRECORD.name = "";

    this.COMMODITYRECORD = new SearchTable();
    this.COMMODITYRECORD.controlname = "COMMODITY";
    this.COMMODITYRECORD.displaycolumn = "NAME";
    this.COMMODITYRECORD.type = "COMMODITY";
    this.COMMODITYRECORD.id = "";
    this.COMMODITYRECORD.code = "";
    this.COMMODITYRECORD.name = "";



    this.SALESMANRECORD = new SearchTable();
    this.SALESMANRECORD.controlname = "SALESMAN";
    this.SALESMANRECORD.displaycolumn = "NAME";
    this.SALESMANRECORD.type = "SALESMAN";
    this.SALESMANRECORD.id = "";
    this.SALESMANRECORD.code = "";
    this.SALESMANRECORD.name = "";

    this.EDIRECORD = new SearchTable();
    this.EDIRECORD.controlname = "CHALIC";
    this.EDIRECORD.displaycolumn = "NAME";
    this.EDIRECORD.type = "CHALIC";
    this.EDIRECORD.where = "param_id1 ='" + this.gs.globalVariables.branch_code + "'";
    this.EDIRECORD.id = "";
    this.EDIRECORD.code = "";
    this.EDIRECORD.name = "";


    this.PKGUNITRECORD = new SearchTable();
    this.PKGUNITRECORD.controlname = "PKG-UNIT";
    this.PKGUNITRECORD.displaycolumn = "CODE";
    this.PKGUNITRECORD.type = "UNIT";
    this.PKGUNITRECORD.id = "";
    this.PKGUNITRECORD.code = "";
    this.PKGUNITRECORD.name = "";

    this.NETUNITRECORD = new SearchTable();
    this.NETUNITRECORD.controlname = "NET-UNIT";
    this.NETUNITRECORD.displaycolumn = "CODE";
    this.NETUNITRECORD.type = "UNIT";
    this.NETUNITRECORD.id = "";
    this.NETUNITRECORD.code = "";
    this.NETUNITRECORD.name = "";

    this.GRUNITRECORD = new SearchTable();
    this.GRUNITRECORD.controlname = "GR-UNIT";
    this.GRUNITRECORD.displaycolumn = "CODE";
    this.GRUNITRECORD.type = "UNIT";
    this.GRUNITRECORD.id = "";
    this.GRUNITRECORD.code = "";
    this.GRUNITRECORD.name = "";

    this.SCHEMERECORD = new SearchTable();
    this.SCHEMERECORD.controlname = "SCHEME";
    this.SCHEMERECORD.displaycolumn = "NAME";
    this.SCHEMERECORD.type = "SCHEME CODE";
    this.SCHEMERECORD.id = "";
    this.SCHEMERECORD.code = "";
    this.SCHEMERECORD.name = "";

  }

  LovSelected(_Record: SearchTable) {
    let bchange: boolean = false;

    if (_Record.controlname == "SHIPPER") {
      bchange = false;
      if (this.Record.job_exp_id != _Record.id)
        bchange = true;

      this.Record.job_exp_id = _Record.id;
      this.Record.job_exp_code = _Record.code;
      this.Record.job_exp_name = _Record.name;

      if (bchange) {
        this.EXPADDRECORD = new SearchTable();
        this.EXPADDRECORD.controlname = "SHIPPERADDRESS";
        this.EXPADDRECORD.displaycolumn = "CODE";
        this.EXPADDRECORD.type = "CUSTOMERADDRESS";
        this.EXPADDRECORD.id = "";
        this.EXPADDRECORD.code = "";
        this.EXPADDRECORD.name = "";
        this.EXPADDRECORD.parentid = this.Record.job_exp_id;
        this.Record.job_exp_br_addr = "";
      }
    }
    else if (_Record.controlname == "SHIPPERADDRESS") {
      this.Record.job_exp_br_id = _Record.id;
      this.Record.job_exp_br_no = _Record.code;
      this.Record.job_exp_br_addr = this.GetBrAddress(_Record.name).address;
    }
    else if (_Record.controlname == "CONSIGNEE") {

      bchange = false;
      if (this.Record.job_imp_id != _Record.id)
        bchange = true;

      this.Record.job_imp_id = _Record.id;
      this.Record.job_imp_code = _Record.code;
      this.Record.job_imp_name = _Record.name;

      if (bchange) {
        this.IMPADDRECORD = new SearchTable();
        this.IMPADDRECORD.controlname = "CONSIGNEEADDRESS";
        this.IMPADDRECORD.displaycolumn = "CODE";
        this.IMPADDRECORD.type = "CUSTOMERADDRESS";
        this.IMPADDRECORD.id = "";
        this.IMPADDRECORD.code = "";
        this.IMPADDRECORD.name = "";
        this.IMPADDRECORD.parentid = this.Record.job_imp_id;
        this.Record.job_imp_br_addr = "";
      }
    }
    else if (_Record.controlname == "CONSIGNEEADDRESS") {
      this.Record.job_imp_br_id = _Record.id;
      this.Record.job_imp_br_no = _Record.code;
      this.Record.job_imp_br_addr = this.GetBrAddress(_Record.name).address;
    }
    else if (_Record.controlname == "BUYER") {
      bchange = false;
      if (this.Record.job_buyer_id != _Record.id)
        bchange = true;

      this.Record.job_buyer_id = _Record.id;
      this.Record.job_buyer_code = _Record.code;
      this.Record.job_buyer_name = _Record.name;

      if (bchange) {
        this.BUYERADDRECORD = new SearchTable();
        this.BUYERADDRECORD.controlname = "BUYERADDRESS";
        this.BUYERADDRECORD.type = "CUSTOMERADDRESS";
        this.BUYERADDRECORD.displaycolumn = "CODE";
        this.BUYERADDRECORD.id = "";
        this.BUYERADDRECORD.code = "";
        this.BUYERADDRECORD.name = "";
        this.BUYERADDRECORD.parentid = this.Record.job_buyer_id;
        this.Record.job_buyer_br_addr = "";
      }
    }
    else if (_Record.controlname == "BUYERADDRESS") {
      this.Record.job_buyer_br_id = _Record.id;
      this.Record.job_buyer_br_no = _Record.code;
      this.Record.job_buyer_br_addr = this.GetBrAddress(_Record.name).address;
    }
    else if (_Record.controlname == "BILLTO") {
      this.Record.job_billto_id = _Record.id;
      this.Record.job_billto_code = _Record.code;
      this.Record.job_billto_name = _Record.name;
    }
    else if (_Record.controlname == "STATEORIGIN") {
      this.Record.job_origin_state_id = _Record.id;
      this.Record.job_origin_state_code = _Record.code;
      this.Record.job_origin_state_name = _Record.name;
    }
    else if (_Record.controlname == "COUNTRYORIGIN") {
      this.Record.job_origin_country_id = _Record.id;
      this.Record.job_origin_country_code = _Record.code;
      this.Record.job_origin_country_name = _Record.name;
    }
    else if (_Record.controlname == "PRECARRIAGE") {
      this.Record.job_pre_carriage_id = _Record.id;
      this.Record.job_pre_carriage_code = _Record.code;
      this.Record.job_pre_carriage_name = _Record.name;
    }
    else if (_Record.controlname == "PLACERECEIPT") {
      this.Record.job_place_receipt_id = _Record.id;
      this.Record.job_place_receipt_code = _Record.code;
      this.Record.job_place_receipt_name = _Record.name;
    }
    else if (_Record.controlname == "POL") {
      this.Record.job_pol_id = _Record.id;
      this.Record.job_pol_code = _Record.code;
      this.Record.job_pol_name = _Record.name;
    }
    else if (_Record.controlname == "POD") {
      this.Record.job_pod_id = _Record.id;
      this.Record.job_pod_code = _Record.code;
      this.Record.job_pod_name = _Record.name;
    }
    else if (_Record.controlname == "POFD") {
      this.Record.job_pofd_id = _Record.id;
      this.Record.job_pofd_code = _Record.code;
      this.Record.job_pofd_name = _Record.name;
    }
    else if (_Record.controlname == "PODCOUNTRY") {
      this.Record.job_pod_country_id = _Record.id;
      this.Record.job_pod_country_code = _Record.code;
      this.Record.job_pod_country_name = _Record.name;
    }
    else if (_Record.controlname == "POFDCOUNTRY") {
      this.Record.job_pofd_country_id = _Record.id;
      this.Record.job_pofd_country_code = _Record.code;
      this.Record.job_pofd_country_name = _Record.name;
    }
    else if (_Record.controlname == "SEACARRIER") {
      this.Record.job_carrier_id = _Record.id;
      this.Record.job_carrier_code = _Record.code;
      this.Record.job_carrier_name = _Record.name;
    }
    else if (_Record.controlname == "CHA") {
      this.Record.job_cha_id = _Record.id;
      this.Record.job_cha_code = _Record.code;
      this.Record.job_cha_name = _Record.name;
    }
    else if (_Record.controlname == "AGENT") {
      this.Record.job_agent_id = _Record.id;
      this.Record.job_agent_code = _Record.code;
      this.Record.job_agent_name = _Record.name;
    }
    else if (_Record.controlname == "FORWARDER") {
      this.Record.job_forwarder_id = _Record.id;
      this.Record.job_forwarder_code = _Record.code;
      this.Record.job_forwarder_name = _Record.name;
    }
    else if (_Record.controlname == "COMMODITY") {
      this.Record.job_commodity_id = _Record.id;
      this.Record.job_commodity_code = _Record.code;
      this.Record.job_commodity_name = _Record.name;
    }
    else if (_Record.controlname == "SALESMAN") {
      this.Record.job_salesman_id = _Record.id;
      this.Record.job_salesman_code = _Record.code;
      this.Record.job_salesman_name = _Record.name;
    }
    else if (_Record.controlname == "CHALIC") {
      this.Record.job_edi_id = _Record.id;
      this.Record.job_edi_code = _Record.code;
      this.Record.job_edi_name = _Record.name;
    }
    else if (_Record.controlname == "PKG-UNIT") {
      this.Record.job_pkg_unit_id = _Record.id;
      this.Record.job_pkg_unit_code = _Record.code;
      this.Record.job_pkg_unit_name = _Record.name;
    }
    else if (_Record.controlname == "NET-UNIT") {
      this.Record.job_ntwt_unit_id = _Record.id;
      this.Record.job_ntwt_unit_code = _Record.code;
      this.Record.job_ntwt_unit_name = _Record.name;
    }
    else if (_Record.controlname == "GR-UNIT") {
      this.Record.job_grwt_unit_id = _Record.id;
      this.Record.job_grwt_unit_code = _Record.code;
      this.Record.job_grwt_unit_name = _Record.name;
    }
    else if (_Record.controlname == "SCHEME") {
      this.Record.job_billtype_id = _Record.id;
      this.Record.job_billtype_code = _Record.code;
      this.Record.job_billtype_name = _Record.name;
    }
  }

  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string, _selectedRowIndex: number = -1) {
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
      this.selectedRowIndex = _selectedRowIndex;
      this.currentTab = 'DETAILS';
      this.pkid = id;
      this.mode = 'EDIT';
      this.ResetControls();

      this.GetRecord(id);
    }
  }

  ResetControls() {

    if (this.type == "AIR EXPORT")
      this.disableNatureofCargo = true;
    else
      this.disableNatureofCargo = false;

    this.disableSave = true;

    this.bDocs = false;

    if (!this.menu_record)
      return;

    if (this.menu_record.rights_admin)
      this.disableSave = false;
    if (this.mode == "ADD" && this.menu_record.rights_add)
      this.disableSave = false;
    if (this.mode == "EDIT" && this.menu_record.rights_edit)
      this.disableSave = false;
    if (this.mode == "EDIT" && this.menu_record.rights_docs)
      this.bDocs = true;


    return this.disableSave;
  }

  // Query List Data
  List(_type: string) {

    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      jobtype: this.jobtype.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      from_date: this.gs.globalData.job_fromdate,
      to_date: this.gs.globalData.job_todate
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

    this.job_no = "";

    this.old_shipper_id = '';
    this.old_billto_id = '';

    this.pkid = this.gs.getGuid();
    this.Record = new Jobm();
    this.Record.job_pkid = this.pkid;
    this.Record.job_docno = null;
    this.Record.job_date = this.gs.defaultValues.today;
    this.Record.job_exp_id = '';
    this.Record.job_exp_code = '';
    this.Record.job_exp_name = '';
    this.Record.job_exp_br_id = '';
    this.Record.job_exp_br_no = '';
    this.Record.job_exp_br_addr = '';
    this.Record.job_imp_id = '';
    this.Record.job_imp_code = '';
    this.Record.job_imp_name = '';
    this.Record.job_imp_br_id = '';
    this.Record.job_imp_br_no = '';
    this.Record.job_imp_br_addr = '';
    this.Record.job_buyer_id = '';
    this.Record.job_buyer_code = '';
    this.Record.job_buyer_name = '';
    this.Record.job_buyer_br_id = '';
    this.Record.job_buyer_br_no = '';
    this.Record.job_buyer_br_addr = '';
    this.Record.job_billto_id = '';
    this.Record.job_billto_code = '';
    this.Record.job_billto_name = '';
    //this.Record.job_origin_country_id = '';
    //this.Record.job_origin_country_code = '';
    //this.Record.job_origin_country_name = '';
    //this.Record.job_origin_state_id = '';
    //this.Record.job_origin_state_code = '';
    //this.Record.job_origin_state_name = '';
    //this.Record.job_pre_carriage_id = '';
    //this.Record.job_pre_carriage_code = '';
    //this.Record.job_pre_carriage_name = '';

    //this.Record.job_place_receipt_id = '' ;
    //this.Record.job_place_receipt_code = '';
    //this.Record.job_place_receipt_name = '';

    //this.Record.job_pol_id = '';
    //this.Record.job_pol_code = '';
    //this.Record.job_pol_name = '';
    this.Record.job_pod_country_id = '';
    this.Record.job_pod_country_code = '';
    this.Record.job_pod_country_name = '';
    this.Record.job_pod_id = '';
    this.Record.job_pod_code = '';
    this.Record.job_pod_name = '';
    this.Record.job_pofd_id = '';
    this.Record.job_pofd_code = '';
    this.Record.job_pofd_name = '';
    this.Record.job_pofd_country_id = '';
    this.Record.job_pofd_country_code = '';
    this.Record.job_pofd_country_name = '';
    this.Record.job_carrier_id = '';
    this.Record.job_carrier_code = '';
    this.Record.job_carrier_name = '';
    //this.Record.job_cha_id = '';
    //this.Record.job_cha_code = '';
    //this.Record.job_cha_name = '';
    //this.Record.job_agent_id = '';
    //this.Record.job_agent_code = '';
    //this.Record.job_agent_name = '';
    this.Record.job_forwarder_id = '';
    this.Record.job_forwarder_code = '';
    this.Record.job_forwarder_name = '';
    //this.Record.job_commodity_id = '';
    //this.Record.job_commodity_code = '';
    //this.Record.job_commodity_name = '';

    this.Record.job_nomination = '';
    this.Record.job_type = '';

    this.Record.job_salesman_id = '';
    this.Record.job_salesman_code = '';
    this.Record.job_salesman_name = '';
    //this.Record.job_edi_id = '';
    //this.Record.job_edi_code = '';
    //this.Record.job_edi_name = '';
    this.Record.job_remarks = '';

    if (this.type == "AIR EXPORT")
      this.Record.job_cargo_nature = 'P';
    else
      this.Record.job_cargo_nature = 'N';

    this.Record.job_pkg = 0;
    this.Record.job_pkg_unit_id = '';
    this.Record.job_pkg_unit_code = '';
    this.Record.job_pkg_unit_name = '';
    this.Record.job_pkg_loose = 0;
    this.Record.job_cntr_tot = 0;
    this.Record.job_pcs = 0;
    this.Record.job_ntwt = 0;
    this.Record.job_ntwt_unit_id = '';
    this.Record.job_ntwt_unit_code = '';
    this.Record.job_ntwt_unit_name = '';
    this.Record.job_grwt = 0;
    this.Record.job_grwt_unit_id = '';
    this.Record.job_grwt_unit_code = '';
    this.Record.job_grwt_unit_name = '';
    this.Record.job_cbm = 0;
    this.Record.job_chwt = 0;
    this.Record.job_marks = '';

    this.Record.job_rbiwno = '';
    this.Record.job_rbiw_date = '';
    this.Record.job_bank = '';
    this.Record.job_acno = '';
    this.Record.job_forexacno = '';
    this.Record.job_dealar_code = '';
    this.Record.job_epz_code = 'N';
    this.Record.job_edi_mbl_no = '';
    this.Record.job_edi_mbl_date = '';
    this.Record.job_edi_hbl_no = '';
    this.Record.job_edi_hbl_date = '';
    this.Record.job_nfei = 'N';
    this.Record.job_nfei_category = 'NA';
    this.Record.job_stuffed_at = 'DOCK';
    this.Record.job_sample = false;
    this.Record.job_seal_type = 'N';
    this.Record.job_seal_no = '';
    this.Record.job_agency_name = '';
    this.Record.jobs_hbl_id = '';
    this.Record.job_billtype_id = '';
    this.Record.job_billtype_code = '';
    this.Record.job_billtype_name = '';
    this.Record.lock_record = false;
    this.Record.job_order = false;

    this.job_edi_no = '';
    this.Record.job_pkg_unit_id = this.gs.defaultValues.param_unit_ctn_id;
    this.Record.job_pkg_unit_code = this.gs.defaultValues.param_unit_ctn_code;
    this.Record.job_ntwt_unit_id = this.gs.defaultValues.param_unit_kgs_id;
    this.Record.job_ntwt_unit_code = this.gs.defaultValues.param_unit_kgs_code;
    this.Record.job_grwt_unit_id = this.gs.defaultValues.param_unit_kgs_id;
    this.Record.job_grwt_unit_code = this.gs.defaultValues.param_unit_kgs_code;

    if (this.type == "SEA EXPORT") {
      this.Record.job_origin_country_id = this.gs.defaultValues.sea_job_origin_country_id;
      this.Record.job_origin_country_code = this.gs.defaultValues.sea_job_origin_country_code;
      this.Record.job_origin_country_name = this.gs.defaultValues.sea_job_origin_country_name;
      this.Record.job_place_receipt_id = this.gs.defaultValues.sea_job_place_receipt_id;
      this.Record.job_place_receipt_code = this.gs.defaultValues.sea_job_place_receipt_code;
      this.Record.job_place_receipt_name = this.gs.defaultValues.sea_job_place_receipt_name;
      this.Record.job_pre_carriage_id = this.gs.defaultValues.sea_job_pre_carriage_id;
      this.Record.job_pre_carriage_code = this.gs.defaultValues.sea_job_pre_carriage_code;
      this.Record.job_pre_carriage_name = this.gs.defaultValues.sea_job_pre_carriage_name;
      this.Record.job_origin_state_id = this.gs.defaultValues.sea_job_origin_state_id;
      this.Record.job_origin_state_code = this.gs.defaultValues.sea_job_origin_state_code;
      this.Record.job_origin_state_name = this.gs.defaultValues.sea_job_origin_state_name;
      this.Record.job_pol_id = this.gs.defaultValues.sea_job_pol_id;
      this.Record.job_pol_code = this.gs.defaultValues.sea_job_pol_code;
      this.Record.job_pol_name = this.gs.defaultValues.sea_job_pol_name;
      this.Record.job_agent_id = this.gs.defaultValues.sea_job_agent_id;
      this.Record.job_agent_code = this.gs.defaultValues.sea_job_agent_code;
      this.Record.job_agent_name = this.gs.defaultValues.sea_job_agent_name;
      this.Record.job_cha_id = this.gs.defaultValues.sea_job_cha_id;
      this.Record.job_cha_code = this.gs.defaultValues.sea_job_cha_code;
      this.Record.job_cha_name = this.gs.defaultValues.sea_job_cha_name;
      this.Record.job_commodity_id = this.gs.defaultValues.sea_job_commodity_id;
      this.Record.job_commodity_code = this.gs.defaultValues.sea_job_commodity_code;
      this.Record.job_commodity_name = this.gs.defaultValues.sea_job_commodity_name;
      this.Record.job_edi_id = this.gs.defaultValues.sea_job_edi_id;
      this.Record.job_edi_code = this.gs.defaultValues.sea_job_edi_code;
      this.Record.job_edi_name = this.gs.defaultValues.sea_job_edi_name;
      this.Record.job_nature = this.gs.defaultValues.sea_job_nature;
      this.Record.job_status = this.gs.defaultValues.sea_job_status;
      this.Record.job_terms = this.gs.defaultValues.sea_job_terms;
      this.Record.job_cargo_nature = this.gs.defaultValues.sea_job_cargo_nature;
      this.Record.job_marks = this.gs.defaultValues.sea_job_marks;
    } else {
      //Air export
      this.Record.job_origin_country_id = this.gs.defaultValues.air_job_origin_country_id;
      this.Record.job_origin_country_code = this.gs.defaultValues.air_job_origin_country_code;
      this.Record.job_origin_country_name = this.gs.defaultValues.air_job_origin_country_name;
      this.Record.job_place_receipt_id = this.gs.defaultValues.air_job_place_receipt_id;
      this.Record.job_place_receipt_code = this.gs.defaultValues.air_job_place_receipt_code;
      this.Record.job_place_receipt_name = this.gs.defaultValues.air_job_place_receipt_name;
      this.Record.job_pre_carriage_id = this.gs.defaultValues.air_job_pre_carriage_id;
      this.Record.job_pre_carriage_code = this.gs.defaultValues.air_job_pre_carriage_code;
      this.Record.job_pre_carriage_name = this.gs.defaultValues.air_job_pre_carriage_name;
      this.Record.job_origin_state_id = this.gs.defaultValues.air_job_origin_state_id;
      this.Record.job_origin_state_code = this.gs.defaultValues.air_job_origin_state_code;
      this.Record.job_origin_state_name = this.gs.defaultValues.air_job_origin_state_name;
      this.Record.job_pol_id = this.gs.defaultValues.air_job_pol_id;
      this.Record.job_pol_code = this.gs.defaultValues.air_job_pol_code;
      this.Record.job_pol_name = this.gs.defaultValues.air_job_pol_name;
      this.Record.job_agent_id = this.gs.defaultValues.air_job_agent_id;
      this.Record.job_agent_code = this.gs.defaultValues.air_job_agent_code;
      this.Record.job_agent_name = this.gs.defaultValues.air_job_agent_name;
      this.Record.job_cha_id = this.gs.defaultValues.air_job_cha_id;
      this.Record.job_cha_code = this.gs.defaultValues.air_job_cha_code;
      this.Record.job_cha_name = this.gs.defaultValues.air_job_cha_name;
      this.Record.job_commodity_id = this.gs.defaultValues.air_job_commodity_id;
      this.Record.job_commodity_code = this.gs.defaultValues.air_job_commodity_code;
      this.Record.job_commodity_name = this.gs.defaultValues.air_job_commodity_name;
      this.Record.job_edi_id = this.gs.defaultValues.air_job_edi_id;
      this.Record.job_edi_code = this.gs.defaultValues.air_job_edi_code;
      this.Record.job_edi_name = this.gs.defaultValues.air_job_edi_name;
      this.Record.job_nature = this.gs.defaultValues.air_job_nature;
      this.Record.job_status = this.gs.defaultValues.air_job_status;
      this.Record.job_terms = this.gs.defaultValues.air_job_terms;
      this.Record.job_marks = this.gs.defaultValues.air_job_marks;
      // this.Record.job_cargo_nature = this.gs.defaultValues.air_job_cargo_nature; //default p and its disabled
    }

    this.InitLov();



    this.PKGUNITRECORD.id = this.Record.job_pkg_unit_id;
    this.PKGUNITRECORD.code = this.Record.job_pkg_unit_code;

    this.NETUNITRECORD.id = this.Record.job_ntwt_unit_id;
    this.NETUNITRECORD.code = this.Record.job_ntwt_unit_code;

    this.GRUNITRECORD.id = this.Record.job_grwt_unit_id;
    this.GRUNITRECORD.code = this.Record.job_grwt_unit_code;

    this.PLACERECEIPTRECORD.id = this.Record.job_place_receipt_id;
    this.PLACERECEIPTRECORD.code = this.Record.job_place_receipt_code;
    this.PLACERECEIPTRECORD.name = this.Record.job_place_receipt_name;

    this.PRECARRIAGERECORD.id = this.Record.job_pre_carriage_id;
    this.PRECARRIAGERECORD.code = this.Record.job_pre_carriage_code;
    this.PRECARRIAGERECORD.name = this.Record.job_pre_carriage_name;

    this.COUNTRYORGRECORD.id = this.Record.job_origin_country_id;
    this.COUNTRYORGRECORD.code = this.Record.job_origin_country_code;
    this.COUNTRYORGRECORD.name = this.Record.job_origin_country_name;

    this.STATEORGRECORD.id = this.Record.job_origin_state_id;
    this.STATEORGRECORD.code = this.Record.job_origin_state_code;
    this.STATEORGRECORD.name = this.Record.job_origin_state_name;

    this.POLRECORD.id = this.Record.job_pol_id;
    this.POLRECORD.code = this.Record.job_pol_code;
    this.POLRECORD.name = this.Record.job_pol_name;

    this.CHARECORD.id = this.Record.job_cha_id;
    this.CHARECORD.code = this.Record.job_cha_code;
    this.CHARECORD.name = this.Record.job_cha_name;

    this.AGENTRECORD.id = this.Record.job_agent_id;
    this.AGENTRECORD.code = this.Record.job_agent_code;
    this.AGENTRECORD.name = this.Record.job_agent_name;

    this.COMMODITYRECORD.id = this.Record.job_commodity_id;
    this.COMMODITYRECORD.code = this.Record.job_commodity_code;
    this.COMMODITYRECORD.name = this.Record.job_commodity_name;

    this.EDIRECORD.id = this.Record.job_edi_id;
    this.EDIRECORD.code = this.Record.job_edi_code;
    this.EDIRECORD.name = this.Record.job_edi_name;

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
        });
  }

  LoadData(_Record: Jobm) {
    this.Record = _Record;
    this.job_edi_no = '';



    this.InitLov();

    this.BILLTORECORD.id = this.Record.job_billto_id;
    this.BILLTORECORD.code = this.Record.job_billto_code;
    this.BILLTORECORD.name = this.Record.job_billto_name;

    this.EXPRECORD.id = this.Record.job_exp_id;
    this.EXPRECORD.code = this.Record.job_exp_code;
    this.EXPRECORD.name = this.Record.job_exp_name;
    this.EXPADDRECORD.id = this.Record.job_exp_br_id;
    this.EXPADDRECORD.code = this.Record.job_exp_br_no;
    this.EXPADDRECORD.parentid = this.Record.job_exp_id;

    this.IMPRECORD.id = this.Record.job_imp_id;
    this.IMPRECORD.code = this.Record.job_imp_code;
    this.IMPRECORD.name = this.Record.job_imp_name;
    this.IMPADDRECORD.id = this.Record.job_imp_br_id;
    this.IMPADDRECORD.code = this.Record.job_imp_br_no;
    this.IMPADDRECORD.parentid = this.Record.job_imp_id;

    this.BUYERRECORD.id = this.Record.job_buyer_id;
    this.BUYERRECORD.code = this.Record.job_buyer_code;
    this.BUYERRECORD.name = this.Record.job_buyer_name;
    this.BUYERADDRECORD.id = this.Record.job_buyer_br_id;
    this.BUYERADDRECORD.code = this.Record.job_buyer_br_no;
    this.BUYERADDRECORD.parentid = this.Record.job_buyer_id;

    this.COUNTRYORGRECORD.id = this.Record.job_origin_country_id;
    this.COUNTRYORGRECORD.code = this.Record.job_origin_country_code;
    this.COUNTRYORGRECORD.name = this.Record.job_origin_country_name;

    this.STATEORGRECORD.id = this.Record.job_origin_state_id;
    this.STATEORGRECORD.code = this.Record.job_origin_state_code;
    this.STATEORGRECORD.name = this.Record.job_origin_state_name;

    this.PRECARRIAGERECORD.id = this.Record.job_pre_carriage_id;
    this.PRECARRIAGERECORD.code = this.Record.job_pre_carriage_code;
    this.PRECARRIAGERECORD.name = this.Record.job_pre_carriage_name;

    this.PLACERECEIPTRECORD.id = this.Record.job_place_receipt_id;
    this.PLACERECEIPTRECORD.code = this.Record.job_place_receipt_code;
    this.PLACERECEIPTRECORD.name = this.Record.job_place_receipt_name;

    this.POLRECORD.id = this.Record.job_pol_id;
    this.POLRECORD.code = this.Record.job_pol_code;
    this.POLRECORD.name = this.Record.job_pol_name;

    this.PODRECORD.id = this.Record.job_pod_id;
    this.PODRECORD.code = this.Record.job_pod_code;
    this.PODRECORD.name = this.Record.job_pod_name;

    this.POFDRECORD.id = this.Record.job_pofd_id;
    this.POFDRECORD.code = this.Record.job_pofd_code;
    this.POFDRECORD.name = this.Record.job_pofd_name;

    this.PODCOUNTRYRECORD.id = this.Record.job_pod_country_id;
    this.PODCOUNTRYRECORD.code = this.Record.job_pod_country_code;
    this.PODCOUNTRYRECORD.name = this.Record.job_pod_country_name;

    this.POFDCOUNTRYRECORD.id = this.Record.job_pofd_country_id;
    this.POFDCOUNTRYRECORD.code = this.Record.job_pofd_country_code;
    this.POFDCOUNTRYRECORD.name = this.Record.job_pofd_country_name;

    this.SEACARRIERRECORD.id = this.Record.job_carrier_id;
    this.SEACARRIERRECORD.code = this.Record.job_carrier_code;
    this.SEACARRIERRECORD.name = this.Record.job_carrier_name;

    this.CHARECORD.id = this.Record.job_cha_id;
    this.CHARECORD.code = this.Record.job_cha_code;
    this.CHARECORD.name = this.Record.job_cha_name;

    this.AGENTRECORD.id = this.Record.job_agent_id;
    this.AGENTRECORD.code = this.Record.job_agent_code;
    this.AGENTRECORD.name = this.Record.job_agent_name;

    this.FORWARDERRECORD.id = this.Record.job_forwarder_id;
    this.FORWARDERRECORD.code = this.Record.job_forwarder_code;
    this.FORWARDERRECORD.name = this.Record.job_forwarder_name;

    this.COMMODITYRECORD.id = this.Record.job_commodity_id;
    this.COMMODITYRECORD.code = this.Record.job_commodity_code;
    this.COMMODITYRECORD.name = this.Record.job_commodity_name;



    this.SALESMANRECORD.id = this.Record.job_salesman_id;
    this.SALESMANRECORD.code = this.Record.job_salesman_code;
    this.SALESMANRECORD.name = this.Record.job_salesman_name;

    this.EDIRECORD.id = this.Record.job_edi_id;
    this.EDIRECORD.code = this.Record.job_edi_code;
    this.EDIRECORD.name = this.Record.job_edi_name;

    this.PKGUNITRECORD.id = this.Record.job_pkg_unit_id;
    this.PKGUNITRECORD.code = this.Record.job_pkg_unit_code;
    this.PKGUNITRECORD.name = this.Record.job_pkg_unit_name;

    this.NETUNITRECORD.id = this.Record.job_ntwt_unit_id;
    this.NETUNITRECORD.code = this.Record.job_ntwt_unit_code;
    this.NETUNITRECORD.name = this.Record.job_ntwt_unit_name;

    this.GRUNITRECORD.id = this.Record.job_grwt_unit_id;
    this.GRUNITRECORD.code = this.Record.job_grwt_unit_code;
    this.GRUNITRECORD.name = this.Record.job_grwt_unit_name;

    this.SCHEMERECORD.id = this.Record.job_billtype_id;
    this.SCHEMERECORD.code = this.Record.job_billtype_code;
    this.SCHEMERECORD.name = this.Record.job_billtype_name;

    // old shipper id and bill to id
    this.old_shipper_id = this.Record.job_exp_id;
    this.old_billto_id = this.Record.job_billto_id;

    this.Record.rec_mode = this.mode;
    //Fill Duplicate Job
    if (this.mode == "ADD") {
      this.Record.job_pkid = this.pkid;
      this.Record.job_docno = null;
      this.Record.job_date = this.gs.defaultValues.today;
      this.Record.lock_record = false;
      this.Record.job_pkg = 0;
      this.Record.job_pkg_loose = 0;
      this.Record.job_cntr_tot = 0;
      this.Record.job_pcs = 0;
      this.Record.job_ntwt = 0;
      this.Record.job_grwt = 0;
      this.Record.job_cbm = 0;
      this.Record.job_chwt = 0;
    }
  }

  // Save Data

  Save() {
    try {
      if (this.old_shipper_id != this.Record.job_exp_id || this.old_billto_id != this.Record.job_billto_id)
        this.CheckCrLimit(true);
      else
        this.SaveFinal();
    }
    catch (error) {
      alert(error.message);
    }
  }

  SaveFinal() {

    if (!this.allvalid())
      return;

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.rec_category = this.type;
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        if (this.mode == 'ADD') {
          this.Record.job_docno = response.docno;
          this.Record.job_prefix = response.jobprefix;
          this.InfoMessage = "New Record " + this.Record.job_docno + " Generated Successfully";
        } else
          this.InfoMessage = "Save Complete";

        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.RefreshList();
        alert(this.InfoMessage);
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
    if (this.Record.job_date.trim().length <= 0) {
      bret = false;
      sError = " | Job Date Cannot Be Blank";
    }
    if (this.Record.job_exp_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Exporter Cannot Be Blank";
    }
    if (this.Record.job_imp_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Importer Cannot Be Blank";
    }
    if (this.Record.job_type.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Job Type Cannot Be Blank";
    }
    if (this.Record.job_place_receipt_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Place Receipt Cannot Be Blank";
    }

    if (this.Record.job_pre_carriage_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Pre-Carriage Cannot Be Blank";
    }
    if (this.Record.job_origin_country_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Origin Country Cannot Be Blank";
    }

    if (this.Record.job_origin_state_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Origin State Cannot Be Blank";
    }
    if (this.Record.job_pol_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | POL Cannot Be Blank";
    }

    if (this.Record.job_pod_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | POD Cannot Be Blank";
    }
    if (this.Record.job_pod_country_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | POD Country Cannot Be Blank";
    }

    if (this.Record.job_pofd_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | POFD Cannot Be Blank";
    }

    if (this.Record.job_pofd_country_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | POFD Country Cannot Be Blank";
    }

    /*
    if (this.Record.job_carrier_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Carrier Cannot Be Blank";
    }
    if (this.Record.job_agent_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Agent Cannot Be Blank";
    }
    if (this.Record.job_forwarder_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Forwarder Cannot Be Blank";
    }
    */

    if (this.Record.job_cha_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | CHA Cannot Be Blank";
    }

    if (this.Record.job_commodity_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Commodity Cannot Be Blank";
    }

    if (this.Record.job_terms.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Terms Cannot Be Blank";
    }

    if (this.Record.job_status.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Status Cannot Be Blank";
    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {
    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.job_pkid == this.Record.job_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.job_docno = this.Record.job_docno;
      REC.job_date = this.Record.job_date;
      REC.job_exp_name = this.Record.job_exp_name;
      REC.job_imp_name = this.Record.job_imp_name;
      REC.job_pol_name = this.Record.job_pol_name;
      REC.job_pod_name = this.Record.job_pod_name;
      REC.job_agent_name = this.Record.job_agent_name;
      REC.job_commodity_name = this.Record.job_commodity_name;
      REC.job_type = this.Record.job_type;
      REC.job_nomination = this.Record.job_nomination;
      REC.job_terms = this.Record.job_terms;
      REC.job_status = this.Record.job_status;
      REC.job_remarks = this.Record.job_remarks;
      REC.job_billtype_name = this.Record.job_billtype_name;
    }
  }


  OnBlur(field: string) {
    switch (field) {
      case 'job_remarks':
        {
          this.Record.job_remarks = this.Record.job_remarks.toUpperCase();
          break;
        }
      case 'Search':
        {
          this.searchstring = this.searchstring.toUpperCase();
          break;
        }
      case 'job_marks':
        {
          this.Record.job_marks = this.Record.job_marks.toUpperCase();
          break;
        }
      case 'job_pkg':
        {
          this.Record.job_pkg = this.gs.roundNumber(this.Record.job_pkg, 0);
          break;
        }
      case 'job_pkg_loose':
        {
          this.Record.job_pkg_loose = this.gs.roundNumber(this.Record.job_pkg_loose, 0);
          break;
        }
      case 'job_cntr_tot':
        {
          this.Record.job_cntr_tot = this.gs.roundNumber(this.Record.job_cntr_tot, 0);
          break;
        }
      case 'job_pcs':
        {
          this.Record.job_pcs = this.gs.roundNumber(this.Record.job_pcs, 3);
          break;
        }
      case 'job_cbm':
        {
          this.Record.job_cbm = this.gs.roundNumber(this.Record.job_cbm, 3);
          break;
        }
      case 'job_ntwt':
        {
          this.Record.job_ntwt = this.gs.roundNumber(this.Record.job_ntwt, 3);
          break;
        }
      case 'job_grwt':
        {
          this.Record.job_grwt = this.gs.roundNumber(this.Record.job_grwt, 3);
          break;
        }
      case 'job_chwt':
        {
          this.Record.job_chwt = this.gs.roundNumber(this.Record.job_chwt, 3);
          break;
        }

      case 'job_rbiwno':
        {
          this.Record.job_rbiwno = this.Record.job_rbiwno.toUpperCase();
          break;
        }

      case 'job_bank':
        {
          this.Record.job_bank = this.Record.job_bank.toUpperCase();
          break;
        }

      case 'job_acno':
        {
          this.Record.job_acno = this.Record.job_acno.toUpperCase();
          break;
        }

      case 'job_dealar_code':
        {
          this.Record.job_dealar_code = this.Record.job_dealar_code.toUpperCase();
          break;
        }
      case 'job_edi_mbl_no':
        {
          this.Record.job_edi_mbl_no = this.Record.job_edi_mbl_no.toUpperCase();
          break;
        }
      case 'job_edi_hbl_no':
        {
          this.Record.job_edi_hbl_no = this.Record.job_edi_hbl_no.toUpperCase();
          break;
        }
      case 'job_seal_no':
        {
          this.Record.job_seal_no = this.Record.job_seal_no.toUpperCase();
          break;
        }
      case 'job_agency_name':
        {
          this.Record.job_agency_name = this.Record.job_agency_name.toUpperCase();
          break;
        }
      case 'job_forexacno':
        {
          this.Record.job_forexacno = this.Record.job_forexacno.toUpperCase();
          break;
        }
    }

  }

  OnChange(field: string) {
  }

  folder_id: string;


  GenerateEdiNo(actiontype: string = 'R') {

    this.loading = true;
    let SearchData = {
      actiontype: '',
      type: '',
      pkid: '',
      company_code: '',
      branch_code: ''
    }
    SearchData.actiontype = actiontype;
    SearchData.type = this.type;
    SearchData.pkid = this.pkid;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;

    this.ErrorMessage = '';
    this.mainService.GenerateEdiNo(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.job_edi_no = response.job_edi_no
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });

  }

  GenerateEdiFile(edifiletype: string, _type: string = 'PDF') {

    this.loading = true;
    this.folder_id = this.gs.getGuid();

    let SearchData = {
      type: '',
      subtype: '',
      edifiletype: '',
      pkid: '',
      report_folder: '',
      folderid: '',
      company_code: '',
      branch_code: ''
    }

    SearchData.pkid = this.pkid;
    SearchData.edifiletype = edifiletype;
    SearchData.subtype = _type;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.folderid = this.folder_id;

    this.ErrorMessage = '';
    this.mainService.GenerateEdi(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (edifiletype == 'CHECKLIST') {
          if (response.serror.toString().indexOf("ESANCHIT") >= 0) {
            alert(response.serror.toString());
          }
        }

        if (_type == 'SIGN')
          this.SignDoc(response.signedtext);
        else
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);

        if (response.invamtmismatch) {
          alert("Mismatch in Invoice Product Value And Item Wise Total ");
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


  Close() {
    this.gs.ClosePage('home');
  }
  SetMarksNos() {
    let str: string = "";

    str = "I/WE UNDERTAKE TO ABIDE BY THE PROVISIONS OF FOREIGN EXCHANGE MANAGEMENT ACT, 1999, ";
    str += "AS AMENDED FROM TIME TO TIME, INCLUDING REALISATION OR REPATRIATION OF FOREIGN EXCHANGE TO";
    str += " OR FROM INDIA.(WE INTEND TO CLAIM REWARDS UNDER MEIS & ROSCTL)";

    this.Record.job_marks = str.toUpperCase();
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

  FillCustInfo() {
    this.loading = true;
    let SearchData = {
      pkid: this.Record.job_exp_id,
      brcode :  this.gs.globalVariables.branch_code
    };

    SearchData.pkid = this.Record.job_exp_id;

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetCustomerDetails(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.FillInfo(response.record);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }
  FillInfo(_Record: Jobm) {
    this.Record.job_bank = _Record.job_bank;
    this.Record.job_acno = _Record.job_acno;
    this.Record.job_forexacno = _Record.job_forexacno;
    this.Record.job_dealar_code = _Record.job_dealar_code;
  }

  openSite() {
    window.open("http://icegatesign.ncode.in:8080/ICEGATE/signTextFiles.jsp", "_blank");
  }


  CheckCrLimit(bCallSave: boolean = false) {

    if (this.Record.job_exp_id == "") {
      alert('Shipper cannot be blank');
      return;
    }

    this.loading = true;
    let SearchData = {
      searchfrom: 'JOB',
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      customerid: this.Record.job_exp_id,
      billtoid: this.Record.job_billto_id
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
        if (this.bCreditLimit && bCallSave) {
          this.SaveFinal();
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  CheckSB(checksb: any) {


    this.open(checksb);
  }

  open(content: any) {
    this.modal = this.modalService.open(content);
  }

  SignDoc(stext: string) {

    this.loading = true;
    this.folder_id = this.gs.getGuid();

    let SearchData = {
      signtext: '',
      report_folder: '',
      folderid: '',
      company_code: '',
      branch_code: ''
    }
    SearchData.signtext = stext;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.folderid = this.folder_id;

    this.ErrorMessage = '';
    this.mainService.SignDoc(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.error != "")
          alert(response.error);
        else
          alert(response.data);
        //this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });



  }


  GenerateMail(mailsent: any) {
    this.loading = true;
    let SearchData = {
      pkid: ''
    };

    SearchData.pkid = this.pkid;

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetMailDetails(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.sTo_ids = response.mailto_ids;
        this.sSubject = response.mailsubject;
        this.sHtml = response.mailmessage;
        this.open(mailsent);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  ShowBL() {
    this.currentPage = 'BLPAGE';
  }

  pageChanged() {
    this.currentPage = 'ROOTPAGE';
  }


  SearchRecord(controlname: string) {
    this.ErrorMessage = '';
    if (this.job_no.trim().length <= 0) {
      this.ErrorMessage = 'Please Enter a  Job Number and Continue......';
      return;
    }
    this.loading = true;
    let SearchData = {
      table: 'jobm',
      rowtype: this.type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      job_docno: ''
    };

    SearchData.table = 'jobm';
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;
    SearchData.year_code = this.gs.globalVariables.year_code;
    SearchData.job_docno = this.job_no;

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;

        this.ErrorMessage = '';
        if (response.jobm.length > 0) {
          this.GetRecord(response.jobm[0].job_pkid);
        }
        else {
          this.ErrorMessage = 'Invalid Job#';
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  LinkDocs(esanchitlink: any) {
    this.open(esanchitlink);
  }
  
  ShowHistory(history: any) {
    this.ErrorMessage = '';
    this.open(history);
  }
}
