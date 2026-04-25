import { GlobalVariables } from '../../core/models/globalvariables';
export class ShipmentStage {
  stage_order: number;
  stage_name: string;
  stage_date_old: string;
  stage_date: string;
  stage_editable: string;
  stage_table_name: string;
  stage_col_name: string;
}

export class VmShipmentStage {
  pkid: string;
  type: string;
  stage_name: string;
  ShipmentStageList: ShipmentStage[] = [];
  _globalvariables: GlobalVariables;
}
