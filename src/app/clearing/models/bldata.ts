import { GlobalVariables } from '../../core/models/globalvariables';

export class Bldata {
    bd_pkid: string;
    bd_parent_id: string;
    bd_type: string;
    bd_hscode_id: string;
    bd_hscode_code: string;
    bd_hscode_name: string;
    bd_desc: string;
    bd_date: string;
    bd_ctr: number;
     
    rec_mode: string;
    rec_category: string;
    _globalvariables: GlobalVariables;
}

export class SaveBldata {
    BldataList: Bldata[] = [];
    parentid: string;
    type: string;
    rec_mode: string;
    _globalvariables: GlobalVariables;
}
