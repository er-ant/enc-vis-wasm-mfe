import { Component, ElementRef, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit, OnDestroy {
  @ViewChild('widgetContainer', { read: ViewContainerRef }) container!: ViewContainerRef;
  @ViewChild('widgetContainerReact', { static: true }) containerReact!: ElementRef;

  private root: any;

  ngAfterViewInit() {
    this.renderApps();
  }

  async renderApps() {
    loadRemoteModule({
      type: 'module',
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
      exposedModule: './NgMFE'
    }).then((m) => this.container.createComponent(m.App));

    const React = await import('react');
    const ReactDOM = await import('react-dom/client');

    const m = await loadRemoteModule({
      type: 'module',
      remoteEntry: 'http://localhost:4202/remoteEntry.js',
      exposedModule: './ReactMFE'
    });

    this.root = ReactDOM.createRoot(this.containerReact.nativeElement);
    this.root.render(React.createElement(m.App));
  }

  ngOnDestroy() {
    if (this.root) {
      this.root.unmount();
    }
  }

}
