import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { LightgalleryModule } from 'lightgallery/angular';
import lightGallery from 'lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [LightgalleryModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  #lightGalleryInstance: any;

  ngAfterViewInit() {
    const element = document.getElementById('lightgallery');
    if (element) {
      this.#lightGalleryInstance = lightGallery(element, {
        selector: '.gallery-item',
        plugins: [lgZoom],
        speed: 500,
      });
    }

    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    });

    const items = document.querySelectorAll('.item');
    items.forEach((item) => animationObserver.observe(item));
  }

  ngOnDestroy() {
    if (this.#lightGalleryInstance) {
      this.#lightGalleryInstance.destroy();
    }
  }
}
