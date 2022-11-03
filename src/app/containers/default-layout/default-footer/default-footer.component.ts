import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '@coreui/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-default-footer',
  templateUrl: './default-footer.component.html',
  styleUrls: ['./default-footer.component.scss'],
})
export class DefaultFooterComponent
  extends FooterComponent
  implements OnDestroy
{
  private routerSub: Subscription;
  showLegend: boolean = false;

  constructor(private router: Router) {
    super();

    this.routerSub = this.router.events.subscribe(() => {
      if (this.router.url.includes('two')) {
        this.showLegend = true;
      } else {
        this.showLegend = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
