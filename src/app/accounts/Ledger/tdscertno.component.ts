import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
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
        this.InitComponent();
        this.List("NEW");
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

    List(_type: string) {
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

        if (controlname == 'te_tds_rate') {
            this.Record.te_tds_rate = this.gs.roundNumber(this.Record.te_tds_rate, 2);
        }
    }

}