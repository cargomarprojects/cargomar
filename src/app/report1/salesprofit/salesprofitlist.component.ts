import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SalesProfitService } from '../services/salesprofit.service';
import { SalesProfitm } from '../models/salesprofit';

@Component({
  selector: 'app-salesprofitlist',
  templateUrl: './salesprofitlist.component.html',
  providers: [SalesProfitService]
})

export class SalesProfitListComponent {
  title = 'Sales Profit Report'
  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
  urlid: string;
  modal: any;

  ErrorMessage = "";
  bExcel = false;
  bAdmin = false;

  constructor(
    private modalService: NgbModal,
    public ms: SalesProfitService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    // URL Query Parameter
    this.sub = this.route.queryParams.subscribe(params => {
      if (params["parameter"] != "") {
        var options = JSON.parse(params["parameter"]);
        this.menuid = options.menuid;
        this.type = options.type;
      }
    });
  }

  ngOnInit() {
    if (!this.InitCompleted) {
      this.InitComponent();
      this.InitCompleted = true;
    }
    this.ms.init(this.menuid);
  }

  InitComponent() {
    this.bExcel = false;
    this.bAdmin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_print)
        this.bExcel = true;
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ShowReport(rec: SalesProfitm) {

  }


  ActionHandler(action: string, id: string) {
    this.ErrorMessage = '';
    if (action == 'LIST') {
      this.ms.state.mode = '';
      this.ms.state.currentTab = 'LIST';
    }
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  OnChange(field: string) {
    // this.RecordList = null;
  }

  Close() {
    this.gs.ClosePage('home');
  }

  open(content: any) {
    this.modal = this.modalService.open(content);
  }


}
