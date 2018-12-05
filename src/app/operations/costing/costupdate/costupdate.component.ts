import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';

@Component({
  selector: 'app-costupdate',
  templateUrl: './costupdate.component.html',
})
export class CostUpdateComponent  {
  // Local Variables 
  title = 'Checking Details';
  
  @Output() ModifiedRecords = new EventEmitter<any>();
  @Input() menuid: string = '';
  @Input() public pkid: string;
  @Input() public type: string = '';
  @Input() public refno: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  mdate: string;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string;
  costupdt_date: string = '';
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
  this.ErrorMessage = '';
  this.SearchRecord('checksentcosting', 'LIST');
  }

  // Save Data
  Save() {

    if (!this.allvalid())
      return;

    this.SearchRecord('checksentcosting','SAVE');
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.costupdt_date.trim().length <= 0) {
      sError = "Date Cannot Be Blank";
      bret = false;
    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  SearchRecord(controlname: string,_type:string) {
    this.InfoMessage = '';
    this.ErrorMessage = '';
    if (this.pkid.trim().length <= 0) {
      this.ErrorMessage = "Invalid ID";
      return;
    }

    this.loading = true;
    let SearchData = {
      pkid: this.pkid,
      rowtype:this.type,
      costupdt_date: this.costupdt_date,
      table: 'checksentcosting',
      type: _type,
    };
     
    SearchData.pkid = this.pkid;
    SearchData.costupdt_date = this.costupdt_date;
    SearchData.table = 'checksentcosting';

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = '';
         
        if (_type == "LIST") {
          if (response.checksentcosting.length > 0)
            this.costupdt_date = response.checksentcosting;
          else
            this.costupdt_date = this.gs.defaultValues.today;
        }
        else {
          if (this.ModifiedRecords != null)
            this.ModifiedRecords.emit({ saction: this.type, sid: this.pkid, sdate: response.checksentcosting  });
          this.InfoMessage = "Save Complete";
           
        }
      },
      error => {
        this.loading = false;
        this.InfoMessage = this.gs.getError(error);
      });
  }

  Close() {
    //if (this.ModifiedRecords != null)
    //  this.ModifiedRecords.emit({ saction: 'CLOSE', sRec: this.Record });
  }

}
