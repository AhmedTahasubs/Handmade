import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { ReviewItemComponent } from '../../components/review-item/review-item';
import { LanguageService } from '../../services/language.service';
import { ProductCardComponent } from "../../components/product-card/product-card";
import { ServiceService } from '../../services/service';
import { CreateCustomerRequestDto, CustomerRequestService } from '../../services/customer-request.service';

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
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/authService.service';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ServiceCardComponent, ReviewItemComponent, ProductCardComponent,RouterModule],
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
   isSubmitting = false;
  showRequestForm = false;
  requestDescription = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  sellerProducts: ProductDisplayDto[] = [];
  displayedSellerProducts: Product[] = [];
  
  private serviceService = inject(ServiceService);
  private customerRequestService = inject(CustomerRequestService);
  public auth = inject(AuthService);
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public languageService: LanguageService,
    private toastService: ToastService
  ) {}
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.serviceId = +params['id'];
      if (isNaN(this.serviceId)) {
        this.router.navigate(['/']);
        return;
      }
    this.resetServiceDate();

      this.loadServiceData();
    });
  }
  
  resetServiceDate(): void {
    this.service = null;
    this.relatedServices = [];
    this.reviews = [];
    this.loading = true;
    this.selectedPackage = null;
    this.activeGalleryImage = 0;
    this.expandedFAQ = null;
    this.showRequestForm = false;
    this.requestDescription = '';
  }
  
  private loadServiceData() {
    this.loading = true;
    this.serviceService.getServiceById(this.serviceId).subscribe({
      next: (dto: ServiceDto) => {
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
          packages: [
            {
              id: 1, name: { en: 'Basic Portrait', ar: 'بورتريه أساسي' },
              description: { en: 'Simple portrait with basic styling', ar: 'بورتريه بسيط مع تصميم أساسي' },
              price: dto.basePrice,
              deliveryTime: this.formatDeliveryTime(dto.deliveryTime),
              revisions: 2,
              features: { en: ['1 person', 'Basic background'], ar: ['شخص واحد', 'خلفية أساسية'] }
            },
          ],
          gallery: [
            dto.imageUrl || 'assets/placeholder-image.jpg',
          ],
          faq: [],
          requirements: { en: [], ar: [] },
          sellerInfo: {
            id: dto.sellerId,
            name: dto.sellerName,
            username: dto.sellerName,
            avatar: '',
            rating: dto.avgRating,
            reviewCount: 0,
            responseTime: '1 hour',
            completedOrders: 0,
            description: { en: '', ar: '' },
            skills: [],
            languages: [],
            isOnline: false,
            isVerified: false,
            joinDate: '',
            location: ''
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
        this.selectedPackage = this.service?.packages[0] || null;
        this.displayedSellerProducts = this.service?.products.slice(0, 3);
        console.log('Service loaded:', this.service);
        this.loadRelatedServices();
        this.loadReviews();
      },
      error: (error) => {
        console.error('Error fetching service detail:', error);
        this.loading = false;
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
        if (!reviews || reviews.length === 0) {
          this.reviews = [];
          return;
        }
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
        // console.error('Error loading reviews:', err);
      }
    });
  }

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
  
  selectPackage(pkg: ServicePackage): void {
    this.selectedPackage = pkg;
  }
  
  selectGalleryImage(index: number): void {
    this.activeGalleryImage = index;
  }
  
  toggleFAQ(id: number): void {
    this.expandedFAQ = this.expandedFAQ === id ? null : id;
  }
  
  toggleRequestForm(): void {
    this.showRequestForm = !this.showRequestForm;
    if (!this.showRequestForm) {
      this.resetRequestForm();
    }
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  resetRequestForm(): void {
    this.requestDescription = '';
    this.selectedFile = null;
    this.imagePreview = null;
  }

   createRequest(): void {
    if (!this.service || !this.requestDescription || this.isSubmitting) return;

    this.isSubmitting = true;

    const requestDto: CreateCustomerRequestDto = {
      sellerId: this.service.sellerInfo.id,
      serviceId: this.service.id,
      description: this.requestDescription,
      file: this.selectedFile!
    };

    this.customerRequestService.create(requestDto).subscribe({
      next: (response) => {
        this.toastService.showSuccess(
          this.currentLanguage === 'en' 
            ? 'Request submitted successfully!' 
            : 'تم إرسال الطلب بنجاح!'
        );
        this.toggleRequestForm();
        this.resetRequestForm();
      },
      error: (error) => {
        console.error('Error creating request:', error);
        this.toastService.showError(
          this.currentLanguage === 'en'
            ? 'Failed to submit request. Please try again.'
            : 'فشل إرسال الطلب. يرجى المحاولة مرة أخرى.'
        );
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  onRelatedServiceClick(service: Service): void {
    this.router.navigate(['/services', service.id]);
  }
  
  goToSellerProfile(): void {
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
      description: this.currentLanguage === 'en' ? 'Description' : 'الوصف',
      description_placeholder: this.currentLanguage === 'en' ? 'Describe what you need in detail...' : 'صف ما تحتاجه بالتفصيل...',
      reference_image: this.currentLanguage === 'en' ? 'Reference Image' : 'صورة مرجعية',
      choose_file: this.currentLanguage === 'en' ? 'Choose File' : 'اختر ملف',
      remove_image: this.currentLanguage === 'en' ? 'Remove Image' : 'إزالة الصورة',
      submit_request: this.currentLanguage === 'en' ? 'Submit Request' : 'إرسال الطلب',
      cancel: this.currentLanguage === 'en' ? 'Cancel' : 'إلغاء',
      packages: this.currentLanguage === 'en' ? 'Service Packages' : 'باقات الخدمة',
      popular: this.currentLanguage === 'en' ? 'Most Popular' : 'الأكثر شعبية',
      select_package: this.currentLanguage === 'en' ? 'Continue' : 'متابعة',
      order_now: this.currentLanguage === 'en' ? 'Customize Your Order Now' : 'خصص طلبك الآن',
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
      Service_products: this.currentLanguage === 'en' ? 'Services Products' : 'منتجات البائع',
      view_all_products: this.currentLanguage === 'en' ? 'View All Products' : 'عرض جميع المنتجات',
            processing: this.currentLanguage === 'en' ? 'Processing...' : 'جاري المعالجة...',

    };
  }
}