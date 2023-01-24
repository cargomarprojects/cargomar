import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Mark_Qtnm, Mark_Qtnd, SaveTermsData } from '../models/quotation';
import { QuotationService } from '../services/quotation.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Param } from '../../master/models/param';
import { GenRemarks } from '../../shared/models/genremarks';

@Component({
    selector: 'app-quotation',
    templateUrl: './quotation.component.html',
    providers: [QuotationService]
})
export class QuotationComponent {

    // Local Variables 
    title = 'Quotation';

    @Input() iisModalWindow: string = 'N';
    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() clientType: string = '';

    InitCompleted: boolean = false;
    menu_record: any;

    selectedRowIndex = 0;

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

    bChanged: boolean;
    total_amt: number = 0;
    total_famt: number = 0;
    ErrorMessage = "";
    InfoMessage = "";

    mode = '';
    pkid = '';
    showclosebutton: boolean = true;
    QtnCategoryList: Param[] = [];
    // Array For Displaying List
    RecordList: Mark_Qtnm[] = [];
    // Single Record for add/edit/view details
    Record: Mark_Qtnm = new Mark_Qtnm;
    TermList: Mark_Qtnm[] = [];
    FullTermList: Mark_Qtnm[] = [];
    Recorddet: Mark_Qtnd = new Mark_Qtnd;
    CUSTRECORD: SearchTable = new SearchTable();
    CUSTADDRECORD: SearchTable = new SearchTable();

    constructor(
        private modalService: NgbModal,
        private mainService: QuotationService,
        private route: ActivatedRoute,
        public gs: GlobalService
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
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
        }
        this.LoadCombo();
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    InitLov() {

        this.CUSTRECORD = new SearchTable();
        this.CUSTRECORD.controlname = "QUOTE-TO";
        this.CUSTRECORD.displaycolumn = "CODE";
        this.CUSTRECORD.type = "CUSTOMER";
        this.CUSTRECORD.where = "";
        this.CUSTRECORD.id = "";
        this.CUSTRECORD.code = "";
        this.CUSTRECORD.name = "";

        this.CUSTADDRECORD = new SearchTable();
        this.CUSTADDRECORD.controlname = "QUOTE-TO-ADDR";
        this.CUSTADDRECORD.displaycolumn = "CODE";
        this.CUSTADDRECORD.type = "CUSTOMERADDRESS";
        this.CUSTADDRECORD.id = "";
        this.CUSTADDRECORD.code = "";
        this.CUSTADDRECORD.name = "";
        this.CUSTADDRECORD.parentid = "";
    }

    LoadCombo() {
        this.loading = true;
        let SearchData = {
            type: 'type',
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code
        };
        SearchData.comp_code = this.gs.globalVariables.comp_code;
        SearchData.branch_code = this.gs.globalVariables.branch_code;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.LoadDefault(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.QtnCategoryList = response.qtncategorylist;
                this.FullTermList = response.termlist;
                this.List("NEW");
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }


    LovSelected(_Record: any) {

        // if (_Record.controlname == "SHIPPER") {

        //     if (this.Record.bl_shipper_id != _Record.id) {
        //       this.Record.bl_shipper_id = _Record.id;
        //       this.Record.bl_shipper_code = _Record.code;
        //       this.Record.bl_shipper_name = _Record.name;
        //       this.Record.bl_shipper_add1 = '';
        //       this.Record.bl_shipper_add2 = '';
        //       this.Record.bl_shipper_add3 = '';
        //       this.Record.bl_shipper_add4 = '';

        //       this.SHPRADDRECORD = new SearchTable();
        //       this.SHPRADDRECORD.controlname = "SHIPPERADDRESS";
        //       this.SHPRADDRECORD.displaycolumn = "CODE";
        //       this.SHPRADDRECORD.type = "CUSTOMERADDRESS";
        //       this.SHPRADDRECORD.id = "";
        //       this.SHPRADDRECORD.code = "";
        //       this.SHPRADDRECORD.name = "";
        //       this.SHPRADDRECORD.parentid = this.Record.bl_shipper_id;
        //     }
        //   }
        //   else if (_Record.controlname == "SHIPPERADDRESS") {

        //     this.Record.bl_shipper_br_id = _Record.id;
        //     this.SearchRecord("SHIPPERADDRESS", this.Record.bl_shipper_br_id, this.Record.bl_shipper_id);
        //   }

        if (_Record.controlname == "QUOTE-TO") {
            if (this.Record.qtnm_to_id != _Record.id) {
                this.Record.qtnm_to_id = _Record.id;
                this.Record.qtnm_to_code = _Record.code;
                this.Record.qtnm_to_name = _Record.name;
                this.Record.qtnm_to_addr1 = '';
                this.Record.qtnm_to_addr2 = '';
                this.Record.qtnm_to_addr3 = '';
                this.Record.qtnm_to_addr4 = '';

                this.CUSTADDRECORD = new SearchTable();
                this.CUSTADDRECORD.controlname = "QUOTE-TO-ADDR";
                this.CUSTADDRECORD.displaycolumn = "CODE";
                this.CUSTADDRECORD.type = "CUSTOMERADDRESS";
                this.CUSTADDRECORD.id = "";
                this.CUSTADDRECORD.code = "";
                this.CUSTADDRECORD.name = "";
                this.CUSTADDRECORD.parentid = this.Record.qtnm_to_id;
            }
        }
        if (_Record.controlname == "QUOTE-TO-ADDR") {
            this.Record.qtnm_to_br_id = _Record.id;
            this.SearchRecord("CUSTOMERADDRESS", this.Record.qtnm_to_br_id, this.Record.qtnm_to_id);
        }

        if (_Record.controlname == "SALESMAN") {
            this.Record.qtnm_salesman_id = _Record.id;
            this.Record.qtnm_salesman_name = _Record.name;
        }
        if (_Record.controlname == "CURR") {
            this.Record.qtnm_curr_code = _Record.code;
            this.Record.qtnm_exrate = _Record.rate;
            this.FindListTotal();
        }
        if (_Record.controlname == "POR") {
            this.Record.qtnm_por_id = _Record.id;
            this.Record.qtnm_por_code = _Record.code;
            this.Record.qtnm_por_name = _Record.name;
        }
        if (_Record.controlname == "POL") {
            this.Record.qtnm_pol_id = _Record.id;
            this.Record.qtnm_pol_code = _Record.code;
            this.Record.qtnm_pol_name = _Record.name;
        }
        if (_Record.controlname == "POD") {
            this.Record.qtnm_pod_id = _Record.id;
            this.Record.qtnm_pod_code = _Record.code;
            this.Record.qtnm_pod_name = _Record.name;
        }
        if (_Record.controlname == "POFD") {
            this.Record.qtnm_pofd_id = _Record.id;
            this.Record.qtnm_pofd_code = _Record.code;
            this.Record.qtnm_pofd_name = _Record.name;
        }
        if (_Record.controlname == "ACCTM") {
            this.Recorddet.qtnd_acc_id = _Record.id;
            this.Recorddet.qtnd_acc_code = _Record.code;
            this.Recorddet.qtnd_acc_name = _Record.name;
        }
        if (_Record.controlname == "CURRENCY") {
            this.Recorddet.qtnd_curr_id = _Record.id;
            this.Recorddet.qtnd_curr_code = _Record.code;
            this.Recorddet.qtnd_exrate = _Record.rate;
            this.bChanged = true;
            this.OnBlur('qtnd_exrate');
        }
        if (_Record.controlname == "CNTRTYPE") {
            this.Recorddet.qtnd_cntr_type_id = _Record.id;
            this.Recorddet.qtnd_cntr_type_code = _Record.code;
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
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code
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
                    alert(this.ErrorMessage);
                });
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }

    NewRecord() {

        this.pkid = this.gs.getGuid();
        this.Record = new Mark_Qtnm();
        this.Record.qtnm_pkid = this.pkid;
        this.Record.qtnm_cfno = 0;
        this.Record.qtnm_no = '';
        this.Record.qtnm_to_id = '';
        this.Record.qtnm_to_code = '';
        this.Record.qtnm_to_br_id = '';
        this.Record.qtnm_to_br_no = '';
        this.Record.qtnm_to_name = '';
        this.Record.qtnm_to_addr1 = '';
        this.Record.qtnm_to_addr2 = '';
        this.Record.qtnm_to_addr3 = '';
        this.Record.qtnm_to_addr4 = '';
        this.Record.qtnm_date = '';
        this.Record.qtnm_quot_by = '';
        this.Record.qtnm_valid_date = '';
        this.Record.qtnm_salesman_id = '';
        this.Record.qtnm_salesman_name = '';
        this.Record.qtnm_move_type = '';
        this.Record.qtnm_por_id = '';
        this.Record.qtnm_por_code = '';
        this.Record.qtnm_por_name = '';
        this.Record.qtnm_pol_id = '';
        this.Record.qtnm_pol_code = '';
        this.Record.qtnm_pol_name = '';
        this.Record.qtnm_pod_id = '';
        this.Record.qtnm_pod_code = '';
        this.Record.qtnm_pod_name = '';
        this.Record.qtnm_pld_name = '';
        this.Record.qtnm_pofd_id = '';
        this.Record.qtnm_pofd_code = '';
        this.Record.qtnm_pofd_name = '';
        this.Record.qtnm_commodity = '';
        this.Record.qtnm_package = '';
        this.Record.qtnm_type = 'SEA EXPORT';
        this.Record.qtnm_kgs = 0;
        this.Record.qtnm_lbs = 0;
        this.Record.qtnm_cbm = 0;
        this.Record.qtnm_cft = 0;
        this.Record.qtnm_tot_famt = 0;
        this.Record.qtnm_tot_amt = 0;
        this.Record.qtnm_subjects = '';
        this.Record.qtnm_remarks = '';
        this.Record.qtnm_office_use = '';
        this.Record.rec_files_attached = '';
        this.Record.qtnm_transtime = '';
        this.Record.qtnm_routing = '';
        this.Record.qtnm_curr_code = '';
        this.Record.qtnm_exrate = 1;
        this.Record.rec_mode = this.mode;
        this.total_amt = 0;
        this.total_famt = 0;
        this.InitLov();
        this.Record.qtnm_detList = new Array<Mark_Qtnd>();
        this.Record.qtnm_remList = new Array<GenRemarks>();
        this.TermList = new Array<Mark_Qtnm>();
        this.NewDetRecord();
        this.NewRemarkRecord();
        this.GetTermsAndConditions();
    }

    NewDetRecord() {
        this.Recorddet = new Mark_Qtnd();
        this.Recorddet.qtnd_pkid = this.gs.getGuid();
        this.Recorddet.qtnd_parent_id = this.pkid;
        this.Recorddet.qtnd_category = '';
        this.Recorddet.qtnd_category_id = '';
        this.Recorddet.qtnd_acc_id = '';
        this.Recorddet.qtnd_acc_code = '';
        this.Recorddet.qtnd_acc_name = '';
        this.Recorddet.qtnd_type = 'INVOICE';
        this.Recorddet.qtnd_cntr_type_id = '';
        this.Recorddet.qtnd_cntr_type_code = '';
        this.Recorddet.qtnd_curr_id = '';
        this.Recorddet.qtnd_curr_code = '';
        this.Recorddet.qtnd_qty = 0;
        this.Recorddet.qtnd_rate = 0;
        this.Recorddet.qtnd_ftotal = 0;
        this.Recorddet.qtnd_total = 0;
        this.Recorddet.qtnd_exrate = 1;
        this.Recorddet.qtnd_remarks = '';
        this.Initdefault();
    }
    Initdefault() {
        if (this.QtnCategoryList != null) {
            var REC = this.QtnCategoryList.find(rec => rec.param_name == 'CLEARING');
            if (REC != null) {
                this.Recorddet.qtnd_category_id = REC.param_pkid;
            }
        }
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
                this.NewDetRecord();
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    LoadData(_Record: Mark_Qtnm) {
        this.Record = _Record;
        this.Record.rec_mode = this.mode;
        if (this.gs.isBlank(this.Record.qtnm_detList))
            this.Record.qtnm_detList = new Array<Mark_Qtnd>();
        if (this.gs.isBlank(this.Record.qtnm_remList))
            this.Record.qtnm_remList = new Array<GenRemarks>();
        if (this.Record.qtnm_remList.length == 0)
            this.NewRemarkRecord();
        this.FindListTotal();
        this.GetTermsAndConditions();

        this.InitLov();
        this.CUSTRECORD.id = this.Record.qtnm_to_id;
        this.CUSTRECORD.code = this.Record.qtnm_to_code;
        this.CUSTADDRECORD.id = this.Record.qtnm_to_br_id;
        this.CUSTADDRECORD.code = this.Record.qtnm_to_br_no;
        this.CUSTADDRECORD.parentid = this.Record.qtnm_to_id;
    }


    // Save Data
    Save() {
        if (!this.allvalid()) {
            alert(this.ErrorMessage);
            return;
        }
        this.FindListTotal();
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.Record._globalvariables = this.gs.globalVariables;
        this.Record.qtnm_tot_amt = this.total_amt;
        this.Record.qtnm_tot_famt = this.total_famt;
        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                if (this.mode == 'ADD') {
                    this.Record.qtnm_no = response.qtnslno;
                    this.InfoMessage = "New Quotation " + this.Record.qtnm_no + " Generated Successfully";
                } else
                    this.InfoMessage = "Save Complete";
                this.mode = 'EDIT';
                this.Record.rec_mode = this.mode;
                alert(this.InfoMessage);
                this.RefreshList();
                this.Record.qtnm_detList = response.list;
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

        // if (this.gs.isBlank(this.Record.cont_name)) {
        //   bret = false;
        //   sError = " | Name Cannot be Blank";
        // }

        // if (this.gs.isBlank(this.Record.cont_type_2)) {
        //   bret = false;
        //   sError += " | Type Cannot be Blank";
        // }

        // if (bret) {
        //     this.Record.cont_name = this.Record.cont_name.toUpperCase().trim();
        // }

        // if (bret === false)
        //   this.ErrorMessage = sError;
        return bret;
    }

    SearchRecord(controlname: string, controlid: string, controlparentid: string) {
        if (controlid.trim().length <= 0)
            return;

        this.loading = true;
        let SearchData = {
            table: 'customeraddress',
            rowtype: this.type,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            add_pkid: '',
            add_parent_id: ''
        };

        SearchData.table = 'customeraddress';
        SearchData.company_code = this.gs.globalVariables.comp_code;
        SearchData.branch_code = this.gs.globalVariables.branch_code;
        SearchData.year_code = this.gs.globalVariables.year_code;
        SearchData.add_pkid = controlid;
        SearchData.add_parent_id = controlparentid;

        this.ErrorMessage = '';
        this.gs.SearchRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.ErrorMessage = '';
                if (controlname == 'CUSTOMERADDRESS') {
                    this.Record.qtnm_to_addr1 = '';
                    this.Record.qtnm_to_addr2 = '';
                    this.Record.qtnm_to_addr3 = '';
                    this.Record.qtnm_to_addr4 = '';
                }
                if (response.customeraddress.length > 0) {

                    if (controlname == 'CUSTOMERADDRESS') {
                        this.Record.qtnm_to_addr1 = response.customeraddress[0].add_line1;
                        this.Record.qtnm_to_addr2 = response.customeraddress[0].add_line2;
                        this.Record.qtnm_to_addr3 = response.customeraddress[0].add_line3;
                        this.Record.qtnm_to_addr4 = response.customeraddress[0].add_line4;
                    }
                }
                else {
                    this.ErrorMessage = 'Invalid Address';
                }
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
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
        var REC = this.RecordList.find(rec => rec.qtnm_pkid == this.Record.qtnm_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.qtnm_no = this.Record.qtnm_no;
            REC.qtnm_date = this.Record.qtnm_date;
            REC.qtnm_to_name = this.Record.qtnm_to_name;
            REC.qtnm_quot_by = this.Record.qtnm_quot_by;
            REC.qtnm_pol_name = this.Record.qtnm_pol_name;
            REC.qtnm_pod_name = this.Record.qtnm_pod_name;
            REC.qtnm_pld_name = this.Record.qtnm_pld_name;
            REC.qtnm_move_type = this.Record.qtnm_move_type;
            REC.qtnm_kgs = this.Record.qtnm_kgs;
            REC.qtnm_cbm = this.Record.qtnm_cbm;
        }
    }
    OnChange(field: string) {
        this.bChanged = true;
        if (field == 'qtnm_type')
            this.GetTermsAndConditions();
        if (field == 'qtnm_exrate')
            this.FindListTotal();
    }

    OnBlur(field: string, _rec: GenRemarks = null) {

        let amt: number;
        switch (field) {
            case 'qtnm_to_name': {
                this.Record.qtnm_to_name = this.Record.qtnm_to_name.toUpperCase();
                break;
            }
            case 'qtnm_to_addr1': {
                this.Record.qtnm_to_addr1 = this.Record.qtnm_to_addr1.toUpperCase();
                break;
            }
            case 'qtnm_to_addr2': {
                this.Record.qtnm_to_addr2 = this.Record.qtnm_to_addr2.toUpperCase();
                break;
            }
            case 'qtnm_to_addr3': {
                this.Record.qtnm_to_addr3 = this.Record.qtnm_to_addr3.toUpperCase();
                break;
            }
            case 'qtnm_to_addr4': {
                this.Record.qtnm_to_addr4 = this.Record.qtnm_to_addr4.toUpperCase();
                break;
            }
            case 'qtnm_quot_by': {
                this.Record.qtnm_quot_by = this.Record.qtnm_quot_by.toUpperCase();
                break;
            }
            case 'qtnm_move_type': {
                this.Record.qtnm_move_type = this.Record.qtnm_move_type.toUpperCase();
                break;
            }
            case 'qtnm_commodity': {
                this.Record.qtnm_commodity = this.Record.qtnm_commodity.toUpperCase();
                break;
            }
            case 'qtnm_por_name': {
                this.Record.qtnm_por_name = this.Record.qtnm_por_name.toUpperCase();
                break;
            }
            case 'qtnm_pol_name': {
                this.Record.qtnm_pol_name = this.Record.qtnm_pol_name.toUpperCase();
                break;
            }
            case 'qtnm_pod_name': {
                this.Record.qtnm_pod_name = this.Record.qtnm_pod_name.toUpperCase();
                break;
            }
            case 'qtnm_pld_name': {
                this.Record.qtnm_pld_name = this.Record.qtnm_pld_name.toUpperCase();
                break;
            }
            case 'qtnm_pofd_name': {
                this.Record.qtnm_pofd_name = this.Record.qtnm_pofd_name.toUpperCase();
                break;
            }
            case 'qtnm_transtime': {
                this.Record.qtnm_transtime = this.Record.qtnm_transtime.toUpperCase();
                break;
            }
            case 'qtnm_routing': {
                this.Record.qtnm_routing = this.Record.qtnm_routing.toUpperCase();
                break;
            }

            case 'qtnm_package': {
                this.Record.qtnm_package = this.Record.qtnm_package.toUpperCase();
                break;
            }
            case 'qtnm_kgs': {
                this.Record.qtnm_kgs = this.gs.roundNumber(this.Record.qtnm_kgs, 3);
                break;
            }
            case 'qtnm_cbm': {
                this.Record.qtnm_cbm = this.gs.roundNumber(this.Record.qtnm_cbm, 3);
                break;
            }
            case 'qtnm_exrate': {
                this.Record.qtnm_exrate = this.gs.roundNumber(this.Record.qtnm_exrate, 3);
                break;
            }
            case 'qtnd_qty': {
                this.Recorddet.qtnd_qty = this.gs.roundNumber(this.Recorddet.qtnd_qty, 3);
                this.Findtotal();
                break;
            }
            case 'qtnd_rate': {
                this.Recorddet.qtnd_rate = this.gs.roundNumber(this.Recorddet.qtnd_rate, 2);
                this.Findtotal();
                break;
            }
            case 'qtnd_exrate': {
                this.Recorddet.qtnd_exrate = this.gs.roundNumber(this.Recorddet.qtnd_exrate, 2);
                this.Findtotal();
                break;
            }
            case 'gr_remarks': {
                if (_rec != null)
                    _rec.gr_remarks = _rec.gr_remarks.toUpperCase();
                break;
            }
        }

        if (field == 'qtnd_remarks') {
            this.Recorddet.qtnd_remarks = this.Recorddet.qtnd_remarks.toUpperCase();
        }
        if (field == 'qtnd_acc_name') {
            this.Recorddet.qtnd_acc_name = this.Recorddet.qtnd_acc_name.toUpperCase();
        }
    }
    OnFocus(field: string) {
        this.bChanged = false;
    }


    AddRow(_type: string) {
        if (_type == "REMARK") {
            this.NewRemarkRecord();
        } else {
            this.NewTermRecord();
        }
    }

    RemoveRow(_id: string, _type: string) {

        if (_type == "REMARK") {
            this.Record.qtnm_remList.splice(this.Record.qtnm_remList.findIndex(rec => rec.gr_uid == _id), 1);
            if (this.Record.qtnm_remList.length == 0)
                this.NewRemarkRecord();
        } else {
            this.TermList.splice(this.TermList.findIndex(rec => rec.qtnm_pkid == _id), 1);
            if (this.TermList.length == 0)
                this.NewTermRecord();
        }
    }

    NewRemarkRecord() {
        let _Rec: GenRemarks = new GenRemarks;
        _Rec.gr_uid = this.gs.getGuid();
        _Rec.gr_pkid = this.pkid;
        _Rec.gr_type = 'QUOTATION';
        _Rec.gr_subtype = this.Record.qtnm_type;
        _Rec.gr_remarks = '';
        this.Record.qtnm_remList.push(_Rec);
    }
    NewTermRecord() {
        let _Rec: Mark_Qtnm = new Mark_Qtnm;
        _Rec.qtnm_pkid = this.gs.getGuid();
        _Rec.qtnm_remarks = '';
        this.TermList.push(_Rec);
    }
    Close() {
        this.gs.ClosePage('home');
    }

    open(content: any) {
        this.modal = this.modalService.open(content);
    }

    RemoveList(event: any) {
        if (event.selected) {
            this.Record.qtnm_detList.splice(this.Record.qtnm_detList.findIndex(rec => rec.qtnd_pkid == event.id), 1);
        }
    }

    FindListTotal() {
        this.total_amt = 0;
        this.Record.qtnm_detList.forEach(rec => {
            this.total_amt += rec.qtnd_total;
        });
        this.total_amt = this.gs.roundNumber(this.total_amt, 2);

        if (this.Record.qtnm_exrate <= 0)
            this.Record.qtnm_exrate = 1;
        this.total_famt = this.total_amt / this.Record.qtnm_exrate;
        this.total_famt = this.gs.roundNumber(this.total_famt, 2);
    }

    AddRecord() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';

        if (this.Recorddet.qtnd_acc_id == '') {
            bret = false;
            sError += " | Invalid A/c Code";
        }

        if (this.Recorddet.qtnd_curr_id == '') {
            bret = false;
            sError += " | Invalid Currency";
        }


        if (this.Recorddet.qtnd_qty <= 0) {
            bret = false;
            sError += " | Invalid Qty";
        }

        if (this.Recorddet.qtnd_rate <= 0) {
            bret = false;
            sError += " | Invalid Rate";
        }

        if (this.Recorddet.qtnd_exrate <= 0) {
            bret = false;
            sError += " | Invalid Ex.Rate";
        }

        if (this.Recorddet.qtnd_total <= 0) {
            bret = false;
            sError += " | Invalid Total Amount";
        }

        if (bret === false) {
            alert(sError);
            return;
        }

        if (this.QtnCategoryList != null) {
            var REC = this.QtnCategoryList.find(rec => rec.param_pkid == this.Recorddet.qtnd_category_id);
            if (REC != null) {
                this.Recorddet.qtnd_category = REC.param_name;
            }
        }
        this.Record.qtnm_detList.push(this.Recorddet);
        this.FindListTotal()
        this.NewDetRecord();
    }
    Findtotal() {
        let amt: number;
        let inramt: number;

        amt = this.Recorddet.qtnd_qty * this.Recorddet.qtnd_rate;
        amt = this.gs.roundNumber(amt, 2);

        inramt = amt * this.Recorddet.qtnd_exrate;
        inramt = this.gs.roundNumber(inramt, 2);

        this.Recorddet.qtnd_ftotal = amt;
        this.Recorddet.qtnd_total = inramt;
    }


    GetTermsAndConditions() {
        if (this.gs.isBlank(this.Record.qtnm_type))
            return;

        this.TermList = new Array<Mark_Qtnm>();
        for (let rec of this.FullTermList.filter(rec => rec.qtnm_type == this.Record.qtnm_type)) {
            this.TermList.push(rec);
        }

        if (this.gs.isBlank(this.TermList))
            this.TermList = new Array<Mark_Qtnm>();
        if (this.TermList.length == 0)
            this.NewTermRecord();

        // this.loading = true;
        // let SearchData = {
        //     type: this.Record.qtnm_type,
        //     company_code: this.gs.globalVariables.comp_code,
        //     branch_code: this.gs.globalVariables.branch_code
        // };
        // this.ErrorMessage = '';
        // this.InfoMessage = '';
        // this.mainService.GetTerms(SearchData)
        //     .subscribe(response => {
        //         this.loading = false;
        //         this.TermList = response.list;
        //         if (this.gs.isBlank(this.TermList))
        //             this.TermList = new Array<Mark_Qtnm>();
        //         if (this.TermList.length == 0)
        //             this.NewTermRecord();
        //     },
        //         error => {
        //             this.loading = false;
        //             this.ErrorMessage = this.gs.getError(error);
        //             alert(this.ErrorMessage);
        //         });
    }

    SaveTerms() {

        let _saveData: SaveTermsData = new SaveTermsData;
        _saveData.qtnm_termList = this.TermList;
        _saveData.type = this.Record.qtnm_type;
        _saveData._globalvariables = this.gs.globalVariables;
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.SaveTerms(_saveData)
            .subscribe(response => {
                this.loading = false;
                this.InfoMessage = "Save Complete";
                alert(this.InfoMessage);
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });

    }

    PrintQuotation() {
        this.loading = true;
        let SearchData = {
            pkid: this.Record.qtnm_pkid,
            report_folder: this.gs.globalVariables.report_folder
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.PrintQuotation(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

}
