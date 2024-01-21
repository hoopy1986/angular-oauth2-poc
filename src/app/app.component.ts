import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {OAuthService} from "angular-oauth2-oidc";
import {authCodeFlowConfig} from "./auth.config";
import {LocalStorageService} from './storage.service';
import {NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'OAuth2 Azure AD test';

  constructor(private oauthService: OAuthService,
              private storage: LocalStorageService,
              private http: HttpClient) {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(value => {
      console.log(this.oauthService.getAccessToken())
      if (this.oauthService.hasValidAccessToken()) {
        this.http.get<AuthResponse>('http://localhost:8080/api/auth/v1/oauth2/token')
          .subscribe({
            next: (data) => {
              storage.set("username", data.username)
              storage.set("token", data.token)
            },
            error: (error) => {
              storage.remove("username")
              storage.remove("token")
            }
          });
      }
    });
  }

  public login() {
    this.oauthService.initCodeFlow()
  }

  public logout() {
    this.storage.remove("username")
    this.storage.remove("token")
    this.oauthService.logOut(true);
    return false;
  }

  public get authorized() {
    return this.storage.get("token") !== null
  }

  public get userName() {
    if(this.authorized)
      return this.storage.get("username")
    return ""
  }
}

export interface AuthResponse {
  id: number;
  lastName: string;
  firstName: string;
  username: string;
  email: string;
  token: string;
  modules: any;
}
