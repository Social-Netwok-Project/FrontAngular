import { Component } from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faThumbsUp} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {

  protected readonly faThumbsUp = faThumbsUp;
}
