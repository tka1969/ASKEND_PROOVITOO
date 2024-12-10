import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ActionEnum } from "../../enums/action.enum";


export enum DataTableActionType {
  UNDEFINED = 0,
  SPACE = 1,
  ICON = 2,
  BUTTON = 3,
  LINK = 4,
  ROWCLICK = 5,
  CHECKCLICK = 6
}

export enum DataTableActionText {
  DEFAULT = 0,
  STATIC = 1,
  LABEL = 2,
}

export interface IDataTableAction {
  type: DataTableActionType,
  label?: string;
  name: string;
  action: ActionEnum;
  actionText?: DataTableActionText,
  icon: IconProp;
  className?: string;
  width?: string;
  hidden?: boolean;
  disabled?: boolean;
}
