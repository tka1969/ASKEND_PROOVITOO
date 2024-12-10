import { faEdit, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ActionEnum } from "../enums/action.enum";
import { IDataTableAction, DataTableActionType } from "../components/data-table/data-table-action.interface";


export const tableRowActions: IDataTableAction[] = [
  {
    type: DataTableActionType.ICON,
    name: "Edit",
    action: ActionEnum.EDIT,
    icon: faEdit,
  },
  {
    type: DataTableActionType.ICON,
    name: "Delete",
    action: ActionEnum.DELETE,
    icon: faTrashCan,
  },
];
