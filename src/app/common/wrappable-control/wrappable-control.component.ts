import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wrappable-control',
  standalone: true,
  imports: [NgIf],
  templateUrl: './wrappable-control.component.html',
  styleUrl: './wrappable-control.component.css',
})
export class WrappableControlComponent {
  @Input() title: string = '';
  wrapped: boolean = true;
}
