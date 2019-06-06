import {AfterViewInit, Component} from '@angular/core';
import {AccountUrlService} from './account.url.service';
import {AccountModel} from './account.model';


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements AfterViewInit {

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
    if (this.accountArr[this.accountSelected].account_type === 'cheque') {
      if (this.accountArr[this.accountSelected].balance <= -500) {
        document.getElementById(i).setAttribute('disabled', 'true');
      } else {
        document.getElementById(i).removeAttribute('disabled');
      }
    }

    if (this.accountArr[this.accountSelected].account_type === 'savings') {
      if (this.accountArr[this.accountSelected].balance <= 0) {
        document.getElementById(i).setAttribute('disabled', 'true');
      } else {
        document.getElementById(i).removeAttribute('disabled');
      }
    }

  }

  pullOutMoney() {
    if (this.withdrawAmount != null) {
      const accountInUse = this.accountArr[this.accountSelected];
      const remainingAmount = JSON.parse(JSON.stringify(+accountInUse.balance - +this.withdrawAmount));

      if (remainingAmount < 0 && this.accountArr[this.accountSelected].account_type === 'savings') {
        alert('Cannot withdraw amount below R0,00');
        return;
      }
      if (remainingAmount < -500 && this.accountArr[this.accountSelected].account_type === 'cheque') {
        alert('Cannot withdraw beyond your overdraft of R500,00');
        return;
      } else {
        this.accountArr[this.accountSelected].balance = remainingAmount.toFixed(2);
        alert('Successfully withdrew R' + this.withdrawAmount);
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
      const accountInUse = this.accountArr[this.accountSelected];
      const remainingAmount = JSON.parse(JSON.stringify(+accountInUse.balance + +this.depositAmount));

      this.accountArr[this.accountSelected].balance = remainingAmount.toFixed(2);
      alert('Successfully deposited R' + this.depositAmount);


      this.logTransactionHistory('Deposit Transact', this.depositAmount, this.accountArr[this.accountSelected]);
      // TODO: Call REST API : POST (Transaction history)
      // TODO: Call REST API : POST (Updated Account Balance)

      this.checkIfToDisableButton(this.accountSelected);
      this.calculateBalanceAllAccounts();
      return;
    }

  }

  private logTransactionHistory(transactionType, amount, Account: AccountModel): any {

    const today = new Date();
    const h = today.getHours();
    const m = today.getMinutes();
    const s = today.getSeconds();

    const y = today.getFullYear();
    const mo = today.getMonth();
    const d = today.getDate();

    if (Account) {
      this.accountArr[this.accountSelected].history.push({
        'transType': transactionType,
        'balanceH': Account.balance,
        'amount': amount,
        'date': 'Time: ' + h + ':' + m + ':' + s + ' | ' + ' Date: ' + d + ' ' + mo + ' ' + y
      });
    }
  }

  calculateBalanceAllAccounts() {
    const balanceAllAccountsArr = [];
    this.accountArr.forEach((data) => {
      balanceAllAccountsArr.push(data.balance);
    });
    // convert to int array
    const eachAccBalance = balanceAllAccountsArr.map(function (v) {
      return parseFloat(v);
    });
    // add amount in array
    const sum = eachAccBalance.reduce(function (accumulator, a) {
      return accumulator + a;
    });
    this.balanceAllAccounts = sum.toFixed(2);

  }


  isAmountNumeric(e) {
    console.log('eee', e);
    let depositEl = document.getElementById('deposit-error').style.display;
    let withdrawEl = document.getElementById('withdraw-error').style.display;

    const regex = /^[0-9]*\.?[0-9]*$/;
    if (!regex.test(e.key)) {
      depositEl = 'block';
      withdrawEl = 'block';
      this.withdrawAmount = 0;
    } else {
      depositEl = 'none';
      withdrawEl = 'none';
    }
  }
}
