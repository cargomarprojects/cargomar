import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { EdiOrder } from '../../models/ediorder';

@Component({
    selector: 'app-ediordupdate',
    templateUrl: './ediordupdate.component.html',
})
export class EdiOrdUpdateComponent {
    // Local Variables 
    title = 'EDI Update Details';

    @Output() ModifiedRecords = new EventEmitter<any>();
    @Input() menuid: string = '';
    @Input() public pkid: string;
    @Input() public type: string = '';
    @Input() public pono: string = '';
    @Input() public poid: string = '';
    @Input() public styleno: string = '';
    InitCompleted: boolean = false;
    menu_record: any;

    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    sub: any;
    urlid: string;
    ErrorMessage = "";
    InfoMessage = "";
    ord_agentref_id = "";
    RecordList: EdiOrder[] = [];

    constructor(
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {

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
        this.LoadCombo();
    }

    InitComponent() {

        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record)
            this.title = this.menu_record.menu_name;
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    LoadCombo() {
        this.ErrorMessage = '';
        this.SearchRecord('ediordupdate', 'LIST');
    }

    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.SearchRecord('ediordupdate', 'SAVE');
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        if (this.ord_agentref_id.trim().length <= 0) {
            sError = "Ref# Cannot Be Blank";
            bret = false;
        }

        if (bret === false)
            this.ErrorMessage = sError;
        return bret;
    }

    SearchRecord(controlname: string, _type: string) {
        this.InfoMessage = '';
        this.ErrorMessage = '';
        if (this.pkid.trim().length <= 0) {
            this.ErrorMessage = "Invalid ID";
            return;
        }

        this.loading = true;
        let SearchData = {
            pkid: this.pkid,
            rowtype: this.type,
            agent_refno: this.ord_agentref_id,
            table: controlname,
            type: _type,
            pono: ''
        };

        SearchData.pono = this.pono;
        SearchData.pkid = this.pkid;
        SearchData.agent_refno = this.ord_agentref_id;
        SearchData.table = controlname;

        this.gs.SearchRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.InfoMessage = '';

                if (_type == "LIST") {
                    if (response.ediordupdate.length > 0)
                        this.ord_agentref_id = response.ediordupdate;
                    else
                        this.ord_agentref_id = "";
                    this.RecordList = response.list;
                }
                else {

                    if (response.serror.length > 0) {
                        this.ErrorMessage = response.serror;
                        alert(this.ErrorMessage);
                    } else {
                        if (this.ModifiedRecords != null)
                            this.ModifiedRecords.emit({ saction: 'SAVE', sid: this.pkid, srefno: response.ediordupdate });
                        this.InfoMessage = "Save Complete";
                    }
                }
            },
                error => {
                    this.loading = false;
                    this.InfoMessage = this.gs.getError(error);
                });
    }

    Close() {
        //if (this.ModifiedRecords != null)
        //  this.ModifiedRecords.emit({ saction: 'CLOSE', sRec: this.Record });
    }
    OnBlur(field: string) {
        switch (field) {

            case 'ord_agentref_id':
                {
                    this.ord_agentref_id = this.ord_agentref_id.toUpperCase();
                    break;
                }
        }
    }

    Getagentrefno(_refno: string) {
        this.ord_agentref_id = _refno;
    }

    CreateOrder(_type: string) {
        if (_type == "VALIDATE") {
            if (this.ModifiedRecords != null)
                this.ModifiedRecords.emit({ saction: 'VALIDATE', sid: this.pkid, srefno: '' });
        }

        if (_type == "CREATE-PO") {
            if (!confirm("Do you want to Create PO " + this.pono + " with style " + this.styleno + " in Order List")) {
                return;
            }
            if (this.ModifiedRecords != null)
                this.ModifiedRecords.emit({ saction: 'CREATE-PO', sid: this.pkid, srefno: '' });
        }
    }
}
