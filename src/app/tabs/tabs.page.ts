import { Component, EnvironmentInjector, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  @ViewChild(IonTabs) tabs: IonTabs;
  selected: string = 'tab1';

  constructor(public environmentInjector: EnvironmentInjector) {
    environmentInjector.get;
  }

  setSelectedTab() {
    this.selected = this.tabs.getSelected();
  }
}
