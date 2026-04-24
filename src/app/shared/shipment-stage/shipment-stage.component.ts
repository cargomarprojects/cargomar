import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShipmentStage, VmShipmentStage } from '../models/shipment-stage';
import { ShipmentStageService } from '../services/shipment-stage.service';

@Component({
  selector: 'app-shipment-stage',
  templateUrl: './shipment-stage.component.html',
  styleUrls: ['./shipment-stage.component.css']
})
export class ShipmentStageComponent implements OnInit {

  public errorMessage: string = '';
  public tab: string = 'main';

  public _pkid: string = '';
  @Input() set pkid(value: string) {
    this._pkid = value;
  }

  public _type: string = '';
  @Input() set type(value: string) {
    this._type = value;
  }

  public _stage: string = '';
  @Input() set stage(value: string) {
    this._stage = value;
  }


  @Output() callbackevent = new EventEmitter<any>();

  RecordList: ShipmentStage[] = [];

  selectedRowIndex = 0;

  modal: any;
  loading = false;
  constructor(
    private modalService: NgbModal,
    private http2: HttpClient,
    private mainservice: ShipmentStageService,
    private gs: GlobalService) {

  }

  ngOnInit() {
    this.GetList();
  }



  GetList() {

    let SearchData = {
      pkid: '',
      type: ''
    }

    SearchData.pkid = this._pkid;
    SearchData.type = this._type;

    this.mainservice.GetRecord(SearchData).subscribe(response => {
      this.RecordList = response.record.ShipmentStageList;
    }, error => {
      alert(this.gs.getError(error));
    });

  }

  SaveRecord(rec: ShipmentStage) {


    if (this.gs.isBlank(this._pkid)) {
      alert('Invalid ID');
      return;
    }

    if (this.gs.isBlank(rec.stage_name)) {
      alert('Invalid Shipment Stage');
      return;
    }

    if (this.gs.isBlank(rec.stage_date)) {
      alert('Invalid Date');
      return;
    }

    let SearchData: VmShipmentStage = new VmShipmentStage;
    SearchData.pkid = this._pkid;
    SearchData.job_date = rec.stage_date;
    SearchData.job_date_old = rec.stage_date_old;
    SearchData.job_stage = rec.stage_name;
    SearchData.job_type = this._type;
    SearchData.job_stage_order = rec.stage_order;
    SearchData.job_stage_col_name = rec.stage_col_name;
    SearchData.ShipmentStageList = this.RecordList;
    SearchData._globalvariables = this.gs.globalVariables;

    this.mainservice.Save(SearchData).subscribe(response => {
      this.updateStage();
      alert("Save Complete");
    }, error => {
      alert(this.gs.getError(error));
    });

  }


  updateStage() {
    let _latest_stage = "";
    this.RecordList.forEach(rec => {
      if (rec.stage_date != "")
        _latest_stage = rec.stage_name;
    })
    this.callbackevent.emit({ stage: _latest_stage })
  }

  ShowHistory(history: any) {
    this.open(history);
  }


  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }


}
