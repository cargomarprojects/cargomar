import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { BkmPayment } from '../models/bkmpayment';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-bkmpayment',
  templateUrl: './bkmpayment.component.html',
})
export class BkmPaymentComponent  {
  // Local Variables 
  title = 'Paymeny Details';
  @Input() public refno: string = '';
  @Input() menuid: string = '';
  @Input() public pkid: string;
  @Input() public type: string = '';
  @Input() mRecord: BkmPayment = new BkmPayment;

  InitCompleted: boolean = false;
  menu_record: any;
   
  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string;
  LOCRECORD: SearchTable = new SearchTable();
  ErrorMessage = "";
  InfoMessage = "";
  constructor(
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {
     
    // URL Query Parameter 
    this.sub = this.route.queryParams.subscribe(params => {
      if (params["parameter"] != "") {
        this.InitCompleted = true;
        var options = JSON.parse(params["parameter"]);
        this.menuid = options.menuid;
        this.type = options.type;
        this.InitComponent();
      }
    });

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    if (!this.InitCompleted) {
      this.InitComponent();
    }
    this.LoadCombo();
    this.InitLov();
  }

  InitComponent() {

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
    
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  LoadCombo()
  {
  
  }

  Close() {
    //if (this.ModifiedRecords != null)
    //  this.ModifiedRecords.emit({ saction: 'CLOSE', sRec: this.Record });
  }

  InitLov() {
    this.LOCRECORD = new SearchTable();
    this.LOCRECORD.controlname = "LOCATION";
    this.LOCRECORD.displaycolumn = "CODE";
    this.LOCRECORD.type = "CITY";
    this.LOCRECORD.id = this.mRecord.bpay_loc_id;
    this.LOCRECORD.code = this.mRecord.bpay_loc_code;
    this.LOCRECORD.name = this.mRecord.bpay_loc_name;
  }

  LovSelected(_Record: SearchTable) {
    
    if (_Record.controlname == "LOCATION") {
      this.mRecord.bpay_loc_id = _Record.id;
      this.mRecord.bpay_loc_code = _Record.code;
      this.mRecord.bpay_loc_name = _Record.name;
    }

    
  }

}
