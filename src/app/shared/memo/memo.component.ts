import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { CustMemoService } from '../services/custmemo.service';
import { CustMemo, VmMemo } from '../models/custmemo';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-memo',
    templateUrl: './memo.component.html'
})
export class MemoComponent implements OnInit {

    public errorMessage: string = '';
    public tab: string = 'main';

    private _parentid: string = '';
    @Input() set parentid(value: string) {
        this._parentid = value;
    }

    private _headerid: string = '';
    @Input() set headerid(value: string) {
        this._headerid = value;
    }

    private _type: string = '';
    @Input() set type(value: string) {
        this._type = value;
    }

    public _screentype: string = 'ALL-EDIT';
    @Input() set screentype(value: string) {
        this._screentype = value;
    }

    public _btncaption: string = 'Memo';
    @Input() set btncaption(value: string) {
        this._btncaption = value;
    }
    public _title: string = 'Memo';
    @Input() set title(value: string) {
        this._title = value;
    }

    public _btnshow: boolean = true;
    @Input() set btnshow(value: boolean) {
        this._btnshow = value;
    }

    public _textheight: number = 3;
    @Input() set textheight(value: number) {
        this._textheight = value;
    }
    public _textlength: number = 500;
    @Input() set textlength(value: number) {
        this._textlength = value;
    }
    public _colcaption: string = 'MEMO';
    @Input() set colcaption(value: string) {
        this._colcaption = value;
    }

    @Output() callbackevent = new EventEmitter<any>();

    @ViewChild('memomodal') memoModal: any;

    MemoList: CustMemo[] = [];
    Record: CustMemo = new CustMemo;

    mode = 'ADD';
    pkid = '';
    modal: any;
    loading = false;
    constructor(
        private modalService: NgbModal,
        private http2: HttpClient,
        private mainservice: CustMemoService,
        public gs: GlobalService) {

    }

    ngOnInit() {

    }

    public showModal(_id: string, _Type: string, _ScreenType: string, _HeaderId: string = '') {
        this._parentid = _id;
        this._type = _Type;
        this._screentype = _ScreenType;
        this._headerid = _HeaderId
        this.GetMemo(this.memoModal);
    }

    GetMemo(memmodal: any = null) {

        if (this.gs.isBlank(this._parentid)) {
            alert('Invalid ID');
            return;
        }
        if (this.gs.isBlank(this._type)) {
            alert('Invalid Type');
            return;
        }
        let SearchData = {
            parentid: '',
            type: '',
            screentype: '',
            headerid: ''
        }

        SearchData.parentid = this._parentid;
        SearchData.type = this._type;
        SearchData.screentype = this._screentype;
        SearchData.headerid = this._headerid;

        this.mainservice.List(SearchData).subscribe(response => {
            this.MemoList = response.list;
            if (this.MemoList.length == 0 && this._screentype == 'ALL-EDIT')
                this.NewRecord();
            else
                this.newSingleRecord();
            this.open(memmodal);

        }, error => {
            alert(this.gs.getError(error));
        });

    }

    open(content: any) {
        this.modal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: true, windowClass: 'modal-custom' });
    }


    SaveMemo() {

        if (this.gs.isBlank(this._parentid)) {
            alert('Invalid ID');
            return;
        }

        let SearchData: VmMemo = new VmMemo;
        SearchData.pkid = this._parentid;
        SearchData.headerid = this._headerid;
        SearchData.type = this._type;
        SearchData.memo_List = this.MemoList;
        SearchData._globalvariables = this.gs.globalVariables;

        this.mainservice.Save(SearchData).subscribe(response => {

            if (response.status == "OK") {
                if (this.callbackevent)
                    this.callbackevent.emit({ action: 'SAVE', id: this._parentid });
            }

            this.modal.close();

        }, error => {
            alert(this.gs.getError(error));
        });

    }

    OnBlur(field: string, _rec: CustMemo = null) {
        if (field == "cm_memo")
            _rec.cm_memo = _rec.cm_memo.toUpperCase();
    }

    CloseModal(_type: string) {
        if (_type == "OK") {
            this.SaveMemo();
        } else
            this.modal.close();
    }

    AddRow() {
        this.NewRecord();
    }

    RemoveRow(_id: string) {
        this.MemoList.splice(this.MemoList.findIndex(rec => rec.cm_pkid == _id), 1);
        if (this.MemoList.length == 0)
            this.NewRecord();
    }

    NewRecord() {
        let _Rec: CustMemo = new CustMemo;
        _Rec.cm_pkid = this.gs.getGuid();
        _Rec.cm_parent_id = this._parentid;
        _Rec.cm_header_id = this._headerid;
        _Rec.cm_type = this._type;
        _Rec.cm_memo = '';
        this.MemoList.push(_Rec);
    }

    editSingleRecord(Id: string) {

        this.loading = true;
        let SearchData = {
            pkid: Id,
        };

        this.mode = 'EDIT';
        this.mainservice.GetSingleRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.LoadData(response.record);
            },
                error => {
                    this.loading = false;
                    alert(this.gs.getError(error));
                });
    }

    LoadData(_Record: CustMemo) {
        this.pkid = _Record.cm_pkid;
        this.Record.cm_pkid = this.pkid;
        this.Record.cm_memo = _Record.cm_memo;
    }

    newSingleRecord() {
        this.mode = 'ADD';
        this.pkid = this.gs.getGuid();
        this.Record = new CustMemo();
        this.Record.cm_pkid = this.pkid;
        this.Record.cm_parent_id = this._parentid;
        this.Record.cm_header_id = this._headerid;
        this.Record.rec_created_by = this.gs.globalVariables.user_code;
        this.Record.rec_created_date = this.gs.defaultValues.today;
        this.Record.cm_memo = "";
    }

    Save() {
        if (!this.allvalid()) {
            return;
        }
        this.loading = true;
        this.Record._globalvariables = this.gs.globalVariables;
        this.Record.cm_pkid = this.pkid;
        this.Record.cm_parent_id = this._parentid;
        this.Record.cm_header_id = this._headerid;
        this.Record.cm_type = "PRE-ALERT-STATUS";
        this.Record.cm_memo = this.Record.cm_memo.toUpperCase();


        this.mainservice.SaveSingleRecord(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.SaveRemarks(this.Record.cm_memo);

                if (this.callbackevent)
                    this.callbackevent.emit({ action: 'SAVE-PREALERT', remark: this.Record.cm_memo, id: this._parentid });

                if (response.mode == "EDIT") {
                    for (let rec of this.MemoList.filter(rec => rec.cm_pkid == this.pkid)) {
                        rec.rec_created_date = this.Record.rec_created_date;
                        rec.cm_memo = this.Record.cm_memo;
                    }
                    this.newSingleRecord();
                } else {
                    this.MemoList.push(this.Record);
                    this.newSingleRecord();
                }

            },
                error => {
                    this.loading = false;
                    alert(this.gs.getError(error));
                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        let str: string = "";
        if (this.gs.isBlank(this.Record.cm_memo)) {
            bret = false;
            sError += "| Comments Cannot Be Blank ";
        }

        if (bret === false)
            alert(sError);
        return bret;
    }

    SaveRemarks(_remarks: string) {

        if (this._parentid == undefined || this._parentid == '') {
            alert('Invalid ID');
            return;
        }
        let SearchData = {
            gr_pkid: '',
            gr_type: '',
            gr_subtype: '',
            gr_remarks: '',
            gr_created_by: ''
        }
        SearchData.gr_pkid = this._parentid;
        SearchData.gr_type = "MBL-SE";
        SearchData.gr_subtype = "PREALERT-SENT-STATUS";
        SearchData.gr_remarks = _remarks;
        SearchData.gr_created_by = this.gs.globalVariables.user_code;
        this.mainservice.SaveRemarks(SearchData).subscribe(response => {
        }, error => {
            alert(this.gs.getError(error));
        });

    }
}