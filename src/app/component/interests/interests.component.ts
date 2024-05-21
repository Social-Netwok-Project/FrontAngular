import { Component } from '@angular/core';
import {discoverNavigationItem, interestsNavigationItem, myPostsNavigationItem} from "../header/navigation-item";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-interests',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './interests.component.html',
  styleUrl: './interests.component.scss'
})
export class InterestsComponent {

  protected readonly myPostsNavigationItem = myPostsNavigationItem;
  protected readonly discoverNavigationItem = discoverNavigationItem;
  protected readonly interestsNavigationItem = interestsNavigationItem;
}
