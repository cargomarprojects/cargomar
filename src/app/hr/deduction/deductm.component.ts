import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Deductm } from '../models/deductm';
import { DeductmService } from '../services/deductm.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
    selector: 'app-deductm',
    templateUrl: './deductm.component.html',
    providers: [DeductmService]
})
export class DeductmComponent {
    // Local Variables 
    title = 'DEDUCTION MASTER';

    @Input() menuid: string = '';
    @Input() type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;
    selectedRowIndex = 0;

    bpending: boolean = true;
    bChanged: boolean;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    bPrint: boolean = false;
    searchstring = '';
    searchstring2 = '';

    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;
    urlid: string;
    lock_record: boolean = false;
    modal: any;

    ErrorMessage = "";
    InfoMessage = "";
    emp_id: string = '';
    emp_code: string = '';
    emp_name: string = '';
    salyear: number;
    salmonth: number;

    mode = '';
    pkid = '';
    // Array For Displaying List
    RecordList: Deductm[] = [];
    // Single Record for add/edit/view details
    RecordList2: Deductm[] = [];
    EMPRECORD: SearchTable = new SearchTable();

    constructor(
        private modalService: NgbModal,
        private mainService: DeductmService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 30;
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
        this.bPrint = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_print)
                this.bPrint = true;
        }
        this.InitLov();
        if (this.gs.defaultValues.today.trim() != "") {
            var tempdt = this.gs.defaultValues.today.split('-');
            this.salyear = +tempdt[0];
            this.salmonth = +tempdt[1];
        }
        this.List("NEW");
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    InitLov() {

        this.EMPRECORD = new SearchTable();
        this.EMPRECORD.controlname = "EMPLOYEE";
        this.EMPRECORD.displaycolumn = "CODE";
        this.EMPRECORD.type = "EMPLOYEE";
        this.EMPRECORD.where = "";
        this.EMPRECORD.id = ""
        this.EMPRECORD.code = "";
        this.EMPRECORD.name = "";
    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "EMPLOYEE") {
            this.emp_id = _Record.id;
            this.emp_code = _Record.code;
            this.emp_name = _Record.name;
        }
    }

    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string, _deductm: any) {
        this.ErrorMessage = '';
        this.InfoMessage = '';
        if (action == 'LIST') {
            this.mode = '';
            this.pkid = '';
            this.currentTab = 'LIST';
        }
        else if (action === 'ADD') {

            this.pkid = this.gs.getGuid();
            this.mode = 'ADD';
            this.open(_deductm);
        }
        else if (action === 'EDIT') {
            this.pkid = id;
            this.mode = 'EDIT';
            this.open(_deductm);
        }
        else if (action === 'PROCESS') {
            this.mode = '';
            this.pkid = '';
            this.currentTab = 'PROCESS';
        }
    }

    // Query List Data
    List(_type: string) {

        this.loading = true;
        let SearchData = {
            type: _type,
            rowtype: this.type,
            searchstring: this.searchstring.toUpperCase(),
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            report_folder: this.gs.globalVariables.report_folder,
            bpending: this.bpending,
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

    OnBlur(field: string) {
        // if (field == 'ded_paid_amt') {
        //     this.Record.ded_paid_amt = this.gs.roundNumber(this.Record.ded_paid_amt, 2);
        //     this.FindInstallments();
        // }
        // if (field == 'ded_mon_amt') {
        //     this.Record.ded_mon_amt = this.gs.roundNumber(this.Record.ded_mon_amt, 2);
        //     this.FindInstallments();
        // }
        // if (field == 'ded_tot_months') {
        //     this.Record.ded_tot_months = this.gs.roundNumber(this.Record.ded_tot_months, 0);
        // }
        if (field == 'searchstring') {
            this.searchstring = this.searchstring.toUpperCase();
        }
        if (field == 'searchstring2') {
            this.searchstring2 = this.searchstring2.toUpperCase();
        }
    }

    Close() {
        this.gs.ClosePage('home');
    }

    open(content: any) {
        this.modal = this.modalService.open(content);
    }

    ModifiedRecords(params: any) {
        if (params.saction == "SAVE") {
            this.RefreshList(params.rec);
        }
        this.modal.close();
    }

    RefreshList(_rec: Deductm) {
        if (this.RecordList == null)
            return;
        var REC = this.RecordList.find(rec => rec.ded_pkid == _rec.ded_pkid);
        if (REC == null) {
            this.RecordList.push(_rec);
        }
        else {
            REC.ded_emp_code = _rec.ded_emp_code;
            REC.ded_emp_name = _rec.ded_emp_name;
            REC.ded_start_date = _rec.ded_start_date;
            REC.ded_type = _rec.ded_type;
            REC.ded_paid_amt = _rec.ded_paid_amt;
            REC.ded_mon_amt = _rec.ded_mon_amt;
            REC.ded_tot_months = _rec.ded_tot_months;
            REC.ded_collected_amt = _rec.ded_collected_amt;
            REC.ded_bal_amt = _rec.ded_bal_amt;
            REC.ded_closed = _rec.ded_closed;
        }
    }

    ProcessDeductions(_type: string) {
        this.ErrorMessage = '';
        if (this.salyear <= 0) {
            this.ErrorMessage += " | Invalid Year";
        } else if (this.salyear < 100) {
            this.ErrorMessage += " | YEAR FORMAT : - YYYY ";
        }
        if (this.salmonth <= 0 || this.salmonth > 12) {
            this.ErrorMessage += " | Invalid Month";
        }
        if (this.ErrorMessage.length > 0) {
            alert(this.ErrorMessage);
            return;
        }
        if (_type == 'PROCESS') {
            if (!confirm("Process Payroll Deductions (Year-" + this.salyear.toString() + ", Month-" + this.salmonth.toString() + ")")) {
                return;
            }
        }
        this.loading = true;
        let SearchData = {
            type: _type,
            rowtype: this.type,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code,
            user_code: this.gs.globalVariables.user_code,
            report_folder: this.gs.globalVariables.report_folder,
            salyear: this.salyear,
            salmonth: this.salmonth,
            searchstring: this.searchstring2.toUpperCase(),
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.ProcessDeduction(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'LIST')
                    this.RecordList2 = response.list;
                if (_type == 'PROCESS') {
                    this.ProcessDeductions('LIST');
                    alert('Successfully Processed');
                }
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }
}
