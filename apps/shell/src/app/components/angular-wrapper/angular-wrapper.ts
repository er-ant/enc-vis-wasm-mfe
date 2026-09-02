import { Component, AfterViewInit, ViewChild, ViewContainerRef, input, output, ComponentRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { loadRemoteModule, LoadRemoteModuleEsmOptions } from '@angular-architects/module-federation';

import { PartialBy, Encryptions } from '../../models';

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
        .pipe(takeUntilDestroyed())
        .subscribe(
          (result: boolean) => result && this.cardDestroy.emit(true)
        );
    });
  }
}
