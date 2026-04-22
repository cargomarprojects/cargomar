import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShipmentStage, VmShipmentStage } from '../models/shipment-stage';
import { ShipmentStageService } from '../services/shipment-stage.service';

@Component({
  selector: 'app-shipment-stage',
  templateUrl: './shipment-stage.component.html'
})
export class ShipmentStageComponent implements OnInit {

  public errorMessage: string = '';
  public tab: string = 'main';

  private _pkid: string = '';
  @Input() set pkid(value: string) {
    this._pkid = value;
  }

  private _type: string = '';
  @Input() set type(value: string) {
    this._type = value;
  }

  private _stage: string = '';
  @Input() set stage(value: string) {
    this._stage = value;
  }

  _stage_date: string = "";


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

  CloseModal(_action: string) {

    if (_action == "OK") {
      this.SaveRecord();
    }
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
      this.getStage();

    }, error => {
      alert(this.gs.getError(error));
    });

  }



  selectRow(rec: ShipmentStage) {
    this._stage = rec.stage_name;
    this._stage_date = rec.stage_date;
    console.log(rec);
  }

  SaveRecord() {

    if (this.gs.isBlank(this._pkid)) {
      alert('Invalid ID');
      return;
    }

    if (this.gs.isBlank(this._stage)) {
      alert('Invalid Shipment Stage');
      return;
    }

    if (this.gs.isBlank(this._stage_date)) {
      alert('Invalid Date');
      return;
    }

    let SearchData: VmShipmentStage = new VmShipmentStage;
    SearchData.pkid = this._pkid;
    SearchData.job_date = this._stage_date;
    SearchData.job_stage = this._stage;
    SearchData.job_type = this._type;

    SearchData.ShipmentStageList = this.RecordList;
    SearchData._globalvariables = this.gs.globalVariables;

    this.mainservice.Save(SearchData).subscribe(response => {
      this.updateStage()

    }, error => {
      alert(this.gs.getError(error));
    });

  }

  getStage() {
    this.RecordList.forEach(rec => {
      if (rec.stage_name == this._stage)
        this._stage_date = rec.stage_date;
    })
  }

  updateStage() {
    this.RecordList.forEach(rec => {
      if (rec.stage_name == this._stage) {
        rec.stage_date = this._stage_date;
        rec.stage_date_old = this._stage_date;
      }
    })
    this.callbackevent.emit({ stage: this._stage })
  }

}
