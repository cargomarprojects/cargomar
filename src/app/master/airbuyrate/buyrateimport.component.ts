import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { AirBuyRate, BuyrateImport, BuyrateImportDet } from '../models/airbuyrate';
import { AirBuyRateService } from '../services/airbuyrate.service';

@Component({
  selector: 'app-buyrateimport',
  templateUrl: './buyrateimport.component.html'
})
export class BuyrateImportComponent implements OnInit {

  @Output() CloseClicked = new EventEmitter<any>()
  @Input() msg: string;
  @Input() type: string;
  ErrorMessage: string = '';
  cbdata: string = '';
  Record: BuyrateImport;
  Records: any[];
  jsonString: any;
  currentTab = 'PASTEDATA';
  pol_codes: string = "";
  pod_codes: string = "";
  carrier_codes: string = "";
  country_codes: string = "";

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
    this.pol_codes = "";
    this.pod_codes = "";
    this.carrier_codes = "";
    this.country_codes = "";

    this.Records = list.reduce((buyrates: any[], rec: any) => {
      const len = Object.keys(rec).length;
      if (len == 31) {
        if (!this.pol_codes.includes(rec["pol_code"])) {
          if (this.pol_codes != "")
            this.pol_codes += ",";
          this.pol_codes += rec["pol_code"];
        }
        if (!this.pod_codes.includes(rec["pod_code"])) {
          if (this.pod_codes != "")
            this.pod_codes += ",";
          this.pod_codes += rec["pod_code"];
        }
        if (!this.carrier_codes.includes(rec["carrier_code"])) {
          if (this.carrier_codes != "")
            this.carrier_codes += ",";
          this.carrier_codes += rec["carrier_code"];
        }
        if (!this.country_codes.includes(rec["country_code"])) {
          if (this.country_codes != "")
            this.country_codes += ",";
          this.country_codes += rec["country_code"];
        }

        buyrates.push({ ...rec, status: '' });
      }
      return buyrates;
    }, []);

    this.jsonString = JSON.stringify(this.Records);

    this.Record = new BuyrateImport();
    this.Record.pol_codes = this.pol_codes;
    this.Record.pod_codes = this.pod_codes;
    this.Record.carrier_codes = this.carrier_codes;
    this.Record.country_codes = this.country_codes;
    this.Record.records = <BuyrateImportDet[]>this.Records;
  }

  save() {
    if (this.gs.isBlank(this.Records)) {
      alert('Records not found');
      return;
    }
    this.bSave = true;
    this.ErrorMessage = '';
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.SaveBuyrateImport(this.Record)
      .subscribe(response => {
        // this.Records = response.Records;
        this.bSave = false;

        if (this.CloseClicked != null)
          this.CloseClicked.emit({ saction: 'SAVE' })

        // alert("Save Completed");
      }, error => {
        this.ErrorMessage = this.gs.getError(error);
        this.bSave = false;
        alert(this.ErrorMessage);
      });
  }

}


