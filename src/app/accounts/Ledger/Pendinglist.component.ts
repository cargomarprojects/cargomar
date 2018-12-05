import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';

import { pendinglist } from '../models/pendinglist';
import { LedgerService } from '../services/ledger.service';


@Component({
  selector: 'app-pendingist',
  templateUrl: './pendinglist.component.html',
  providers: [LedgerService]
})
export class PendingListComponent {
  // Local Variables 
  title = 'Pending List';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() parentid: string = '';


  @Input() jv_total: number = 0;

  @Input() Total_Diff: number = 0;

  @Output() OkSelected = new EventEmitter<string>();


  Total_Amount: number = 0;

  loading = false;
  currentTab = 'LIST';

  ErrorMessage = "";

  mode = 'ADD';
  pkid = '';

  ctr: number;

  // Array For Displaying List
  @Input() RecordList: pendinglist[] = [];


  constructor(
    private mainService: LedgerService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.SetupGrid();
    this.findtotal();
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  SetupGrid() {

  }

  OnChange(field: string, _rec: pendinglist) {
    if (field == 'jv_selected') {
      if (_rec.jv_selected) {
        if (this.Total_Diff < _rec.jv_balance) {
          _rec.jv_allocation = this.Total_Diff;
        }
        else {
          _rec.jv_allocation = _rec.jv_balance;
        }
      }
      else {
        _rec.jv_allocation = 0;
      }
      this.findtotal();
    }
  }

  OnBlur(field: string, _rec: pendinglist) {
    if (field == 'jv_allocation') {
      if (_rec.jv_allocation > _rec.jv_balance) {
        alert('Cannot Allocate More than balance ')
      }
      this.findtotal();
      return;
    }
  }



  findtotal() {
    this.Total_Amount = 0;
    this.RecordList.forEach(rec => {
      this.Total_Amount += rec.jv_allocation;
    });
    this.Total_Amount = this.gs.roundNumber(this.Total_Amount,2);
    this.Total_Diff = this.jv_total - this.Total_Amount;
    this.Total_Diff = this.gs.roundNumber(this.Total_Diff, 2);
  }

  Ok() {
    this.findtotal();

    if (this.Total_Amount > this.jv_total) {
      alert("Allocated amount is above balance amount")
      return;
    }
    this.OkSelected.emit("OK");
  }

  Close() {
    this.gs.ClosePage('home');
  }

}
