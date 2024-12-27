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

    @Input() record: Gstr2bDownload = new Gstr2bDownload;

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
    SearchData = {
        pkid: '',
        jvh_branch: '',
        jvh_type: '',
        jvh_reference: '',
        jvh_reference_date: '',
        jvh_org_invno: '',
        jvh_org_invdt: '',
        jvh_vrno: '',
        jvh_date: '',
        jvh_party_name: '',
        company_code: this.gs.globalVariables.comp_code,
        branch_code: this.gs.globalVariables.branch_code,
        user_code: this.gs.globalVariables.user_code,
        jvh_docno: this.record.source
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
        this.SearchData.jvh_docno = this.record.source;
        this.ErrorMessage = '';
        this.mainService.GetPurchaseInvoice(this.SearchData)
            .subscribe(response => {
                this.SearchData.jvh_branch = response.branchcode;
                this.SearchData.jvh_type = response.vrtype;
                this.SearchData.jvh_vrno = response.vrno;
                this.SearchData.jvh_date = response.vrdate;
                this.SearchData.jvh_party_name = response.partyname;
                this.SearchData.jvh_reference = response.jvh_reference;
                this.SearchData.jvh_reference_date = response.jvh_reference_date;
                this.SearchData.jvh_org_invno = response.jvh_org_invno;
                this.SearchData.jvh_org_invdt = response.jvh_org_invdt;

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

        if (!confirm("Do you want to Save")) {
            return;
        }

        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';

        this.mainService.SavePurchaseInvoice(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                if (response.retvalue) {
                    this.SearchData.jvh_reference = response.jvh_reference;
                    this.SearchData.jvh_reference_date = response.jvh_reference_date;
                    this.SearchData.jvh_org_invno = response.jvh_org_invno;
                    this.SearchData.jvh_org_invdt = response.jvh_org_invdt;
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
