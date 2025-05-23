import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { TdsExemption } from '../models/tdsexemption';
import { TdsExemptionService } from '../services/tdsexemption.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-tdsexempt',
    templateUrl: './tdsexempt.component.html',
    providers: [TdsExemptionService]
})

export class TdsExemptionComponent {
    // Local Variables 
    title = 'Tds Exemption';

    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;
    disableSave = true;
    loading = false;
    bDocs: boolean = false;
    bExcel: boolean = false;
    sub: any;
    urlid: string;
    modal: any;

    //selectedRowIndex = 0;
    // currentTab = 'LIST';
    // searchstring = '';
    // page_count = 0;
    // page_current = 0;
    // page_rows = 0;
    // page_rowcount = 0;
    // ErrorMessage = "";
    // mode = '';
    // pkid = '';
    // // Array For Displaying List
    // RecordList: TdsExemption[] = [];

    // Single Record for add/edit/view details
    Record: TdsExemption = new TdsExemption;
    ACCRECORD: SearchTable = new SearchTable();
    PARTYRECORD: SearchTable = new SearchTable();
    PANRECORD: SearchTable = new SearchTable();

    constructor(
        private modalService: NgbModal,
        public mainService: TdsExemptionService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.InitLov();
        // this.mainService.state.page_count = 0;
        // this.mainService.state.page_rows = 2;
        // this.mainService.state.page_current = 0;

        // URL Query Parameter 
        this.sub = this.route.queryParams.subscribe(params => {
            if (params["parameter"] != "") {
                // this.InitCompleted = true;
                var options = JSON.parse(params["parameter"]);
                this.menuid = options.menuid;
                this.type = options.type;
                // this.InitComponent();
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
        if (this.mainService.state.mode == "ADD")
            this.ActionHandler('ADD', '');
        else if (this.mainService.state.mode == "EDIT")
            this.ActionHandler('EDIT', this.mainService.state.pkid)

    }

    InitComponent() {
        this.bDocs = false;
        this.bExcel = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_docs)
                this.bDocs = true;
            if (this.menu_record.rights_print)
                this.bExcel = true;
        }
        this.LoadCombo();
        // this.List("NEW");
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    LoadCombo() {
    }

    InitLov() {
        this.ACCRECORD = new SearchTable();
        this.ACCRECORD.controlname = "ACCTM";
        this.ACCRECORD.displaycolumn = "CODE";
        this.ACCRECORD.type = "ACCTM";
        this.ACCRECORD.id = "";
        this.ACCRECORD.code = "";
        this.ACCRECORD.name = "";

        this.PARTYRECORD = new SearchTable();
        this.PARTYRECORD.controlname = "PARTY";
        this.PARTYRECORD.displaycolumn = "CODE";
        this.PARTYRECORD.type = "ACCTM";//CUSTOMER
        this.PARTYRECORD.id = "";
        this.PARTYRECORD.code = "";
        this.PARTYRECORD.name = "";
        this.PARTYRECORD.parentid = "";

        this.PANRECORD = new SearchTable();
        this.PANRECORD.controlname = "PAN";
        this.PANRECORD.displaycolumn = "CODE";
        this.PANRECORD.type = "PAN";
        this.PANRECORD.id = "";
        this.PANRECORD.code = "";
    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "ACCTM") {
            this.Record.te_tds_acc_id = _Record.id;
            this.Record.te_tds_acc_code = _Record.code;
            this.Record.te_tds_acc_name = _Record.name;
        }

        if (_Record.controlname == "PARTY") {
            this.Record.te_cust_id = _Record.id;
            this.Record.te_cust_code = _Record.code;
            this.Record.te_cust_name = _Record.name;
            this.SearchRecord("CUSTOMERPAN", this.Record.te_cust_id);
        }

        if (_Record.controlname == "PAN") {
            this.Record.te_pan_id = _Record.id;
            this.Record.te_pan_code = _Record.code;
            this.Record.te_pan_name = _Record.name;
        }
    }


    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {
        this.mainService.state.ErrorMessage = '';
        if (action == 'LIST') {
            // this.mode = '';
            // this.pkid = '';
            // this.currentTab = 'LIST';
            this.mainService.state.mode = '';
            this.mainService.state.pkid = '';
            this.mainService.state.currentTab = 'LIST';
        }
        else if (action === 'ADD') {
            // this.currentTab = 'DETAILS';
            // this.mode = 'ADD';
            this.mainService.state.currentTab = 'DETAILS';
            this.mainService.state.mode = 'ADD';
            this.ResetControls();
            this.NewRecord();
        }
        else if (action === 'EDIT') {
            // this.currentTab = 'DETAILS';
            // this.mode = 'EDIT';
            this.mainService.state.currentTab = 'DETAILS';
            this.mainService.state.mode = 'EDIT';
            this.ResetControls();
            //this.pkid = id;
            this.mainService.state.pkid = id;
            this.GetRecord(id);
        }
    }


    ResetControls() {
        this.disableSave = true;
        if (!this.menu_record)
            return;

        if (this.menu_record.rights_admin)
            this.disableSave = false;
        // if (this.mode == "ADD" && this.menu_record.rights_add)
        //     this.disableSave = false;
        // if (this.mode == "EDIT" && this.menu_record.rights_edit)
        //     this.disableSave = false;

        if (this.mainService.state.mode == "ADD" && this.menu_record.rights_add)
            this.disableSave = false;
        if (this.mainService.state.mode == "EDIT" && this.menu_record.rights_edit)
            this.disableSave = false;

        return this.disableSave;
    }

    // Query List Data
    List(_type: string) {

        this.loading = true;
        let SearchData = {
            type: _type,
            rowtype: this.type,
            searchstring: this.mainService.state.searchstring.toUpperCase(),
            page_count: this.mainService.state.page_count,
            page_current: this.mainService.state.page_current,
            page_rows: this.mainService.state.page_rows,
            page_rowcount: this.mainService.state.page_rowcount,
            company_code: this.gs.globalVariables.comp_code,
            year_code: this.gs.globalVariables.year_code,
            report_folder: this.gs.globalVariables.report_folder
        };
        this.mainService.state.ErrorMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.reportfile, _type, response.filedisplayname);
                else {
                    this.mainService.state.RecordList = response.list;
                    this.mainService.state.page_count = response.page_count;
                    this.mainService.state.page_current = response.page_current;
                    this.mainService.state.page_rowcount = response.page_rowcount;
                }
            },
                error => {
                    this.loading = false;
                    this.mainService.state.ErrorMessage = this.gs.getError(error);
                    alert(this.mainService.state.ErrorMessage);
                });
    }

    NewRecord() {

        // this.pkid = this.gs.getGuid();
        this.mainService.state.pkid = this.gs.getGuid();
        this.Record = new TdsExemption();
        // this.Record.te_pkid = this.pkid;
        this.Record.te_pkid = this.mainService.state.pkid;
        this.Record.te_cert_no = '';
        this.Record.te_cert_date = this.gs.defaultValues.today;
        this.Record.te_cust_id = '';
        this.Record.te_cust_code = '';
        this.Record.te_cust_name = '';
        this.Record.te_valid_from = this.gs.defaultValues.today;
        this.Record.te_valid_to = this.gs.globalVariables.year_end_date;
        this.Record.te_year = 0;
        this.Record.te_tds_acc_id = '';
        this.Record.te_tds_acc_code = '';
        this.Record.te_tds_acc_name = '';
        this.Record.te_tds_rate = 0;
        this.Record.te_tds_cert_rate = 0;
        this.Record.te_cr_limit = 0;
        this.Record.te_used_amt = 0;
        this.Record.te_remarks = '';
        // this.Record.rec_mode = this.mode;
        this.Record.rec_mode = this.mainService.state.mode;

        this.InitLov();
    }

    // Load a single Record for VIEW/EDIT
    GetRecord(Id: string) {
        this.loading = true;

        let SearchData = {
            pkid: Id,
        };

        this.mainService.state.ErrorMessage = '';
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.LoadData(response.record);
            },
                error => {
                    this.loading = false;
                    this.mainService.state.ErrorMessage = this.gs.getError(error);
                    alert(this.mainService.state.ErrorMessage);
                });
    }

    LoadData(_Record: TdsExemption) {
        this.Record = _Record;
        this.InitLov();

        this.ACCRECORD.id = this.Record.te_tds_acc_id;
        this.ACCRECORD.code = this.Record.te_tds_acc_code;
        this.ACCRECORD.name = this.Record.te_tds_acc_name;
        this.PARTYRECORD.id = this.Record.te_cust_id;
        this.PARTYRECORD.code = this.Record.te_cust_code;
        this.PARTYRECORD.name = this.Record.te_cust_name;

        this.PANRECORD.id = this.Record.te_pan_id;
        this.PANRECORD.code = this.Record.te_pan_code;
        this.PANRECORD.name = this.Record.te_pan_name;

        // this.Record.rec_mode = this.mode;
        this.Record.rec_mode = this.mainService.state.mode;
    }


    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.mainService.state.ErrorMessage = '';

        this.Record._globalvariables = this.gs.globalVariables;
        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.mainService.state.ErrorMessage = "Save Complete";
                // this.mode = 'EDIT';
                // this.Record.rec_mode = this.mode;
                this.mainService.state.mode = 'EDIT';
                this.Record.rec_mode = this.mainService.state.mode;
                this.RefreshList();
                alert(this.mainService.state.ErrorMessage);
            },
                error => {
                    this.loading = false;
                    this.mainService.state.ErrorMessage = this.gs.getError(error);
                    alert(this.mainService.state.ErrorMessage);
                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.mainService.state.ErrorMessage = '';
        if (this.Record.te_tds_acc_id.trim().length <= 0) {
            bret = false;
            sError = "A/c Code Need To Be Selected";
        }
        if (bret === false) {
            this.mainService.state.ErrorMessage = sError;
            alert(this.mainService.state.ErrorMessage);
        }
        return bret;
    }

    RefreshList() {

        if (this.mainService.state.RecordList == null)
            return;
        var REC = this.mainService.state.RecordList.find(rec => rec.te_pkid == this.Record.te_pkid);
        if (REC == null) {
            this.mainService.state.RecordList.push(this.Record);
        }
        else {
            REC.te_cust_code = this.Record.te_cust_code;
            REC.te_cust_name = this.Record.te_cust_name;
            REC.te_tds_acc_code = this.Record.te_tds_acc_code;
            REC.te_tds_acc_name = this.Record.te_tds_acc_name;
            REC.te_cert_no = this.Record.te_cert_no;
            REC.te_cert_date = this.Record.te_cert_date;
            REC.te_tds_rate = this.Record.te_tds_rate;
            REC.te_tds_cert_rate = this.Record.te_tds_cert_rate;
            REC.te_valid_from = this.Record.te_valid_from;
            REC.te_valid_to = this.Record.te_valid_to;
            REC.te_cr_limit = this.Record.te_cr_limit;
            REC.te_remarks = this.Record.te_remarks;
        }
    }

    UpdateTdsExemption() {

        if (!confirm("Update Amount")) {
            return;
        }

        this.loading = true;
        let SearchData = {
            report_folder: this.gs.globalVariables.report_folder,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            user_code: this.gs.globalVariables.user_code,
            year_code: this.gs.globalVariables.year_code
        };

        this.mainService.state.ErrorMessage = '';
        this.mainService.Update(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.List("NEW");
            },
                error => {
                    this.loading = false;
                    this.mainService.state.ErrorMessage = this.gs.getError(error);
                    alert(this.mainService.state.ErrorMessage);
                });
    }

    Close() {
        this.gs.ClosePage('home');
    }

    ShowDocuments(doc: any) {
        this.mainService.state.ErrorMessage = '';
        this.open(doc);
    }

    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }


    OnBlur(controlname: string) {

        if (controlname == 'te_tds_rate') {
            this.Record.te_tds_rate = this.gs.roundNumber(this.Record.te_tds_rate, 2);
        }
        if (controlname == 'te_tds_cert_rate') {
            this.Record.te_tds_cert_rate = this.gs.roundNumber(this.Record.te_tds_cert_rate, 2);
        }

        if (controlname == 'te_cr_limit') {
            this.Record.te_cr_limit = this.gs.roundNumber(this.Record.te_cr_limit, 2);
        }
        if (controlname == 'te_cert_no') {
            this.Record.te_cert_no = this.Record.te_cert_no.toUpperCase();
        }
        if (controlname == 'te_remarks') {
            this.Record.te_remarks = this.Record.te_remarks.toUpperCase();
        }
        if (controlname == 'searchstring') {
            this.mainService.state.searchstring = this.mainService.state.searchstring.toUpperCase();
        }
    }


    // // Query List Data
    GstPurchaseReport(_cust_name: string, _cust_id: string) {
        this.mainService.state.ErrorMessage = '';

        if (!confirm("Download the purchase report for " + _cust_name)) {
            return;
        }

        let SearchData = {
            type: 'EXCEL',
            pkid: this.gs.getGuid(),
            report_folder: this.gs.globalVariables.report_folder,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            searchstring: _cust_name,
            from_date: this.gs.globalVariables.year_start_date,
            to_date: this.gs.globalVariables.year_end_date,
            format_type: 'PURCHASE',
            all: true,
            gst_only: true,
            print_new_format: true,
            user_code: this.gs.globalVariables.user_code,
            state_name: '',
            state_code: '',
            hide_ho_entries: this.gs.globalVariables.hide_ho_entries,
            te_cust_id: _cust_id
        };

        this.loading = true;
        this.mainService.GstReport(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
            },
                error => {
                    this.loading = false;
                    this.mainService.state.ErrorMessage = this.gs.getError(error);
                    alert(this.mainService.state.ErrorMessage);
                });
    }


    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }

    SearchRecord(controlname: string, controlid: string) {
        if (controlid.trim().length <= 0)
            return;

        this.loading = true;
        let SearchData = {
            table: 'customerpan',
            rowtype: this.type,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            cust_pkid: ''
        };

        SearchData.table = 'customerpan';
        SearchData.company_code = this.gs.globalVariables.comp_code;
        SearchData.branch_code = this.gs.globalVariables.branch_code;
        SearchData.year_code = this.gs.globalVariables.year_code;
        SearchData.cust_pkid = controlid;

        this.mainService.state.ErrorMessage = '';
        this.gs.SearchRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.mainService.state.ErrorMessage = '';

                if (controlname == 'CUSTOMERPAN') {
                    this.Record.te_pan_id = '';
                    this.Record.te_pan_code = '';
                    this.Record.te_pan_name = '';
                    this.PANRECORD = new SearchTable();
                    this.PANRECORD.controlname = "PAN";
                    this.PANRECORD.displaycolumn = "CODE";
                    this.PANRECORD.type = "PAN";
                    this.PANRECORD.id = "";
                    this.PANRECORD.code = "";
                }

                if (response.customerpan.length > 0) {

                    if (controlname == 'CUSTOMERPAN') {
                        this.Record.te_pan_id = response.customerpan[0].param_pkid;
                        this.Record.te_pan_code = response.customerpan[0].param_code;
                        this.Record.te_pan_name = response.customerpan[0].param_name;
                        this.PANRECORD.id = this.Record.te_pan_id;
                        this.PANRECORD.code = this.Record.te_pan_code;
                        this.PANRECORD.name = this.Record.te_pan_name;
                    }

                }
                else {
                    this.mainService.state.ErrorMessage = 'PAN Not Found';
                    alert(this.mainService.state.ErrorMessage);
                }
            },
                error => {
                    this.loading = false;
                    this.mainService.state.ErrorMessage = this.gs.getError(error);
                    alert(this.mainService.state.ErrorMessage);
                });
    }


}
