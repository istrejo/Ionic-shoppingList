import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export default class Tab2Page {
  constructor() {}
}
