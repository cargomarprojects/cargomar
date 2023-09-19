import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { AirBuyRate } from '../models/airbuyrate';
import { AirBuyRateService } from '../services/airbuyrate.service';

@Component({
  selector: 'app-buyrateimport',
  templateUrl: './buyrateimport.component.html'
})
export class BuyrateImportComponent implements OnInit {

  @Output() CloseClicked = new EventEmitter<{ records: any[], data: string }>()
  @Input() msg: string;
  @Input() type: string;
  ErrorMessage: string = '';
  cbdata: string = '';
  Record: AirBuyRate;
  Records: any[];
  jsonString: any;
  currentTab = 'PASTEDATA';

  bSave = false;

  constructor(
    private mainService: AirBuyRateService,
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
    this.Records = [];
    this.currentTab = "PASTEDATA";
  }

  ConvertData() {
    const list = this.gs.CSVToJSON(this.cbdata);

    this.Records = list.reduce((acc: any[], rec: any) => {
      const len = Object.keys(rec).length;
      if (len == 23) {
        // const amt = rec["credit"];
        // if (amt != "")
          acc.push({ ...rec, status: '' });
      }
      return acc;
    }, []);

    this.jsonString = JSON.stringify(this.Records);

    // this.Record = new BankStmt();
    // this.Record.records = <BankStmtDet[]>this.Records;
  }

  save() {
    // if (this.type != "BR") {
    //   alert('This option can be used only in Bank Receipt, Invalid Type ' + this.type);
    //   return;
    // }

    // const rec = this.Records.find(f => f.status != "");
    // if (rec) {
    //   alert('Records Already Saved');
    //   return;
    // }


    // this.bSave = true;

    // this.ErrorMessage = '';

    // this.Record.jvh_type = this.type;
    // this.Record._globalvariables = this.gs.globalVariables;

    // this.mainService.SaveBankImport(this.Record)
    //   .subscribe(response => {
    //     this.Records = response.Records;
    //     this.bSave = false;
    //     alert("Save Completed");
    //   }, error => {
    //     this.ErrorMessage = this.gs.getError(error);
    //     this.bSave = false;
    //     alert(this.ErrorMessage);
    //   });
  }

}


