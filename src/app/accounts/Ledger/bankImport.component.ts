import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GlobalService } from '../../core/services/global.service';
import { PayRequestComponent } from '../payrequest/payrequest.component';
import { NavigationCancel } from '@angular/router';



@Component({
  selector: 'App-BankImport',
  templateUrl: './bankimport.component.html'
})
export class BankImportComponent implements OnInit {

  @ViewChild('content') private content: any;

  @Output() CloseClicked = new EventEmitter<{ records: any[], data: string }>()

  @Input() msg: string;

  //@Input() visible: boolean = false;

  displayed: boolean = false;

  loading: boolean = false

  modalref: any;

  ErrorMessage: string = '';

  cbdata: string = '';

  nTotal: string = '';

  RecordList: any[];
  jsonString: any;

  currentTab = 'PASTEDATA';

  constructor(
    private gs: GlobalService,
    private modalService: NgbModal) {
  }


  ngOnInit() {
    this.currentTab = 'PASTEDATA';
  }

  open() {
    this.displayed = true;
  }

  close() {
    if (this.displayed) {
      this.displayed = false;
      if (this.CloseClicked != null)
        this.CloseClicked.emit(null);
    }
  }

  clearData() {
    this.cbdata = "";
    this.RecordList = [];
  }

  PasteDataClosed(cbdata: string) {
    this.cbdata = cbdata;
    this.Verify();
  }

  cancel() {
    this.currentTab = "PASTEDATA";
  }

  process() {
    if (this.CloseClicked != null) {
      this.ConvertData();
    }
  }

  Verify() {
    this.ConvertData();
    this.currentTab = "LIST";
  }

  ConvertData() {
    const list = this.gs.CSVToJSON(this.cbdata);

    /*
    this.RecordList = list.map(rec => {
      return { ...rec, remarks: '' };
    })
    */


    this.RecordList = list.reduce((acc: any[], rec: any) => {
      const len = Object.keys(rec).length;
      if (len == 10) {
        const amt = rec["credit"];
        if (amt != "")
          acc.push({ ...rec, remarks: '' });
      }
      return acc;
    }, []);

    this.jsonString = JSON.stringify(this.RecordList);
  }


}
