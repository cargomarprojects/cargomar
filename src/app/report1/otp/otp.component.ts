import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { RepService } from '../services/report.service';
import { Companym } from '../../admin/models/company';

@Component({
    selector: 'app-otp',
    templateUrl: './otp.component.html'
})
export class OtpComponent {

    title = 'Otp Details';

    @Output() ModifiedRecords = new EventEmitter<any>();
    @Input() public menuid: string = '';
    @Input() public type: string = '';
    @Input() public retperiod: string = '';
    @Input() bSave: boolean = false;

    InitCompleted: boolean = false;
    disableSave = true;
    loading = false;
    sub: any;
    urlid: string;
    opt_value: number = 0;
    opt_valid_date: string = '';
    RecordList: Companym[] = [];

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
        this.SearchRecord("GSP-OTP", 'LIST', null);
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

    Save(_rec: Companym) {

        if (_rec.comp_gsp_otp.length <= 0) {
            alert("Invalid  OTP");
            return;
        }

        if (!confirm("Do you want to Save OTP")) {
            return;
        }
        this.SearchRecord("GSP-OTP", 'SAVE', _rec);
    }

    Generate(_rec: Companym) {

        if (!confirm("Do you want to Generate OTP")) {
            return;
        }

        let SearchData2 = {
            type: 'OTP',
            report_folder: '',
            company_code: '',
            branch_code: '',
            year_code: '',
            user_code: '',
            state_code: '',
            return_period: ''
        };

        this.loading = true;
        SearchData2.type = 'OTP';
        SearchData2.report_folder = this.gs.globalVariables.report_folder;
        SearchData2.company_code = this.gs.globalVariables.comp_code;
        SearchData2.branch_code = "";
        SearchData2.year_code = this.gs.globalVariables.year_code;
        SearchData2.user_code = this.gs.globalVariables.user_code;
        SearchData2.state_code = _rec.comp_gstin_state_code;
        SearchData2.return_period = this.retperiod;
        this.ErrorMessage = '';
        this.mainService.GenerateGspOtp(SearchData2)
            .subscribe(response => {
                this.loading = false;
                alert(response.status)
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }

    SearchRecord(controlname: string, _type: string, _rec: Companym) {
        this.InfoMessage = '';
        this.ErrorMessage = '';

        if (_type == "SAVE")
            if (_rec.comp_gsp_otp.length <= 0) {
                this.ErrorMessage = "Invalid  OTP";
                return;
            }

        this.loading = true;
        let SearchData = {
            table: controlname,
            type: _type,
            company_code: this.gs.globalVariables.comp_code,
            comp_gstin_state_code: _rec == null ? '' : _rec.comp_gstin_state_code,
            comp_gsp_user: _rec == null ? '' : _rec.comp_gsp_user,
            opt_value: _rec == null ? '' : _rec.comp_gsp_otp
        };

        this.gs.SearchRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
                if (_type == "SAVE")
                    alert('Save Complete');
            },
                error => {
                    this.loading = false;
                    this.InfoMessage = this.gs.getError(error);
                });
    }

    passwordVisibility(_rec: Companym) {
        _rec.comp_pwd_visible = !_rec.comp_pwd_visible;
    }
}
