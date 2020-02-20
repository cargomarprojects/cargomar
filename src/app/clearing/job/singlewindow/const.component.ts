import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChange } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { SwConst } from '../../models/swconst';
import { SwConstService } from '../../services/swconst.service';
import { SearchTable } from '../../../shared/models/searchtable';

@Component({
    selector: 'app-const',
    templateUrl: './const.component.html',
    providers: [SwConstService]
})
export class ConstComponent {
    // Local Variables 
    title = 'Constituents';
    //   @ViewChild('lic_reg_no') private lic_reg_no: ElementRef;

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() parentid: string = '';
    @Input() jobid: string = '';

    selectedRowIndex: number = -1;

    Total_Amount: number = 0;

    loading = false;
    currentTab = 'LIST';

    bChanged: boolean;

    ErrorMessage = "";
    InfoMessage = "";
    mode = 'ADD';
    pkid = '';

    ctr: number;

    // Array For Displaying List
    RecordList: SwConst[] = [];
    // Single Record for add/edit/view details
    Record: SwConst = new SwConst;

    UQCUNITRECORD: SearchTable = new SearchTable();

    constructor(
        private mainService: SwConstService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.InitLov();
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        //this.List("NEW");
        //this.ActionHandler("ADD", null);

    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        for (let propName in changes) {
            let changedProp = changes[propName];
            let from = changedProp.previousValue;
            if (propName == 'parentid') {
                this.LoadCombo();
                this.List("NEW");
                this.ActionHandler("ADD", null);
            }
        }
    }
    LoadCombo() {

    }

    InitLov() {
        this.UQCUNITRECORD = new SearchTable();
        this.UQCUNITRECORD.controlname = "UQC-UNIT";
        this.UQCUNITRECORD.displaycolumn = "CODE";
        this.UQCUNITRECORD.type = "UNIT";
        this.UQCUNITRECORD.id = "";
        this.UQCUNITRECORD.code = "";
        this.UQCUNITRECORD.name = "";
    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "UQC-UNIT") {
            // this.Record.sw_info_uqc_id = _Record.id;
            // this.Record.sw_info_uqc_code = _Record.code;
            // this.Record.sw_info_uqc_name = _Record.name;
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
            this.mode = 'EDIT';
            this.ResetControls();
            this.pkid = id;
            this.GetRecord(id);
        }
        else if (action === 'REMOVE') {
            this.currentTab = 'DETAILS';
            this.pkid = id;
            this.RemoveRecord(id);
        }
    }

    ResetControls() {

    }

    List(_type: string) {
        this.loading = true;

        let SearchData = {
            type: _type,
            rowtype: this.type,
            parentid: this.parentid,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    NewRecord() {

        this.pkid = this.gs.getGuid();
        this.Record = new SwConst();
        this.Record.sw_pkid = this.pkid;
        this.Record.sw_jobid = '';
        this.Record.sw_itmid = '';
        this.Record.sw_const_elementname = '';
        this.Record.sw_const_code = '';
        this.Record.sw_const_percent = 0;
        this.Record.sw_const_yieldpercent = 0;
        this.Record.sw_active_ingredient = 'N';
        this.Record.rec_mode = this.mode;
        this.InitLov();
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

    LoadData(_Record: SwConst) {
        this.Record = _Record;
        this.InitLov();
        // this.UQCUNITRECORD.id = this.Record.sw_info_uqc_id;
        // this.UQCUNITRECORD.code = this.Record.sw_info_uqc_code;
        // this.UQCUNITRECORD.name = this.Record.sw_info_uqc_name;

        this.Record.rec_mode = this.mode;
        // this.lic_reg_no.nativeElement.focus();
    }

    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.Record.sw_itmid = this.parentid;
        this.Record.sw_jobid = this.jobid;
        this.Record.rec_category=this.type;
        this.Record._globalvariables = this.gs.globalVariables;
        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.InfoMessage = "Save Complete";
                this.mode = 'EDIT';
                this.Record.rec_mode = this.mode;
                this.RefreshList();
                this.ActionHandler('ADD', null);
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';

        if (this.parentid.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Item ID Cannot Be Blank";
        }

        if (this.jobid.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Job ID Cannot Be Blank";
        }


        if (bret === false)
            this.ErrorMessage = sError;
        return bret;
    }

    RefreshList() {

        if (this.RecordList == null)
            return;
        var REC = this.RecordList.find(rec => rec.sw_pkid == this.Record.sw_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.sw_const_elementname = this.Record.sw_const_elementname;
            REC.sw_const_code = this.Record.sw_const_code;
            REC.sw_const_percent = this.Record.sw_const_percent;
            REC.sw_const_yieldpercent = this.Record.sw_const_yieldpercent;
            REC.sw_active_ingredient = this.Record.sw_active_ingredient;

        }
    }

    RemoveList(event: any) {
        if (event.selected) {
            this.ActionHandler('REMOVE', event.id)
        }
    }
    RemoveRecord(Id: string) {
        this.loading = true;
        let SearchData = {
            pkid: Id,
            parentid: this.parentid
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.DeleteRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList.splice(this.RecordList.findIndex(rec => rec.sw_pkid == this.pkid), 1);
                this.ActionHandler('ADD', null);
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }


    Close() {
        this.gs.ClosePage('home');
    }

    OnFocus(field: string) {
        this.bChanged = false;
    }

    OnChange(field: string) {
        this.bChanged = true;
    }

    OnBlur(field: string) {
        switch (field) {

            case 'sw_const_elementname':
                {
                    this.Record.sw_const_elementname = this.Record.sw_const_elementname.toUpperCase();
                    break;
                }
            case 'sw_const_code':
                {
                    this.Record.sw_const_code = this.Record.sw_const_code.toUpperCase();
                    break;
                }
            case 'sw_const_percent':
                {
                    this.Record.sw_const_percent = this.gs.roundNumber(this.Record.sw_const_percent, 2);
                    break;
                }
            case 'sw_const_yieldpercent':
                {
                    this.Record.sw_const_yieldpercent = this.gs.roundNumber(this.Record.sw_const_yieldpercent, 2);
                    break;
                }
        }
    }

}
