import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { ProductService } from '../shared/services/product.service';
import { CartService } from '../shared/services/cart.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  count$: Observable<number> | undefined;
  
  constructor(
    private msalService: MsalService,
    private productService: ProductService,
    private cartService: CartService

  ) { }

  ngOnInit(): void {
    this.count$ = this.cartService.getCount();
  }

  isUserLoggedIn():boolean
 {
  if(this.msalService.instance.getActiveAccount()!=null)
    {
      return true;
    }
  else{
      return false;
    }
 }

 login()
  {
    this.msalService.loginPopup().subscribe((response:AuthenticationResult)=>{
        this.msalService.instance.setActiveAccount(response.account);
        this.productService.idToken = response.idToken;
    })
  }

  isAdmin(): boolean{
    let allAccounts = this.msalService.instance.getActiveAccount();
      if (allAccounts) {
        let roles = allAccounts.idTokenClaims?.roles ?? "";
        if(roles == "Task.Write"){
            return true;
          }
      }
      return false;
  }

  logout()
  {
    if(confirm("Are you sure you want to logout?")){

      this.msalService.logoutPopup();
      this.productService.idToken = '';
    }
  }

}
