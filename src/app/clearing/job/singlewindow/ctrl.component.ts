import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChange } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { SwCtrl } from '../../models/swctrl';
import { SwCtrlService } from '../../services/swctrl.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { DateComponent } from '../../../shared/date/date.component';

@Component({
    selector: 'app-ctrl',
    templateUrl: './ctrl.component.html',
    providers: [SwCtrlService]
})
export class CtrlComponent {
    // Local Variables 
    title = 'Control';
    //   @ViewChild('lic_reg_no') private lic_reg_no: ElementRef;
    @ViewChild('sw_ctrl_startdate') private ctrl_startdate: DateComponent;
    @ViewChild('sw_ctrl_enddate') private ctrl_enddate: DateComponent;

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

    CtrlTypeList: any[] = [];
    CtrlResultList: any[] = [];

    AllCtrlResultList: any[] = [];

    // Array For Displaying List
    RecordList: SwCtrl[] = [];
    // Single Record for add/edit/view details
    Record: SwCtrl = new SwCtrl;

    UQCUNITRECORD: SearchTable = new SearchTable();

    constructor(
        private mainService: SwCtrlService,
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
                this.CtrlTypeList = response.ctrltypelist;
                this.AllCtrlResultList = response.ctrlresultlist;
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    InitLov() {
        // this.UQCUNITRECORD = new SearchTable();
        // this.UQCUNITRECORD.controlname = "UQC-UNIT";
        // this.UQCUNITRECORD.displaycolumn = "CODE";
        // this.UQCUNITRECORD.type = "UNIT";
        // this.UQCUNITRECORD.id = "";
        // this.UQCUNITRECORD.code = "";
        // this.UQCUNITRECORD.name = "";
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
        this.Record = new SwCtrl();
        this.Record.sw_pkid = this.pkid;
        this.Record.sw_ctrl_type_id = '';
        this.Record.sw_ctrl_type_code = '';
        this.Record.sw_ctrl_type_name = '';
        this.Record.sw_ctrl_location = '';
        this.Record.sw_ctrl_startdate = '';
        this.Record.sw_ctrl_enddate = '';
        this.Record.sw_ctrl_result_id = '';
        this.Record.sw_ctrl_result_code = '';
        this.Record.sw_ctrl_result_name = '';

        this.Record.rec_mode = this.mode;
        this.InitLov();
        this.CtrlResultList = new Array<any>();
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

    LoadData(_Record: SwCtrl) {
        this.Record = _Record;
        //this.InitLov();
        // this.UQCUNITRECORD.id = this.Record.sw_info_uqc_id;
        // this.UQCUNITRECORD.code = this.Record.sw_info_uqc_code;
        // this.UQCUNITRECORD.name = this.Record.sw_info_uqc_name;

        this.Record.rec_mode = this.mode;

        this.FillResultList();

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
        this.Record.rec_category = this.type;
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
            REC = this.RecordList.find(rec => rec.sw_pkid == this.Record.sw_pkid);
            REC.sw_ctrl_startdate = this.ctrl_startdate.GetDisplayDate();
            REC.sw_ctrl_enddate = this.ctrl_enddate.GetDisplayDate();

            var Rec = this.CtrlTypeList.find(rec => rec.param_pkid == this.Record.sw_ctrl_type_id);
            if (Rec != null) {
                REC.sw_ctrl_type_code = Rec.param_code;
                REC.sw_ctrl_type_name = Rec.param_name;
            }
            var Rec2 = this.CtrlResultList.find(rec => rec.param_pkid == this.Record.sw_ctrl_result_id);
            if (Rec2 != null) {
                REC.sw_ctrl_result_code = Rec2.param_code;
                REC.sw_ctrl_result_name = Rec2.param_name;
            }
        }
        else {
            REC.sw_ctrl_type_name = this.Record.sw_ctrl_type_name;
            REC.sw_ctrl_location = this.Record.sw_ctrl_location;
            REC.sw_ctrl_startdate = this.ctrl_startdate.GetDisplayDate();
            REC.sw_ctrl_enddate = this.ctrl_enddate.GetDisplayDate();
            REC.sw_ctrl_result_code = this.Record.sw_ctrl_result_code;
            REC.sw_ctrl_result_name = this.Record.sw_ctrl_result_name;
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
        if (field == "sw_ctrl_type_id") {
            this.FillResultList();
        }
    }

    FillResultList() {
        this.CtrlResultList = this.AllCtrlResultList.filter(rec => rec.param_id5 == this.Record.sw_ctrl_type_id);
    }


    OnBlur(field: string) {
        switch (field) {

            case 'sw_ctrl_location':
                {
                    this.Record.sw_ctrl_location = this.Record.sw_ctrl_location.toUpperCase();
                    break;
                }
        }
    }

}
