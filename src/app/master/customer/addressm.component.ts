import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { Addressm } from '../models/addressm';

import { CustomerService } from '../services/customer.service';
import { Addressdel } from '../models/addressdel';


@Component({
    selector: 'app-addressm',
    templateUrl: './addressm.component.html',
    providers: [CustomerService]
})
export class AddressmComponent {
    // Local Variables 
    title = 'Address List';
    /*
    Ajith 24/06/2019 validate GSTIN with PAN no
    Ajith 29/06/2019 validate Gistin cannot blank
    */
    @Input() menuid: string = '';
    @Input() type: string = '';


    @Output() ValueChanged = new EventEmitter<boolean>();


    loading = false;
    currentTab: string = 'LIST';
    addid: string = "";

    ErrorMessage = "";

    mode = '';
    pkid = '';
    modal: any;
    public shipperAddrLen: number = 34;
    public consigneeAddrLen: number = 20;


    // Array For Displaying List
    @Input() RecordList: Addressm[] = [];

    @Input() StateList: any[] = [];
    @Input() CountryList: any[] = [];
    @Input() bDelete: boolean = false;
    @Input() customer_id: string = '';
    @Input() pan_no: string = '';
    @Input() bShipper: boolean = false;
    @Input() bForeigner: boolean = false;
    @Input() bAdmin: boolean = false;
    @Input() bUnregistered: boolean = false;
    @Input() fStateList: any[] = [];

    shipperAddr1Len: number = 34;
    shipperAddr2Len: number = 34;
    shipperAddr3Len: number = 0;
    shipperAddr4Len: number = 0;
    consigneeAddr1Len: number = 20;
    consigneeAddr2Len: number = 20;
    consigneeAddr3Len: number = 28;
    consigneeAddr4Len: number = 20;

    GstList: any[] = [];

    // Single Record for add/edit/view details
    Record: Addressm = new Addressm;

    constructor(
        private modalService: NgbModal,
        private mainService: CustomerService,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {

        this.GstList = [
            { "code": 'GSN', "name": "IEC" },
            { "code": 'GSG', "name": "GOVT.ENTITIES" },
            { "code": 'GSD', "name": "DIPLOMATS" },
            { "code": 'PAN', "name": "PAN NO" },
            { "code": 'TAN', "name": "TAN NO" },
            { "code": 'PSP', "name": "PASSPORT NO" },
            { "code": 'ADH', "name": "ADHAR NO" },
            { "code": 'NA', "name": "NA" }];

    }

    // Init Will be called After executing Constructor
    ngOnInit() {

    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    }

    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, rec: Addressm) {
        this.ErrorMessage = '';
        if (action == 'LIST') {
            this.mode = '';
            this.pkid = '';
            this.currentTab = 'LIST';


        }
        else if (action === 'ADD') {
            this.currentTab = 'DETAILS';
            this.mode = 'ADD';
            this.NewRecord();

        }
        else if (action === 'EDIT') {
            this.currentTab = 'DETAILS';
            this.mode = 'EDIT';
            this.LoadData(rec);

        }
    }



    NewRecord() {
        this.pkid = this.gs.getGuid();
        this.Record = new Addressm();
        this.Record.add_pkid = this.pkid;

        if (this.RecordList.length <= 0)
            this.Record.add_pkid = this.customer_id;

        this.Record.add_line1 = '';
        this.Record.add_line2 = '';
        this.Record.add_line3 = '';
        this.Record.add_line4 = '';



        this.Record.add_city = '';




        this.Record.add_state_id = '';
        this.Record.add_state_name = '';

        this.Record.add_fstate_id = '';
        this.Record.add_fstate_name = '';

        this.Record.add_country_id = '';
        this.Record.add_country_name = '';

        this.Record.add_gstin = '';
        this.Record.add_gst_type = 'NA';

        this.Record.add_contact = '';
        this.Record.add_pin = '';
        this.Record.add_tel = '';
        this.Record.add_fax = '';
        this.Record.add_email = '';
        this.Record.add_web = '';
        this.Record.add_location = this.gs.globalVariables.branch_code;

        this.Record.add_sepz_unit = false;

        this.Record.rec_mode = "ADD";
        var REC = this.fStateList.find(rec => rec.param_code == 'NA');
        if (REC != null) {
            this.Record.add_fstate_id = REC.param_pkid;
            this.Record.add_fstate_name = REC.param_name;
        }

    }

    LoadData(_Record: Addressm) {
        this.pkid = _Record.add_pkid;
        this.Record = new Addressm();
        this.Record.add_pkid = _Record.add_pkid;
        this.Record.add_line1 = _Record.add_line1;
        this.Record.add_line2 = _Record.add_line2;
        this.Record.add_line3 = _Record.add_line3;
        this.Record.add_line4 = _Record.add_line4;
        this.Record.add_contact = _Record.add_contact;

        this.Record.add_pin = _Record.add_pin;
        this.Record.add_tel = _Record.add_tel;
        this.Record.add_fax = _Record.add_fax;
        this.Record.add_email = _Record.add_email;
        this.Record.add_web = _Record.add_web;

        this.Record.add_branch_slno = _Record.add_branch_slno;



        this.Record.add_city = _Record.add_city;


        this.Record.add_state_id = _Record.add_state_id;
        this.Record.add_state_name = _Record.add_state_name;
        this.Record.add_fstate_id = _Record.add_fstate_id;
        this.Record.add_fstate_name = _Record.add_fstate_name;

        this.Record.add_country_id = _Record.add_country_id;
        this.Record.add_country_name = _Record.add_country_name;

        this.Record.add_location = _Record.add_location;

        this.Record.add_sepz_unit = _Record.add_sepz_unit;

        this.Record.add_gstin = _Record.add_gstin;
        this.Record.add_gst_type = _Record.add_gst_type;

        if (this.Record.add_fstate_id == "" || this.Record.add_fstate_id == null || this.Record.add_fstate_id == undefined) {
            this.Record.add_fstate_id = "";
            this.Record.add_fstate_name = "";
            var REC = this.fStateList.find(rec => rec.param_code == 'NA');
            if (REC != null) {
                this.Record.add_fstate_id = REC.param_pkid;
                this.Record.add_fstate_name = REC.param_name;
            }
        }
    }

    // Save Data
    Save() {
        if (!this.allvalid()) {
            alert(this.ErrorMessage);
            return;
        }
        if (this.mode == "ADD") {

            this.Record.add_state_name = this.StateList.find(rec => rec.param_pkid == this.Record.add_state_id).param_name;
            this.Record.add_country_name = this.CountryList.find(rec => rec.param_pkid == this.Record.add_country_id).param_name;
            this.Record.add_fstate_name = this.fStateList.find(rec => rec.param_pkid == this.Record.add_fstate_id).param_name;
            this.RecordList.push(this.Record);
        }
        else {
            var REC = this.RecordList.find(rec => rec.add_pkid == this.Record.add_pkid);

            REC.add_branch_slno = this.Record.add_branch_slno;
            REC.add_line1 = this.Record.add_line1;
            REC.add_line2 = this.Record.add_line2;
            REC.add_line3 = this.Record.add_line3;
            REC.add_line4 = this.Record.add_line4;
            REC.add_contact = this.Record.add_contact;

            REC.add_pin = this.Record.add_pin;
            REC.add_tel = this.Record.add_tel;
            REC.add_fax = this.Record.add_fax;
            REC.add_email = this.Record.add_email;
            REC.add_web = this.Record.add_web;

            REC.add_gstin = this.Record.add_gstin;
            REC.add_gst_type = this.Record.add_gst_type;

            REC.add_city = this.Record.add_city;

            REC.add_location = this.Record.add_location;
            REC.add_sepz_unit = this.Record.add_sepz_unit;

            REC.add_state_id = this.Record.add_state_id;
            REC.add_state_name = this.StateList.find(rec => rec.param_pkid == this.Record.add_state_id).param_name;

            REC.add_country_id = this.Record.add_country_id;
            REC.add_country_name = this.CountryList.find(rec => rec.param_pkid == this.Record.add_country_id).param_name;
            REC.add_fstate_id = this.Record.add_fstate_id;
            REC.add_fstate_name = this.fStateList.find(rec => rec.param_pkid == this.Record.add_fstate_id).param_name;

        }
        this.ErrorMessage = '';

        this.currentTab = 'LIST';

    }

    IsSpecialCharacter(str: string) {

        if (str.indexOf("–") >= 0)
            return true;
        else
            return false;
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';

        if (!this.bUnregistered) {
            if (this.gs.globalVariables.user_code != 'ADMIN') {
                if (this.bForeigner == false && this.bShipper && this.Record.add_gstin.trim().length <= 0) {
                    bret = false;
                    sError += "| GSTIN Cannot Be Blank ";
                }
            }
        }

        if (this.Record.add_contact.trim().length <= 0) {
            bret = false;
            sError += "| Contact Name Cannot Be Blank";
        }

        if (this.Record.add_line1.trim().length < 3) {
            bret = false;
            sError += "| Address Line1  Cannot Be Blank";
        }

        if (this.Record.add_line2.trim().length < 3) {
            bret = false;
            sError += "| Address Line2  Cannot Be Blank";
        }

        if (this.Record.add_city.trim().length < 3) {
            bret = false;
            sError += "| City  Cannot Be Blank";
        }

        if (this.Record.add_state_id.trim().length <= 0) {
            bret = false;
            sError += "| State  Cannot Be Blank";
        }

        if (this.Record.add_country_id.trim().length <= 0) {
            bret = false;
            sError += "| Country  Cannot Be Blank";
        }

        if (this.bForeigner == false && !this.bUnregistered && this.Record.add_gst_type.trim() == 'GSN') {
            if (this.Record.add_gstin.trim().length != 15) {
                bret = false;
                sError += "| Invalid GSTIN ";
            }
        }

        if (this.IsSpecialCharacter(this.Record.add_line1)) {
            bret = false;
            sError += "| Special Character in Address Line1";
        }

        if (this.IsSpecialCharacter(this.Record.add_line2)) {
            bret = false;
            sError += "|Special Character in Address Line2";
        }

        if (this.IsSpecialCharacter(this.Record.add_line3)) {
            bret = false;
            sError += "| Special Character in Address Line3";
        }

        if (this.IsSpecialCharacter(this.Record.add_line4)) {
            bret = false;
            sError += "| Special Character in Address Line4";
        }



        if (this.Record.add_gst_type.trim() != 'NA') {

        }

        if (this.bShipper) {
            if (!(+this.Record.add_pin >= 100000 && +this.Record.add_pin <= 999999)) {
                bret = false;
                sError += "| Invalid Pin Code";
            }
        }

        let maxval: number = 15;
        if (this.bShipper)
            maxval = 12;

        if (this.Record.add_tel.includes(",")) {
            var pharr = this.Record.add_tel.split(',');
            for (let ph of pharr) {
                if (!this.gs.IsValidTelephone(ph, maxval)) {
                    bret = false;
                    sError += "| Invalid Telephone Number " + ph;
                }
            }
        } else {
            if (!this.gs.IsValidTelephone(this.Record.add_tel, maxval)) {
                bret = false;
                sError += "| Invalid Telephone Number " + this.Record.add_tel;
            }
        }

        if (this.bShipper) {
            if (this.Record.add_email.includes(",")) {
                var emailarr = this.Record.add_email.split(',');
                for (let em of emailarr) {
                    if (!this.gs.IsValidEmail(em)) {
                        bret = false;
                        sError += "| Invalid Email " + em;
                    }
                }
            } else {
                if (!this.gs.IsValidEmail(this.Record.add_email)) {
                    bret = false;
                    sError += "| Invalid Email " + this.Record.add_email;
                }
            }
        }
        var regexp = new RegExp('^([^\\\"])*$');
        if (!regexp.test(this.Record.add_city)) {
            bret = false;
            sError += "| Invalid City " + this.Record.add_city;
        }

        if (bret) {
            this.Record.add_contact = this.Record.add_contact.toUpperCase().trim();
        }

        if (bret == false)
            this.ErrorMessage = sError;

        return bret;
    }

    Close() {
        this.gs.ClosePage('home');
    }
    open(content: any) {
        this.modal = this.modalService.open(content);
    }
    ShowlinkList(addlnklst: any, _rec: Addressm) {
        this.ErrorMessage = '';
        this.addid = _rec.add_pkid;
        // if(this.addid==this.customer_id)
        // {
        //     alert('Cannot Delete Default Address');
        //     return;
        // }
        this.open(addlnklst);
    }

    ModifiedRecords(params: any) {
        if (params.saction == "DELETE") {
            this.RecordList.splice(this.RecordList.findIndex(rec => rec.add_pkid == params.sid), 1);
            this.modal.close();
        }
        if (params.saction == "CLOSE") {
            this.modal.close();
        }
    }


    OnBlur(field: string) {

        if (field == 'add_line1') {
            this.Record.add_line1 = this.Record.add_line1.toUpperCase();
        }
        if (field == 'add_line2') {
            this.Record.add_line2 = this.Record.add_line2.toUpperCase();
        }
        if (field == 'add_line3') {
            this.Record.add_line3 = this.Record.add_line3.toUpperCase();
        }
        if (field == 'add_line4') {
            this.Record.add_line4 = this.Record.add_line4.toUpperCase();
        }
    }

    OnFocus(field: string) {

        if (field == 'add_line1') {
            this.shipperAddrLen = this.shipperAddr1Len;
            this.consigneeAddrLen = this.consigneeAddr1Len;
        }
        if (field == 'add_line2') {
            this.shipperAddrLen = this.shipperAddr2Len;
            this.consigneeAddrLen = this.consigneeAddr2Len;
        }
        if (field == 'add_line3') {
            this.shipperAddrLen = this.shipperAddr3Len;
            this.consigneeAddrLen = this.consigneeAddr3Len;
        }
        if (field == 'add_line4') {
            this.shipperAddrLen = this.shipperAddr4Len;
            this.consigneeAddrLen = this.consigneeAddr4Len;
        }
    }
}
