import { Component, ElementRef, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { RouterOutlet } from '@angular/router';

import { NxWelcome } from './nx-welcome';

@Component({
  imports: [NxWelcome, RouterOutlet],
  selector: 'app-root',
  // standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit, OnDestroy {
  @ViewChild('widgetContainer', { read: ViewContainerRef }) container!: ViewContainerRef;
  @ViewChild('widgetContainerReact', { static: true }) containerReact!: ElementRef;

  protected title = 'shell';

  private root: any;

  constructor() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderApps();
    }, 100);
  }

  async renderApps() {
    loadRemoteModule({
      type: 'module',
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
      exposedModule: './NgMFE'
    }).then((m) => this.container.createComponent(m.App));


    // setTimeout(async () => {
    //   const React = await import('react');
    //   const ReactDOM = await import('react-dom/client');

    //   const m = await loadRemoteModule({
    //     type: 'module',
    //     remoteEntry: 'http://localhost:4202/remoteEntry.js',
    //     exposedModule: './ReactMFE'
    //   });

    //   this.root = ReactDOM.createRoot(this.containerReact.nativeElement);
    //   this.root.render(React.createElement(m.App));
    // }, 3000)

  }

  ngOnDestroy() {
    if (this.root) {
      this.root.unmount();
    }
  }

}
