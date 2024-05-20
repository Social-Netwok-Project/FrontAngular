import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  footerTopValue!: number;
  // position: string = 'static';

  @Input() footerTopPadding: number = 0;
  @Input() footerTopMinValue: number = 0;
  @Input() position: string = "";

  constructor() {
  }

  ngOnInit(): void {
    try {
      this.footerTopValue = Math.max(this.footerTopMinValue, window.innerHeight);
    } catch (e) {
    }
  }

  onResize(event: any) {
    this.footerTopValue = Math.max(this.footerTopMinValue, window.innerHeight);
  }

}
