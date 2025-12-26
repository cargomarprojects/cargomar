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

    private _parentid: string;
    @Input() set parentid(value: string) {
        this._parentid = value;
    }

    private _type: string = '';
    @Input() set type(value: string) {
        this._type = value;
    }

    @Output() callbackevent = new EventEmitter<any>();
    MemoList: CustMemo[] = [];

    modal: any;
    loading = false;
    constructor(
        private modalService: NgbModal,
        private http2: HttpClient,
        private mainservice: CustMemoService,
        private gs: GlobalService) {

    }

    ngOnInit() {

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
            type: ''
        }

        SearchData.parentid = this._parentid;
        SearchData.type = this._type;

        this.mainservice.List(SearchData).subscribe(response => {
            this.MemoList = response.list;
            if (this.MemoList.length == 0)
                this.NewRecord();
            this.open(memmodal);

        }, error => {
            alert(this.gs.getError(error));
        });

    }
    open(content: any) {
        this.modal = this.modalService.open(content,  { size: "sm", backdrop: 'static', keyboard: true, windowClass: 'modal-custom' } );
    }


    SaveMemo() {

        if (this.gs.isBlank(this._parentid)) {
            alert('Invalid ID');
            return;
        }

        let SearchData: VmMemo = new VmMemo;
        SearchData.pkid = this._parentid;
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
        _Rec.cm_type = this._type;
        _Rec.cm_memo = '';
        this.MemoList.push(_Rec);
    }

}