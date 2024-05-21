import { Component } from '@angular/core';
import {discoverNavigationItem, myPostsNavigationItem} from "../header/navigation-item";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.scss'
})
export class DiscoverComponent {

  protected readonly myPostsNavigationItem = myPostsNavigationItem;
  protected readonly discoverNavigationItem = discoverNavigationItem;
}
