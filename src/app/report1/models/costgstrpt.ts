
import { GlobalVariables } from '../../core/models/globalvariables';

export class CostGstRpt {

    row_type: string;
    row_colour: string;
    costing_date: string;
    refno: string;
    costing_type: string;
    branch: string;
    mbl_agent_name: string;
    costing_agent_name: string;
    blno: string;
    description: string;
    remarks: string;
    sell_rate: number;
    buy_rate: number;
    split: number;
    qty: number;
    rate: number;
    amount: number;

    _globalvariables: GlobalVariables;
}
