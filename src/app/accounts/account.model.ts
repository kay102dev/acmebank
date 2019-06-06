import {AccountsHistoryModel} from "./accounts-history.model";

export class AccountModel {
  account_number: number;
  account_type: string;
  balance: number;
  history:  AccountsHistoryModel[];
}
