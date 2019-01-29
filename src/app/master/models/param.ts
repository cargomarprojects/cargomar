
import { GlobalVariables } from '../../core/models/globalvariables';

export class Param {
    param_pkid: string;
    param_type: string;
    param_code: string;
    param_name: string;

    param_id1: string;
    param_id2: string;
    param_id3: string;
    param_id4: string;

    param_email: string;

    param_rate: number;
    rec_mode: string;

    rec_locked: boolean;

    _globalvariables: GlobalVariables;

}

export class Paramvalues {
    param_pkid: string;    
    parent_id: string;
    param_key: string;
    param_value: string;
    param_defvalue: string;
}

export class Paramvalues_vm{
    param_pkid: string;    
    _globalvariables: GlobalVariables;
    RecordDet : Paramvalues[] = [];
}

