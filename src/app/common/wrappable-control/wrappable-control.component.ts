import { Component, input, Input, signal } from '@angular/core';

@Component({
  selector: 'app-wrappable-control',
  standalone: true,
  imports: [],
  templateUrl: './wrappable-control.component.html',
  styleUrl: './wrappable-control.component.css',
})
export class WrappableControlComponent {
  title = input('');
  wrapped = signal(true);

  toggle() {
    this.wrapped.update((prev) => !prev);
  }
}
