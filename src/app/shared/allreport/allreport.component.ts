import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';

@Component({
    selector: 'app-allreport',
    templateUrl: './allreport.component.html'
})
export class AllReportComponent {
    // Local Variables 
    title = 'Refersh Details';

    @Output() ModifiedRecords = new EventEmitter<any>();
    @Input() public reportname: string = '';
    @Input() public branch_code: string = '';
    @Input() public company_code: string = '';
    @Input() public canrefresh: boolean = false;

    InitCompleted: boolean = false;
    disableSave = true;
    loading = false;
    sub: any;
    urlid: string;

    refereshby = "";
    ErrorMessage = "";
    InfoMessage = "";
    constructor(
        private route: ActivatedRoute,
        public gs: GlobalService
    ) {
        // URL Query Parameter 
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.LoadCombo();
        this.SearchRecord("allreport", 'LIST');
    }

    InitComponent() {

    }


    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        // this.sub.unsubscribe();
    }

    LoadCombo() {


    }

    // Save Data
    OnBlur(field: string) {

    }
    Close() {

    }
    Referesh() {
        this.SearchRecord("allreport", 'REFERESH');
    }
    SearchRecord(controlname: string, _type: string) {
        this.InfoMessage = '';
        this.ErrorMessage = '';
        if (this.reportname.trim().length <= 0) {
            this.ErrorMessage = "Invalid  Name";
            return;
        }

        this.loading = true;
        let SearchData = {
            table: 'allreport',
            type: _type,
            reportname: this.reportname,
            company_code: this.company_code,
            branch_code: this.branch_code,
            user_code: this.gs.globalVariables.user_code
        };

        this.gs.SearchRecord(SearchData)
            .subscribe(response => {
                this.loading = false;

                this.refereshby = response.allreport;

                // else {
                //   if (this.ModifiedRecords != null)
                //     this.ModifiedRecords.emit({ saction: this.type, sid: this.pkid, sdate: response.checksentcosting  });
                //   this.InfoMessage = "Save Complete";

                // }
            },
                error => {
                    this.loading = false;
                    this.InfoMessage = this.gs.getError(error);
                });
    }

}
