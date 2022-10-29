import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Deductm, Deductd } from '../models/deductm';
import { DeductmService } from '../services/deductm.service';
import { SearchTable } from '../../shared/models/searchtable';
import { SalaryHead } from '../models/salaryhead';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-deductm-edit',
    templateUrl: './deductm-edit.component.html',
    providers: [DeductmService]
})
export class DeductmEditComponent {
    // Local Variables 
    title = 'DEDUCTIONS';

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() mode: string = '';
    @Input() pkid: string = '';

    @Output() callbackevent = new EventEmitter<any>();

    InitCompleted: boolean = false;
    menu_record: any;


    bChanged: boolean;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    bPrint: boolean = false;
    searchstring = '';

    modal: any;
    sub: any;
    urlid: string;
    lock_record: boolean = false;


    ErrorMessage = "";
    InfoMessage = "";
    iTotal: number = 0;
    // Array For Displaying List
    Salheadlist: SalaryHead[] = [];
    // Single Record for add/edit/view details
    Record: Deductm = new Deductm;
    RecordList: Deductd[] = [];
    EMPRECORD: SearchTable = new SearchTable();

    constructor(
        private modalService: NgbModal,
        private mainService: DeductmService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {


    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.InitComponent();
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
        this.LoadCombo();
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
                this.Salheadlist = response.salheadlist;
                this.ActionHandler(this.mode, this.pkid)
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    InitLov() {
        this.EMPRECORD = new SearchTable();
        this.EMPRECORD.controlname = "EMPLOYEE";
        this.EMPRECORD.displaycolumn = "CODE";
        this.EMPRECORD.type = "EMPLOYEE";
        this.EMPRECORD.where = " a.rec_branch_code='" + this.gs.globalVariables.branch_code + "' ";
        this.EMPRECORD.id = ""
        this.EMPRECORD.code = "";
        this.EMPRECORD.name = "";
    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "EMPLOYEE") {
            this.Record.ded_emp_id = _Record.id;
            this.Record.ded_emp_code = _Record.code;
            this.Record.ded_emp_name = _Record.name;
        }
    }

    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {
        this.ErrorMessage = '';
        this.InfoMessage = '';
        if (action === 'ADD') {
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

    NewRecord() {
        this.pkid = this.gs.getGuid();
        this.Record = new Deductm();
        this.Record.ded_pkid = this.pkid;
        this.Record.ded_emp_id = '';
        this.Record.ded_emp_code = '';
        this.Record.ded_emp_name = '';
        this.Record.ded_type = '';
        this.Record.ded_type_code = '';
        this.Record.ded_start_date = this.gs.defaultValues.today;
        this.Record.ded_paid_amt = 0;
        this.Record.ded_mon_amt = 0;
        this.Record.ded_tot_months = 0;
        this.Record.ded_closed = 'N';
        this.Record.ded_edit_code = "{S}";
        this.Record.ded_remarks = '';
        this.lock_record = false;
        this.Record.ded_alloc_exist = false;
        this.InitLov();
        this.Record.rec_mode = this.mode;

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
        if (this.mode == "EDIT")
            return this.disableSave;
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
                this.RecordList = response.list;
                this.iTotal = 0;
                for (let rec of this.RecordList) {
                    this.iTotal += rec.ded_amt;
                }
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    LoadData(_Record: Deductm) {
        this.Record = _Record;
        this.Record.rec_mode = this.mode;
        this.InitLov();
        this.EMPRECORD.id = this.Record.ded_emp_id;
        this.EMPRECORD.code = this.Record.ded_emp_code;
        this.EMPRECORD.name = this.Record.ded_emp_name;
        // this.lock_record = true;
        // if (this.Record.ded_edit_code.indexOf("{S}") >= 0)
        //     this.lock_record = false;
    }

    // Save Data
    Save() {
        this.FindNetAmt();
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.Record.ded_type_code = this.getTypecode(this.Record.ded_type);
        this.Record._globalvariables = this.gs.globalVariables;
        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.InfoMessage = "Save Complete";
                this.mode = 'EDIT';
                this.Record.rec_mode = this.mode;
                if (this.callbackevent != null)
                    this.callbackevent.emit({ saction: 'SAVE', rec: this.Record });
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

        if (this.Record.ded_emp_code.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Employee Cannot Be Blank";
        }

        if (this.Record.ded_type.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Deduction Type Cannot Be Blank";
        }

        if (this.Record.ded_start_date.trim().length <= 0) {
            bret = false;
            sError += " | Date Cannot Be Blank";
        }

        if (this.Record.ded_paid_amt == 0) {
            bret = false;
            sError += "\n\r | Invalid  Amount ";
        }

        if (this.Record.ded_mon_amt == 0) {
            bret = false;
            sError += "\n\r | Invalid Monthly Amount ";
        }

        if (this.Record.ded_mon_amt > this.Record.ded_paid_amt) {
            bret = false;
            sError += "\n\r | Invalid  Amount ";
        }

        if (bret === false) {
            this.ErrorMessage = sError;
            alert(this.ErrorMessage);
        }
        if (bret) {

        }
        return bret;
    }




    OnBlur(field: string) {
        if (field == 'ded_paid_amt') {
            this.Record.ded_paid_amt = this.gs.roundNumber(this.Record.ded_paid_amt, 2);
            this.FindInstallments();
        }
        if (field == 'ded_mon_amt') {
            this.Record.ded_mon_amt = this.gs.roundNumber(this.Record.ded_mon_amt, 2);
            this.FindInstallments();
        }
        if (field == 'ded_tot_months') {
            this.Record.ded_tot_months = this.gs.roundNumber(this.Record.ded_tot_months, 0);
        }
        if (field == 'ded_remarks') {
            this.Record.ded_remarks = this.Record.ded_remarks.toUpperCase();
        }
    }



    FindNetAmt() {

        // let TotDeductn: number = 0;
        // for (let rec of this.Record.DetList) {
        //     if (rec.d_code1 == "D01") //Employee PF Deduction
        //         rec.d_amt1 = PF_Amt;
        //     if (rec.d_code1 == "D02")
        //         rec.d_amt1 = ESI_Amt;

        //     TotDeductn += rec.d_amt1;
        //     TotDeductn += rec.d_amt2;
        // }
        // TotDeductn = this.gs.roundNumber(TotDeductn, 0);

        // this.Record.d01 = PF_Amt;
        // this.Record.d02 = ESI_Amt;
        // this.Record.sal_gross_deduct = TotDeductn;
    }

    FindInstallments() {

        let Totmons: number = 0;
        if (this.Record.ded_mon_amt > 0)
            Totmons = this.Record.ded_paid_amt / this.Record.ded_mon_amt;
        Totmons = this.gs.roundNumber(this.Record.ded_paid_amt / this.Record.ded_mon_amt, 0);
        this.Record.ded_tot_months = Totmons;
    }

    Close() {
        if (this.callbackevent != null)
            this.callbackevent.emit({ saction: 'CLOSE' });
    }

    getTypecode(_type: string) {
        let str = "";
        if (this.Salheadlist != null) {
            var REC = this.Salheadlist.find(rec => rec.sal_desc == _type);
            if (REC != null) {
                str = REC.sal_code;
            }
        }
        return str;
    }

    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }

    ShowHistory(history: any) {
        this.ErrorMessage = '';
        this.open(history);
    }
}
