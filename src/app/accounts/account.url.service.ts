import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, retry} from "rxjs/internal/operators";
import {AccountModel} from "./account.model";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment.prod";

@Injectable()
export class AccountUrlService {

  constructor(private http: HttpClient) {
  }

  public static readonly ACCOUNTSURL = 'api/accounts.json';


  public get(endpoint: string): any {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin,Accept,' +
      ' X-Requested-With, Content-Type, Access-Control-Request-Method,' +
      ' Access-Control-Request-Headers, Access-Control-Allow-Credentials');
    httpHeaders.set('Access-Control-Allow-Credentials', 'true');

    return this.http.get(endpoint,{ headers: httpHeaders }).pipe(
      // TODO - Show the loader overlay when retrying...
      retry(3)
    );

  }


  public post(endpoint: string): any {
    // TODO : HTTP POST Pure Method
  }

  public async callGetService() {
    const getAccountsURL = environment.mockServerUrl + AccountUrlService.ACCOUNTSURL;
    // TODO - Show the loader...
    let accounts: AccountModel[];
    await this.get(getAccountsURL).toPromise().then((response) => {
        const responseArray = response.accounts;
        // Note: this is required in order to preserve the functions on the AccountModel objects
        return accounts = responseArray.map((singleResponse) => {
          return Object.assign(new AccountModel(), singleResponse);
        });
      },
      (error) => {
        // TODO - Confirm error handling used here
        console.log('Unable to retrieve data ', error);
      }
    ).then((data) => {
      // TODO - Hide the loader...
    });

    return accounts;
  }

  public async callPostService() {
    const postAccountsURL = environment.mockServerUrl + AccountUrlService.ACCOUNTSURL;
    // TODO: REST API : POST
  }

}
