import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { GlobalService } from '../../../../core/services/global.service';
import { EdiJob, EdiJobPacking } from '../../../models/edijob';
import { EdijobEditService } from '../../../services/edijobedit.service';
import { SearchTable } from '../../../../shared/models/searchtable';


@Component({
    selector: 'app-edijobpacking-edit',
    templateUrl: './edijobpacking-edit.component.html',
    providers: [EdijobEditService]
})
export class EdiJobpackingEditComponent {
    // Local Variables 
    title = 'JOb Packing List';

    mdate: string;

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() RecordList: EdiJobPacking[] = [];
    InitCompleted: boolean = false;
    menu_record: any;

    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    bAdmin = false;
    bEdit = false;

    selectedRowIndex = 0;
    searchstring = '';
    sub: any;
    urlid: string;

    ErrorMessage = "";
    InfoMessage = "";

    mode = '';
    pkid = '';

    constructor(
        private mainService: EdijobEditService,
        private route: ActivatedRoute,
        private gs: GlobalService

    ) {



    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        if (!this.InitCompleted) {
            this.InitComponent();
            this.InitCompleted = true;
        }
    }

    InitComponent() {
        this.bAdmin = false;
        this.bEdit = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_admin)
                this.bAdmin = true;
            if (this.menu_record.rights_edit)
                this.bEdit = true;
        }
        this.LoadCombo();
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
    }

    LovSelected(_Record: any) {
    }
    LoadCombo() {

    }


    allvalid(_rec: EdiJobPacking) {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';

        if (this.gs.isBlank(_rec.pack_from)) {
            bret = false;
            sError += "\n\r  Packing From Has to be entered";
        }

        if (this.gs.isBlank(_rec.pack_to)) {
            bret = false;
            sError += "\n\r Packing To Has to be entered";
        }

        if (this.gs.isBlank(_rec.pack_unit)) {
            bret = false;
            sError += "\n\r Packing Unit Has to be entered";
        }

        if (bret === false)
            alert(sError);
        return bret;
    }

    UpdateRecord(_rec: EdiJobPacking) {
        if (!this.allvalid(_rec))
            return;
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        _rec._globalvariables = this.gs.globalVariables;
        this.mainService.UpdatePackingRecord(_rec)
            .subscribe(response => {
                this.loading = false;
                alert("Record Updated");
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

}
