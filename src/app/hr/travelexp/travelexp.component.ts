import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { TravelExpense } from '../models/travelexpense';
import { TravelExpenseService } from '../services/travelexpense.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-travelexp',
    templateUrl: './travelexp.component.html',
    providers: [TravelExpenseService]
})

export class TravelExpenseComponent {
    // Local Variables 
    title = 'Travel Expense';

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

    // Single Record for add/edit/view details
    Record: TravelExpense = new TravelExpense;

    constructor(
        private modalService: NgbModal,
        public ms: TravelExpenseService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        // URL Query Parameter 
        this.sub = this.route.queryParams.subscribe(params => {
            if (params["parameter"] != "") {
                var options = JSON.parse(params["parameter"]);
                this.menuid = options.menuid;
                this.type = options.type;
            }
        });
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        if (!this.InitCompleted) {
            this.InitCompleted = true;
            this.InitComponent();
        }

        this.ms.init(this.menuid);
        if (this.ms.state.mode == "ADD")
            this.ActionHandler('ADD', '');
        else if (this.ms.state.mode == "EDIT")
            this.ActionHandler('EDIT', this.ms.state.pkid)
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
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    LoadCombo() {
    }
    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "EMPLOYEE") {
            this.Record.te_emp_id= _Record.id;
            this.Record.te_emp_code = _Record.code;
            this.Record.te_emp_name = _Record.name;
            this.Record.rec_branch_code = _Record.col2;
            this.Record.te_grade_id = _Record.col3;
            this.Record.te_grade_name = _Record.col4;
        }
    }


    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {
        this.ms.state.ErrorMessage = '';
        if (action == 'LIST') {
            this.ms.state.mode = '';
            this.ms.state.pkid = '';
            this.ms.state.currentTab = 'LIST';
        }
        else if (action === 'ADD') {
            this.ms.state.currentTab = 'DETAILS';
            this.ms.state.mode = 'ADD';
            this.ResetControls();
            this.NewRecord();
        }
        else if (action === 'EDIT') {
            this.ms.state.currentTab = 'DETAILS';
            this.ms.state.mode = 'EDIT';
            this.ResetControls();
            this.ms.state.pkid = id;
            this.GetRecord(id);
        }
    }

    ResetControls() {
        this.disableSave = true;
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

        this.loading = true;
        let SearchData = {
            type: _type,
            rowtype: this.type,
            searchstring: this.ms.state.searchstring.toUpperCase(),
            page_count: this.ms.state.page_count,
            page_current: this.ms.state.page_current,
            page_rows: this.ms.state.page_rows,
            page_rowcount: this.ms.state.page_rowcount,
            company_code: this.gs.globalVariables.comp_code,
            year_code: this.gs.globalVariables.year_code,
            report_folder: this.gs.globalVariables.report_folder
        };
        this.ms.state.ErrorMessage = '';
        this.ms.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.reportfile, _type, response.filedisplayname);
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

    NewRecord() {

        this.ms.state.pkid = this.gs.getGuid();
        this.Record = new TravelExpense();
        this.Record.te_pkid = this.ms.state.pkid;
        this.Record.te_slno = null;
        this.Record.te_date = this.gs.defaultValues.today;
        this.Record.te_emp_id = '';
        this.Record.te_emp_code = '';
        this.Record.te_emp_name = '';
        this.Record.te_grade_id = '';
        this.Record.te_grade_code = '';
        this.Record.te_grade_name = '';
        this.Record.te_travel_from = '';
        this.Record.te_travel_to = '';
        this.Record.te_purpose = '';
        this.Record.te_travel_mode_id = '';
        this.Record.te_travel_mode_code = '';
        this.Record.te_travel_mode_name = '';
        this.Record.te_city_type = 'METRO';
        this.Record.te_own_arrangement = false;
        this.Record.te_lodging_days = 0;
        this.Record.te_lodging_amt = 0;
        this.Record.te_boarding_days = 0;
        this.Record.te_boarding_amt = 0;
        this.Record.te_conv_comp_car_amt = 0;
        this.Record.te_conv_taxi_amt = 0;
        this.Record.te_conv_auto_amt = 0;
        this.Record.te_conv_others_amt = 0;
        this.Record.te_conv_total = 0;
        this.Record.te_misc_amt = 0;
        this.Record.te_remarks = '';
        this.Record.rec_branch_code = '';

        this.Record.rec_mode = this.ms.state.mode;

    }

    // Load a single Record for VIEW/EDIT
    GetRecord(Id: string) {
        this.loading = true;

        let SearchData = {
            pkid: Id,
        };

        this.ms.state.ErrorMessage = '';
        this.ms.GetRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.LoadData(response.record);
            },
                error => {
                    this.loading = false;
                    this.ms.state.ErrorMessage = this.gs.getError(error);
                    alert(this.ms.state.ErrorMessage);
                });
    }

    LoadData(_Record: TravelExpense) {
        this.Record = _Record;
        this.Record.rec_mode = this.ms.state.mode;
    }


    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ms.state.ErrorMessage = '';
        this.Record._globalvariables = this.gs.globalVariables;
        this.ms.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.ms.state.ErrorMessage = "Save Complete";
                if (this.ms.state.mode == 'ADD') {
                    this.Record.te_slno = response.slno;
                }
                this.ms.state.mode = 'EDIT';
                this.Record.rec_mode = this.ms.state.mode;
                this.RefreshList();
                alert(this.ms.state.ErrorMessage);
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
        if (this.Record.te_emp_id.trim().length <= 0) {
            bret = false;
            sError = "Employee cannot be blank";
        }
        if (bret === false) {
            this.ms.state.ErrorMessage = sError;
            alert(this.ms.state.ErrorMessage);
        }
        return bret;
    }

    RefreshList() {

        if (this.ms.state.RecordList == null)
            return;
        var REC = this.ms.state.RecordList.find(rec => rec.te_pkid == this.Record.te_pkid);
        if (REC == null) {
            this.ms.state.RecordList.push(this.Record);
        }
        else {
            REC.te_emp_name = this.Record.te_emp_name;
            REC.te_grade_name = this.Record.te_grade_name;
            REC.te_date = this.Record.te_date;
            REC.te_remarks = this.Record.te_remarks;
        }
    }


    Close() {
        this.gs.ClosePage('home');
    }

    // ShowDocuments(doc: any) {
    //     this.ms.state.ErrorMessage = '';
    //     this.open(doc);
    // }

    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }

    OnBlur(controlname: string) {

        // if (controlname == 'te_tds_rate') {
        //     this.Record.te_tds_rate = this.gs.roundNumber(this.Record.te_tds_rate, 2);
        // }

        // if (controlname == 'searchstring') {
        //     this.mainService.state.searchstring = this.mainService.state.searchstring.toUpperCase();
        // }
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }

}