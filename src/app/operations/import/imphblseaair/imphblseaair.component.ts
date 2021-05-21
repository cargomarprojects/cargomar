import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../../core/services/global.service';

import { Hblm } from '../../models/hbl';
import { ImpHblService } from '../../services/imphbl.service';

import { SearchTable } from '../../../shared/models/searchtable';

@Component({
  selector: 'app-imphblseaair',
  templateUrl: './imphblseaair.component.html',
  providers: [ImpHblService]
})
export class ImpHblSeaAirComponent {
  // Local Variables 
  title = 'HBL MASTER';

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;


  bDocs = false;

  currentPage = 'ROOTPAGE';
  // disableBookslno = false;

  lblhblname = 'HBL No';
  masterexist = false;
  jobexist = false;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  JobTab = 'LIST';

  searchby = "";
  searchstring = '';
  jobtype = 'BOTH';
  porttype = 'SEA PORT';
  carriertype = 'SEA CARRIER';

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;

  ErrorMessage = "";
  InfoMessage = "";

  sImp_ID = "";
  sExp_ID = "";

  mode = '';
  pkid = '';

  old_shipper_id = '';
  old_billto_id = '';

  bCreditLimit: boolean = false;
  showalert = false;
  CrList : any[];



  // Array For Displaying List
  RecordList: Hblm[] = [];
  // Single Record for add/edit/view details
  Record: Hblm = new Hblm;

  //JobTypeList: any[] = [];

  // Shipper
  BILLTORECORD: SearchTable = new SearchTable();
  LINERRECORD: SearchTable = new SearchTable();
  AGENTRECORD: SearchTable = new SearchTable();
  EXPRECORD: SearchTable = new SearchTable();
  EXPADDRECORD: SearchTable = new SearchTable();
  IMPRECORD: SearchTable = new SearchTable();
  IMPADDRECORD: SearchTable = new SearchTable();
  LOCATIONRECORD: SearchTable = new SearchTable();
  COUNTRYORGRECORD: SearchTable = new SearchTable();
  POLRECORD: SearchTable = new SearchTable();
  PKGUNITRECORD: SearchTable = new SearchTable();
  NETUNITRECORD: SearchTable = new SearchTable();
  GRUNITRECORD: SearchTable = new SearchTable();
  FCURRECORD: SearchTable = new SearchTable();
  ICURRECORD: SearchTable = new SearchTable();

  constructor(
    private mainService: ImpHblService,
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
    this.searchby = "ALL";
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
    {
      this.title = this.menu_record.menu_name;
      this.bDocs =this.menu_record.rights_docs;
    }
    if (this.type.toString() == "SEA IMPORT") {
      this.porttype = "SEA PORT";
      this.lblhblname = "HBL.No";
      this.carriertype = "SEA CARRIER";
    }
    else {
      this.porttype = "AIR PORT";
      this.lblhblname = "HAWB.No";
      this.carriertype = "AIR CARRIER";
    }
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

    //this.JobTypeList = [{ "name": "BOTH" }, { "name": "CLEARING" }, { "name": "FORWARDING" }];

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




    this.LINERRECORD = new SearchTable();
    this.LINERRECORD.controlname = "LINER";
    this.LINERRECORD.displaycolumn = "CODE";
    this.LINERRECORD.type = this.carriertype;
    this.LINERRECORD.id = "";
    this.LINERRECORD.code = "";
    this.LINERRECORD.name = "";

    this.AGENTRECORD = new SearchTable();
    this.AGENTRECORD.controlname = "AGENT";
    this.AGENTRECORD.displaycolumn = "CODE";
    this.AGENTRECORD.type = "CUSTOMER";
    this.AGENTRECORD.where = " CUST_IS_AGENT = 'Y' ";
    this.AGENTRECORD.id = "";
    this.AGENTRECORD.code = "";
    this.AGENTRECORD.name = "";

    this.EXPRECORD = new SearchTable();
    this.EXPRECORD.controlname = "SHIPPER";
    this.EXPRECORD.displaycolumn = "CODE";
    this.EXPRECORD.type = "CUSTOMER";
    //this.EXPRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
    this.EXPRECORD.where = " CUST_IS_CONSIGNEE = 'Y' ";
    this.EXPRECORD.id = "";
    this.EXPRECORD.code = "";
    this.EXPRECORD.name = "";

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
    // this.IMPRECORD.where = " CUST_IS_CONSIGNEE = 'Y' ";
    this.IMPRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
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


    this.LOCATIONRECORD = new SearchTable();
    this.LOCATIONRECORD.controlname = "LOCATION";
    this.LOCATIONRECORD.displaycolumn = "NAME";
    this.LOCATIONRECORD.type = "CITY";
    this.LOCATIONRECORD.id = "";
    this.LOCATIONRECORD.code = "";
    this.LOCATIONRECORD.name = "";

    this.COUNTRYORGRECORD = new SearchTable();
    this.COUNTRYORGRECORD.controlname = "COUNTRYORIGIN";
    this.COUNTRYORGRECORD.displaycolumn = "CODE";
    this.COUNTRYORGRECORD.type = "COUNTRY";
    this.COUNTRYORGRECORD.id = "";
    this.COUNTRYORGRECORD.code = "";
    this.COUNTRYORGRECORD.name = "";

    this.POLRECORD = new SearchTable();
    this.POLRECORD.controlname = "POL";
    this.POLRECORD.displaycolumn = "CODE";
    this.POLRECORD.type = this.porttype;
    this.POLRECORD.id = "";
    this.POLRECORD.code = "";
    this.POLRECORD.name = "";

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

    this.FCURRECORD = new SearchTable();
    this.FCURRECORD.controlname = "FCURRENCY";
    this.FCURRECORD.displaycolumn = "CODE";
    this.FCURRECORD.type = "CURRENCY";
    this.FCURRECORD.id = this.gs.defaultValues.param_curr_foreign_id;
    this.FCURRECORD.code = this.gs.defaultValues.param_curr_foreign_code;

    this.ICURRECORD = new SearchTable();
    this.ICURRECORD.controlname = "ICURRENCY";
    this.ICURRECORD.displaycolumn = "CODE";
    this.ICURRECORD.type = "CURRENCY";
    this.ICURRECORD.id = this.gs.defaultValues.param_curr_foreign_id;
    this.ICURRECORD.code = this.gs.defaultValues.param_curr_foreign_code;

  }

  LovSelected(_Record: SearchTable) {
    let bchange: boolean = false;

    if (_Record.controlname == "LINER") {
      this.Record.hbl_carrier_id = _Record.id;
      this.Record.hbl_carrier_code = _Record.code;
      this.Record.hbl_carrier_name = _Record.name;
    }

    if (_Record.controlname == "AGENT") {
      this.Record.hbl_agent_id = _Record.id;
      this.Record.hbl_agent_code = _Record.code;
      this.Record.hbl_agent_name = _Record.name;
    }

    if (_Record.controlname == "SHIPPER") {

      bchange = false;
      if (this.Record.hbl_exp_id != _Record.id)
        bchange = true;

      this.Record.hbl_exp_id = _Record.id;
      this.Record.hbl_exp_code = _Record.code;
      this.Record.hbl_exp_name = _Record.name;

      if (bchange) {
        this.EXPADDRECORD = new SearchTable();
        this.EXPADDRECORD.controlname = "SHIPPERADDRESS";
        this.EXPADDRECORD.displaycolumn = "NAME";
        this.EXPADDRECORD.type = "CUSTOMERADDRESS";
        this.EXPADDRECORD.id = "";
        this.EXPADDRECORD.code = "";
        this.EXPADDRECORD.name = "";
        this.EXPADDRECORD.parentid = this.Record.hbl_exp_id;
        this.Record.hbl_exp_br_addr = "";
      }
    }
    else if (_Record.controlname == "SHIPPERADDRESS") {
      this.Record.hbl_exp_br_id = _Record.id;
      this.Record.hbl_exp_br_no = _Record.code;
      this.Record.hbl_exp_br_addr = this.GetBrAddress(_Record.name).address;
    }

    else if (_Record.controlname == "BILLTO") {
      this.Record.hbl_billto_id = _Record.id;
      this.Record.hbl_billto_code = _Record.code;
      this.Record.hbl_billto_name = _Record.name;
    }

    else if (_Record.controlname == "CONSIGNEE") {

      bchange = false;
      if (this.Record.hbl_imp_id != _Record.id)
        bchange = true;

      this.Record.hbl_imp_id = _Record.id;
      this.Record.hbl_imp_code = _Record.code;
      this.Record.hbl_imp_name = _Record.name;

      if (bchange) {
        this.IMPADDRECORD = new SearchTable();
        this.IMPADDRECORD.controlname = "CONSIGNEEADDRESS";
        this.IMPADDRECORD.displaycolumn = "NAME";
        this.IMPADDRECORD.type = "CUSTOMERADDRESS";
        this.IMPADDRECORD.id = "";
        this.IMPADDRECORD.code = "";
        this.IMPADDRECORD.name = "";
        this.IMPADDRECORD.parentid = this.Record.hbl_imp_id;
        this.Record.hbl_imp_br_addr = "";
      }
    }
    else if (_Record.controlname == "CONSIGNEEADDRESS") {
      this.Record.hbl_imp_br_id = _Record.id;
      this.Record.hbl_imp_br_no = _Record.code;
      this.Record.hbl_imp_br_addr = this.GetBrAddress(_Record.name).address;
    }
    else if (_Record.controlname == "LOCATION") {
      this.Record.hbl_location_id = _Record.id;
      this.Record.hbl_location_code = _Record.code;
      this.Record.hbl_location_name = _Record.name;
    } else if (_Record.controlname == "COUNTRYORIGIN") {
      this.Record.hbl_origin_country_id = _Record.id;
      this.Record.hbl_origin_country_code = _Record.code;
      this.Record.hbl_origin_country_name = _Record.name;
    } else if (_Record.controlname == "POL") {
      this.Record.hbl_pol_id = _Record.id;
      this.Record.hbl_pol_code = _Record.code;
      this.Record.hbl_pol_name = _Record.name;
    } else if (_Record.controlname == "PKG-UNIT") {
      this.Record.hbl_pkg_unit_id = _Record.id;
      this.Record.hbl_pkg_unit_code = _Record.code;
      this.Record.hbl_pkg_unit_name = _Record.name;
    }
    else if (_Record.controlname == "NET-UNIT") {
      this.Record.hbl_ntwt_unit_id = _Record.id;
      this.Record.hbl_ntwt_unit_code = _Record.code;
      this.Record.hbl_ntwt_unit_name = _Record.name;
    }
    else if (_Record.controlname == "GR-UNIT") {
      this.Record.hbl_grwt_unit_id = _Record.id;
      this.Record.hbl_grwt_unit_code = _Record.code;
      this.Record.hbl_grwt_unit_name = _Record.name;
    } else if (_Record.controlname == "FCURRENCY") {
      this.Record.hbl_frt_curr_id = _Record.id;
      this.Record.hbl_frt_curr_code = _Record.code;
      this.Record.hbl_frt_ex_rate = _Record.rate;
    }
    else if (_Record.controlname == "ICURRENCY") {
      this.Record.hbl_insu_curr_id = _Record.id;
      this.Record.hbl_insu_curr_code = _Record.code;
      this.Record.hbl_insu_ex_rate = _Record.rate;
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
      this.pkid = id;
      this.mode = 'EDIT';
      this.ResetControls();
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
      searchby: this.searchby,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      from_date: this.gs.globalData.hbl_fromdate,
      to_date: this.gs.globalData.hbl_todate
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
    // this.disableBookslno = false;

    this.old_shipper_id = '';
    this.old_billto_id = '';


    this.pkid = this.gs.getGuid();
    this.Record = new Hblm();
    this.Record.hbl_pkid = this.pkid;
    this.Record.hbl_no = null;
    this.Record.hbl_date = this.gs.defaultValues.today;

    this.Record.hbl_carrier_id = '';
    this.Record.hbl_carrier_code = '';
    this.Record.hbl_carrier_name = '';
    this.Record.hbl_agent_id = '';
    this.Record.hbl_agent_code = '';
    this.Record.hbl_agent_name = '';

    this.Record.hbl_exp_id = '';
    this.Record.hbl_exp_code = '';
    this.Record.hbl_exp_name = '';
    this.Record.hbl_exp_br_id = '';
    this.Record.hbl_exp_br_no = '';
    this.Record.hbl_exp_br_addr = '';

    this.Record.hbl_imp_id = '';
    this.Record.hbl_imp_code = '';
    this.Record.hbl_imp_name = '';
    this.Record.hbl_imp_br_id = '';
    this.Record.hbl_imp_br_no = '';
    this.Record.hbl_imp_br_addr = '';

    this.Record.hbl_billto_id = '';
    this.Record.hbl_billto_code = '';
    this.Record.hbl_billto_name = '';


    if (this.type == "SEA IMPORT")
      this.Record.hbl_nature = 'FCL/FCL';
    else
      this.Record.hbl_nature = '';
    this.Record.hbl_terms = 'EX-WORK';
    this.Record.hbl_location_id = '';
    this.Record.hbl_location_code = '';
    this.Record.hbl_location_name = '';
    this.Record.hbl_remarks = '';
    this.Record.hbl_mbl_id = '';
    this.Record.hbl_mbl_no = '';
    this.Record.hbl_mbl_bookslno = '';
    this.Record.hbl_mbl_bookno = '';

    this.Record.hbl_pol_id = '';
    this.Record.hbl_pol_code = '';
    this.Record.hbl_pol_name = '';

    this.Record.hbl_origin_country_id = '';
    this.Record.hbl_origin_country_code = '';
    this.Record.hbl_origin_country_name = '';

    this.Record.hbl_carton_nos = '';

    this.Record.hbl_pkg = 0;
    this.Record.hbl_pkg_unit_id = '';
    this.Record.hbl_pkg_unit_code = '';
    this.Record.hbl_pkg_unit_name = '';

    this.Record.hbl_pcs = 0;
    this.Record.hbl_ntwt = 0;
    this.Record.hbl_ntwt_unit_id = '';
    this.Record.hbl_ntwt_unit_code = '';
    this.Record.hbl_ntwt_unit_name = '';
    this.Record.hbl_grwt = 0;
    this.Record.hbl_grwt_unit_id = '';
    this.Record.hbl_grwt_unit_code = '';
    this.Record.hbl_grwt_unit_name = '';
    this.Record.hbl_cbm = 0;
    this.Record.hbl_chwt = 0;

    this.Record.hbl_deliv_orderissued = 'NA';
    this.Record.hbl_deliv_place = '';
    this.Record.hbl_deliv_date = '';
    this.Record.hbl_frt_amt = 0;
    this.Record.hbl_frt_curr_id = '';
    this.Record.hbl_frt_curr_code = '';
    this.Record.hbl_frt_curr_name = '';
    this.Record.hbl_frt_ex_rate = 0;
    this.Record.hbl_insu_amt = 0;
    this.Record.hbl_insu_curr_id = '';
    this.Record.hbl_insu_curr_code = '';
    this.Record.hbl_insu_curr_name = '';
    this.Record.hbl_insu_ex_rate = 0;
    this.Record.hbl_invoice_nos = '';
    this.Record.hbl_bl_no = '';

    this.InitLov();
    this.PKGUNITRECORD.id = this.gs.defaultValues.param_unit_pcs_id;
    this.PKGUNITRECORD.code = this.gs.defaultValues.param_unit_pcs_code;
    this.Record.hbl_pkg_unit_id = this.PKGUNITRECORD.id;
    this.Record.hbl_pkg_unit_code = this.PKGUNITRECORD.code;

    this.NETUNITRECORD.id = this.gs.defaultValues.param_unit_kgs_id;
    this.NETUNITRECORD.code = this.gs.defaultValues.param_unit_kgs_code;
    this.Record.hbl_ntwt_unit_id = this.NETUNITRECORD.id;
    this.Record.hbl_ntwt_unit_code = this.NETUNITRECORD.code;

    this.GRUNITRECORD.id = this.gs.defaultValues.param_unit_kgs_id;
    this.GRUNITRECORD.code = this.gs.defaultValues.param_unit_kgs_code;
    this.Record.hbl_grwt_unit_id = this.GRUNITRECORD.id;
    this.Record.hbl_grwt_unit_code = this.GRUNITRECORD.code;
    this.Record.lock_record = false;
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

  LoadData(_Record: Hblm) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;

    //this.disableBookslno = false;
    //if (this.Record.hbl_mbl_bookslno != null)
    //  if (this.Record.hbl_mbl_bookslno.length > 0)
    //    this.disableBookslno = true;

    this.masterexist = this.IsMasterExist();

    this.InitLov();


    this.BILLTORECORD.id = this.Record.hbl_billto_id;
    this.BILLTORECORD.code = this.Record.hbl_billto_code;
    this.BILLTORECORD.name = this.Record.hbl_billto_name;


    this.LINERRECORD.id = this.Record.hbl_carrier_id;
    this.LINERRECORD.code = this.Record.hbl_carrier_code;
    this.LINERRECORD.name = this.Record.hbl_carrier_name;

    this.AGENTRECORD.id = this.Record.hbl_agent_id;
    this.AGENTRECORD.code = this.Record.hbl_agent_code;
    this.AGENTRECORD.name = this.Record.hbl_agent_name;

    this.EXPRECORD.id = this.Record.hbl_exp_id;
    this.EXPRECORD.code = this.Record.hbl_exp_code;
    this.EXPRECORD.name = this.Record.hbl_exp_name;
    this.EXPADDRECORD.id = this.Record.hbl_exp_br_id;
    this.EXPADDRECORD.code = this.Record.hbl_exp_br_no;
    this.EXPADDRECORD.parentid = this.Record.hbl_exp_id;

    this.IMPRECORD.id = this.Record.hbl_imp_id;
    this.IMPRECORD.code = this.Record.hbl_imp_code;
    this.IMPRECORD.name = this.Record.hbl_imp_name;
    this.IMPADDRECORD.id = this.Record.hbl_imp_br_id;
    this.IMPADDRECORD.code = this.Record.hbl_imp_br_no;
    this.IMPADDRECORD.parentid = this.Record.hbl_imp_id;

    this.LOCATIONRECORD.id = this.Record.hbl_location_id;
    this.LOCATIONRECORD.code = this.Record.hbl_location_code;
    this.LOCATIONRECORD.name = this.Record.hbl_location_name;

    this.COUNTRYORGRECORD.id = this.Record.hbl_origin_country_id;
    this.COUNTRYORGRECORD.code = this.Record.hbl_origin_country_code;
    this.COUNTRYORGRECORD.name = this.Record.hbl_origin_country_name;

    this.POLRECORD.id = this.Record.hbl_pol_id;
    this.POLRECORD.code = this.Record.hbl_pol_code;
    this.POLRECORD.name = this.Record.hbl_pol_name;

    this.PKGUNITRECORD.id = this.Record.hbl_pkg_unit_id;
    this.PKGUNITRECORD.code = this.Record.hbl_pkg_unit_code;
    this.PKGUNITRECORD.name = this.Record.hbl_pkg_unit_name;

    this.NETUNITRECORD.id = this.Record.hbl_ntwt_unit_id;
    this.NETUNITRECORD.code = this.Record.hbl_ntwt_unit_code;
    this.NETUNITRECORD.name = this.Record.hbl_ntwt_unit_name;


    this.GRUNITRECORD.id = this.Record.hbl_grwt_unit_id;
    this.GRUNITRECORD.code = this.Record.hbl_grwt_unit_code;
    this.GRUNITRECORD.name = this.Record.hbl_grwt_unit_name;

    this.FCURRECORD.id = this.Record.hbl_frt_curr_id;
    this.FCURRECORD.code = this.Record.hbl_frt_curr_code;

    this.ICURRECORD.id = this.Record.hbl_insu_curr_id;
    this.ICURRECORD.code = this.Record.hbl_insu_curr_code;

    this.old_shipper_id = this.Record.hbl_exp_id;
    this.old_billto_id = this.Record.hbl_billto_id;


  }


  Save() {
    try {
        if (this.old_shipper_id != this.Record.hbl_exp_id || this.old_billto_id != this.Record.hbl_billto_id)
            this.CheckCrLimit(true);
        else
            this.SaveFinal();
    }
    catch (error) {
        alert(error.message);
    }
}



  // Save Data
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
          this.Record.hbl_no = response.docno;
          this.InfoMessage = "New Record " + this.Record.hbl_no + " Generated Successfully";
        } else
          this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        //if (this.Record.hbl_mbl_bookslno != null)
        //  if (this.Record.hbl_mbl_bookslno.length > 0)
        //    this.disableBookslno = true;

        this.masterexist = this.IsMasterExist();
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
    if (this.Record.hbl_date.trim().length <= 0) {
      bret = false;
      sError = " | Hbl Date Cannot Be Blank";
    }
    if (this.Record.hbl_exp_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Exporter Cannot Be Blank";
    }
    if (this.Record.hbl_imp_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Importer Cannot Be Blank";
    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }


  CheckCrLimit(bCallSave: boolean = false) {

    if (this.Record.hbl_imp_id == "") {
      alert('Importer cannot be blank');
      return;
    }

    this.loading = true;
    let SearchData = {
      type : 'SI ' + this.type,      
      searchfrom: 'SI-IMPORT',
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      customerid: this.Record.hbl_imp_id,
      billtoid: this.Record.hbl_billto_id
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetCreditLimit(SearchData)
      .subscribe(response => {
        this.loading = false;
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





  RefreshList() {
    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.hbl_pkid == this.Record.hbl_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.hbl_no = this.Record.hbl_no;
      REC.hbl_bl_no = this.Record.hbl_bl_no;
      REC.hbl_date = this.Record.hbl_date;
      REC.hbl_exp_name = this.Record.hbl_exp_name;
      REC.hbl_imp_name = this.Record.hbl_imp_name;
      REC.hbl_beno = this.Record.hbl_beno;
      REC.hbl_bedate = this.Record.hbl_bedate;
      REC.hbl_nature = this.Record.hbl_nature;
      REC.hbl_terms = this.Record.hbl_terms;
      REC.hbl_nomination = this.Record.hbl_nomination;
    }
  }

  OnBlur(field: string) {
    switch (field) {
      case 'hbl_remarks':
        {
          this.Record.hbl_remarks = this.Record.hbl_remarks.toUpperCase();
          break;
        }
      case 'hbl_beno':
        {
          this.Record.hbl_beno = this.Record.hbl_beno.toUpperCase();
          break;
        }
      case 'hbl_bl_no':
        {
          this.Record.hbl_bl_no = this.Record.hbl_bl_no.toUpperCase();
          break;
        }
      case 'hbl_mbl_bookslno':
        {
          this.SearchRecord('hbl_mbl_bookslno');
          break;
        }
      case 'hbl_pkg':
        {
          this.Record.hbl_pkg = this.gs.roundWeight(this.Record.hbl_pkg, "PKG");
          break;
        }
      case 'hbl_pcs':
        {
          this.Record.hbl_pcs = this.gs.roundWeight(this.Record.hbl_pcs, "PCS");
          break;
        }
      case 'hbl_cbm':
        {
          this.Record.hbl_cbm = this.gs.roundWeight(this.Record.hbl_cbm, "CBM");
          break;
        }
      case 'hbl_ntwt':
        {
          this.Record.hbl_ntwt = this.gs.roundWeight(this.Record.hbl_ntwt, "NTWT");
          break;
        }
      case 'hbl_grwt':
        {
          this.Record.hbl_grwt = this.gs.roundWeight(this.Record.hbl_grwt, "GRWT");
          break;
        }
      case 'hbl_chwt':
        {
          this.Record.hbl_chwt = this.gs.roundWeight(this.Record.hbl_chwt, "CHWT");
          break;
        }

      case 'hbl_frt_amt':
        {
          this.Record.hbl_frt_amt = this.gs.roundWeight(this.Record.hbl_frt_amt, "AMT");
          break;
        }

      case 'hbl_frt_ex_rate':
        {
          this.Record.hbl_frt_ex_rate = this.gs.roundWeight(this.Record.hbl_frt_ex_rate, "EXRATE");
          break;
        }

      case 'hbl_insu_amt':
        {
          this.Record.hbl_insu_amt = this.gs.roundWeight(this.Record.hbl_insu_amt, "AMT");
          break;
        }

      case 'hbl_insu_ex_rate':
        {
          this.Record.hbl_insu_ex_rate = this.gs.roundWeight(this.Record.hbl_insu_ex_rate, "EXRATE");
          break;
        }
      case 'hbl_deliv_place':
        {
          this.Record.hbl_deliv_place = this.Record.hbl_deliv_place.toUpperCase();
          break;
        }
      case 'hbl_invoice_nos':
        {
          this.Record.hbl_invoice_nos = this.Record.hbl_invoice_nos.toUpperCase();
          break;
        }

    }
  }

  SearchRecord(controlname: string) {
    this.ErrorMessage = '';
    this.Record.hbl_mbl_id = '';
    this.Record.hbl_mbl_no = '';
    this.Record.hbl_mbl_bookno = '';
    if (controlname == 'hbl_mbl_bookslno' && this.Record.hbl_mbl_bookslno.trim().length <= 0)
      return;

    this.loading = true;
    let SearchData = {
      rowtype: this.type,
      table: 'linerbkm',
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      book_slno: '',
      pkid: '',
      hbl_beno: '',
      hbl_bedate: ''
    };
    if (controlname == 'hbl_mbl_bookslno') {
      SearchData.rowtype = this.type;
      SearchData.table = 'linerbkm';
      SearchData.company_code = this.gs.globalVariables.comp_code;
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.year_code = this.gs.globalVariables.year_code;
      SearchData.book_slno = this.Record.hbl_mbl_bookslno;
    }
    if (controlname == 'updatehouse') {
      SearchData.table = 'updatehouse';
      SearchData.pkid = this.Record.hbl_pkid;
      SearchData.hbl_beno = this.Record.hbl_beno;
      SearchData.hbl_bedate = this.Record.hbl_bedate;
    }

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (controlname == 'updatehouse') {
          this.InfoMessage = 'Save Complete';
        } else {
          this.Record.hbl_mbl_id = '';
          this.ErrorMessage = '';
          if (response.linerbkm.length > 0) {
            this.Record.hbl_mbl_id = response.linerbkm[0].book_pkid;
            this.Record.hbl_mbl_bookno = response.linerbkm[0].book_no;
            this.Record.hbl_mbl_no = response.linerbkm[0].book_mblno;
          }
          else {
            this.ErrorMessage = 'Invalid Booking';
          }
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
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


  IsMasterExist() {
    let bret: boolean = false;
    if (this.Record.hbl_mbl_id != null)
      if (this.Record.hbl_mbl_id.length > 0)
        bret = true;
    return bret;
  }

  ShowBL() {

    // this.currentPage = 'BLPAGE';
  }

  pageChanged() {
    this.currentPage = 'ROOTPAGE';
  }
  GenerateArrivalNotice(id: string, ftype: string, formattype: string) {
    this.loading = true;
    let SearchData = {
      rowtype: '',
      ftype: '',
      formattype: '',
      pkid: '',
      report_folder: '',
      folderid: '',
      company_code: '',
      branch_code: ''
    }
    SearchData.rowtype = this.type;
    SearchData.formattype = formattype;

    SearchData.pkid = id;
    SearchData.report_folder = this.gs.globalVariables.report_folder;
    SearchData.folderid = this.gs.getGuid();
    SearchData.company_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;

    this.ErrorMessage = '';
    this.mainService.GenerateArrivalNotice(SearchData)
      .subscribe(response => {
        this.loading = false;
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
}
