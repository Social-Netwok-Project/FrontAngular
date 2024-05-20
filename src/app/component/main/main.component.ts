import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NgIf} from "@angular/common";
import {HeaderComponent} from "../header/header.component";
import {CookieComponent} from "../misc/cookie-component";

@Component({
  selector: 'main-component',
  standalone: true,
  imports: [RouterOutlet, NgIf, HeaderComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent extends CookieComponent implements OnInit {
  // Excluded Routes for headers / footers
  excludedHeaderRoutes = ['/login', '/register', '/password-recovery', '/password-reset/'];

  constructor(protected override router: Router) {
    super();
  }

  ngOnInit(): void {
  }

  isCurrentRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  isNotExcludedHeaderRoute(): boolean {
    for (let i = 0; i < this.excludedHeaderRoutes.length; i++) {
      if (this.isCurrentRoute(this.excludedHeaderRoutes[i])) {
        return false;
      }
    }
    return true;
  }
}
