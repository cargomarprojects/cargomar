import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SearchTable } from '../models/searchtable';
import { GlobalService } from '../../core/services/global.service';


@Component({
  selector: 'App-PasteData',
  templateUrl: './pastedata.component.html'
})
export class PasteDataComponent implements OnInit {

  @ViewChild('content') private content: any;

  @Output() CloseClicked = new EventEmitter<string>();

  @Input() msg: string;

  @Input() visible: boolean = false;

  @Input() ExcelFormat: string = '';

  @Input() data: any;

  @Input() version: number = 0;

  displayed: boolean = false;

  loading: boolean = false

  modalref: any;

  ErrorMessage: string = '';

  isVerified = false;


  cbdata: string = '';

  result: any;

  htmldata = '';

  dateformat: string = 'DMY';
  maintype: string = 'ORDER LIST';

  // RecList: SearchTable[] = [];

  nTotal: string = '';


  SearchData = {
    type: '',
    table: '',
    report_folder: '',
    company_code: this.gs.globalVariables.comp_code,
    branch_code: this.gs.globalVariables.branch_code,
    year_code: this.gs.globalVariables.year_code,
    cbdata: ''
  };

  constructor(
    private gs: GlobalService,
    private modalService: NgbModal) {
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (let propName in changes) {
      if (propName == 'visible') {

        if (this.visible) {
          this.cbdata = '';
          // this.RecList = null;
          this.open();
        }
        if (!this.visible)
          this.close();

      }
    }
  }

  ngOnInit() {
  }

  open() {
    this.displayed = true;
    //this.modalref = this.modalService.open(this.content, { size: "sm", backdrop: 'static', keyboard: false });
  }

  close() {
    if (this.displayed) {
      this.displayed = false;
      //      this.modalref.close();
      if (this.CloseClicked != null)
        this.CloseClicked.emit(null);
    }
  }

  ok() {
    if (this.CloseClicked != null)
      this.CloseClicked.emit(this.cbdata);
  }



  //SearchRecord() {

  //  this.loading = true;


  // // SearchData.table = 'pastedata';
  //  this.SearchData.type = this.maintype;
  //  this.SearchData.comp_code = this.gs.globalVariables.comp_code;
  //  this.SearchData.branch_code = this.gs.globalVariables.branch_code;
  //  this.SearchData.year_code = this.gs.globalVariables.year_code;
  //  this.SearchData.cbdata = this.cbdata;


  //  //this.RecList = this.SearchData;

  //  this.ErrorMessage = '';

  //}

  PrintFormat() {
    if (this.ExcelFormat == '')
      return;
    this.loading = true;
    this.SearchData.type = this.ExcelFormat;
    this.SearchData.table = "excelformat";
    this.SearchData.report_folder = this.gs.globalVariables.report_folder;
    this.SearchData.company_code = this.gs.globalVariables.comp_code;
    this.SearchData.branch_code = this.gs.globalVariables.branch_code;
    this.SearchData.year_code = this.gs.globalVariables.year_code;
    this.ErrorMessage = '';
    this.gs.SearchRecord(this.SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = '';
        this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  verify() {

    this.result = this.cbdata.split("\n");



    this.htmldata = '';
    this.htmldata += '<div class="page-body table-responsive">';
    this.htmldata += '<table class="table  table-hover table-sm">';

    this.htmldata += '<thead class="page-body-thead">';


    this.htmldata += '<tr>';

    var colhead = this.result[0].split('\t');
    for (var i = 0; i < colhead.length; i++) {
      this.htmldata += '<th>' + colhead[i] + '</th>';
    }


    this.htmldata += '</tr>';

    this.htmldata += '</thead>';

    this.htmldata += '<tbody class="page-body-tbody">';

    for (var i = 1; i < this.result.length; i++) {
      this.htmldata += '<tr>';

      var coldata = this.result[i].split('\t');

      for (let itm of coldata) {
        this.htmldata += '<td>' + itm + '</td>';
      }
      this.htmldata += '</tr>';
    }

    this.htmldata += '</tbody>';

    this.htmldata += '</table>';
    this.htmldata += '</div>';

    this.isVerified = true;
  }


  Save() {

    this.data.table = 'pastedata';
    this.data.type = this.ExcelFormat;
    this.data.comp_code = this.gs.globalVariables.comp_code;
    this.data.branch_code = this.gs.globalVariables.branch_code;
    this.data.year_code = this.gs.globalVariables.year_code;
    this.data.cbdata = this.cbdata;

    this.ErrorMessage = '';
    this.gs.importData(this.data)
      .subscribe(response => {
        this.loading = false;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });

  }



}

