import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';

@Component({
  selector: 'app-rateupdate',
  templateUrl: './rateupdate.component.html',
})
export class RateUpdateComponent {
  // Local Variables 
  title = 'Rate Details';

  @Input() public badd: boolean = false;
  @Input() public pkid: string;
  @Input() public type: string = '';
  @Input() public hblno: string = '';
  @Input() public buysell_record: any;
  InitCompleted: boolean = false;

 
  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string;
  sell_remarks: string = '';
  buy_remarks: string = '';
  ErrorMessage = "";
  InfoMessage = "";

  constructor(
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {

    // URL Query Parameter 
    /*
    this.sub = this.route.queryParams.subscribe(params => {
      if (params["parameter"] != "") {
        this.InitCompleted = true;
        var options = JSON.parse(params["parameter"]);
        this.menuid = options.menuid;
        this.type = options.type;
        this.InitComponent();
      }
    });
*/
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    if (!this.InitCompleted) {
      this.InitComponent();
    }
    this.LoadCombo();
  }

  InitComponent() {
    /*
      this.menu_record = this.gs.getMenu(this.menuid);
      if (this.menu_record)
        this.title = this.menu_record.menu_name;
      */
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    // this.sub.unsubscribe();
  }

  LoadCombo() {
    this.ErrorMessage = '';
    this.SearchRecord('rateupdate', 'LIST');
  }

  // Save Data
  Save() {

    if (!this.allvalid())
      return;

    this.SearchRecord('rateupdate', 'SAVE');
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.sell_remarks.trim().length <= 0 && this.buy_remarks.trim().length <= 0) {
      sError = "Remarks Cannot Be Blank";
      bret = false;
    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  SearchRecord(controlname: string, _type: string) {
    this.InfoMessage = '';
    this.ErrorMessage = '';
    if (this.pkid.trim().length <= 0) {
      this.ErrorMessage = "Invalid ID";
      return;
    }

    this.loading = true;
    let SearchData = {
      pkid: this.pkid,
      rowtype: this.type,
      sell_remarks: this.sell_remarks,
      buy_remarks: this.buy_remarks,
      table: 'rateupdate',
      type: _type,
    };

    SearchData.pkid = this.pkid;
    SearchData.sell_remarks = this.sell_remarks;
    SearchData.buy_remarks = this.buy_remarks;
    SearchData.table = 'rateupdate';

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = '';

        if (_type == "LIST") {
          this.sell_remarks = response.sellremarks;
          this.buy_remarks = response.buyremarks;
        }
        else {
          this.InfoMessage = "Save Complete";
        }
      },
        error => {
          this.loading = false;
          this.InfoMessage = this.gs.getError(error);
        });
  }

  Close() {
  }

  OnBlur(field: string) {
    switch (field) {
      case 'buy_remarks':
        {
          this.buy_remarks = this.buy_remarks.toUpperCase();
          break;
        }
      case 'sell_remarks':
        {
          this.sell_remarks = this.sell_remarks.toUpperCase();
          break;
        }
    }
  }
}
