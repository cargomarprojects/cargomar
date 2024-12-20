import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Gstr2bDownload } from '../models/gstr2bdownload';
import { GstReconRepService } from '../services/gstreconrep.service';

@Component({
    selector: 'app-gstreconrepdet-edit',
    templateUrl: './gstreconrepdet-edit.component.html',
    providers: [GstReconRepService]
})

export class GstReconRepDetEditComponent {
    // Local Variables 
    title = '';

    @Input() record: Gstr2bDownload;

    pkid: string = '';
    jvh_branch: string = '';
    jvh_type: string = '';
    jvh_reference: string = '';
    jvh_reference_date: string = '';
    jvh_org_invno: string = '';
    jvh_org_invdt: string = '';
    jvh_vrno: string = '';
    jvh_date: string = '';

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

    SearchData = {
        pkid: '',
        jvh_branch: '',
        jvh_type: '',
        jvh_reference: '',
        jvh_reference_date: '',
        jvh_org_invno: '',
        jvh_org_invdt: '',
        jvh_vrno: '',
        jvh_date: ''
    }

    constructor(
        private mainService: GstReconRepService,
        private route: ActivatedRoute,
        private gs: GlobalService

    ) {

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.pkid = this.record.pkid;
        this.LoadInvoice();
    }


    LoadInvoice() {

        if (this.pkid.trim().length <= 0) {
            this.ErrorMessage = "Invalid ID";
            return;
        }
        this.SearchData.pkid = this.pkid;
        this.ErrorMessage = '';
        this.mainService.GetPurchaseInvoice(this.SearchData)
            .subscribe(response => {
                this.SearchData.jvh_branch = response.branch;
                this.SearchData.jvh_type = response.type;
                this.SearchData.jvh_vrno = response.vrno;
                this.SearchData.jvh_date = response.vrdate;
            },
                error => {
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    InitComponent() {

    }

    // Save Data
    Save() {
        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';

        this.mainService.SavePurchaseInvoice(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                if (response.status == "OK") {
                //   this.record.job_remarks = this.remarks.toUpperCase();
                  this.record.rec_displayed = false;
                }
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

        // if (this.remarks.toString().length <= 0) {
        //     bret = false;
        //     sError = " | Remarks Cannot Be Blank";
        // }

        // if (bret === false)
        //     this.ErrorMessage = sError;
        return bret;
    }


    Close() {
        this.record.rec_displayed = false;

    }


}
