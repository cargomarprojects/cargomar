
import { Component, Input, Output, OnInit, OnDestroy, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { OsRep } from '../models/osrep';
import { SalesFollowupService } from '../services/salesfollowup.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
//EDIT-AJITH-07-09-2021

@Component({
    selector: 'app-salesfollowupinv',
    templateUrl: './salesfollowupinv.component.html',
    providers: [SalesFollowupService]
})


export class SalesFollowupInvComponent {
    // Local Variables 
    title = 'Invoice Wise';

    @Input() public branch: string = '';
    @Input() public sman: string = '';
    @Input() public party: string = '';
    @Input() public reportdate: string = '';
    @Input() menuid: string = '';
    @Output() ModifiedRecords = new EventEmitter<any>();

    menu_record: any;
    InitCompleted: boolean = false;
    loading = false;
    currentTab = 'LIST';
    sub: any;
    modal: any;

    pkid = "";
    ErrorMessage = "";
    InfoMessage = "";
    RecordList: OsRep[] = [];

    constructor(
        private mainService: SalesFollowupService,
        private modalService: NgbModal,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {

        // URL Query Parameter 

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        // this.menu_record = this.gs.getMenu(this.menuid);
        // if (this.menu_record) {
        //     this.title = this.menu_record.menu_name;
        // }

        this.InvoiceList('SCREEEN');
    }

    InitComponent() {


    }


    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }



    // Save Data
    OnBlur(field: string) {

    }


    InvoiceList(_type: string) {


        this.pkid = this.gs.getGuid();

        let SearchData2 = {
            type: _type,
            pkid: this.pkid,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            user_pkid: this.gs.globalVariables.user_pkid,
            year_code: this.gs.globalVariables.year_code,
            report_folder: this.gs.globalVariables.report_folder,
            branch: this.branch,
            sman: this.sman,
            party: this.party,
            report_date: this.reportdate,
            isadmin: false,
            iscompany: false
        };

        this.loading = true;

        this.ErrorMessage = '';
        this.mainService.InvoiceList(SearchData2)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname)
                else {
                    this.RecordList = response.list;
                }
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    Close() {

        if (this.ModifiedRecords != null)
            this.ModifiedRecords.emit({ saction: 'CLOSE' });

    }

    Download(_rec: OsRep) {
        //   this.Downloadfile(_rec.doc_file_path, "SB", _rec.doc_file_name);
    }
    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }

}
