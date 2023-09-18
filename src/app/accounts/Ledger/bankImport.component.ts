import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { LedgerService } from '../services/ledger.service';
import { Ledgerh } from '../models/ledgerh';
import { CostCentert } from '../models/costcentert';
import { pendinglist } from '../models/pendinglist';
import { Ledgert } from '../models/ledgert';

@Component({
  selector: 'App-BankImport',
  templateUrl: './bankimport.component.html'
})
export class BankImportComponent implements OnInit {

  @Output() CloseClicked = new EventEmitter<{ records: any[], data: string }>()
  @Input() msg: string;
  @Input() type: string;
  ErrorMessage: string = '';
  cbdata: string = '';
  RecordList: any[];
  jsonString: any;
  currentTab = 'PASTEDATA';

  constructor(
    private mainService: LedgerService,
    private gs: GlobalService
  ) {
  }

  ngOnInit() {
    this.currentTab = 'PASTEDATA';
  }

  PasteDataClosed(cbdata: string) {
    this.cbdata = cbdata;
    this.ConvertData();
    this.currentTab = "LIST";
  }

  cancel() {
    this.cbdata = "";
    this.jsonString = "";
    this.RecordList = [];
    this.currentTab = "PASTEDATA";
  }

  ConvertData() {
    const list = this.gs.CSVToJSON(this.cbdata);
    this.RecordList = list.reduce((acc: any[], rec: any) => {
      const len = Object.keys(rec).length;
      if (len == 10) {
        const amt = rec["credit"];
        if (amt != "")
          acc.push({ ...rec, status: '' });
      }
      return acc;
    }, []);
    this.jsonString = JSON.stringify(this.RecordList);
  }

  process() {
    if (this.type != "BR") {
      alert('This option can be used only in Bank Receipt, Invalid Type ' + this.type);
      return;
    }
    this.StartProcess();
  }

  StartProcess() {
    const data = this.RecordList.find(f => f.status == '');
    if (data) {
      data.status = 'completed';
    }
    else {
      alert('All Completed');
    }
  }


}


