import { FormStateEnum } from "../../enums/action.enum";
import { IDataTableAction } from "./data-table-action.interface";

export interface IDataTableActionEvent<T> {
  state?: FormStateEnum;
  action: IDataTableAction;
  payload?: any;
}
