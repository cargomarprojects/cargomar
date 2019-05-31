
import { GlobalVariables } from '../../core/models/globalvariables';

export class UserRights {
    rights_id: string;
    rights_branch_id: string;

    rights_user_id: string;

    module_name: string;
    menu_id: string;

    menu_code: string;
    menu_name: string;
    menu_type: string;

    menu_route1: string;
    menu_route2: string;

    menu_displayed: boolean;

    rights_company: boolean;
    rights_admin: boolean;
    rights_add: boolean;
    rights_edit: boolean;
    rights_delete: boolean;
    rights_print: boolean;
    rights_email: boolean;
    rights_docs: boolean;
    rights_docs_upload: boolean;
    rights_view: boolean;
    rights_approval: string;
}

export class UserRights_VM {
    globalvariables: GlobalVariables;
    userRights: UserRights[] = [];
    copyto_user_id: string;
    copyto_branch_id: string;
}
