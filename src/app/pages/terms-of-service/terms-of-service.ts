import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terms-of-service.html'
})
export class TermsOfServiceComponent {
  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService
  ) {}
}