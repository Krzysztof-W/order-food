import { Component } from '@angular/core';

interface NavigationTab {
  name: string,
  link: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  navigationTabs: NavigationTab[] = [
    {name: 'Dashboard', link: '/dashboard'},
    {name: 'My groups', link: '/my-groups'}
  ];
  navigationOpened = false;
  toggleNav() {
    this.navigationOpened = !this.navigationOpened;
  }
  closeNav() {
    this.navigationOpened = false;
  }
}
