import { GlobalVariables } from '../../core/models/globalvariables';
export class ShipmentStage {
  stage_parent_id: string;
  stage_order: number;
  stage_name: string;
  stage_date_old: string;
  stage_date: string;
}

export class VmShipmentStage {
  List: ShipmentStage[] = [];
  _globalvariables: GlobalVariables;
}
