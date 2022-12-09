import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PasteDatam, PasteDatad } from '../models/pastedata';
import { SearchTable } from '../models/searchtable';
import { GlobalService } from '../../core/services/global.service';
import { forEach } from '@angular/router/src/utils/collection';


@Component({
  selector: 'App-PasteData',
  templateUrl: './pastedata.component.html'
})
export class PasteDataComponent implements OnInit {

  @ViewChild('content') private content: any;
  @ViewChild('templatee') myTemplate: ElementRef;

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
  innerHtmlDivHt = '';
  selectedRowIndex = 0;
  dateformat: string = 'DMY';
  maintype: string = 'ORDER LIST';

  // RecList: SearchTable[] = [];
  Record: PasteDatam = new PasteDatam;
  //RecordList: PasteDatam[] = [];

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
    //private elementRef: ElementRef,
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

  ngAfterViewChecked() {
    // if(this.elementRef.nativeElement.querySelector('#my-button')){
    //   this.elementRef.nativeElement.querySelector('#my-button').addEventListener('click', this.DeleteRow.bind(this));
    // }
  }
  open() {
    this.displayed = true;
    //this.modalref = this.modalService.open(this.content, { size: "sm", backdrop: 'static', keyboard: false });
  }

  close() {
    if (this.displayed) {
      this.displayed = false;
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




  Save() {


    if (this.loading)
      return;

    this.loading = true;

    this.data.type = this.ExcelFormat;
    this.data.comp_code = this.gs.globalVariables.comp_code;
    this.data.branch_code = this.gs.globalVariables.branch_code;
    this.data.year_code = this.gs.globalVariables.year_code;
    this.data.cbdata = this.cbdata;
    this.data._globalvariables = this.gs.globalVariables;
    this.ErrorMessage = '';
    this.gs.importData(this.data)
      .subscribe(response => {
        this.loading = false;
        alert('Import Data Complete');
        this.close();
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });

  }

  verifyOld() {

    let bOk = false;
    if (this.gs.isBlank(this.cbdata)) {
      alert('Records Not Found');
      return;
    }

    this.innerHtmlDivHt = '400px';
    this.result = this.cbdata.trim().split("\n");

    this.htmldata = '';
    this.htmldata += '<div class="page-body table-responsive">';
    this.htmldata += '<table class="table  table-hover table-sm">';
    this.htmldata += '<thead class="page-body-thead">';
    this.htmldata += '<tr>';

    var colhead = this.result[0].split('\t');
    for (var i = 0; i < colhead.length; i++) {
      if (this.gs.isBlank(colhead[i])) {
        alert('Column Header Cannot be Blank');
        return;
      }
    }

    for (var i = 0; i < colhead.length; i++) {
      this.htmldata += '<th>' + colhead[i] + '</th>';
    }
    this.htmldata += '<th>DEL</th>';

    this.htmldata += '</tr>';

    this.htmldata += '</thead>';

    this.htmldata += '<tbody class="page-body-tbody">';

    for (var i = 1; i < this.result.length; i++) {
      this.htmldata += '<tr>';

      var coldata = this.result[i].split('\t');
      if (coldata.length != colhead.length) {
        alert('Number of columns mismatch with header row and item rows');
        return;
      }
      bOk = false;
      for (let itm of coldata) {
        bOk = true;
        this.htmldata += '<td>' + itm + '</td>';
      }
      if (bOk)
        this.htmldata += '<td class="p-0 text-center"><i class="fa fa-trash  fa-lg pointer" aria-hidden="true" id="my-button" (click)="DeleteRow(\'' + i.toString() + '\')"></i></td>';
      this.htmldata += '</tr>';
    }

    this.htmldata += '</tbody>';

    this.htmldata += '</table>';
    this.htmldata += '</div>';
    this.isVerified = true;

    this.myTemplate.nativeElement.innerHTML = this.htmldata;
    this.myTemplate.nativeElement.addEventListener('click', this.DeleteRow);
  }

  verify() {

    let bOk = false;
    if (this.gs.isBlank(this.cbdata)) {
      alert('Records Not Found');
      return;
    }
    this.innerHtmlDivHt = '400px';
    this.result = this.cbdata.trim().split("\n");

    let dRow: PasteDatad = new PasteDatad;
    let detList: PasteDatad[] = new Array<PasteDatad>();

    var colhead = this.result[0].split('\t');
    for (var i = 0; i < colhead.length; i++) {
      if (this.gs.isBlank(colhead[i])) {
        alert('Column Header Cannot be Blank');
        return;
      }
    }

    this.Record = new PasteDatam;
    this.Record.hdr_pkid = this.gs.getGuid();
    this.Record.hdr_col1 = colhead.length > 0 ? colhead[0] : "";
    this.Record.hdr_col2 = colhead.length > 1 ? colhead[1] : "";
    this.Record.hdr_col3 = colhead.length > 2 ? colhead[2] : "";
    this.Record.hdr_col4 = colhead.length > 3 ? colhead[3] : "";
    this.Record.hdr_col5 = colhead.length > 4 ? colhead[4] : "";
    this.Record.hdr_col6 = colhead.length > 5 ? colhead[5] : "";
    this.Record.hdr_col7 = colhead.length > 6 ? colhead[6] : "";
    this.Record.hdr_col8 = colhead.length > 7 ? colhead[7] : "";
    this.Record.hdr_col9 = colhead.length > 8 ? colhead[8] : "";
    this.Record.hdr_col10 = colhead.length > 9 ? colhead[9] : "";
    this.Record.hdr_col11 = colhead.length > 10 ? colhead[10] : "";
    this.Record.hdr_col12 = colhead.length > 11 ? colhead[11] : "";
    this.Record.hdr_col13 = colhead.length > 12 ? colhead[12] : "";
    this.Record.hdr_col14 = colhead.length > 13 ? colhead[13] : "";
    this.Record.hdr_col15 = colhead.length > 14 ? colhead[14] : "";
    this.Record.hdr_col16 = colhead.length > 15 ? colhead[15] : "";
    this.Record.hdr_col17 = colhead.length > 16 ? colhead[16] : "";
    this.Record.hdr_col18 = colhead.length > 17 ? colhead[17] : "";
    this.Record.hdr_col19 = colhead.length > 18 ? colhead[18] : "";
    this.Record.hdr_col20 = colhead.length > 19 ? colhead[19] : "";
    this.Record.hdr_col21 = colhead.length > 20 ? colhead[20] : "";
    this.Record.hdr_col22 = colhead.length > 21 ? colhead[21] : "";
    this.Record.hdr_col23 = colhead.length > 22 ? colhead[22] : "";
    this.Record.hdr_col24 = colhead.length > 23 ? colhead[23] : "";
    this.Record.hdr_col25 = colhead.length > 24 ? colhead[24] : "";
    this.Record.hdr_col26 = colhead.length > 25 ? colhead[25] : "";
    this.Record.hdr_col27 = colhead.length > 26 ? colhead[26] : "";
    this.Record.hdr_col28 = colhead.length > 27 ? colhead[27] : "";
    this.Record.hdr_col29 = colhead.length > 28 ? colhead[28] : "";
    this.Record.hdr_col30 = colhead.length > 29 ? colhead[29] : "";
    this.Record.DetList = new Array<PasteDatad>();

    for (var i = 1; i < this.result.length; i++) {
      var coldata = this.result[i].split('\t');
      if (coldata.length != colhead.length) {
        alert('Number of columns mismatch with header row and item rows');
        this.Record.DetList = new Array<PasteDatad>();
        return;
      }
      dRow = new PasteDatad;
      dRow.row_pkid = this.gs.getGuid();
      dRow.row_col1 = coldata.length > 0 ? coldata[0] : "";
      dRow.row_col2 = coldata.length > 1 ? coldata[1] : "";
      dRow.row_col3 = coldata.length > 2 ? coldata[2] : "";
      dRow.row_col4 = coldata.length > 3 ? coldata[3] : "";
      dRow.row_col5 = coldata.length > 4 ? coldata[4] : "";
      dRow.row_col6 = coldata.length > 5 ? coldata[5] : "";
      dRow.row_col7 = coldata.length > 6 ? coldata[6] : "";
      dRow.row_col8 = coldata.length > 7 ? coldata[7] : "";
      dRow.row_col9 = coldata.length > 8 ? coldata[8] : "";
      dRow.row_col10 = coldata.length > 9 ? coldata[9] : "";
      dRow.row_col11 = coldata.length > 10 ? coldata[10] : "";
      dRow.row_col12 = coldata.length > 11 ? coldata[11] : "";
      dRow.row_col13 = coldata.length > 12 ? coldata[12] : "";
      dRow.row_col14 = coldata.length > 13 ? coldata[13] : "";
      dRow.row_col15 = coldata.length > 14 ? coldata[14] : "";
      dRow.row_col16 = coldata.length > 15 ? coldata[15] : "";
      dRow.row_col17 = coldata.length > 16 ? coldata[16] : "";
      dRow.row_col18 = coldata.length > 17 ? coldata[17] : "";
      dRow.row_col19 = coldata.length > 18 ? coldata[18] : "";
      dRow.row_col20 = coldata.length > 19 ? coldata[19] : "";
      dRow.row_col21 = coldata.length > 20 ? coldata[20] : "";
      dRow.row_col22 = coldata.length > 21 ? coldata[21] : "";
      dRow.row_col23 = coldata.length > 22 ? coldata[22] : "";
      dRow.row_col24 = coldata.length > 23 ? coldata[23] : "";
      dRow.row_col25 = coldata.length > 24 ? coldata[24] : "";
      dRow.row_col26 = coldata.length > 25 ? coldata[25] : "";
      dRow.row_col27 = coldata.length > 26 ? coldata[26] : "";
      dRow.row_col28 = coldata.length > 27 ? coldata[27] : "";
      dRow.row_col29 = coldata.length > 28 ? coldata[28] : "";
      dRow.row_col30 = coldata.length > 29 ? coldata[29] : "";
      this.Record.DetList.push(dRow)
    }
    this.isVerified = true;
  }
  ok2() {

    if (this.gs.isBlank(this.Record)) {
      alert('Please Verify and Continue.....');
      return;
    }
    this.result = this.Record.hdr_col1;
    this.result += (this.Record.hdr_col2 != "") ? "\t" + this.Record.hdr_col2 : "";
    this.result += (this.Record.hdr_col3 != "") ? "\t" + this.Record.hdr_col3 : "";
    this.result += (this.Record.hdr_col4 != "") ? "\t" + this.Record.hdr_col4 : "";
    this.result += (this.Record.hdr_col5 != "") ? "\t" + this.Record.hdr_col5 : "";
    this.result += (this.Record.hdr_col6 != "") ? "\t" + this.Record.hdr_col6 : "";
    this.result += (this.Record.hdr_col7 != "") ? "\t" + this.Record.hdr_col7 : "";
    this.result += (this.Record.hdr_col8 != "") ? "\t" + this.Record.hdr_col8 : "";
    this.result += (this.Record.hdr_col9 != "") ? "\t" + this.Record.hdr_col9 : "";
    this.result += (this.Record.hdr_col10 != "") ? "\t" + this.Record.hdr_col10 : "";
    this.result += (this.Record.hdr_col11 != "") ? "\t" + this.Record.hdr_col11 : "";
    this.result += (this.Record.hdr_col12 != "") ? "\t" + this.Record.hdr_col12 : "";
    this.result += (this.Record.hdr_col13 != "") ? "\t" + this.Record.hdr_col13 : "";
    this.result += (this.Record.hdr_col14 != "") ? "\t" + this.Record.hdr_col14 : "";
    this.result += (this.Record.hdr_col15 != "") ? "\t" + this.Record.hdr_col15 : "";
    this.result += (this.Record.hdr_col16 != "") ? "\t" + this.Record.hdr_col16 : "";
    this.result += (this.Record.hdr_col17 != "") ? "\t" + this.Record.hdr_col17 : "";
    this.result += (this.Record.hdr_col18 != "") ? "\t" + this.Record.hdr_col18 : "";
    this.result += (this.Record.hdr_col19 != "") ? "\t" + this.Record.hdr_col19 : "";
    this.result += (this.Record.hdr_col20 != "") ? "\t" + this.Record.hdr_col20 : "";
    this.result += (this.Record.hdr_col21 != "") ? "\t" + this.Record.hdr_col21 : "";
    this.result += (this.Record.hdr_col22 != "") ? "\t" + this.Record.hdr_col22 : "";
    this.result += (this.Record.hdr_col23 != "") ? "\t" + this.Record.hdr_col23 : "";
    this.result += (this.Record.hdr_col24 != "") ? "\t" + this.Record.hdr_col24 : "";
    this.result += (this.Record.hdr_col25 != "") ? "\t" + this.Record.hdr_col25 : "";
    this.result += (this.Record.hdr_col26 != "") ? "\t" + this.Record.hdr_col26 : "";
    this.result += (this.Record.hdr_col27 != "") ? "\t" + this.Record.hdr_col27 : "";
    this.result += (this.Record.hdr_col28 != "") ? "\t" + this.Record.hdr_col28 : "";
    this.result += (this.Record.hdr_col29 != "") ? "\t" + this.Record.hdr_col29 : "";
    this.result += (this.Record.hdr_col30 != "") ? "\t" + this.Record.hdr_col30 : "";
    for (let rec of this.Record.DetList) {
      this.result += "\n";
      this.result += rec.row_col1;
      this.result += (this.Record.hdr_col2 != "") ? "\t" + rec.row_col2 : "";
      this.result += (this.Record.hdr_col3 != "") ? "\t" + rec.row_col3 : "";
      this.result += (this.Record.hdr_col4 != "") ? "\t" + rec.row_col4 : "";
      this.result += (this.Record.hdr_col5 != "") ? "\t" + rec.row_col5 : "";
      this.result += (this.Record.hdr_col6 != "") ? "\t" + rec.row_col6 : "";
      this.result += (this.Record.hdr_col7 != "") ? "\t" + rec.row_col7 : "";
      this.result += (this.Record.hdr_col8 != "") ? "\t" + rec.row_col8 : "";
      this.result += (this.Record.hdr_col9 != "") ? "\t" + rec.row_col9 : "";
      this.result += (this.Record.hdr_col10 != "") ? "\t" + rec.row_col10 : "";
      this.result += (this.Record.hdr_col11 != "") ? "\t" + rec.row_col11 : "";
      this.result += (this.Record.hdr_col12 != "") ? "\t" + rec.row_col12 : "";
      this.result += (this.Record.hdr_col13 != "") ? "\t" + rec.row_col13 : "";
      this.result += (this.Record.hdr_col14 != "") ? "\t" + rec.row_col14 : "";
      this.result += (this.Record.hdr_col15 != "") ? "\t" + rec.row_col15 : "";
      this.result += (this.Record.hdr_col16 != "") ? "\t" + rec.row_col16 : "";
      this.result += (this.Record.hdr_col17 != "") ? "\t" + rec.row_col17 : "";
      this.result += (this.Record.hdr_col18 != "") ? "\t" + rec.row_col18 : "";
      this.result += (this.Record.hdr_col19 != "") ? "\t" + rec.row_col19 : "";
      this.result += (this.Record.hdr_col20 != "") ? "\t" + rec.row_col20 : "";
      this.result += (this.Record.hdr_col21 != "") ? "\t" + rec.row_col21 : "";
      this.result += (this.Record.hdr_col22 != "") ? "\t" + rec.row_col22 : "";
      this.result += (this.Record.hdr_col23 != "") ? "\t" + rec.row_col23 : "";
      this.result += (this.Record.hdr_col24 != "") ? "\t" + rec.row_col24 : "";
      this.result += (this.Record.hdr_col25 != "") ? "\t" + rec.row_col25 : "";
      this.result += (this.Record.hdr_col26 != "") ? "\t" + rec.row_col26 : "";
      this.result += (this.Record.hdr_col27 != "") ? "\t" + rec.row_col27 : "";
      this.result += (this.Record.hdr_col28 != "") ? "\t" + rec.row_col28 : "";
      this.result += (this.Record.hdr_col29 != "") ? "\t" + rec.row_col29 : "";
      this.result += (this.Record.hdr_col30 != "") ? "\t" + rec.row_col30 : "";
    }

    if (this.CloseClicked != null)
      this.CloseClicked.emit(this.result);
  }

  DeleteRow(_rec: PasteDatad) {
    if (!confirm("DELETE SELECTED ROW")) {
      return;
    }
    this.Record.DetList.splice(this.Record.DetList.findIndex(rec => rec.row_pkid == _rec.row_pkid), 1);
  }

}

