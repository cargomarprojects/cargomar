
import { GlobalVariables } from '../../core/models/globalvariables';
export class CustMemo {
    cm_pkid: string;
    cm_parent_id: string;
    cm_type: string;
    cm_memo: string;
    rec_created_by: string;
    rec_created_date: string;
    cm_ctr: number;
    _globalvariables: GlobalVariables;
}

export class VmMemo {
    pkid: string;
    type: string;
    memo_List: CustMemo[] = [];
    _globalvariables: GlobalVariables;
}
