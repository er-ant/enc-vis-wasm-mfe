import { Component, AfterViewInit, ViewChild, ViewContainerRef, input, output } from '@angular/core';
import { loadRemoteModule, LoadRemoteModuleEsmOptions  } from '@angular-architects/module-federation';

import { PartialBy } from '../../models';

interface IAngularAppMetadata {
  remoteModuleConfig: PartialBy<LoadRemoteModuleEsmOptions, 'type'>;
}

@Component({
  selector: 'app-angular-wrapper',
  imports: [],
  templateUrl: './angular-wrapper.html',
  styleUrl: './angular-wrapper.scss',
})
export class AngularWrapper implements AfterViewInit {

  @ViewChild('widgetContainer', { read: ViewContainerRef }) container!: ViewContainerRef;

  angularAppInfo = input.required<IAngularAppMetadata>();

  cardDestroy = output<boolean>();

  ngAfterViewInit() {
    this.renderAngularApp(this.angularAppInfo());
  }

  renderAngularApp(angularAppInfo: IAngularAppMetadata): void {
    loadRemoteModule({
      type: 'module',
      ...angularAppInfo.remoteModuleConfig
    }).then((m: any) => {
      const component = this.container.createComponent(m.App);
    });
  }
}
