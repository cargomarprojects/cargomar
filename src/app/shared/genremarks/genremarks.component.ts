import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { GenRemarksService } from '../services/genremarks.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-genremarks',
    templateUrl: './genremarks.component.html'
})
export class GenRemarksComponent implements OnInit {

    public errorMessage: string = '';
    public tab: string = 'main';

    private _pkid: string;
    @Input() set pkid(value: string) {
        this._pkid = value;
    }

    private _type: string = '';
    @Input() set type(value: string) {
        this._type = value;
    }

    private _subtype: string;
    @Input() set subtype(value: string) {
        this._subtype = value;
    }

    private _refno: string;
    @Input() set refno(value: string) {
        this._refno = value;
    }

    private _btntype: string;
    @Input() set btntype(value: string) {
        this._btntype = value;
    }

    private _mremarks: string;
    @Input() set mremarks(value: string) {
        this._mremarks = value;
    }

    @Output() callbackevent = new EventEmitter<any>();

    private _remarks: string;
    modal: any;

    constructor(
        private modalService: NgbModal,
        private http2: HttpClient,
        private mainservice: GenRemarksService,
        private gs: GlobalService) {

    }

    ngOnInit() {

    }

    GetRemarks(remmodal: any = null) {

        if (this._pkid == undefined || this._pkid == '') {
            alert('Invalid ID');
            return;
        }

        let SearchData = {
            gr_pkid: ''
        }

        SearchData.gr_pkid = this._pkid;

        this.mainservice.GetRemarks(SearchData).subscribe(response => {
            this._remarks = response.remarks;


            this.open(remmodal);


        }, error => {
            alert(this.gs.getError(error));
        });

    }
    open(content: any) {
        this.modal = this.modalService.open(content);
    }
    SaveRemarks() {

        if (this._pkid == undefined || this._pkid == '') {
            alert('Invalid ID');
            return;
        }

        let SearchData = {
            gr_pkid: '',
            gr_type: '',
            gr_subtype: '',
            gr_remarks: ''
        }

        SearchData.gr_pkid = this._pkid;
        SearchData.gr_type = this._type;
        SearchData.gr_subtype = this._subtype;
        SearchData.gr_remarks = this._remarks;

        this.mainservice.SaveRemarks(SearchData).subscribe(response => {

            if (response.status == "OK") {
                if (this.callbackevent)
                    this.callbackevent.emit({ action: 'SAVE', id: this._pkid, remarks: this._remarks });
            }

            this.modal.close();

        }, error => {
            alert(this.gs.getError(error));
        });

    }

    OnBlur(feild: string) {
        if (feild == "remarks")
            this._remarks = this._remarks.toUpperCase();
    }
    CloseModal(_type: string) {
        if (_type == "OK") {
            this.SaveRemarks();
        } else
            this.modal.close();
    }


}
