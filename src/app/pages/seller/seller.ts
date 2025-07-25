import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component, HostListener, OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterOutlet } from '@angular/router';
import { SellerSidebar } from '../../components/seller components/seller-sidebar/seller-sidebar';
import { SellerHeader } from '../../components/seller components/seller-header/seller-header';

@Component({
  selector: "app-seller",
  standalone: true,
  imports: [
    CommonModule,
    SellerSidebar,
    SellerHeader,
    RouterOutlet
  ],
  templateUrl: './seller.html',
})
export class Seller implements OnDestroy {
  sidebarOpen = false;

  constructor(
    public ThemeService: ThemeService,
    public LanguageService: LanguageService,
  ) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    this.updateBodyOverflow();
  }

  closeSidebar() {
    this.sidebarOpen = false;
    this.updateBodyOverflow();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth >= 1024) {
      this.closeSidebar();
    }
  }

  private updateBodyOverflow() {
    document.body.style.overflow = this.sidebarOpen ? 'hidden' : '';
  }

  ngOnDestroy() {
    // Clean up when component is destroyed
    document.body.style.overflow = '';
  }
}