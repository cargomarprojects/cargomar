import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { RepService } from '../services/report.service';

@Component({
    selector: 'app-otp',
    templateUrl: './otp.component.html'
})
export class OtpComponent {

    title = 'Otp Details';

    @Output() ModifiedRecords = new EventEmitter<any>();
    @Input() public menuid: string = '';
    @Input() public type: string = '';

    InitCompleted: boolean = false;
    disableSave = true;
    loading = false;
    sub: any;
    urlid: string;
    opt_value: number = 0;
    opt_valid_date: string = '';

    ErrorMessage = "";
    InfoMessage = "";
    constructor(
        private route: ActivatedRoute,
        public gs: GlobalService,
        public mainService: RepService
    ) {
        // URL Query Parameter 
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.LoadCombo();
        this.SearchRecord("GSP-OPT", 'LIST');
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

    Save() {
        this.SearchRecord("GSP-OPT", 'SAVE');
    }

    Generate() {

        if (!confirm("Do you want to Generate OTP")) {
            return;
        }
        let SearchData2 = {
            report_folder: '',
            company_code: '',
            branch_code: '',
            user_code: '',
            return_period: ''
        };

        this.loading = true;
        SearchData2.report_folder = this.gs.globalVariables.report_folder;
        SearchData2.company_code = this.gs.globalVariables.comp_code;
        SearchData2.branch_code = this.gs.globalVariables.branch_code;
        SearchData2.user_code = this.gs.globalVariables.user_code;
        this.ErrorMessage = '';
        this.mainService.GenerateGspOtp(SearchData2)
            .subscribe(response => {
                this.loading = false;
                alert(response.retmsg)
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    SearchRecord(controlname: string, _type: string) {
        this.InfoMessage = '';
        this.ErrorMessage = '';

        if (_type == "SAVE")
            if (this.opt_value <= 0) {
                this.ErrorMessage = "Invalid  OTP";
                return;
            }

        this.loading = true;
        let SearchData = {
            table: controlname,
            type: _type,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            branch_pkid: this.gs.globalVariables.branch_pkid,
            user_code: this.gs.globalVariables.user_code,
            year_code: this.gs.globalVariables.year_code,
            year_name: this.gs.globalVariables.year_name,
            opt_value: this.opt_value
        };

        this.gs.SearchRecord(SearchData)
            .subscribe(response => {
                this.loading = false;

                this.opt_value = response.opt_value;
                this.opt_valid_date = response.opt_valid_date;
                if (_type == "SAVE")
                    alert('Save Complete');
            },
                error => {
                    this.loading = false;
                    this.InfoMessage = this.gs.getError(error);
                });
    }

}
