import { Component, OnInit, OnDestroy, Input, Output, ViewChild, ElementRef, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SearchTable } from '../models/searchtable';
import { LovService } from '../services/lov.service';

import { GlobalService } from '../../core/services/global.service';

@Component({
  selector: 'app-autocomplete3',
  templateUrl: './autocomplete3.component.html',
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
           /* floatdrop: render the list as a viewport-anchored overlay so it escapes any
               clipping/overflow ancestor (e.g. a scrolling table) and shows above all controls */
            .my-class.my-class-float {
                position: fixed;
                z-index: 4000;
            }
    `
  ]
})

export class AutoComplete3Component {


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

  private inputdata: SearchTable = new SearchTable();

  @Output() ValueChanged = new EventEmitter<SearchTable>();
  @Input() disabled: boolean = false;
  @Input() flag: string = 'NA';
  @Input() locked: string = 'N';

  // opt-in: when true the dropdown is rendered as a fixed overlay anchored to the input,
  // so it isn't clipped by a scrolling/overflow container (e.g. the quotation grid)
  @Input() floatdrop: boolean = false;
  dropStyle: any = {};


  //@ViewChild('inputbox', { static: true }) private inputbox: ElementRef;
  @ViewChild('inputbox') private inputbox: ElementRef;
  @ViewChild('dropdown') private dropdown: ElementRef;
  private movedToBody = false;


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
      this.rows_to_display = 10;
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
      searchstring: this._displaydata,
      where: this._where,
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this._branchcode,
      flag: this.flag,
      locked: this.locked
    };

    this.loginservice.List(SearchData)
      .subscribe(response => {
        //this.RecList = response.list;
        //this.rows_total = response.rows_total;

        // if (this.rows_ending_number >= this.rows_total)
        //     this.bShowMore = false;


        if (response.list == null)
          this.bShowMore = false;

        this.RecList.push(...response.list);

        this.loading = false;

        if (this.RecList.length === 0) {
          this.SelectedItem('', null);
          this.showDiv = false;
        }
        else if (this.RecList.length === 1) {
          this.SelectedItem('', this.RecList[0]);
          this.showDiv = false;
        }
        else {
          this.setDropPosition();
          this.showDiv = true;
        }
      },
        error => {
          this.loading = false;
          alert(error.error);

        }
      );
  }



  SelectedItem(_source: string, _Record: SearchTable) {
    if (_Record == null) {
      this.inputdata.controlname = this._controlname;
      this.inputdata.uid = this._uid;
      this.inputdata.id = "";
      this.inputdata.code = "";
      this.inputdata.name = "";
      this.inputdata.rate = 0;

      this.inputdata.col1 = '';
      this.inputdata.col2 = '';
      this.inputdata.col3 = '';
      this.inputdata.col4 = '';
      this.inputdata.col5 = '';
      this.inputdata.col6 = '';

      this.inputdata.col7 = '';

      this.inputdata.col8 = '';

      this.inputdata.col9 = '';
      this.inputdata.col10 = '';
      this.inputdata.col11 = '';
      this.displaydata = '';
      this.parentid = '';



    }
    else {
      this.inputdata.controlname = this._controlname;
      this.inputdata.uid = this._uid;
      this.inputdata.id = _Record.id;
      this.inputdata.code = _Record.code;
      this.inputdata.name = _Record.name;
      this.inputdata.rate = _Record.rate;

      if (this._displaycolumn == "CODE")
        this._displaydata = _Record.code;
      if (this._displaycolumn == "NAME")
        this._displaydata = _Record.name;


      this._parentid = _Record.parentid;


      this.inputdata.col1 = _Record.col1;
      this.inputdata.col2 = _Record.col2;
      this.inputdata.col3 = _Record.col3;
      this.inputdata.col4 = _Record.col4;
      this.inputdata.col5 = _Record.col5;
      this.inputdata.col6 = _Record.col6;
      this.inputdata.col7 = _Record.col7;
      this.inputdata.col8 = _Record.col8;
      this.inputdata.col9 = _Record.col9;
      this.inputdata.col10 = _Record.col10;
      this.inputdata.col11 = _Record.col11;

    }


    this.showDiv = false;
    this.ValueChanged.emit(this.inputdata);
    this.RecList = [];
  }

  onfocus() {
    if (this.showDiv) {
      if (this.old_data != this._displaydata)
        this._displaydata = "";
    }
    this.old_data = this._displaydata;
    this.RecList = [];
    this.showDiv = false;
  }

  onBlur() {
    let localdata: string = "";
    if (this._displaydata === null)
      localdata = '';
    else
      localdata = this._displaydata;

    if (this.old_data != localdata) {
      if (localdata == '')
        this.SelectedItem('', null);
      else
        this.List();
    }
  }

  Cancel() {
    let localdata: string = "";
    if (this._displaydata === null)
      localdata = '';
    else
      localdata = this._displaydata;

    if (this.old_data != localdata) {
      this.SelectedItem('', null);
    }
    this.showDiv = false;
  }


  // anchor the fixed overlay to the input's current screen position, and portal it to
  // <body> so it isn't trapped inside the table's stacking context (where later sticky
  // rows would otherwise paint on top of it)
  setDropPosition() {
    if (!this.floatdrop || !this.inputbox) return;
    let r = this.inputbox.nativeElement.getBoundingClientRect();
    this.dropStyle = {
      'top': r.bottom + 'px',
      'left': r.left + 'px',
      'min-width': Math.max(r.width, 300) + 'px'
    };
    if (this.dropdown && !this.movedToBody) {
      document.body.appendChild(this.dropdown.nativeElement);
      this.movedToBody = true;
    }
  }

  ngOnDestroy() {
    // remove the portalled dropdown from <body> to avoid a leftover node
    if (this.movedToBody && this.dropdown && this.dropdown.nativeElement.parentNode) {
      this.dropdown.nativeElement.parentNode.removeChild(this.dropdown.nativeElement);
    }
  }


  setMyStyles() {
    let styles = {
      'border': '1px solid rgba(0,0,255,0.25)',
      'margin-left': '0px',
      'border-radius': '0px',
    };
    return styles;
  }


}







