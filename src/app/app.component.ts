import { Component } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(public auth: AuthenticationService) {}
  BASE_URL = "http://localhost:3001";
  GOOGLE_MAP_KEY = "AIzaSyAVKf6MiIfZSj_DsLXMtPRMH7FGoAnmkVg";
}
