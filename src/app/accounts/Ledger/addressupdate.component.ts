import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';

@Component({
    selector: 'app-addressupdate',
    templateUrl: './addressupdate.component.html',
})
export class AddressUpdateComponent {
    // Local Variables 
    title = 'Address';

    @Output() ModifiedAddress = new EventEmitter<any>();
    @Input() public pkid: string;
    @Input() public addslno: number;

    InitCompleted: boolean = false;
    menu_record: any;
    disableSave = true;
    loading = false;

    sub: any;
    urlid: string;
    addres_slno: number;
    ErrorMessage = "";
    InfoMessage = "";

    constructor(
        private route: ActivatedRoute,
        private gs: GlobalService

    ) {

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.addres_slno = this.addslno;
        if (!this.InitCompleted) {
            this.InitComponent();
        }
        this.LoadCombo();
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
    Save() {

        if (!this.allvalid())
            return;
        this.SearchRecord("SAVE");
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';
        this.InfoMessage = '';
        // if (this.costupdt_date.trim().length <= 0) {
        //   sError = "Date Cannot Be Blank";
        //   bret = false;
        // }

        // if (bret === false)
        //   this.ErrorMessage = sError;
        return bret;
    }
    SearchRecord(_type: string) {
        this.InfoMessage = '';
        this.ErrorMessage = '';
        if (this.pkid.trim().length <= 0) {
            this.ErrorMessage = "Invalid ID";
            return;
        }

        this.loading = true;
        let SearchData = {
            type: _type,
            company_code: '',
            branch_code: '',
            pkid: this.pkid,
            addres_slno: this.addres_slno,
            table: 'updatecompanyaddslno',
        };

        SearchData.company_code = this.gs.globalVariables.comp_code;
        SearchData.branch_code = this.gs.globalVariables.branch_code;
        SearchData.pkid = this.pkid;
        SearchData.addres_slno = this.addres_slno;
        SearchData.table = 'updatecompanyaddslno';

        this.gs.SearchRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.InfoMessage = '';
                this.ErrorMessage = '';
                if (response.serror.length > 0) {
                    this.ErrorMessage = response.serror;
                    alert(this.ErrorMessage);
                } else {

                    if (this.ModifiedAddress != null)
                        this.ModifiedAddress.emit({ saction: 'SAVE', spkid: this.pkid, saddres_slno: this.addres_slno });
                    this.InfoMessage = "Save Complete";
                }
            },
                error => {
                    this.loading = false;
                    this.InfoMessage = this.gs.getError(error);
                });
    }

    Close() {
        if (this.ModifiedAddress != null)
            this.ModifiedAddress.emit({ saction: 'CLOSE' });
    }
}
