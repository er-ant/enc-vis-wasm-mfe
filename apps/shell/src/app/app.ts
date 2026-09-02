import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './components/header/header';
import { ReactWrapper } from './components/react-wrapper/react-wrapper';
import { AngularWrapper } from './components/angular-wrapper/angular-wrapper';

import { Frameworks, Encryptions, IAddCardConfig } from './models';

interface IMFEInfo {
  id: string;
  framework: Frameworks;
  algorithm: Encryptions;
}

@Component({
  imports: [RouterOutlet, Header, ReactWrapper, AngularWrapper],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {

  readonly MICROFRONTENDS_MODULE_INFO = {
    Angular: {
      remoteModuleConfig: {
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './NgMFE'
      }
    },
    React: {
      remoteModuleConfig: {
        remoteEntry: 'http://localhost:4202/remoteEntry.js',
        exposedModule: './ReactMFE'
      }
    }
  };

  microfrontends = signal<Array<IMFEInfo>>([]);

  cardAddedHandler($event: IAddCardConfig): void {
    const newMFE: IMFEInfo = {
      id: crypto.randomUUID(),
      framework: $event.framework,
      algorithm: $event.encryption,
    };

    this.microfrontends.set([...this.microfrontends(), newMFE]);
  }

  removeCardHandler(id: string): void {
    this.microfrontends.update((MFEs: Array<IMFEInfo>) => MFEs.filter((MFE: IMFEInfo) => MFE.id !== id));
  }
}
