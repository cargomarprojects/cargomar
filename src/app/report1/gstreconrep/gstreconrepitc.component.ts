import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Gstr2bDownload } from '../models/gstr2bdownload';
import { GstReconRepService } from '../services/gstreconrep.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-gstreconrepitc',
    templateUrl: './gstreconrepitc.component.html',
    providers: [GstReconRepService]
})

export class GstReconRepItcComponent {
    title = 'GST Reconcile Report'

    @Input() menuid: string = '';
    @Input() type: string = '';

    InitCompleted: boolean = false;
    menu_record: any;
    sub: any;
    urlid: string;

    ErrorMessage = "";
    mode = '';
    pkid = '';
    modal: any;
    selectedRowIndex = 0;
    // recon_year = 0;
    // recon_month = 0;
    gstin_supplier: string = "";
    period_id: string = "";
    claim_period: string = "";

    branch_code: string = '';
    // format_type: string = '';
    from_date: string = '';
    to_date: string = '';
    searchstring = '';
    display_format_type: string = '';
    reconcile_state_name: string = "KERALA";
    reconcile_state_code: string = "32";
    round_off: number = 5;
    chk_pending: boolean = true;
    // claim_status: string = 'ITC AVAILED';

    bCompany = false;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    chkallselected: boolean = false;
    selectdeselect: boolean = false;

    SearchData = {
        type: '',
        pkid: '',
        report_folder: '',
        company_code: '',
        branch_code: '',
        year_code: '',
        searchstring: '',
        from_date: '',
        to_date: '',
        format_type: '',
        user_code: '',
        state_name: '',
        state_code: '',
        round_off: 5,
        recon_year: 0,
        recon_month: 0,
        chk_pending: this.chk_pending,
        hide_ho_entries: this.gs.globalVariables.hide_ho_entries
    };

    // Array For Displaying List
    RecordList: Gstr2bDownload[] = [];
    //  Single Record for add/edit/view details
    Record: Gstr2bDownload = new Gstr2bDownload;

    constructor(
        private modalService: NgbModal,
        private mainService: GstReconRepService,
        private route: ActivatedRoute,
        public gs: GlobalService
    ) {


    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.Init();
    }


    Init() {
        this.branch_code = this.gs.globalVariables.branch_code;
        this.display_format_type = this.gs.defaultValues.gst_recon_itc_status;

    }

    // // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    initLov(caption: string = '') {

    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "STATE") {
            this.gs.defaultValues.gst_recon_itc_state_code = _Record.code;
            this.gs.defaultValues.gst_recon_itc_state_name = _Record.name;
        }
    }
    LoadCombo() {

        // this.loading = true;
        // let SearchData = {
        //   comp_code: this.gs.globalVariables.comp_code,
        //   branch_code: this.gs.globalVariables.branch_code
        // };
        // SearchData.comp_code = this.gs.globalVariables.comp_code;
        // SearchData.branch_code = this.gs.globalVariables.branch_code;
        // this.ErrorMessage = '';
        // this.mainService.LoadDefault(SearchData)
        //   .subscribe(response => {
        //     this.loading = false;
        //     // this.BranchList = response.branchlist;
        //   },
        //     error => {
        //       this.loading = false;
        //       this.ErrorMessage = this.gs.getError(error);
        //     });

    }


    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {
        this.ErrorMessage = '';
        if (action == 'LIST') {
            this.mode = '';
            this.pkid = '';
            this.currentTab = 'LIST';
        }
    }


    // // Query List Data
    List(_type: string) {
        if (this.gs.isBlank(this.reconcile_state_name)) {
            alert("State Cannot be Blank");
            return;
        }
        if (+this.gs.defaultValues.gst_recon_itc_year <= 0) {
            alert("Invalid Year");
            return;
        } else if (+this.gs.defaultValues.gst_recon_itc_year < 100) {
            alert("YEAR FORMAT : - YYYY ");
            return;
        }
        if (+this.gs.defaultValues.gst_recon_itc_month <= 0 || +this.gs.defaultValues.gst_recon_itc_month > 12) {
            alert("Invalid Month");
            return;
        }

        this.display_format_type = this.gs.defaultValues.gst_recon_itc_status;
        this.loading = true;
        this.pkid = this.gs.getGuid();
        this.SearchData.pkid = this.pkid;
        this.SearchData.report_folder = this.gs.globalVariables.report_folder;
        this.SearchData.company_code = this.gs.globalVariables.comp_code;
        this.SearchData.branch_code = this.branch_code;
        this.SearchData.year_code = this.gs.globalVariables.year_code;
        this.SearchData.searchstring = this.searchstring.toUpperCase();
        this.SearchData.type = _type;
        this.SearchData.format_type = this.gs.defaultValues.gst_recon_itc_status;
        this.SearchData.user_code = this.gs.globalVariables.user_code;
        this.SearchData.state_code = this.gs.defaultValues.gst_recon_itc_state_code;
        this.SearchData.state_name = this.gs.defaultValues.gst_recon_itc_state_name;
        this.SearchData.round_off = this.round_off;
        this.SearchData.recon_year = +this.gs.defaultValues.gst_recon_itc_year;
        this.SearchData.recon_month = +this.gs.defaultValues.gst_recon_itc_month;
        this.ErrorMessage = '';
        this.mainService.ItcList(this.SearchData)
            .subscribe(response => {
                this.loading = false;
                this.chkallselected = false;
                this.selectdeselect = false;
                this.claim_period = response.claimperiod;
                if (_type == 'EXCEL') {
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                }
                else {
                    this.RecordList = response.list;
                }
            },
                error => {
                    this.loading = false;
                    this.RecordList = null;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }

    OnChange(field: string) {
        this.RecordList = null;
    }
    Close() {
        this.gs.ClosePage('home');
    }

    ShowHideRecord(_rec: Gstr2bDownload) {
        // _rec.row_displayed = !_rec.row_displayed;
    }

    OnBlur(field: string) {
        if (field == "searchstring")
            this.searchstring = this.searchstring.toUpperCase();
    }


    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }
    SelectDeselect() {
        this.selectdeselect = !this.selectdeselect;
        for (let rec of this.RecordList) {
            rec.rec_selected = this.selectdeselect;
        }
    }

    UpdateItcClaim() {

        let sPkids: string = "";//Main List
        let _Ctr: number = 0;
        let _status: string = "";
        for (let rec of this.RecordList) {
            if (rec.rec_selected) {
                _status = rec.reconcile_status;
                _Ctr++;
                if (sPkids != "")
                    sPkids += ",";
                sPkids += rec.pkid;
            }
        }

        if (this.gs.isBlank(sPkids)) {
            alert('No Records selected');
            return;
        }

        if (_status == "MATCHED" || _status == "ALMOST MATCHED" || _status == "MISMATCHED (GST AMOUNT)" || _status == "MISMATCHED (PERIOD)") {
            if (this.RecordList.length != _Ctr) {
                alert('Please select all Records');
                return;
            }
        }

        if (!confirm("Update Claim Status")) {
            return;
        }

        let SearchData2 = {
            pkid: sPkids,
            claim_status: this.gs.defaultValues.gst_recon_itc_claim_status,
            claim_period: this.claim_period
        };

        this.loading = true;
        this.ErrorMessage = '';
        this.mainService.UpdateItcClaim(SearchData2)
            .subscribe(response => {
                this.loading = false;
                if (response.retvalue) {
                    let pkidsArray = sPkids.split(',');
                    for (let i = 0; i < pkidsArray.length; i++) {
                        for (let rec of this.RecordList.filter(rec => rec.pkid == pkidsArray[i])) {
                            rec.claim_status = this.gs.defaultValues.gst_recon_itc_claim_status;
                        }
                    }
                }
                // alert('Save Completed')
                // this.BranchList = response.branchlist;
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }
}