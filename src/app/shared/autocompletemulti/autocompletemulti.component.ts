import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SearchTable } from '../models/searchtable';
import { LovService } from '../services/lov.service';

import { GlobalService } from '../../core/services/global.service';

@Component({
  selector: 'app-autocompletemulti',
  templateUrl: './autocompletemulti.component.html',
  styles: [
    `
            .my-class {
                cursor: pointer;
                border-style: solid;
                border-width: 1px;
                overflow-y: scroll; 
                position: absolute;     
                height:300px;
                width:auto;
                min-width:300px;
                z-index: 2000;
                background: #fff;
                display: block;
            }
    `
  ]
})

export class AutoCompleteMultiComponent {


  private _controlname: string = '';
  @Input() set controlname(value: string) {
    if (value != null)
      this._controlname = value;
  }

  private _displaycolumn: string = '';
  @Input() set displaycolumn(value: string) {
    if (value != null)
      this._displaycolumn = value;
  }

  private _tabletype: string = '';
  @Input() set tabletype(value: string) {
    if (value != null)
      this._tabletype = value;
  }

  private _subtype: string = '';
  @Input() set subtype(value: string) {
    if (value != null)
      this._subtype = value;
  }

  private _id: string = '';
  @Input() set id(value: string) {
    if (value != null)
      this._id = value;
  }

  public _displaydata: string = '';
  @Input() set displaydata(value: string) {
    if (value != null)
      this._displaydata = value;
  }

  private _where: string = '';
  @Input() set where(value: string) {
    if (value != null)
      this._where = value;
  }

  private _parentid: string = '';
  @Input() set parentid(value: string) {
    if (value != null)
      this._parentid = value;
  }

  private _uid: string = '';
  @Input() set uid(value: string) {
    if (value != null)
      this._uid = value;
  }


  private _branchcode: string = '';
  @Input() set branchcode(value: string) {
    if (value != null)
      this._branchcode = value;
  }

  private _ShowMore: boolean = true;
  @Input() set showmore(value: boolean) {
    if (value != null)
      this._ShowMore = value;
  }

  private inputdata: SearchTable = new SearchTable();

  @Output() ValueChanged = new EventEmitter<SearchTable>();
  @Input() disabled: boolean = false;

  //@ViewChild('inputbox', { static: true }) private inputbox: ElementRef;
  @ViewChild('inputbox') private inputbox: ElementRef;

  rows_to_display: number = 0;
  rows_total: number = 0;
  rows_starting_number: number = 0;
  rows_ending_number: number = 0;

  old_data: string;

  returndata: string;

  RecList: SearchTable[] = [];

  Record: SearchTable = new SearchTable;

  showDiv = false;

  bShowMore = true;

  _displaydataid: string = '';


  loading = false;

  constructor(
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private loginservice: LovService,
    private gs: GlobalService
  ) {

  }

  ngOnInit() {
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

  }

  setfocus() {
    if (!this.disabled)
      this.inputbox.nativeElement.focus();
  }

  eventHandler(KeyCode: any) {
    this.List();
  }

  More() {
    // if (this.rows_ending_number < this.rows_total)
    // {
    //     this.rows_starting_number = this.rows_ending_number +1;
    //     this.rows_ending_number = this.rows_ending_number + this.rows_to_display;
    //     this.List('NEXT');
    // }


    this.rows_starting_number = this.rows_ending_number + 1;
    this.rows_ending_number = this.rows_ending_number + this.rows_to_display;
    this.List('NEXT');




  }

  List(_action: string = 'NEW') {
    this.loading = true;

    if (_action == "NEW") {
      this.rows_to_display = 50;
      this.rows_starting_number = 1;
      this.rows_ending_number = this.rows_to_display;
      this.bShowMore = true;
    }

    let SearchData = {
      action: _action,
      rows_to_display: this.rows_to_display,
      rows_starting_number: this.rows_starting_number,
      rows_ending_number: this.rows_ending_number,
      type: this._tabletype,
      subtype: this._subtype,
      parentid: this._parentid,
      searchstring: '', // this._displaydata.includes(',') ? '' : this._displaydata
      where: this._where,
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this._branchcode
    };

    this.loginservice.List(SearchData)
      .subscribe(response => {
        this.loading = false;

        if (this.gs.isBlank(response.list) || !this._ShowMore)
          this.bShowMore = false;

        this.RecList.push(...response.list);
        if (this.RecList != null && this.RecList != undefined) {
          this.RecList.forEach(Rec => {
            if (this._displaydata != null && this._displaydata != undefined)
              if (this._displaydata.includes(Rec.code)) {
                Rec.colchecked = true;
              }
          })
        }

        // if (this.RecList.length === 0) {
        //   this.SelectedItem('', null);
        //   this.showDiv = false;
        // }
        // else if (this.RecList.length === 1) {
        //   this.SelectedItem('', this.RecList[0]);
        //   this.showDiv = false;
        // }
        // else {
        //   this.showDiv = true;
        // }

        this.showDiv = true;
      },
        error => {
          this.loading = false;
          alert(error.error);

        }
      );
  }



  SelectedItem(_source: string, _Record: SearchTable) {
    let itms: string = "";
    let itmsid: string = "";
    if (this.RecList != null && this.RecList != undefined) {
      this.RecList.forEach(Rec => {
        if (Rec.colchecked) {
          if (itms.trim() != "")
            itms += ",";
          itms += Rec.code;

          if (!this.gs.isBlank(Rec.code)) {
            if (itmsid.trim() != "")
              itmsid += ",";
            itmsid += Rec.id + "~" + Rec.code;
          }
          // if (this._displaycolumn == "CODE")
          //   itms += Rec.code;
          // if (this._displaycolumn == "NAME")
          //   itms += Rec.name;
        }
      })
    }
    this._displaydata = itms;
    this._displaydataid = itmsid;
  }

  onfocus() {
    // if (this.showDiv) {
    //   if (this.old_data != this._displaydata)
    //     this._displaydata = "";
    // }
    // this.old_data = this._displaydata;
    // this.RecList = [];
    // this.showDiv = false;

    if (this.showDiv)
      this.Cancel();
  }

  onBlur(_feild: string = "") {
    // let localdata: string = "";
    // if (this._displaydata === null)
    //   localdata = '';
    // else
    //   localdata = this._displaydata;

    // if (this.old_data != localdata) {
    //   if (localdata == '')
    //     this.SelectedItem('', null);
    //   else
    //     this.List();
    // }
  }

  Cancel() {
    let localdata: string = "";
    if (this._displaydata === null)
      localdata = '';
    else
      localdata = this._displaydata;

    // if (this.old_data != localdata) {
    //   this.SelectedItem('', null);
    // }


    this.SelectedItem('', null);

    this.inputdata.controlname = this._controlname;
    this.inputdata.uid = this._uid;
    this.inputdata.id = this._displaydataid;
    this.inputdata.code = this._displaydata;
    this.inputdata.name = this._displaydata;
    this.inputdata.rate = 0;
    this.inputdata.col1 = '';
    this.inputdata.col2 = '';
    this.inputdata.col3 = '';
    this.inputdata.col4 = '';
    this.inputdata.col5 = '';
    this.inputdata.col6 = '';
    this.inputdata.col7 = '';
    this.parentid = '';
    this.showDiv = false;
    this.ValueChanged.emit(this.inputdata);
    this.RecList = [];
  }


  setMyStyles() {
    let styles = {
      'border': '1px solid rgba(0,0,255,0.25)',
      'margin-left': '0px',
      'border-radius': '0px',
    };
    return styles;
  }

  SelectItem(_rec: SearchTable) {
    _rec.colchecked = !_rec.colchecked;
    this.SelectedItem('', null);
  }

  public Close() {
    if (this.showDiv)
      this.Cancel();
  }
}







