
import { GlobalVariables } from '../../core/models/globalvariables';

export class Menum {
    menu_pkid: string;
    menu_code: string;
    menu_name: string;
    menu_route1: string;
    menu_route2: string;
    menu_type: string;
    menu_order: number;

    menu_module_id: string;
    menu_module_name: string;
    menu_module_order: number;

    menu_displayed: boolean;

    rights_company: boolean;
    rights_admin: boolean;
    rights_add: boolean;
    rights_edit: boolean;
    rights_delete: boolean;
    rights_print: boolean;
    rights_email: boolean;
    rights_docs: boolean;


    _globalvariables: GlobalVariables;


    rec_mode: string;
}
