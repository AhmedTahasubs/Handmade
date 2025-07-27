import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceCardComponent, Service } from '../../components/service-card/service-card.component';
import { ReviewItemComponent, Review } from '../../components/review-item/review-item';
import { LanguageService } from '../../services/language.service';
import { ProductCardComponent } from "../../components/product-card/product-card";

export interface ServiceDetail extends Service {
  fullDescription: {
    en: string;
    ar: string;
  };
  features: {
    en: string[];
    ar: string[];
  };
  packages: ServicePackage[];
  gallery: string[];
  faq: FAQ[];
  requirements: {
    en: string[];
    ar: string[];
  };
  sellerInfo: SellerInfo;
}

export interface ServicePackage {
  id: number;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  price: number;
  deliveryTime: string;
  revisions: number;
  features: {
    en: string[];
    ar: string[];
  };
  isPopular?: boolean;
}

export interface FAQ {
  id: number;
  question: {
    en: string;
    ar: string;
  };
  answer: {
    en: string;
    ar: string;
  };
}

export interface SellerInfo {
  id: number;
  name: string;
  username: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  responseTime: string;
  completedOrders: number;
  description: {
    en: string;
    ar: string;
  };
  skills: string[];
  languages: string[];
  isOnline: boolean;
  isVerified: boolean;
  joinDate: string;
  location: string;
}

// Review interface moved to review-item component

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ServiceCardComponent, ReviewItemComponent, ProductCardComponent],
  templateUrl: './service-detail.html',
  styleUrl: './service-detail.css'
})
export class ServiceDetailPage implements OnInit {
  serviceId: string = '';
  service: ServiceDetail | null = null;
  relatedServices: Service[] = [];
  reviews: Review[] = [];
  loading = true;
  selectedPackage: ServicePackage | null = null;
  activeGalleryImage = 0;
  expandedFAQ: number | null = null;
  
  // Contact form
  showContactForm = false;
  contactMessage = '';
  sellerProducts: any[] = [];
  displayedSellerProducts: any[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public languageService: LanguageService
  ) {}
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.serviceId = params['id'];
      this.loadServiceData();
    });
  }
  
  private loadServiceData() {
    // Mock service data - in real app, this would come from a service
    this.service = {
      id: parseInt(this.serviceId),
      title: 'Custom Portrait Illustration',
      description: 'Personalized digital portrait illustration in a unique artistic style. Perfect for profile pictures, gifts, or personal use.',
      price: 45,
      rating: 4.8,
      reviewCount: 127,
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
      category: 'art',
      seller: 'ArtisticSoul',
      isCustomizable: true,
      deliveryTime: '3-5 days',
      fullDescription: {
        en: 'Transform your photos into stunning digital portrait illustrations! I specialize in creating unique, personalized artwork that captures the essence of your personality. Using professional digital art techniques, I will create a one-of-a-kind portrait that you can use for social media profiles, print as wall art, or give as a memorable gift.',
        ar: 'حول صورك إلى رسوم بورتريه رقمية مذهلة! أنا متخصص في إنشاء أعمال فنية فريدة وشخصية تلتقط جوهر شخصيتك. باستخدام تقنيات الفن الرقمي المهنية، سأنشئ بورتريه فريد من نوعه يمكنك استخدامه لملفات وسائل التواصل الاجتماعي أو طباعته كعمل فني جداري أو تقديمه كهدية لا تُنسى.'
      },
      features: {
        en: [
          'High-resolution digital artwork',
          'Multiple format delivery (PNG, JPG, PDF)',
          'Commercial use rights included',
          'Unlimited revisions until satisfied',
          'Custom background options',
          'Fast 24-48 hour delivery'
        ],
        ar: [
          'عمل فني رقمي عالي الدقة',
          'تسليم بصيغ متعددة (PNG, JPG, PDF)',
          'حقوق الاستخدام التجاري مشمولة',
          'مراجعات غير محدودة حتى الرضا',
          'خيارات خلفية مخصصة',
          'تسليم سريع خلال 24-48 ساعة'
        ]
      },
      packages: [
        {
          id: 1,
          name: { en: 'Basic Portrait', ar: 'بورتريه أساسي' },
          description: { en: 'Simple portrait with basic styling', ar: 'بورتريه بسيط مع تصميم أساسي' },
          price: 25,
          deliveryTime: '2 days',
          revisions: 2,
          features: {
            en: ['1 person', 'Basic background', '1 revision', 'High resolution'],
            ar: ['شخص واحد', 'خلفية أساسية', 'مراجعة واحدة', 'دقة عالية']
          }
        },
        {
          id: 2,
          name: { en: 'Standard Portrait', ar: 'بورتريه قياسي' },
          description: { en: 'Enhanced portrait with custom styling', ar: 'بورتريه محسن مع تصميم مخصص' },
          price: 45,
          deliveryTime: '3-5 days',
          revisions: 3,
          features: {
            en: ['1-2 people', 'Custom background', '3 revisions', 'Multiple formats', 'Commercial rights'],
            ar: ['1-2 أشخاص', 'خلفية مخصصة', '3 مراجعات', 'صيغ متعددة', 'حقوق تجارية']
          },
          isPopular: true
        },
        {
          id: 3,
          name: { en: 'Premium Portrait', ar: 'بورتريه فاخر' },
          description: { en: 'Detailed portrait with premium features', ar: 'بورتريه مفصل مع ميزات فاخرة' },
          price: 85,
          deliveryTime: '5-7 days',
          revisions: 5,
          features: {
            en: ['Up to 4 people', 'Premium styling', '5 revisions', 'All formats', 'Commercial rights', 'Rush delivery option'],
            ar: ['حتى 4 أشخاص', 'تصميم فاخر', '5 مراجعات', 'جميع الصيغ', 'حقوق تجارية', 'خيار التسليم السريع']
          }
        }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2458&q=80',
        'https://images.unsplash.com/photo-1596514042625-fd3dd6dc98c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      ],
      faq: [
        {
          id: 1,
          question: {
            en: 'What information do you need to get started?',
            ar: 'ما المعلومات التي تحتاجها للبدء؟'
          },
          answer: {
            en: 'I need high-quality photos of the person(s) you want illustrated, any specific style preferences, and details about the intended use of the artwork.',
            ar: 'أحتاج إلى صور عالية الجودة للشخص أو الأشخاص الذين تريد رسمهم، وأي تفضيلات محددة للأسلوب، وتفاصيل حول الاستخدام المقصود للعمل الفني.'
          }
        },
        {
          id: 2,
          question: {
            en: 'Can I request revisions?',
            ar: 'هل يمكنني طلب مراجعات؟'
          },
          answer: {
            en: 'Yes! Each package includes a specific number of revisions. I want to make sure you are completely satisfied with the final result.',
            ar: 'نعم! كل باقة تتضمن عدد محدد من المراجعات. أريد التأكد من أنك راضٍ تماماً عن النتيجة النهائية.'
          }
        }
      ],
      requirements: {
        en: [
          'High-quality photos (minimum 500x500 pixels)',
          'Clear description of desired style',
          'Specify intended use (personal/commercial)',
          'Any specific background preferences'
        ],
        ar: [
          'صور عالية الجودة (500x500 بكسل كحد أدنى)',
          'وصف واضح للأسلوب المطلوب',
          'تحديد الاستخدام المقصود (شخصي/تجاري)',
          'أي تفضيلات محددة للخلفية'
        ]
      },
      sellerInfo: {
        id: 1,
        name: 'Ahmed Hassan',
        username: 'ArtisticSoul',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
        rating: 4.9,
        reviewCount: 156,
        responseTime: '1 hour',
        completedOrders: 324,
        description: {
          en: 'Professional digital artist with 5+ years of experience in portrait illustration and custom artwork.',
          ar: 'فنان رقمي محترف مع أكثر من 5 سنوات من الخبرة في رسم البورتريه والأعمال الفنية المخصصة.'
        },
        skills: ['Digital Art', 'Portrait Illustration', 'Adobe Photoshop', 'Custom Design'],
        languages: ['English', 'Arabic'],
        isOnline: true,
        isVerified: true,
        joinDate: '2019-03-15',
        location: 'Cairo, Egypt'
      }
    };
    
    this.selectedPackage = this.service.packages[1]; // Default to standard package
    
    // Mock related services
    this.relatedServices = [
      {
        id: 2,
        title: 'Logo Design Service',
        description: 'Professional logo design for your business',
        price: 75,
        rating: 4.7,
        reviewCount: 89,
        imageUrl: 'https://images.unsplash.com/photo-1626785774625-0b1c2c4eab67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
        category: 'design',
        seller: 'ArtisticSoul',
        isCustomizable: true,
        deliveryTime: '2-3 days'
      },
      {
        id: 3,
        title: 'Character Illustration',
        description: 'Custom character design and illustration',
        price: 95,
        rating: 4.9,
        reviewCount: 67,
        imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2458&q=80',
        category: 'art',
        seller: 'ArtisticSoul',
        isCustomizable: true,
        deliveryTime: '5-7 days'
      }
    ];
    
    // Mock reviews
    this.reviews = [
      {
        id: 1,
        user: {
          name: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b550?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
          country: 'United States'
        },
        rating: 5.0,
        comment: {
          en: 'Absolutely amazing work! Ahmed created a beautiful portrait that exceeded my expectations. The attention to detail is incredible and the communication was excellent throughout the process.',
          ar: 'عمل مذهل بكل ما تحمله الكلمة من معنى! أحمد أنشأ بورتريه جميل فاق توقعاتي. الاهتمام بالتفاصيل لا يصدق والتواصل كان ممتاز طوال العملية.'
        },
        date: '2024-01-15',
        isVerified: true
      },
      {
        id: 2,
        user: {
          name: 'محمد علي',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          country: 'Saudi Arabia'
        },
        rating: 4.8,
        comment: {
          en: 'Great service and professional work. The portrait came out exactly as I imagined. Will definitely work with Ahmed again.',
          ar: 'خدمة رائعة وعمل احترافي. البورتريه خرج تماماً كما تخيلت. سأعمل مع أحمد مرة أخرى بالتأكيد.'
        },
        date: '2024-01-10',
        isVerified: true
      }
    ];
    
    // Load seller products
    this.loadSellerProducts();
    
    this.loading = false;
  }
  
  selectPackage(pkg: ServicePackage): void {
    this.selectedPackage = pkg;
  }
  
  selectGalleryImage(index: number): void {
    this.activeGalleryImage = index;
  }
  
  toggleFAQ(id: number): void {
    this.expandedFAQ = this.expandedFAQ === id ? null : id;
  }
  
  toggleContactForm(): void {
    this.showContactForm = !this.showContactForm;
  }
  
  sendMessage(): void {
    if (this.contactMessage.trim()) {
      console.log('Sending message:', this.contactMessage);
      // Implement message sending functionality
      this.contactMessage = '';
      this.showContactForm = false;
    }
  }
  
  orderService(): void {
    if (this.selectedPackage) {
      console.log('Ordering service:', this.selectedPackage);
      // Implement order functionality
    }
  }
  
  onRelatedServiceClick(service: Service): void {
    this.router.navigate(['/service', service.id]);
  }
  
  goToSellerProfile(): void {
    if (this.service) {
      this.router.navigate(['/seller', this.service.sellerInfo.id]);
    }
  }
  
  goBackToServices(): void {
    this.router.navigate(['/services']);
  }

  private loadSellerProducts(): void {
    // Mock seller products data
    this.sellerProducts = [
      {
        id: 1,
        name: { en: 'Handcrafted Wooden Bowl', ar: 'وعاء خشبي يدوي الصنع' },
        description: { 
          en: 'Beautiful handcrafted wooden bowl made from sustainable oak.',
          ar: 'وعاء خشبي جميل مصنوع يدوياً من خشب البلوط المستدام.'
        },
        price: 45.99,
        category: 'Home & Garden',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
        seller: 'ArtisticSoul',
        rating: 4.8,
        customizable: true
      },
      {
        id: 2,
        name: { en: 'Custom Ceramic Vase', ar: 'مزهرية خزفية مخصصة' },
        description: { 
          en: 'Handcrafted ceramic vase with unique designs.',
          ar: 'مزهرية خزفية مصنوعة يدوياً بتصاميم فريدة.'
        },
        price: 35.99,
        category: 'Home & Garden',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
        seller: 'ArtisticSoul',
        rating: 4.6,
        customizable: true
      },
      {
        id: 3,
        name: { en: 'Leather Wallet', ar: 'محفظة جلدية' },
        description: { 
          en: 'Handmade leather wallet with premium quality.',
          ar: 'محفظة جلدية مصنوعة يدوياً بجودة فاخرة.'
        },
        price: 29.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
        seller: 'ArtisticSoul',
        rating: 4.5,
        customizable: false
      },
      {
        id: 4,
        name: { en: 'Artistic Wall Art', ar: 'عمل فني جداري' },
        description: { 
          en: 'Unique wall art piece created by the artist.',
          ar: 'قطعة فنية جدارية فريدة من نوعها من إنشاء الفنان.'
        },
        price: 89.99,
        category: 'Art',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500',
        seller: 'ArtisticSoul',
        rating: 4.9,
        customizable: true
      }
    ];
    
    // Set displayed products (max 3)
    this.displayedSellerProducts = this.sellerProducts.slice(0, 3);
  }

  onAddToCart(product: any): void {
    console.log('Adding to cart:', product);
    // Implement add to cart functionality
  }

  onAddToWishlist(product: any): void {
    console.log('Adding to wishlist:', product);
    // Implement add to wishlist functionality
  }

  viewAllSellerProducts(): void {
    if (this.service) {
      // Navigate to products page with seller filter
      this.router.navigate(['/products'], { 
        queryParams: { 
          seller: this.service.sellerInfo.name,
          sellerId: this.service.sellerInfo.id 
        } 
      });
    }
  }
  
  getStarArray(): number[] {
    return Array(5).fill(0).map((_, i) => i);
  }
  
  isStarFilled(index: number, rating: number): boolean {
    return index < Math.floor(rating);
  }
  
  isStarHalf(index: number, rating: number): boolean {
    return index === Math.floor(rating) && rating % 1 >= 0.5;
  }
  
  get currentLanguage(): 'en' | 'ar' {
    return this.languageService.currentLanguage() as 'en' | 'ar';
  }
  
  get labels() {
    return {
      // Navigation
      back_to_services: this.currentLanguage === 'en' ? 'Back to Services' : 'العودة للخدمات',
      
      // Service Info
      starting_at: this.currentLanguage === 'en' ? 'Starting at' : 'يبدأ من',
      delivery_time: this.currentLanguage === 'en' ? 'Delivery Time' : 'وقت التسليم',
      revisions: this.currentLanguage === 'en' ? 'Revisions' : 'المراجعات',
      
      // Contact
      contact_seller: this.currentLanguage === 'en' ? 'Contact Seller' : 'اتصل بالبائع',
      send_message: this.currentLanguage === 'en' ? 'Send Message' : 'إرسال رسالة',
      message_placeholder: this.currentLanguage === 'en' ? 'Type your message here...' : 'اكتب رسالتك هنا...',
      send: this.currentLanguage === 'en' ? 'Send' : 'إرسال',
      cancel: this.currentLanguage === 'en' ? 'Cancel' : 'إلغاء',
      
      // Packages
      packages: this.currentLanguage === 'en' ? 'Service Packages' : 'باقات الخدمة',
      popular: this.currentLanguage === 'en' ? 'Most Popular' : 'الأكثر شعبية',
      select_package: this.currentLanguage === 'en' ? 'Continue' : 'متابعة',
      order_now: this.currentLanguage === 'en' ? 'Order Now' : 'اطلب الآن',
      
      // Sections
      about_service: this.currentLanguage === 'en' ? 'About This Service' : 'حول هذه الخدمة',
      service_features: this.currentLanguage === 'en' ? 'What You Get' : 'ما ستحصل عليه',
      gallery: this.currentLanguage === 'en' ? 'Portfolio Samples' : 'عينات الأعمال',
      requirements: this.currentLanguage === 'en' ? 'Requirements' : 'المتطلبات',
      faq: this.currentLanguage === 'en' ? 'Frequently Asked Questions' : 'الأسئلة الشائعة',
      reviews: this.currentLanguage === 'en' ? 'Reviews' : 'التقييمات',
      seller_info: this.currentLanguage === 'en' ? 'About the Seller' : 'حول البائع',
      related_services: this.currentLanguage === 'en' ? 'Related Services' : 'خدمات ذات صلة',
      
      // Seller Info
      response_time: this.currentLanguage === 'en' ? 'Response Time' : 'وقت الاستجابة',
      completed_orders: this.currentLanguage === 'en' ? 'Orders Completed' : 'الطلبات المكتملة',
      member_since: this.currentLanguage === 'en' ? 'Member Since' : 'عضو منذ',
      from: this.currentLanguage === 'en' ? 'From' : 'من',
      skills: this.currentLanguage === 'en' ? 'Skills' : 'المهارات',
      languages: this.currentLanguage === 'en' ? 'Languages' : 'اللغات',
      view_profile: this.currentLanguage === 'en' ? 'View Full Profile' : 'عرض الملف الكامل',
      
      // Reviews
      verified_purchase: this.currentLanguage === 'en' ? 'Verified Purchase' : 'عملية شراء موثقة',
      helpful: this.currentLanguage === 'en' ? 'Helpful' : 'مفيد',
      
      // States
      online: this.currentLanguage === 'en' ? 'Online' : 'متصل',
      verified: this.currentLanguage === 'en' ? 'Verified Seller' : 'بائع موثق',
      
      // Seller Products
      seller_products: this.currentLanguage === 'en' ? 'Seller Products' : 'منتجات البائع',
      view_all_products: this.currentLanguage === 'en' ? 'View All Products' : 'عرض جميع المنتجات'
    };
  }
}