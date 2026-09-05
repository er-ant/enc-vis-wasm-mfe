import { Component, AfterViewInit, ViewChild, ViewContainerRef, input, output, ComponentRef } from '@angular/core';
import { loadRemoteModule, LoadRemoteModuleEsmOptions } from '@angular-architects/module-federation';

import { PartialBy } from '../../models';
import { Encryptions } from '@enc-vis-wasm-mfe/shared-types';

interface IAngularAppMetadata {
  remoteModuleConfig: PartialBy<LoadRemoteModuleEsmOptions, 'type'>;
}

@Component({
  selector: 'enc-vis-shell-angular-wrapper',
  imports: [],
  templateUrl: './angular-wrapper.html',
  styleUrl: './angular-wrapper.scss',
})
export class AngularWrapper implements AfterViewInit {

  @ViewChild('mfeContainer', { read: ViewContainerRef }) mfeContainer!: ViewContainerRef;

  angularAppInfo = input.required<IAngularAppMetadata>();
  algorithm = input.required<Encryptions>();

  cardDestroy = output<boolean>();

  ngAfterViewInit() {
    this.renderAngularApp(this.angularAppInfo());
  }

  renderAngularApp(angularAppInfo: IAngularAppMetadata): void {
    loadRemoteModule({
      type: 'module',
      ...angularAppInfo.remoteModuleConfig
    }).then((m: any) => {
      const componentRef: ComponentRef<any> = this.mfeContainer.createComponent(m.App);
      componentRef.setInput('algorithm', this.algorithm());

      componentRef
        .instance
        .onClose
        .subscribe(
          (result: boolean) => result && this.cardDestroy.emit(true)
        );
    });
  }
}
