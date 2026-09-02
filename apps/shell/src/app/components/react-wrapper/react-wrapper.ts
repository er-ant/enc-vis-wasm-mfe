import { Component, AfterViewInit, OnDestroy, ElementRef, input, output, effect, inject } from '@angular/core';
import { loadRemoteModule, LoadRemoteModuleEsmOptions  } from '@angular-architects/module-federation';

import { Root } from 'react-dom/client';

import { PartialBy } from '../../models';

interface IReactAppMetadata {
  remoteModuleConfig: PartialBy<LoadRemoteModuleEsmOptions, 'type'>;
  props?: { [key: string]: any };
}

@Component({
  selector: 'app-react-wrapper',
  imports: [],
  templateUrl: './react-wrapper.html',
  styleUrl: './react-wrapper.scss',
})
export class ReactWrapper implements AfterViewInit, OnDestroy {

  private elementRef = inject(ElementRef);

  reactAppInfo = input.required<IReactAppMetadata>();

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
        appModule = m;
        this.root = ReactDOM.createRoot(this.elementRef.nativeElement);
        this.root.render(React.createElement(appModule.App, reactAppMetadata.props));
      });
  }
}
