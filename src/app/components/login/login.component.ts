import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from '../../config/my-app-config';

import { OKTA_AUTH } from '@okta/okta-angular';
import OktaSignIn from '@okta/okta-signin-widget';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  oktaSignin: any;
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('oauth2')[0],

      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    });

  }


  ngOnInit(): void {
    // console.log("Base URL >>>>", this.oktaSignin.baseUrl);
    // console.log("client Id >>>>", this.oktaSignin.clientId);
    // console.log("redirect Uri >>>>", this.oktaSignin.redirectUri);
    // console.log("ISSUER >>>>" + this.oktaSignin.authParams.issuer + "scopes" + this.oktaSignin.authParams.scopes);


    this.oktaSignin.remove();
    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget' // this should be same in html login
    },
      (reponse: any) => {
        if (reponse.status === 'SUCCESS') {
          this.oktaAuth.signInWithRedirect();
        }
      },
      (error: any) => {
        throw error;
      }
    );
  }
  ngOnDestroy(): void {
    this.oktaSignin.remove();
  }
}