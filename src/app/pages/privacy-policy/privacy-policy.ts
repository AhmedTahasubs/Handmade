import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-policy.html'
})
export class PrivacyPolicyComponent {
  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService
  ) {}
}