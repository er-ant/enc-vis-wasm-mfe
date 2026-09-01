import { Component, OnDestroy, ElementRef, ViewChild, input, effect } from '@angular/core';
import { loadRemoteModule, LoadRemoteModuleEsmOptions  } from '@angular-architects/module-federation';

import { Root } from 'react-dom/client';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

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
export class ReactWrapper implements OnDestroy {

  @ViewChild('widgetContainerReact', { static: true }) containerReact!: ElementRef;

  reactAppInfo = input.required<IReactAppMetadata>();

  private root!: Root;

  constructor() {
    effect(() => {
      this.renderReactApp(this.reactAppInfo());
    });
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
        this.root = ReactDOM.createRoot(this.containerReact.nativeElement);
        this.root.render(React.createElement(appModule.App, reactAppMetadata.props));
      });
  }

  ngOnDestroy() {
    if (this.root) {
      this.root.unmount();
    }
  }
}
