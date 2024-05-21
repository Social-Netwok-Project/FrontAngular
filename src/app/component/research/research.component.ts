import { Component } from '@angular/core';
import {faArrowRightToBracket} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {researchNavigationItem} from "../header/navigation-item";

@Component({
  selector: 'app-research',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './research.component.html',
  styleUrl: './research.component.scss'
})
export class ResearchComponent {

  protected readonly faArrowRightToBracket = faArrowRightToBracket;
  protected readonly researchNavigationItem = researchNavigationItem;
}
