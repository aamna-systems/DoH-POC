import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {
  @Input() sidebarId: string = 'sidebar';
  navText: string;

  public newMessages = new Array(4);
  public newTasks = new Array(5);
  public newNotifications = new Array(5);

  constructor(private classToggler: ClassToggleService, private router: Router) {
    super();

    this.router.events.subscribe(() => {
      if (this.router.url.includes("two")) {
        this.navText = "International Outbreak"
      } else if (this.router.url.includes("three")){
        this.navText = "Epidemic Visualization"
      } else {
        this.navText = "Data Generator"
      }
    })
  }
}
