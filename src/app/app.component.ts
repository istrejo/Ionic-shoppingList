import { Component, EnvironmentInjector, inject } from '@angular/core';
import { Platform } from '@ionic/angular';

import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  platform = inject(Platform);
  constructor(public environmentInjector: EnvironmentInjector) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('initialize app');
      GoogleAuth.initialize({
        scopes: ['profile', 'email'],
        clientId:
          '721140284167-k25clbb7679lec9a4b8caba4dpp7oaol.apps.googleusercontent.com',
      });
    });
  }
}
