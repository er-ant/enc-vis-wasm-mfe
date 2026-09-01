import { Component, ElementRef, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { RouterOutlet } from '@angular/router';

import { Header } from './components/header/header';
import { ReactWrapper } from './components/react-wrapper/react-wrapper';

import { Frameworks, Encryptions, IAddCardConfig } from './models';

// interface IWidget {

// }

@Component({
  imports: [RouterOutlet, Header, ReactWrapper],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit {
  @ViewChild('widgetContainer', { read: ViewContainerRef }) container!: ViewContainerRef;

  microfrontends = signal<Array<any>>([]);

  readonly REACT_APP_OBJ = {
    remoteModuleConfig: {
      remoteEntry: 'http://localhost:4202/remoteEntry.js',
      exposedModule: './ReactMFE'
    }
  }

  ngAfterViewInit() {
    this.renderApps();
  }

  async renderApps() {
    loadRemoteModule({
      type: 'module',
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
      exposedModule: './NgMFE'
    }).then((m) => console.log(this.container.createComponent(m.App)));
  }

  cardChoosenHandler($event: IAddCardConfig): void {
    console.log($event);
  }
}
