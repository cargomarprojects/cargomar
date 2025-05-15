
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
    param_id5: string;
    param_id5_code: string;
    param_id5_name: string;

    param_email: string;
    param_date: string;

    param_rate: number;
    rec_mode: string;
    rec_created_by: string;
    rec_created_date: string;
    rec_edited_by: string;
    rec_edited_date: string;

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

export class Paramvalues_vm {
    param_pkid: string;
    _globalvariables: GlobalVariables;
    RecordDet: Paramvalues[] = [];
}

export class Currency_vm {
    param_type: string;
    _globalvariables: GlobalVariables;
    RecordDet: Currency[] = [];
}

export class Currency {
    curr_slno: number;
    curr_code: string;
    curr_name: string;
    curr_per_rate: number;
    curr_imp_rate: number;
    curr_exp_rate: number;
}
