import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { AdminSidebar } from "../../components/admin components/admin-sidebar/admin-sidebar";
import { AdminHeader } from "../../components/admin components/admin-header/admin-header";
import { DashboardOverview } from "../../components/admin components/dashboard-overview/dashboard-overview";
import { ArtisanStats } from "../../components/admin components/artisan-stats/artisan-stats";
import { SalesAnalytics } from "../../components/admin components/sales-analytics/sales-analytics";
import { RecentOrders } from "../../components/admin components/recent-orders/recent-orders";
import { TopArtisans } from "../../components/admin components/top-artisans/top-artisans";
import { PendingApprovalsComponent } from "../../components/admin components/pending-approvals/pending-approvals";
import { RouterOutlet } from '@angular/router';
@Component({
  selector: "app-admin",
  standalone: true,
  imports: [
    CommonModule,
    AdminSidebar,
    AdminHeader,
    DashboardOverview,
    ArtisanStats,
    SalesAnalytics,
    RecentOrders,
    TopArtisans,
    PendingApprovalsComponent,
    RouterOutlet
],
  templateUrl: './admin.html',
})
export class Admin implements OnInit {
  sidebarOpen = false

  constructor(
    public ThemeService: ThemeService,
    public LanguageService: LanguageService,
  ) {}

  ngOnInit() {}
}