import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Mark_Qtnm, Mark_Qtnd } from '../models/quotation';
import { QuotationService } from '../services/quotation.service';
import { SearchTable } from '../../shared/models/searchtable';
import { qtnm } from '../../shared/models/qtn';


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
    ErrorMessage = "";
    InfoMessage = "";

    mode = '';
    pkid = '';
    showclosebutton: boolean = true;

    // Array For Displaying List
    RecordList: Mark_Qtnm[] = [];
    // Single Record for add/edit/view details
    Record: Mark_Qtnm = new Mark_Qtnm;
    RecordRemList: Mark_Qtnm[] = [];
    RecordTermList: Mark_Qtnm[] = [];

    CATEGORYRECORD: SearchTable = new SearchTable();
    SALESMANRECORD: SearchTable = new SearchTable();
    CSDRECORD: SearchTable = new SearchTable();
    CNTRYRECORD: SearchTable = new SearchTable();

    Recorddet: Mark_Qtnd = new Mark_Qtnd;
    // ACCRECORD: SearchTable = new SearchTable();
    // CURRECORD: SearchTable = new SearchTable();
    // CNTRTYPERECORD: SearchTable = new SearchTable();
    // REBTCURRECORD: SearchTable = new SearchTable();

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
        this.List('NEW');
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
        // this.mainService.LoadDefault(SearchData)
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

        if (_Record.controlname == "QUOTE-TO") {
            this.Record.qtnm_to_id = _Record.id;
            this.Record.qtnm_to_code = _Record.code;
            this.Record.qtnm_to_name = _Record.name;
        }

        if (_Record.controlname == "SALESMAN") {
            this.Record.qtnm_salesman_id = _Record.id;
            this.Record.qtnm_salesman_name = _Record.name;
        }
        if (_Record.controlname == "CURR") {
            this.Record.qtnm_curr_code = _Record.code;
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
        // if (_Record.controlname == "CSD") {
        //     this.Record.cont_csd_id = _Record.id;
        //     this.Record.cont_csd_name = _Record.name;
        // }

        // if (_Record.controlname == "COUNTRY") {
        //     this.Record.cont_country_id = _Record.id;
        //     this.Record.cont_country_code = _Record.code;
        //     this.Record.cont_country = _Record.name;
        // }

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
            this.OnBlur('inv_exrate');
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
        this.Record.qtnm_plfd_name = '';
        this.Record.qtnm_commodity = '';
        this.Record.qtnm_package = '';
        this.Record.qtnm_type = 'SEA EXPORT';
        this.Record.qtnm_kgs = 0;
        this.Record.qtnm_lbs = 0;
        this.Record.qtnm_cbm = 0;
        this.Record.qtnm_cft = 0;
        this.Record.qtnm_tot_amt = 0;
        this.Record.qtnm_subjects = '';
        this.Record.qtnm_remarks = '';
        this.Record.qtnm_office_use = '';
        this.Record.rec_files_attached = '';
        this.Record.qtnm_transtime = '';
        this.Record.qtnm_routing = '';
        this.Record.qtnm_curr_code = '';
        // this.Record.rec_mode = this.mode;
        this.total_amt = 0;

        // this.InitLov();
        this.Record.qtnm_detList = new Array<Mark_Qtnd>();
        this.RecordRemList = new Array<Mark_Qtnm>();
        this.RecordTermList = new Array<Mark_Qtnm>();
        this.NewDetRecord();
        this.NewRemarkRecord();
        this.NewTermRecord();
    }

    NewDetRecord() {
        this.Recorddet = new Mark_Qtnd();

        this.Recorddet.qtnd_pkid = this.gs.getGuid();

        this.Recorddet.qtnd_parent_id = this.pkid;
        this.Recorddet.qtnd_category = 'CLEARING';
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

        this.Recorddet.qtnd_exrate = 1;

        this.Recorddet.qtnd_remarks = '';

        this.Recorddet.rec_mode = "ADD";

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
                    alert(this.ErrorMessage);
                });
    }

    LoadData(_Record: Mark_Qtnm) {
        this.Record = _Record;


        if (this.gs.isBlank(this.Record.qtnm_detList))
            this.Record.qtnm_detList = new Array<Mark_Qtnd>();
        if (this.Record.qtnm_detList.length == 0)
            this.NewDetRecord();

        // this.Record.rec_mode = "EDIT";

        // this.InitLov();

        // this.CATEGORYRECORD.id = this.Record.cont_type_id.toString();
        // this.CATEGORYRECORD.name = this.Record.cont_type_name;

        // this.SALESMANRECORD.id = this.Record.cont_saleman_id.toString();
        // this.SALESMANRECORD.name = this.Record.cont_saleman_name;

        // this.CSDRECORD.id = this.Record.cont_csd_id.toString();
        // this.CSDRECORD.name = this.Record.cont_csd_name;

        // this.CNTRYRECORD.id = this.Record.cont_country_id;
        // this.CNTRYRECORD.code = this.Record.cont_country_code;
        // this.CNTRYRECORD.name = this.Record.cont_country;

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
                this.mode = 'EDIT';
                // this.Record.rec_mode = this.mode;
                this.InfoMessage = "Save Complete";
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
        // var REC = this.RecordList.find(rec => rec.cont_pkid == this.Record.cont_pkid);
        // if (REC == null) {
        //     this.RecordList.push(this.Record);
        // }
        // else {
        //     REC.cont_name = this.Record.cont_name;
        //     REC.cont_add1 = this.Record.cont_add1;
        //     REC.cont_state = this.Record.cont_state;
        //     REC.cont_country = this.Record.cont_country;
        //     REC.cont_tel = this.Record.cont_tel;
        //     REC.cont_mobile = this.Record.cont_mobile;
        //     REC.cont_email = this.Record.cont_email;
        // }
    }
    OnChange(field: string) {
        this.bChanged = true;
        // if (field == 'cont_name') {
        //     this.Record.cont_name = this.Record.cont_name.toUpperCase();
        // }
    }

    OnBlur(field: string, _rec: Mark_Qtnm = null) {

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
            case 'qtnm_plfd_name': {
                this.Record.qtnm_plfd_name = this.Record.qtnm_plfd_name.toUpperCase();
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
            case 'qtnm_remarks': {
                if (_rec != null)
                    _rec.qtnm_remarks = _rec.qtnm_remarks.toUpperCase();
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
            this.RecordRemList.splice(this.RecordRemList.findIndex(rec => rec.qtnm_pkid == _id), 1);
            if (this.RecordRemList.length == 0)
                this.NewRemarkRecord();
        } else {
            this.RecordTermList.splice(this.RecordTermList.findIndex(rec => rec.qtnm_pkid == _id), 1);
            if (this.RecordTermList.length == 0)
                this.NewTermRecord();
        }
    }

    NewRemarkRecord() {
        let _Rec: Mark_Qtnm = new Mark_Qtnm;
        _Rec.qtnm_pkid = this.gs.getGuid();
        _Rec.qtnm_remarks = '';
        this.RecordRemList.push(_Rec);
    }
    NewTermRecord() {
        let _Rec: Mark_Qtnm = new Mark_Qtnm;
        _Rec.qtnm_pkid = this.gs.getGuid();
        _Rec.qtnm_remarks = '';
        this.RecordTermList.push(_Rec);
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
        this.total_amt = this.gs.roundNumber(this.total_amt,2);
    }

    AddRecord() {

        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';

        // if (this.Record.qtn_party_id.length <= 0) {
        //   bret = false;
        //   sError += "|A/c Code Cannot Be Blank";
        // }


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
        
        this.Recorddet.qtnd_amt = amt;
        this.Recorddet.qtnd_total = inramt;
    }

    SaveTerms() {

    }
}
