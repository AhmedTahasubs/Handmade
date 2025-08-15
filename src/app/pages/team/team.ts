import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';
import { RouterModule } from '@angular/router';

interface TeamMember {
  id: number;
  nameEn: string;
  nameAr: string;
  phone: string;
  linkedin: string;
  github: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './team.html',
  styleUrls: ['./team.css']
})
export class TeamComponent {
  teamMembers: TeamMember[] = [
    {
      id: 1,
      nameEn: 'Ahmed Taha Muhammad Taha',
      nameAr: 'أحمد طه محمد طه',
      phone: '01113795716',
      linkedin: 'https://www.linkedin.com/in/ahmedtahamuhammed/',
      github: 'https://github.com/AhmedTahasubs',
      imageUrl: 'taha.jpg'
    },
    {
      id: 5,
      nameEn: 'Ahmed Elsayed Hammad',
      nameAr: 'أحمد السيد حماد ',
      phone: '01090720075',
      linkedin: 'https://www.linkedin.com/in/ahmed-hammad-8aaa1a340/',
      github: 'https://github.com/Hammad4544',
      imageUrl: 'hammad.jpg',
    },
    {
      id: 2,
      nameEn: 'Ahmed Abdelkarim Ibrahim',
      nameAr: 'احمد عبدالكريم إبراهيم',
      phone: '01149947723',
      linkedin: 'https://www.linkedin.com/in/ahmed-abdullkarim/',
      github: 'https://github.com/AhmedAbdelkarim1',
      imageUrl: 'abdelkarim.jpg'
    },
    {
      id: 3,
      nameEn: 'Amira Fathelbab Abdelfattah Abdalghaffar',
      nameAr: 'اميره فتح الباب عبد الفتاح عبد الغفار',
      phone: '01069455514',
      linkedin: 'https://www.linkedin.com/in/amira-fathelbab-16b098340/',
      github: 'https://github.com/AmiraFathalbab',
      imageUrl: 'https://avatars.githubusercontent.com/u/107847417?v=4',
    },
    {
      id: 4,
      nameEn: 'Ahmed Fathi Ahmed',
      nameAr: 'أحمد فتحى أحمد',
      phone: '01142392700',
      linkedin: 'https://www.linkedin.com/in/ahmed-hasona-6788b2146',
      github: 'https://github.com/ahmed2103',
      imageUrl: 'hasona.png'
    },

  ];

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService
  ) {}

  get currentLanguage() {
    return this.languageService.currentLanguage();
  }

  getWhatsAppLink(phone: string): string {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Add the international prefix if it's an Egyptian number
    if (cleaned.startsWith('01') && cleaned.length === 11) {
      return `https://wa.me/20${cleaned.substring(1)}`;
    }
    return `https://wa.me/${cleaned}`;
  }
}