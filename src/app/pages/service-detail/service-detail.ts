// src/app/pages/service-detail/service-detail.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { ReviewItemComponent } from '../../components/review-item/review-item';
import { LanguageService } from '../../services/language.service';
import { ProductCardComponent } from "../../components/product-card/product-card";
import { ServiceService } from '../../services/service'; 


import {
  Service,
  ServiceDetail,
  ServicePackage,
  FAQ,
  SellerInfo,
  Review,
  ServiceDto,
  ProductDisplayDto as ProductDto, 
  Product, 
  ProductDisplayDto,
} from '../../shared/service.interface'; 


@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ServiceCardComponent, ReviewItemComponent, ProductCardComponent],
  templateUrl: './service-detail.html',
  styleUrl: './service-detail.css'
})
export class ServiceDetailPage implements OnInit {
  serviceId: number = 0;
  service: ServiceDetail | null = null;
  relatedServices: Service[] = [];
  reviews: Review[] = [];
  loading = true;
  selectedPackage: ServicePackage | null = null;
  activeGalleryImage = 0;
  expandedFAQ: number | null = null;
  
  showContactForm = false;
  contactMessage = '';
  sellerProducts: ProductDisplayDto[] = []; // النوع Product[] للـ frontend
  displayedSellerProducts: Product[] = [];
  
  // حقن ServiceService
  private serviceService = inject(ServiceService);
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public languageService: LanguageService
  ) {}
  
  ngOnInit() {
    console.log('seller profile:', this.service?.sellerInfo.id);
    this.route.params.subscribe(params => {
      this.serviceId = +params['id']; // تحويل الـ id من string إلى number
      if (isNaN(this.serviceId)) {
        console.error('Invalid Service ID:', params['id']);
        this.router.navigate(['/services']); // إعادة التوجيه لو الـ ID مش رقم
        return;
      }
      this.loadServiceData(); // استدعي دالة تحميل البيانات
    });
  }
  
  private loadServiceData() {
    this.loading = true;
    this.serviceService.getServiceById(this.serviceId).subscribe({
      next: (dto: ServiceDto) => {
        // **هنا بنحول الـ ServiceDto اللي جاي من الـ API للـ ServiceDetail**
        // ركز على معالجة الخصائص اللي ممكن ما تكونش موجودة في الـ DTO أو محتاجة تحويل.
        this.service = {
          id: dto.id,
          title: dto.title,
          description: dto.description,
          price: dto.basePrice, 
          rating: dto.avgRating,
          reviewCount: 0, 
          imageUrl: dto.imageUrl, 
          category: dto.categoryName, 
          seller: dto.sellerName,
          categoryId: dto.categoryId, 
          isCustomizable: false, 
          deliveryTime: this.formatDeliveryTime(dto.deliveryTime),
          
          fullDescription: dto.description,
          features: {
            en: [
              'High-resolution digital artwork', 'Multiple format delivery (PNG, JPG, PDF)',
              'Commercial use rights included', 'Unlimited revisions until satisfied',
              'Custom background options', 'Fast 24-48 hour delivery'
            ],
            ar: [
              'عمل فني رقمي عالي الدقة', 'تسليم بصيغ متعددة (PNG, JPG, PDF)',
              'حقوق الاستخدام التجاري مشمولة', 'مراجعات غير محدودة حتى الرضا',
              'خيارات خلفية مخصصة', 'تسليم سريع خلال 24-48 ساعة'
            ]
          },
          packages: [ // **ملاحظة:** هذه البيانات تحتاج لجلبها من الـ API أو تكوينها بناءً على الـ DTO
            {
              id: 1, name: { en: 'Basic Portrait', ar: 'بورتريه أساسي' },
              description: { en: 'Simple portrait with basic styling', ar: 'بورتريه بسيط مع تصميم أساسي' },
              price: dto.basePrice, // ممكن تستخدم الـ basePrice من الـ DTO كـ Basic Package
              deliveryTime: this.formatDeliveryTime(dto.deliveryTime),
              revisions: 2,
              features: { en: ['1 person', 'Basic background'], ar: ['شخص واحد', 'خلفية أساسية'] }
            },
            // ممكن تضيف باقات إضافية هنا لو الـ API بيرجعها
          ],
          gallery: [ // **ملاحظة:** المعرض يحتاج لجلب من الـ API
            dto.imageUrl || 'assets/placeholder-image.jpg', // استخدام الصورة الأساسية كأول صورة في المعرض
            // هنا ممكن تضيف صور أخرى لو الـ API بيرجع array من الصور
          ],
          faq: [], // **ملاحظة:** FAQs تحتاج لجلب من الـ API
          requirements: { en: [], ar: [] }, // **ملاحظة:** Requirements تحتاج لجلب من الـ API
          sellerInfo: { // **ملاحظة:** SellerInfo تحتاج لجلب من الـ API أو تكوينها من DTO
            id: dto.sellerId, // تحويل String لـ number
            name: dto.sellerName,
            username: dto.sellerName, // افتراض أن اسم المستخدم هو اسم البائع
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=387', // Mocked
            rating: dto.avgRating,
            reviewCount: 0, // Mocked
            responseTime: '1 hour', // Mocked
            completedOrders: 0, // Mocked
            description: { en: '', ar: '' }, // Mocked
            skills: [], // Mocked
            languages: [], // Mocked
            isOnline: false, // Mocked
            isVerified: false, // Mocked
            joinDate: '', // Mocked
            location: '' // Mocked
          },
products: (dto.products ?? []).filter(p=>p.status==="approved").map((pDto: ProductDisplayDto) => ({
  id: pDto.id,
  title: pDto.title,
  price: pDto.price,
  quantity: pDto.quantity,
  status: pDto.status,
  createdAt: pDto.createdAt,
  sellerId: dto.sellerId,
  serviceId: dto.id,
  imageUrl: pDto.imageUrl || 'assets/product-placeholder.jpg',
  category: dto.categoryName ?? '',
  description: pDto.description,
  sellerName: dto.sellerName ?? '',
}))


        };
        console.log('Fetched Service Detail:', this.service);

        // قم بتعيين أول باقة أو القيمة الافتراضية إذا كان لديك logic أكثر تعقيدًا للباقات
        this.selectedPackage = this.service?.packages[0] || null;
        // عرض أول 3 منتجات من البائع
        this.displayedSellerProducts = this.service?.products.slice(0, 3);
        
        // **هنا ممكن تستدعي دوال لجلب Related Services و Reviews لو ليهم APIs منفصلة**
        this.loadRelatedServices(); // لسه بتجيب Mock data، ممكن تعدلها
        this.loadReviews(); // لسه بتجيب Mock data، ممكن تعدلها

      },
      error: (error) => {
        console.error('Error fetching service detail:', error);
        this.loading = false;
        // هنا ممكن تعمل إعادة توجيه لصفحة خطأ أو تعرض رسالة للمستخدم
        this.router.navigate(['/services']); 
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  private mapDtoToService(dto: ServiceDto): Service {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    price: dto.basePrice,
    rating: dto.avgRating,
    reviewCount: dto.products.length, 
    imageUrl: dto.imageUrl,
    category: dto.categoryName,
    seller: dto.sellerName,
    isCustomizable: dto.products.length > 0, 
    deliveryTime: dto.deliveryTime + ' days', 
    categoryId: dto.categoryId
  };
}


  // هذه الدوال لسه بتجيب Mock data. لو عندك APIs ليها، عدلها.
private loadRelatedServices(): void {
  if (!this.service || !this.service.category) return;

  this.serviceService.getServicesByCategoryName(this.service.category).subscribe((dtos: ServiceDto[]) => {
    const services = dtos
      .filter(dto => dto.id !== this.service?.id)
      .map(dto => this.mapDtoToService(dto)).slice(0, 4);

    this.relatedServices = services;
  });
}


private loadReviews(): void {
  if (!this.service) return;

  this.serviceService.getReviewsByServiceId(this.service.id).subscribe({
    next: (reviews: Review[]) => {
      this.reviews = reviews.map(r => ({
        ...r,
        user: {
          id: r.reviewerId,
          name: r.reviewerName
        },
        date: r.createdAt,
        isVerified: true  
      }));
    },
    error: (err) => {
      console.error('Error loading reviews:', err);
    }
  });}



  private formatDeliveryTime(timeInDays: number): string {
    if (timeInDays === 0) {
      return this.currentLanguage === 'en' ? 'Instant' : 'فوري';
    } else if (timeInDays === 1) {
      return this.currentLanguage === 'en' ? '1 day' : 'يوم واحد';
    } else if (timeInDays > 0) {
      return this.currentLanguage === 'en' ? `${timeInDays} days` : `${timeInDays} أيام`;
    }
    return '';
  }
  
  // ... (بقية دوال الكومبوننت كما هي) ...

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
      this.contactMessage = '';
      this.showContactForm = false;
    }
  }
  
  orderService(): void {
    if (this.selectedPackage) {
      console.log('Ordering service:', this.selectedPackage);
    }
  }
  
  onRelatedServiceClick(service: Service): void {
    this.router.navigate(['/services', service.id]);
  }
  
  goToSellerProfile(): void {
    console.log('Going to seller profile:', this.service?.sellerInfo.id);
    if (this.service) {
      this.router.navigate(['/sellerProfile', this.service.sellerInfo.id]);
    }
  }
  
 

  onAddToCart(product: any): void {
    console.log('Adding to cart:', product);
  }

  onAddToWishlist(product: any): void {
    console.log('Adding to wishlist:', product);
  }

  viewAllSellerProducts(): void {
    if (this.service) {
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
      back_to_services: this.currentLanguage === 'en' ? 'Back to Services' : 'العودة للخدمات',
      starting_at: this.currentLanguage === 'en' ? 'Starting at' : 'يبدأ من',
      delivery_time: this.currentLanguage === 'en' ? 'Delivery Time' : 'وقت التسليم',
      revisions: this.currentLanguage === 'en' ? 'Revisions' : 'المراجعات',
      contact_seller: this.currentLanguage === 'en' ? 'Contact Seller' : 'اتصل بالبائع',
      send_message: this.currentLanguage === 'en' ? 'Send Message' : 'إرسال رسالة',
      message_placeholder: this.currentLanguage === 'en' ? 'Type your message here...' : 'اكتب رسالتك هنا...',
      send: this.currentLanguage === 'en' ? 'Send' : 'إرسال',
      cancel: this.currentLanguage === 'en' ? 'Cancel' : 'إلغاء',
      packages: this.currentLanguage === 'en' ? 'Service Packages' : 'باقات الخدمة',
      popular: this.currentLanguage === 'en' ? 'Most Popular' : 'الأكثر شعبية',
      select_package: this.currentLanguage === 'en' ? 'Continue' : 'متابعة',
      order_now: this.currentLanguage === 'en' ? 'Order Now' : 'اطلب الآن',
      about_service: this.currentLanguage === 'en' ? 'About This Service' : 'حول هذه الخدمة',
      service_features: this.currentLanguage === 'en' ? 'What You Get' : 'ما ستحصل عليه',
      gallery: this.currentLanguage === 'en' ? 'Portfolio Samples' : 'عينات الأعمال',
      requirements: this.currentLanguage === 'en' ? 'Requirements' : 'المتطلبات',
      faq: this.currentLanguage === 'en' ? 'Frequently Asked Questions' : 'الأسئلة الشائعة',
      reviews: this.currentLanguage === 'en' ? 'Reviews' : 'التقييمات',
      seller_info: this.currentLanguage === 'en' ? 'About the Seller' : 'حول البائع',
      related_services: this.currentLanguage === 'en' ? 'Related Services' : 'خدمات ذات صلة',
      response_time: this.currentLanguage === 'en' ? 'Response Time' : 'وقت الاستجابة',
      completed_orders: this.currentLanguage === 'en' ? 'Orders Completed' : 'الطلبات المكتملة',
      member_since: this.currentLanguage === 'en' ? 'Member Since' : 'عضو منذ',
      from: this.currentLanguage === 'en' ? 'From' : 'من',
      skills: this.currentLanguage === 'en' ? 'Skills' : 'المهارات',
      languages: this.currentLanguage === 'en' ? 'Languages' : 'اللغات',
      view_profile: this.currentLanguage === 'en' ? 'View Full Profile' : 'عرض الملف الكامل',
      verified_purchase: this.currentLanguage === 'en' ? 'Verified Purchase' : 'عملية شراء موثقة',
      helpful: this.currentLanguage === 'en' ? 'Helpful' : 'مفيد',
      online: this.currentLanguage === 'en' ? 'Online' : 'متصل',
      verified: this.currentLanguage === 'en' ? 'Verified Seller' : 'بائع موثق',
      Service_products: this.currentLanguage === 'en' ? 'Serices Products' : 'منتجات البائع',
      view_all_products: this.currentLanguage === 'en' ? 'View All Products' : 'عرض جميع المنتجات'
    };
  }
}