import {AfterViewInit, Component} from '@angular/core';
import {AccountUrlService} from "./account.url.service";
import {AccountModel} from "./account.model";


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponents implements AfterViewInit {

  accountArr: AccountModel[];
  withdrawAmount: number;
  depositAmount: number;
  accountSelected: number;
  balanceAllAccounts: string;
  isDisabled;
  singleHistoryArr;

  constructor(private accountUrlService: AccountUrlService) {
  }

  async ngAfterViewInit() {
    this.accountArr = await this.getAccountInfo();
    await this.calculateBalanceAllAccounts();
  }

  private getAccountInfo() {
    return this.accountUrlService.callGetService();
  }

  openDialog(event, i) {
    this.accountSelected = i;
    this.singleHistoryArr = this.accountArr[i].history;
  }

  checkIfToDisableButton(i) {
    if (this.accountArr[this.accountSelected].account_type == "cheque") {
      if (this.accountArr[this.accountSelected].balance <= -500) {
        document.getElementById(i).setAttribute('disabled', 'true');
      } else {
        document.getElementById(i).removeAttribute('disabled');
      }
    }

    if (this.accountArr[this.accountSelected].account_type == "savings") {
      if (this.accountArr[this.accountSelected].balance <= 0) {
        document.getElementById(i).setAttribute('disabled', 'true');
      } else {
        document.getElementById(i).removeAttribute('disabled');
      }
    }

  }

  pullOutMoney() {
    if (this.withdrawAmount != null) {
      let accountInUse = this.accountArr[this.accountSelected];
      const remainingAmount = JSON.parse(JSON.stringify(+accountInUse.balance - +this.withdrawAmount));

      if (remainingAmount < 0 && this.accountArr[this.accountSelected].account_type == "savings") {
        alert("Cannot withdraw amount below R0,00");
        return;
      }
      if (remainingAmount < -500 && this.accountArr[this.accountSelected].account_type == "cheque") {
        alert("Cannot withdraw beyond your overdraft of R500,00");
        return;
      }
      else {
        this.accountArr[this.accountSelected].balance = remainingAmount.toFixed(2);
        alert("Successfully withdrew R" + this.withdrawAmount);
      }

      // log each transaction
      this.logTransactionHistory('Withdraw Transact', this.withdrawAmount, this.accountArr[this.accountSelected]);
      // TODO: Call REST API : POST (Transaction history)
      // TODO: Call REST API : POST (Updated Account Balance)


      this.checkIfToDisableButton(this.accountSelected);
      this.calculateBalanceAllAccounts();
      return;

    }
  }

  pushInMoney() {
    if (this.depositAmount != null) {
      let accountInUse = this.accountArr[this.accountSelected];
      const remainingAmount = JSON.parse(JSON.stringify(+accountInUse.balance + +this.depositAmount));

      this.accountArr[this.accountSelected].balance = remainingAmount.toFixed(2);
      alert("Successfully deposited R" + this.depositAmount);


      this.logTransactionHistory('Deposit Transact', this.depositAmount, this.accountArr[this.accountSelected]);
      // TODO: Call REST API : POST (Transaction history)
      // TODO: Call REST API : POST (Updated Account Balance)

      this.checkIfToDisableButton(this.accountSelected);
      this.calculateBalanceAllAccounts();
      return;
    }

  }

  private logTransactionHistory(transactionType, amount, Account: AccountModel): any {

    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();

    let y = today.getFullYear();
    let mo = today.getMonth();
    let d = today.getDate();

    if (Account) {
      this.accountArr[this.accountSelected].history.push({
        "transType": transactionType,
        "balanceH": Account.balance,
        "amount": amount,
        "date": 'Time: ' + h + ":" + m + ":" + s + ' | ' + ' Date: ' + d + " " + mo + " " + y
      });
    }
  }

  calculateBalanceAllAccounts() {
    let balanceAllAccountsArr = [];
    this.accountArr.forEach((data) => {
      balanceAllAccountsArr.push(data.balance);
    });
    // convert to int array
    let eachAccBalance = balanceAllAccountsArr.map(function (v) {
      return parseFloat(v);
    });
    // add amount in array
    const sum = eachAccBalance.reduce(function (accumulator, a) {
      return accumulator + a;
    });
    this.balanceAllAccounts = sum.toFixed(2);

  }


  isAmountNumeric(e) {
    // TODO: Have this validator method as a Directive class
    let specialKeys = [];
    specialKeys.push(8); //Backspace
    let keyCode = e.which ? e.which : e.keyCode;
    let isValueNumber = ((keyCode >= 48 && keyCode <= 57) || specialKeys.indexOf(keyCode) != -1 || keyCode === 190);

    // TODO: create pure function to handle different dialogs at scale
    document.getElementById("deposit-error").style.display = isValueNumber ? "none" : "block";
    document.getElementById("withdraw-error").style.display = isValueNumber ? "none" : "block";

    // TODO: Not allow more than 2 decimal points in withdrawAmount and deposit amount

    if (!isValueNumber) {
      this.withdrawAmount = 0;
    }
    return isValueNumber;
  }
}
