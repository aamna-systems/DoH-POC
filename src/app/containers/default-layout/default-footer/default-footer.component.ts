import { Component, OnDestroy, OnInit } from '@angular/core';
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
  implements OnInit, OnDestroy
{
  private routerSub: Subscription;
  showLegend: boolean = false;

  constructor(private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.routerSub = this.router.events.subscribe(() => {
      this.showLegend = this.router.url.includes('map') ? true : false;
    });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
