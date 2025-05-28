import { Component, Input, Output, OnInit, OnDestroy, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { TdsExemption } from '../models/tdsexemption';
import { TdsExemptionService } from '../services/tdsexemption.service';

@Component({
    selector: 'app-tdscertno',
    templateUrl: './tdscertno.component.html',
    providers: [TdsExemptionService]
})
export class TdsCertnoComponent {
    // Local Variables 
    title = 'Tds Exemption List';
    @Output() ModifiedRecords = new EventEmitter<any>();
    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() pan_id: string = '';
    @Input() tds_acc_id: string = '';

    @ViewChild('_tabset') tabsetCtrl: any;

    selectedRowIndex: number = -1;
    InitCompleted: boolean = false;
    menu_record: any;
    sub: any;

    loading = false;
    currentTab = 'LIST';

    bAdmin = false;
    bChanged: boolean;

    ErrorMessage = "";
    InfoMessage = "";
    pkid = "";
    // Array For Displaying List
    RecordList: TdsExemption[] = [];
    // Single Record for add/edit/view details
    Record: TdsExemption = new TdsExemption;

    constructor(
        private mainService: TdsExemptionService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.pkid = this.gs.getGuid();
        this.InitComponent();
        this.mainService.init(this.pkid);
        this.TdsCertList("NEW");
    }

    InitComponent() {
        this.bAdmin = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            if (this.menu_record.rights_admin)
                this.bAdmin = true;
        }
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    TdsCertList(_type: string) {
        this.loading = true;
        let SearchData = {
            type: _type,
            rowtype: this.type,
            pan_id: this.pan_id,
            tds_acc_id: this.tds_acc_id,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.TdsCertList(SearchData)
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

    List(_type: string) {

        if (this.gs.isBlank(this.mainService.state.certno)) {
            alert('Certificate number cannot be blank');
            return;
        }

        this.loading = true;
        let SearchData = {
            type: _type,
            rowtype: this.type,
            searchstring: this.mainService.state.searchstring,
            page_count: this.mainService.state.page_count,
            page_current: this.mainService.state.page_current,
            page_rows: this.mainService.state.page_rows,
            page_rowcount: this.mainService.state.page_rowcount,
            cert_no: this.mainService.state.certno,
            pan_id: this.mainService.state.pan_id,
            tds_acc_id: this.mainService.state.tds_acc_id,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code
        };

        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.mainService.TdsCertDetList(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.mainService.state.RecordList = response.list;
                this.mainService.state.page_count = response.page_count;
                this.mainService.state.page_current = response.page_current;
                this.mainService.state.page_rowcount = response.page_rowcount;
                this.mainService.state.totAmt = response.totamt;
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

    cancel() {
        if (this.ModifiedRecords != null)
            this.ModifiedRecords.emit({ status: 'CLOSE' });
    }

    SelectCertificate(_rec: TdsExemption) {
        if (this.ModifiedRecords != null)
            this.ModifiedRecords.emit({ status: 'SAVE', certno: _rec.te_cert_no, certrate: _rec.te_tds_cert_rate, certbalamt: _rec.te_bal_amt });
    }

    ClearSelection() {
        if (this.ModifiedRecords != null)
            this.ModifiedRecords.emit({ status: 'CLEAR' });
    }


    OnBlur(controlname: string) {
        if (controlname == 'searchstring') {
            this.mainService.state.searchstring = this.mainService.state.searchstring.toUpperCase();
        }
    }

    showCertDetail(_rec: TdsExemption) {
        this.mainService.state.searchstring = '';
        this.mainService.state.certno = _rec.te_cert_no;
        this.mainService.state.pan_id = _rec.te_pan_id;
        this.mainService.state.tds_acc_id = _rec.te_tds_acc_id;
        if (!this.gs.isBlank(this.tabsetCtrl))
            this.tabsetCtrl.select('tabdetail');
        this.List("NEW");
    }
}