import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.scss']
})
export class LoginStatusComponent implements OnInit {
  userFullName?: string;
  isAuthenticated = false;

  storage: Storage = sessionStorage;
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    this.oktaAuth.authStateManager.subscribe(
      (isAuth: boolean) => this.isAuthenticated = isAuth);
  }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    if (this.isAuthenticated) {
      const userClaim = await this.oktaAuth.getUser();
      console.log("User Full name >>>>", userClaim);
      this.userFullName = userClaim.name as string;
      // retrieve the user's email from authentication purpose
      const theEmail = userClaim.email;

      this.storage.setItem('userEmail', JSON.stringify(theEmail))
    }
    console.log("Autentication = " + this.isAuthenticated);
    console.log("Username = " + this.userFullName);
  }
  async logout() {
    await this.oktaAuth.signOut({ postLogoutRedirectUri: '/login' });
  }
}
