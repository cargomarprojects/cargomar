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
    @Input() period: number = 2020;
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
        jvh_docno: this.record.source,
        igst: 0,
        cgst: 0,
        sgst: 0,
        gst_bal: 0,
        category: '',
        period: this.period
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
        if (this.record.download_source == "PURCHASE")
            this.LoadInvoice();
        if (this.record.download_source == "GSTR-2B") {
            if (this.pkid.trim().length <= 0) {
                alert("Invalid ID");
                return;
            }
            this.SearchData.pkid = this.pkid;
            this.SearchData.igst = this.record.integrated_tax;
            this.SearchData.cgst = this.record.central_tax;
            this.SearchData.sgst = this.record.state_ut_tax;
        }
        this.SearchData.category = this.record.rec_category;
        this.SearchData.period = this.period;
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
        if (this.record.download_source == "PURCHASE")
            this.saveInvoice();
        if (this.record.download_source == "GSTR-2B")
            this.saveGst();
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

        // if (this.record.download_source == "GSTR-2B") {
        //     if (this.SearchData.gst_bal <= 5) {
        //         alert('Invalid Balance');
        //         bret = false;
        //     }
        // }

        return bret;
    }

    saveInvoice() {
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
                    if (this.ModifiedRecords != null)
                        this.ModifiedRecords.emit({ stype: 'SAVE' });
                }
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }


    saveGst() {
        this.loading = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.SaveGstAmt(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                if (response.retvalue) {
                    this.record.integrated_tax = response.igst;
                    this.record.central_tax = response.cgst;
                    this.record.state_ut_tax = response.sgst;
                    this.record.gst_bal = response.gst_bal;
                    this.record.rec_displayed = false;
                }
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    Close() {
        this.record.rec_displayed = false;
    }

    OnBlur(field: string) {
        if (field == "igst") {
            this.SearchData.gst_bal = this.record.integrated_tax_actual - this.SearchData.igst;
            this.SearchData.gst_bal = this.gs.roundNumber(this.SearchData.gst_bal, 2);
        }
        if (field == "cgst") {
            this.SearchData.sgst = this.SearchData.cgst;
            this.SearchData.gst_bal = this.record.central_tax_actual + this.record.state_ut_tax_actual - (this.SearchData.cgst + this.SearchData.sgst);
            this.SearchData.gst_bal = this.gs.roundNumber(this.SearchData.gst_bal, 2);
        }
        if (field == "sgst") {
            this.SearchData.cgst = this.SearchData.sgst;
            this.SearchData.gst_bal = this.record.central_tax_actual + this.record.state_ut_tax_actual - (this.SearchData.cgst + this.SearchData.sgst);
            this.SearchData.gst_bal = this.gs.roundNumber(this.SearchData.gst_bal, 2);
        }
    }

}
