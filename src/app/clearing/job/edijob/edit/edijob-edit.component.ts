import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { GlobalService } from '../../../../core/services/global.service';
import { EdiJob } from '../../../models/edijob';
import { EdijobEditService } from '../../../services/edijobedit.service';
import { SearchTable } from '../../../../shared/models/searchtable';


@Component({
    selector: 'app-edijob-edit',
    templateUrl: './edijob-edit.component.html',
    providers: [EdijobEditService]
})
export class EdijobEditComponent {
    // Local Variables 
    title = 'EDI Job List';

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() pkid: string = '';
    @Input() parentid: string = '';
    @Output() ModifiedRecords = new EventEmitter<any>();

    selectedRowIndex: number = -1;

    modal: any;

    loading = false;
    currentTab = 'LIST';

    bChanged: boolean;

    ErrorMessage = "";
    InfoMessage = "";
    mode = 'ADD';

    // Array For Displaying List
    RecordList: EdiJob[] = [];
    // Single Record for add/edit/view details
    Record: EdiJob = new EdiJob;

    constructor(
        private mainService: EdijobEditService,
        private route: ActivatedRoute,
        private gs: GlobalService,
        private modalService: NgbModal,
    ) {

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        if (this.pkid)
            this.GetRecord();
        else
            alert('Invalid ID');
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }
 
    // Load a single Record for VIEW/EDIT
    GetRecord() {
        this.loading = true;
        let SearchData = {
            pkid: this.pkid,
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

    LoadData(_Record: EdiJob) {
        this.Record = _Record;
        this.Record.rec_mode = 'EDIT';
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
                if (this.ModifiedRecords != null)
                this.ModifiedRecords.emit({ saction: 'SAVE', sid: this.pkid, _rec: this.Record });
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

        if (this.Record.pkid.trim().length <= 0) {
            bret = false;
            sError += "\n\r | ID Cannot Be Blank";
        }

        /*
          if (this.Record.ord_desc.trim().length <= 0) {
            bret = false;
            sError += "\n\r | Description Cannot Be Blank";
          }
        */


        if (bret === false) {
            this.ErrorMessage = sError;
            alert(this.ErrorMessage);
        }
        return bret;
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

            // case 'ord_exp_name':
            //     {
            //         this.Record.ord_exp_name = this.Record.ord_exp_name.toUpperCase();
            //         break;
            //     }

        }
    }
    
}
