import { GlobalVariables } from '../../core/models/globalvariables';

export class Mappingm {
    pkid: string;
    br_code: string;
    table_name: string;
    source_col: string;
    target_col: string;
    slno: number;
    rec_mode:string;
    _globalvariables: GlobalVariables;
    MappingList: Mappingm[] = [];
}
