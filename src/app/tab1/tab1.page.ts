import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab1',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export default class Tab1Page {
  authService = inject(AuthService);
  router = inject(Router);
  constructor() {}

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
