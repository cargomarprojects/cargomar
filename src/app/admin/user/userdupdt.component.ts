import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Userd } from '../models/userd';

@Component({
    selector: 'app-userdupdt',
    templateUrl: './userdupdt.component.html'
})

export class UserdUpdtComponent {
    // Local Variables 
    title = '';

    @Input() record: Userd;
    @Output() ModifiedRecords = new EventEmitter<any>();

    pkid: string = '';

    InitCompleted: boolean = false;
    menu_record: any;

    disableSave = true;
    loading = false;
    currentTab = 'LIST';

    sub: any;
    urlid: string;

    ErrorMessage = "";
    InfoMessage = "";

    mode = '';

    // Array For Displaying List

    // Single Record for add/edit/view details

    constructor(
        private route: ActivatedRoute,
        private gs: GlobalService

    ) {
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.pkid = this.record.user_id;
        this.InitLov();
    }

    InitComponent() {

    }

    InitLov() {

    }
    LovSelected(_Record: SearchTable) {

    }
    // Save Data
    Save() {
        if (!this.allvalid())
            return;

        if (this.ModifiedRecords != null)
            this.ModifiedRecords.emit({ saction: "SAVE", rec: this.record });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';

        if (this.gs.isBlank(this.record.user_dsc_slno)) {
            bret = false;
            sError += ' | DSC SL# Cannot be blank'
        }
        if (this.gs.isBlank(this.record.user_icegate_id)) {
            bret = false;
            sError += ' | Icegate ID Cannot be blank'
        }
        if (this.gs.isBlank(this.record.user_icegate_pwd)) {
            bret = false;
            sError += ' | Icegate password Cannot be blank'
        }

        if (bret === false) {
            this.ErrorMessage = sError;
            alert(this.ErrorMessage);
        }
        return bret;
    }


    Close() {
        if (this.ModifiedRecords != null)
            this.ModifiedRecords.emit({ saction: "CLOSE"});
    }

    OnBlur(field: string) {
        switch (field) {
            // case 'hbl_inv_remarks':
            //     {
            //         this.hbl_inv_remarks = this.hbl_inv_remarks.toUpperCase();
            //         break;
            //     }
        }
    }

}