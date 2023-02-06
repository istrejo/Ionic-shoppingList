import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export default class Tab1Page {
  constructor() {}
}
