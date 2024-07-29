import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Ritcd } from '../../models/ritcd';
import { RitcdService } from '../../services/ritcd.service';
import { SearchTable } from '../../../shared/models/searchtable';

@Component({
    selector: 'app-ritcd',
    templateUrl: './ritcd.component.html',
    providers: [RitcdService]
})
export class RitcdComponent {
    // Local Variables 
    title = 'Ritcd List';

    // @ViewChild('pack_from') private pack_from: ElementRef;

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() parentid: string = '';

    Total_Amount: number = 0;

    selectedRowIndex: number = -1;

    loading = false;
    currentTab = 'LIST';

    bChanged: boolean;

    ErrorMessage = "";
    InfoMessage = "";
    mode = 'ADD';
    pkid = '';

    ctr: number;

    // Array For Displaying List
    RecordList: Ritcd[] = [];
    // Single Record for add/edit/view details
    Record: Ritcd = new Ritcd;

    SCHEMERECORD: SearchTable = new SearchTable();

    constructor(
        private mainService: RitcdService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.InitLov();

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.List("NEW");
        this.ActionHandler("ADD", null);
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    InitLov() {
        this.SCHEMERECORD = new SearchTable();
        this.SCHEMERECORD.controlname = "SCHEME";
        this.SCHEMERECORD.displaycolumn = "NAME";
        this.SCHEMERECORD.type = "SCHEME CODE";
        this.SCHEMERECORD.id = "";
        this.SCHEMERECORD.code = "";
        this.SCHEMERECORD.name = "";
    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "SCHEME") {
            this.Record.ritcd_scheme_id = _Record.id;
            this.Record.ritcd_scheme_code = _Record.code;
            this.Record.ritcd_scheme_name = _Record.name;
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
                    alert(this.ErrorMessage);
                });
    }

    NewRecord() {

        this.pkid = this.gs.getGuid();
        this.Record = new Ritcd();
        this.Record.ritcd_pkid = this.pkid;
        this.Record.ritcd_rate = 0;
        this.Record.ritcd_cap = 0;
        this.Record.ritcd_scheme_id = '';
        this.Record.ritcd_scheme_code = '';
        this.Record.ritcd_scheme_name = '';
        this.Record.ritcd_valid_date = '';
        this.Record.rec_mode = this.mode;

        this.InitLov();
 
        // this.pack_from.nativeElement.focus();
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

    LoadData(_Record: Ritcd) {
        this.Record = _Record;
        this.InitLov();
        this.SCHEMERECORD.id = this.Record.ritcd_scheme_id;
        this.SCHEMERECORD.code = this.Record.ritcd_scheme_code;
        this.SCHEMERECORD.name = this.Record.ritcd_scheme_name;
        this.Record.rec_mode = this.mode;

        // this.pack_from.nativeElement.focus();
    }

    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
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
                    alert(this.ErrorMessage);
                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';

        if (this.Record.ritcd_scheme_id.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Scheme Code Cannot Be Blank";
        }
        if (this.Record.ritcd_rate <= 0) {
            bret = false;
            sError += "\n\r | Invalid Rate";
        }

        if (bret === false) {
            this.ErrorMessage = sError;
            alert(this.ErrorMessage);
        }
        return bret;
    }

    RefreshList() {

        if (this.RecordList == null)
            return;
        var REC = this.RecordList.find(rec => rec.ritcd_pkid == this.Record.ritcd_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.ritcd_scheme_code = this.Record.ritcd_scheme_code;
            REC.ritcd_scheme_name = this.Record.ritcd_scheme_name;
            REC.ritcd_rate = this.Record.ritcd_rate;
            REC.ritcd_cap = this.Record.ritcd_cap;
            REC.ritcd_valid_date = this.Record.ritcd_valid_date;
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
                this.RecordList.splice(this.RecordList.findIndex(rec => rec.ritcd_pkid == this.pkid), 1);
                this.ActionHandler('ADD', null);
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
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
        if (field == 'ritcd_rate') {
            this.Record.ritcd_rate = this.gs.roundNumber(this.Record.ritcd_rate, 2);
        }
        if (field == 'ritcd_cap') {
            this.Record.ritcd_cap = this.gs.roundNumber(this.Record.ritcd_cap, 2);
        }
    }

}
