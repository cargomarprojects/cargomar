import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Hblm } from '../models/hbl';
import { HblService } from '../services/hbl.service';

import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-hblseaair',
    templateUrl: './hblseaair.component.html',
    providers: [HblService]
})
export class HblSeaAirComponent {
    // Local Variables 
    title = 'HBL MASTER';

    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;
    modal: any;
    buysell_record: any;
    bAdmin = false;
    bPrint = false;

    bDocs = false;
    bBilling = false;
    bJobIncome = false;
    bbuysellrate = false;
    currentPage = 'ROOTPAGE';
    // disableBookslno = false;

    btnbltiltle = 'House BL';
    masterexist = false;
    jobexist = false;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    JobTab = 'LIST';

    hbl_no = "";
    searchby = "";
    searchstring = '';
    jobtype = 'BOTH';
    carriertype = 'SEA CARRIER';

    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    To_ids: string = '';
    mSubject: string = '';
    mMsg: string = '';
    sHtml: string = '';
    AttachList: any[] = [];

    old_shipper_id = '';
    old_billto_id = '';

    bCreditLimit: boolean = false;

    showalert = false;

    CrList: any[];

    sub: any;
    urlid: string;

    ErrorMessage = "";
    InfoMessage = "";

    sImp_ID = "";
    sExp_ID = "";

    mode = '';
    pkid = '';


    // Array For Displaying List
    RecordList: Hblm[] = [];
    // Single Record for add/edit/view details
    Record: Hblm = new Hblm;

    //JobTypeList: any[] = [];

    // Shipper
    BILLTORECORD: SearchTable = new SearchTable();
    EXPRECORD: SearchTable = new SearchTable();
    EXPADDRECORD: SearchTable = new SearchTable();
    AGENTRECORD: SearchTable = new SearchTable();
    AGENTADDRECORD: SearchTable = new SearchTable();
    SEACARRIERRECORD: SearchTable = new SearchTable();
    SALESMANRECORD: SearchTable = new SearchTable();
    IMPRECORD: SearchTable = new SearchTable();
    IMPADDRECORD: SearchTable = new SearchTable();
    LOCATIONRECORD: SearchTable = new SearchTable();
    COLOADERRECORD: SearchTable = new SearchTable();

    constructor(
        private modalService: NgbModal,
        private mainService: HblService,
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
        this.bBilling = false;
        this.bJobIncome = false;
        this.bbuysellrate = false;
        this.bDocs = false;
        this.hbl_no = "";
        let billrecord: any;
        let incomerecord: any;

        billrecord = this.gs.getMenu('ARINVOICE');
        if (billrecord)
            this.bBilling = true;

        if (this.type.toString() == "SEA EXPORT") {
            incomerecord = this.gs.getMenu('SE-JOBINCOME');
            if (incomerecord)
                this.bJobIncome = true;

            this.buysell_record = this.gs.getMenu('SE-BUYSELL-RATE');
            if (this.buysell_record) {
                if (this.buysell_record.rights_add || this.buysell_record.rights_view)
                    this.bbuysellrate = true;
            }
        }

        if (this.type.toString() == "AIR EXPORT") {
            incomerecord = this.gs.getMenu('AE-JOBINCOME');
            if (incomerecord)
                this.bJobIncome = true;

            this.buysell_record = this.gs.getMenu('AE-BUYSELL-RATE');
            if (this.buysell_record) {
                if (this.buysell_record.rights_add || this.buysell_record.rights_view)
                    this.bbuysellrate = true;
            }
        }

        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_admin)
                this.bAdmin = true;
            if (this.menu_record.rights_docs)
                this.bDocs = true;

            this.bPrint = this.menu_record.rights_print;
        }



        if (this.type.toString() == "SEA EXPORT") {
            this.carriertype = "SEA CARRIER";
            this.btnbltiltle = "House BL";
        }
        else {
            this.carriertype = "AIR CARRIER";
            this.btnbltiltle = "HAWB";
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


        this.EXPRECORD = new SearchTable();
        this.EXPRECORD.controlname = "SHIPPER";
        this.EXPRECORD.displaycolumn = "CODE";
        this.EXPRECORD.type = "CUSTOMER";
        this.EXPRECORD.where = " CUST_IS_SHIPPER = 'Y' ";
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

        this.AGENTRECORD = new SearchTable();
        this.AGENTRECORD.controlname = "AGENT";
        this.AGENTRECORD.displaycolumn = "CODE";
        this.AGENTRECORD.type = "CUSTOMER";
        this.AGENTRECORD.where = " CUST_IS_AGENT = 'Y' ";
        this.AGENTRECORD.id = "";
        this.AGENTRECORD.code = "";
        this.AGENTRECORD.name = "";

        this.AGENTADDRECORD = new SearchTable();
        this.AGENTADDRECORD.controlname = "AGENTADDRESS";
        this.AGENTADDRECORD.displaycolumn = "CODE";
        this.AGENTADDRECORD.type = "CUSTOMERADDRESS";
        this.AGENTADDRECORD.id = "";
        this.AGENTADDRECORD.code = "";
        this.AGENTADDRECORD.name = "";
        this.AGENTADDRECORD.parentid = "";

        this.SEACARRIERRECORD = new SearchTable();
        this.SEACARRIERRECORD.controlname = "SEACARRIER";
        this.SEACARRIERRECORD.displaycolumn = "NAME";
        this.SEACARRIERRECORD.type = this.carriertype;
        this.SEACARRIERRECORD.id = "";
        this.SEACARRIERRECORD.code = "";
        this.SEACARRIERRECORD.name = "";

        this.SALESMANRECORD = new SearchTable();
        this.SALESMANRECORD.controlname = "SALESMAN";
        this.SALESMANRECORD.displaycolumn = "CODE";
        this.SALESMANRECORD.type = "SALESMAN";
        this.SALESMANRECORD.id = "";
        this.SALESMANRECORD.code = "";
        this.SALESMANRECORD.name = "";

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


        this.LOCATIONRECORD = new SearchTable();
        this.LOCATIONRECORD.controlname = "LOCATION";
        this.LOCATIONRECORD.displaycolumn = "NAME";
        this.LOCATIONRECORD.type = "CITY";
        this.LOCATIONRECORD.id = "";
        this.LOCATIONRECORD.code = "";
        this.LOCATIONRECORD.name = "";

        this.COLOADERRECORD = new SearchTable();
        this.COLOADERRECORD.controlname = "COLOADER";
        this.COLOADERRECORD.displaycolumn = "CODE";
        this.COLOADERRECORD.type = "CUSTOMER";
        this.COLOADERRECORD.id = "";
        this.COLOADERRECORD.code = "";
        this.COLOADERRECORD.name = "";
    }

    LovSelected(_Record: SearchTable) {
        let bchange: boolean = false;

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
                this.EXPADDRECORD.displaycolumn = "CODE";
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
        else if (_Record.controlname == "AGENT") {

            bchange = false;
            if (this.Record.hbl_agent_id != _Record.id)
                bchange = true;

            this.Record.hbl_agent_id = _Record.id;
            this.Record.hbl_agent_code = _Record.code;
            this.Record.hbl_agent_name = _Record.name;

            if (bchange) {
                this.AGENTADDRECORD = new SearchTable();
                this.AGENTADDRECORD.controlname = "AGENTADDRESS";
                this.AGENTADDRECORD.displaycolumn = "CODE";
                this.AGENTADDRECORD.type = "CUSTOMERADDRESS";
                this.AGENTADDRECORD.id = "";
                this.AGENTADDRECORD.code = "";
                this.AGENTADDRECORD.name = "";
                this.AGENTADDRECORD.parentid = this.Record.hbl_agent_id;
                this.Record.hbl_agent_br_addr = "";
            }

        } else if (_Record.controlname == "AGENTADDRESS") {
            this.Record.hbl_agent_br_id = _Record.id;
            this.Record.hbl_agent_br_no = _Record.code;
            this.Record.hbl_agent_br_addr = this.GetBrAddress(_Record.name).address;
        }
        else if (_Record.controlname == "SEACARRIER") {
            this.Record.hbl_carrier_id = _Record.id;
            this.Record.hbl_carrier_code = _Record.code;
            this.Record.hbl_carrier_name = _Record.name;
        }
        else if (_Record.controlname == "SALESMAN") {
            this.Record.hbl_salesman_id = _Record.id;
            this.Record.hbl_salesman_code = _Record.code;
            this.Record.hbl_salesman_name = _Record.name;
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
                this.IMPADDRECORD.displaycolumn = "CODE";
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
        } else if (_Record.controlname == "COLOADER") {
            this.Record.hbl_coloader_id = _Record.id;
            this.Record.hbl_coloader_code = _Record.code;
            this.Record.hbl_coloader_name = _Record.name;
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
            to_date: this.gs.globalData.hbl_todate,
            showbuysell: this.bbuysellrate ? "Y" : "N",
            hide_ho_entries: this.gs.globalVariables.hide_ho_entries,
            report_folder: this.gs.globalVariables.report_folder,
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
            }, error => {
                this.loading = false;
                this.ErrorMessage = this.gs.getError(error);
            });
    }

    NewRecord() {
        // this.disableBookslno = false;

        this.old_shipper_id = '';
        this.old_billto_id = '';

        this.hbl_no = "";
        this.sExp_ID = "";
        this.sImp_ID = "";
        this.pkid = this.gs.getGuid();
        this.Record = new Hblm();
        this.Record.hbl_pkid = this.pkid;
        this.Record.hbl_no = null;

        this.Record.hbl_exp_id = '';
        this.Record.hbl_exp_code = '';
        this.Record.hbl_exp_name = '';
        this.Record.hbl_exp_br_id = '';
        this.Record.hbl_exp_br_no = '';
        this.Record.hbl_exp_br_addr = '';
        this.Record.hbl_agent_id = '';
        this.Record.hbl_agent_code = '';
        this.Record.hbl_agent_name = '';
        this.Record.hbl_agent_br_id = '';
        this.Record.hbl_agent_br_no = '';
        this.Record.hbl_agent_br_addr = '';
        this.Record.hbl_carrier_id = '';
        this.Record.hbl_carrier_code = '';
        this.Record.hbl_carrier_name = '';
        this.Record.hbl_imp_id = '';
        this.Record.hbl_imp_code = '';
        this.Record.hbl_imp_name = '';
        this.Record.hbl_imp_br_id = '';
        this.Record.hbl_imp_br_no = '';
        this.Record.hbl_imp_br_addr = '';


        this.Record.hbl_billto_id = '';
        this.Record.hbl_billto_code = '';
        this.Record.hbl_billto_name = '';


        if (this.type == "SEA EXPORT")
            this.Record.hbl_nature = 'FCL/FCL';
        else
            this.Record.hbl_nature = '';
        this.Record.hbl_terms = 'EX-WORK';
        this.Record.hbl_coloading = 'NA';
        this.Record.hbl_acd_status = 'NA';
        this.Record.hbl_ddc_status = 'NA';
        this.Record.hbl_switch_bl = 'NA';
        this.Record.hbl_sample = 'NA';
        this.Record.hbl_ddp = 'NA';
        this.Record.hbl_ddu = 'NA';
        this.Record.hbl_ex_works = 'NA';
        this.Record.hbl_profit = 0;
        this.Record.hbl_salesman_id = '';
        this.Record.hbl_salesman_code = '';
        this.Record.hbl_salesman_name = '';

        this.Record.hbl_nomination = '';

        this.Record.hbl_location_id = '';
        this.Record.hbl_location_code = '';
        this.Record.hbl_location_name = '';
        this.Record.hbl_remarks = '';
        this.Record.hbl_direct_bl = 'NA';
        this.Record.hbl_mbl_id = '';
        this.Record.hbl_mbl_no = '';
        this.Record.hbl_mbl_bookslno = '';
        this.Record.hbl_mbl_bookno = '';
        this.Record.hbl_bl_no = '';
        this.Record.hbl_date = '';
        this.Record.hbl_commodity = '';
        this.Record.hbl_coloader_id = '';
        this.Record.hbl_coloader_code = '';
        this.Record.hbl_coloader_name = '';
        this.Record.lock_record = false;
        this.Record.hbl_released_date = '';
        this.InitLov();
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
        this.Record.JobList = _Record.JobList;
        this.sExp_ID = _Record.hbl_exp_id;
        this.sImp_ID = _Record.hbl_imp_id;

        this.InitLov();

        this.BILLTORECORD.id = this.Record.hbl_billto_id;
        this.BILLTORECORD.code = this.Record.hbl_billto_code;
        this.BILLTORECORD.name = this.Record.hbl_billto_name;


        this.EXPRECORD.id = this.Record.hbl_exp_id;
        this.EXPRECORD.code = this.Record.hbl_exp_code;
        this.EXPRECORD.name = this.Record.hbl_exp_name;
        this.EXPADDRECORD.id = this.Record.hbl_exp_br_id;
        this.EXPADDRECORD.code = this.Record.hbl_exp_br_no;
        this.EXPADDRECORD.parentid = this.Record.hbl_exp_id;

        this.AGENTRECORD.id = this.Record.hbl_agent_id;
        this.AGENTRECORD.code = this.Record.hbl_agent_code;
        this.AGENTRECORD.name = this.Record.hbl_agent_name;
        this.AGENTADDRECORD.id = this.Record.hbl_agent_br_id;
        this.AGENTADDRECORD.code = this.Record.hbl_agent_br_no;
        this.AGENTADDRECORD.parentid = this.Record.hbl_agent_id;

        this.SEACARRIERRECORD.id = this.Record.hbl_carrier_id;
        this.SEACARRIERRECORD.code = this.Record.hbl_carrier_code;
        this.SEACARRIERRECORD.name = this.Record.hbl_carrier_name;

        this.IMPRECORD.id = this.Record.hbl_imp_id;
        this.IMPRECORD.code = this.Record.hbl_imp_code;
        this.IMPRECORD.name = this.Record.hbl_imp_name;
        this.IMPADDRECORD.id = this.Record.hbl_imp_br_id;
        this.IMPADDRECORD.code = this.Record.hbl_imp_br_no;
        this.IMPADDRECORD.parentid = this.Record.hbl_imp_id;

        this.LOCATIONRECORD.id = this.Record.hbl_location_id;
        this.LOCATIONRECORD.code = this.Record.hbl_location_code;
        this.LOCATIONRECORD.name = this.Record.hbl_location_name;

        this.SALESMANRECORD.id = this.Record.hbl_salesman_id;
        this.SALESMANRECORD.code = this.Record.hbl_salesman_code;
        this.SALESMANRECORD.name = this.Record.hbl_salesman_name;

        this.COLOADERRECORD.id = this.Record.hbl_coloader_id;
        this.COLOADERRECORD.code = this.Record.hbl_coloader_code;
        this.COLOADERRECORD.name = this.Record.hbl_coloader_name;

        this.old_shipper_id = this.Record.hbl_exp_id;
        this.old_billto_id = this.Record.hbl_billto_id;


        //Fill Duplicate Job
        if (this.mode == "ADD") {
            this.Record.hbl_pkid = this.pkid;
            this.Record.hbl_no = null;
            this.Record.hbl_mbl_id = '';
            this.Record.hbl_mbl_no = '';
            this.Record.hbl_mbl_bookslno = '';
            this.Record.hbl_mbl_bookno = '';
            this.Record.hbl_bl_no = '';
            this.Record.hbl_date = '';
            this.Record.lock_record = false;
            this.Record.JobList = new Array<any>();
            this.JobList(this.Record);
        }

        this.masterexist = this.IsMasterExist();
        this.jobexist = this.IsJobExist();

    }

    // Save Data

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
                this.jobexist = this.IsJobExist();

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
        if (this.Record.hbl_exp_id.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Exporter Cannot Be Blank";
        }
        if (this.Record.hbl_imp_id.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Importer Cannot Be Blank";
        }
        if (this.Record.hbl_agent_id.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Agent Cannot Be Blank";
        }
        if (this.Record.hbl_carrier_id.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Carrier Cannot Be Blank";
        }

        if (this.Record.hbl_exp_id.trim() != this.sExp_ID && this.Record.JobList.length > 0) {
            bret = false;
            sError += "\n\r | Job List not proper, please Click the find button";
        }
        if (this.Record.hbl_imp_id.trim() != this.sImp_ID && this.Record.JobList.length > 0) {
            bret = false;
            sError += "\n\r | Job List not proper, please Click the find button";
        }

        if (bret === false)
            this.ErrorMessage = sError;
        return bret;
    }

    CheckCrLimit(bCallSave: boolean = false) {

        if (this.Record.hbl_exp_id == "") {
            alert('Shipper cannot be blank');
            return;
        }

        this.loading = true;
        let SearchData = {
            type : 'SI ' + this.type,
            searchfrom: 'SI',
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            customerid: this.Record.hbl_exp_id,
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
            REC.hbl_date = this.Record.hbl_date;
            REC.hbl_exp_name = this.Record.hbl_exp_name;
            REC.hbl_imp_name = this.Record.hbl_imp_name;
            //REC.job_pol_name = this.Record.job_pol_name;
            //REC.job_pod_name = this.Record.job_pod_name;
            REC.hbl_agent_name = this.Record.hbl_agent_name;
            //REC.job_commodity_name = this.Record.job_commodity_name;
            //REC.job_type = this.Record.job_type;
            //REC.job_nomination = this.Record.job_nomination;
            //REC.job_terms = this.Record.job_terms;
            //REC.job_status = this.Record.job_status;
        }
    }


    OnBlur(field: string) {
        switch (field) {
            case 'hbl_remarks':
                {
                    this.Record.hbl_remarks = this.Record.hbl_remarks.toUpperCase();
                    break;
                }
            case 'hbl_profit':
                {
                    this.Record.hbl_profit = this.gs.roundNumber(this.Record.hbl_profit, 2);
                    break;
                }
            case 'hbl_commodity':
                {
                    this.Record.hbl_commodity = this.Record.hbl_commodity.toUpperCase();
                    break;
                }
            case 'searchstring':
                {
                    this.searchstring = this.searchstring.toUpperCase();
                    break;
                }
            case 'hbl_mbl_bookslno':
                {
                    this.SearchRecord('hbl_mbl_bookslno');
                    break;
                }

        }
    }
    SearchRecord(controlname: string) {
        this.ErrorMessage = '';

        if (controlname == "hbl_mbl_bookslno") {
            this.Record.hbl_mbl_id = '';
            this.Record.hbl_mbl_no = '';
            this.Record.hbl_mbl_bookno = '';
            if (this.Record.hbl_mbl_bookslno.trim().length <= 0)
                return;
        } else if (controlname == 'hbl_no') {
            if (this.hbl_no.trim().length <= 0) {
                this.ErrorMessage = 'Please Enter a  SI Number and Continue......';
                return;
            }
        }

        this.loading = true;
        let SearchData = {
            rowtype: this.type,
            table: 'linerbkm',
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            book_slno: '',
            hbl_no: ''
        };

        if (controlname == 'hbl_mbl_bookslno') {
            SearchData.rowtype = this.type;
            SearchData.table = 'linerbkm';
            SearchData.company_code = this.gs.globalVariables.comp_code;
            SearchData.branch_code = this.gs.globalVariables.branch_code;
            SearchData.year_code = this.gs.globalVariables.year_code;
            SearchData.book_slno = this.Record.hbl_mbl_bookslno;
        } else if (controlname == 'hbl_no') {
            SearchData.table = 'hblm';
            SearchData.company_code = this.gs.globalVariables.comp_code;
            SearchData.branch_code = this.gs.globalVariables.branch_code;
            SearchData.year_code = this.gs.globalVariables.year_code;
            SearchData.hbl_no = this.hbl_no;
            if (this.type == "AIR EXPORT")
                SearchData.rowtype = "HBL-AE";
            else if (this.type == "SEA EXPORT")
                SearchData.rowtype = "HBL-SE";
            else
                SearchData.rowtype = "";
        }

        this.gs.SearchRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.ErrorMessage = '';
                if (controlname == 'hbl_mbl_bookslno') {
                    this.Record.hbl_mbl_id = '';
                    if (response.linerbkm.length > 0) {
                        this.Record.hbl_mbl_id = response.linerbkm[0].book_pkid;
                        this.Record.hbl_mbl_bookno = response.linerbkm[0].book_no;
                        this.Record.hbl_mbl_no = response.linerbkm[0].book_mblno;
                    }
                    else {
                        this.ErrorMessage = 'Invalid Booking';
                    }
                } else if (controlname == 'hbl_no') {
                    if (response.hblm.length > 0) {
                        this.GetRecord(response.hblm[0].hbl_pkid);
                    }
                    else {
                        this.ErrorMessage = 'Invalid SI#';
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


    JobList(_Record: Hblm) {

        this.ErrorMessage = '';
        this.InfoMessage = '';
        if (this.Record.hbl_exp_id.trim().length <= 0) {

            this.ErrorMessage += " | Exporter Cannot Be Blank";
        }
        if (this.Record.hbl_imp_id.trim().length <= 0) {

            this.ErrorMessage += "\n\r | Importer Cannot Be Blank";
        }

        if (this.ErrorMessage)
            return;

        this.sExp_ID = _Record.hbl_exp_id;
        this.sImp_ID = _Record.hbl_imp_id;

        this.loading = true;
        let SearchData = {
            rowtype: this.type,
            exporterid: this.sExp_ID,
            importerid: this.sImp_ID,
            hblid: _Record.hbl_pkid,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.JobList(SearchData)
            .subscribe(response => {
                this.loading = false;
                _Record.JobList = response.list;

            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    IsMasterExist() {
        let bret: boolean = false;
        if (this.Record.hbl_mbl_id != null)
            if (this.Record.hbl_mbl_id.length > 0)
                bret = true;
        return bret;
    }
    IsJobExist() {
        let bret: boolean = false;
        var REC = this.Record.JobList.find(rec => rec.job_selected == true);
        if (REC != null)
            bret = true;
        return bret;
    }
    ShowBL() {
        this.currentPage = 'BLPAGE';
    }

    pageChanged() {
        this.currentPage = 'ROOTPAGE';
    }
    open(content: any) {
        this.modal = this.modalService.open(content);
    }
    ShowRate(buysellrate: any) {
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.open(buysellrate);
    }
    ShowHistory(history: any) {
        this.ErrorMessage = '';
        this.open(history);
    }

    AmsFiling(amsedi: any) {
        this.ErrorMessage = '';
        this.open(amsedi);
    }

    ModifiedRecords(params: any) {
        //shiptracking call back
    }


    ISFReport(mailsent: any) {

        this.loading = true;
        let SearchData = {
            type: '',
            pkid: '',
            report_folder: '',
            comp_code: '',
            branch_code: ''
        };

        SearchData.type = this.type;
        SearchData.pkid = this.pkid;
        SearchData.report_folder = this.gs.globalVariables.report_folder;
        SearchData.comp_code = this.gs.globalVariables.comp_code;
        SearchData.branch_code = this.gs.globalVariables.branch_code;

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.ISFReport(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.To_ids = response.mailto_ids;
                this.mSubject = response.subject;
                this.mMsg = response.message;
                this.AttachList = new Array<any>();
                this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname, filesize: response.filesize });
                this.open(mailsent);

                // this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
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
