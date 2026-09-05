import { Component, AfterViewInit, OnDestroy, ElementRef, input, output, effect, inject } from '@angular/core';
import { loadRemoteModule, LoadRemoteModuleEsmOptions  } from '@angular-architects/module-federation';

import { Root } from 'react-dom/client';

import { PartialBy } from '../../models';
import { Encryptions } from '@enc-vis-wasm-mfe/shared-types';

interface IReactAppMetadata {
  remoteModuleConfig: PartialBy<LoadRemoteModuleEsmOptions, 'type'>;
  props?: { [key: string]: any };
}

@Component({
  selector: 'enc-vis-shell-react-wrapper',
  imports: [],
  templateUrl: './react-wrapper.html',
  styleUrl: './react-wrapper.scss',
})
export class ReactWrapper implements AfterViewInit, OnDestroy {

  private elementRef = inject(ElementRef);

  reactAppInfo = input.required<IReactAppMetadata>();
  algorithm = input.required<Encryptions>();

  cardDestroy = output<boolean>();

  private root!: Root;

  ngAfterViewInit(): void {
    this.renderReactApp(this.reactAppInfo());
  }

  ngOnDestroy(): void {
    if (this.root) {
      this.root.unmount();
    }
  }

  renderReactApp(reactAppMetadata: IReactAppMetadata): void {
    let React: any;
    let ReactDOM: any;
    let appModule: any;

    import('react')
      .then((r: any) => {
        React = r;
        return import('react-dom/client');
      })
      .then((dom: any) => {
        ReactDOM = dom;
        return loadRemoteModule({
          type: 'module',
          ...reactAppMetadata.remoteModuleConfig
        })
      })
      .then((m: any) => {
        const props = {
          algorithm: this.algorithm(),
          onClose: (result: boolean) => result && this.cardDestroy.emit(true),
          ...reactAppMetadata.props
        };
        appModule = m;
        this.root = ReactDOM.createRoot(this.elementRef.nativeElement);

        this.root.render(React.createElement(appModule.App, props));
      });
  }
}
