import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChange } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { InfoType } from '../../models/infotype';
import { InfoTypeService } from '../../services/infotype.service';
import { SearchTable } from '../../../shared/models/searchtable';

@Component({
    selector: 'app-infotype',
    templateUrl: './infotype.component.html',
    providers: [InfoTypeService]
})
export class InfoTypeComponent {
    // Local Variables 
    title = 'Info Type';
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

    InfoTypeList: any[] = [];
    InfoQlfrList: any[] = [];
    InfoCodeList: any[] = [];

    AllInfoQlfrList: any[] = [];
    AllInfoCodeList: any[] = [];
    // Array For Displaying List
    RecordList: InfoType[] = [];
    // Single Record for add/edit/view details
    Record: InfoType = new InfoType;

    UQCUNITRECORD: SearchTable = new SearchTable();

    constructor(
        private mainService: InfoTypeService,
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
                this.InfoTypeList = response.infotypelist;
                this.AllInfoQlfrList = response.infoqlfrlist;
                this.AllInfoCodeList = response.infocodelist;
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
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
            this.Record.sw_info_uqc_id = _Record.id;
            this.Record.sw_info_uqc_code = _Record.code;
            this.Record.sw_info_uqc_name = _Record.name;
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
        this.Record = new InfoType();
        this.Record.sw_pkid = this.pkid;
        this.Record.sw_info_type_id = '';
        this.Record.sw_info_type_code = '';
        this.Record.sw_info_type_name = '';
        this.Record.sw_info_qfr_id = '';
        this.Record.sw_info_qfr_code = '';
        this.Record.sw_info_qfr_name = '';
        this.Record.sw_info_code_id = '';
        this.Record.sw_info_code_code = '';
        this.Record.sw_info_code_name = '';
        this.Record.sw_info_text = '';
        this.Record.sw_info_msr = 0;
        this.Record.sw_info_uqc_id = '';
        this.Record.sw_info_uqc_code = '';
        this.Record.sw_info_uqc_name = '';

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

    LoadData(_Record: InfoType) {
        this.Record = _Record;
        this.InitLov();
        this.UQCUNITRECORD.id = this.Record.sw_info_uqc_id;
        this.UQCUNITRECORD.code = this.Record.sw_info_uqc_code;
        this.UQCUNITRECORD.name = this.Record.sw_info_uqc_name;

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
            REC.sw_info_type_name = this.Record.sw_info_type_name;
            REC.sw_info_qfr_name = this.Record.sw_info_qfr_name;
            REC.sw_info_code_name = this.Record.sw_info_code_name;
            REC.sw_info_text = this.Record.sw_info_text;
            REC.sw_info_msr = this.Record.sw_info_msr;
            REC.sw_info_uqc_code = this.Record.sw_info_uqc_code;
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
        if (field == "sw_info_type_id") {
           this.InfoQlfrList = this.AllInfoQlfrList.filter(rec => rec.param_id5 == this.Record.sw_info_type_id);
           this.InfoCodeList = new Array<any>();
        }
       else if (field == "sw_info_qfr_id") {
            this.InfoCodeList = this.AllInfoCodeList.filter(rec => rec.param_id5 == this.Record.sw_info_qfr_id);
         }
    }

    OnBlur(field: string) {
        switch (field) {

            case 'sw_info_text':
                {
                    this.Record.sw_info_text = this.Record.sw_info_text.toUpperCase();
                    break;
                }
            case 'sw_info_msr':
                {
                    this.Record.sw_info_msr = this.gs.roundNumber(this.Record.sw_info_msr, 3);
                    break;
                }
        }
    }

}
