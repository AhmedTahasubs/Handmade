import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent, Product } from '../../components/product-card/product-card';
import { ReviewItemComponent } from '../../components/review-item/review-item';
import { FormButton } from '../../components/form-button/form-button';
import { LanguageService } from '../../services/language.service';

export interface Review {
  id: number;
  user: {
    name: string;
    avatar: string;
    country: string;
  };
  rating: number;
  comment: {
    en: string;
    ar: string;
  };
  date: string;
  isVerified: boolean;
}

export interface ExtendedProduct extends Product {
  originalPrice?: number;
  material?: string;
  dimensions?: string;
  weight?: string;
  images?: string[];
  stock?: number;
  sku?: string;
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
  imports: [
    CommonModule,
    FormsModule,
    ProductCardComponent,
    ReviewItemComponent,
    FormButton
  ]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: ExtendedProduct | null = null;
  loading = true;
  language: 'en' | 'ar' = 'en';
  // Labels
  labels = {
    home: 'Home',
    products: 'Products',
    loading: 'Loading...',
    add_to_wishlist: 'Add to wishlist',
    share: 'Share',
    customizable: 'Customizable',
    in_stock: 'In Stock',
    description: 'Description',
    category: 'Category',
    material: 'Material',
    dimensions: 'Dimensions',
    weight: 'Weight',
    not_specified: 'Not specified',
    quantity: 'Quantity',
    add_to_cart: 'Add to Cart',
    buy_now: 'Buy Now',
    starting_price: 'Starting price',
    free_shipping: 'Free Shipping',
    shipping_info: 'Free shipping on orders over $50',
    reviews: 'Reviews',
    write_review: 'Write Review',
    rating_distribution: 'Rating Distribution',
    stars: 'stars',
    review_filters: 'Review Filters',
    load_more_reviews: 'Load More Reviews',
    related_products: 'Related Products',
    rating: 'Rating',
    comment: 'Comment',
    review_placeholder: 'Share your experience with this product...',
    cancel: 'Cancel',
    submit_review: 'Submit Review',
    off: 'OFF',
    helpful: 'Helpful',
    verified_purchase: 'Verified Purchase'
  };
  // Image gallery
  selectedImage: string | null = null;
  productImages: string[] = [];

  // Quantity
  quantity = 1;

  // Wishlist
  isInWishlist = false;

  // Cart operations
  addingToCart = false;
  buyingNow = false;

  // Reviews
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  averageRating = 0;
  totalReviews = 0;
  ratingDistribution: { rating: number; count: number; percentage: number }[] = [];
  reviewFilters: { label: string; value: string; count: number }[] = [];
  selectedFilter = 'all';
  hasMoreReviews = false;
  loadingReviews = false;

  // Review form
  showReviewForm = false;
  reviewRating = 0;
  reviewComment = '';
  submittingReview = false;

  // Related products
  relatedProducts: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    // Set initial language
    this.language = this.languageService.currentLanguage();
    this.updateLabels();

    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private updateLabels(): void {
    if (this.language === 'ar') {
      this.labels = {
        home: 'الرئيسية',
        products: 'المنتجات',
        loading: 'جاري التحميل...',
        add_to_wishlist: 'أضف للمفضلة',
        share: 'مشاركة',
        customizable: 'مخصص',
        in_stock: 'متوفر',
        description: 'الوصف',
        category: 'الفئة',
        material: 'المادة',
        dimensions: 'الأبعاد',
        weight: 'الوزن',
        not_specified: 'غير محدد',
        quantity: 'الكمية',
        add_to_cart: 'أضف للسلة',
        buy_now: 'اشتري الآن',
        starting_price: 'السعر الأساسي',
        free_shipping: 'شحن مجاني',
        shipping_info: 'شحن مجاني للطلبات فوق 50$',
        reviews: 'التقييمات',
        write_review: 'اكتب تقييم',
        rating_distribution: 'توزيع التقييمات',
        stars: 'نجوم',
        review_filters: 'فلاتر التقييم',
        load_more_reviews: 'تحميل المزيد من التقييمات',
        related_products: 'منتجات ذات صلة',
        rating: 'التقييم',
        comment: 'التعليق',
        review_placeholder: 'شارك تجربتك مع هذا المنتج...',
        cancel: 'إلغاء',
        submit_review: 'إرسال التقييم',
        off: 'خصم',
        helpful: 'مفيد',
        verified_purchase: 'شراء موثق'
      };
    }
  }

  private loadProduct(productId: number): void {
    this.loading = true;

    // Simulate API call
    // setTimeout(() => {
    //   this.product = this.getMockProduct(productId);
    //   this.productImages = this.product.images || [this.product.imageUrl];
    //   this.selectedImage = this.productImages[0];
    //   this.loadReviews();
    //   this.loadRelatedProducts();
    //   this.checkWishlistStatus();
    //   this.loading = false;
    // }, 1000);
  }

  // private getMockProduct(id: number): ExtendedProduct {
  //   const mockProducts: ExtendedProduct[] = [
  //     {
  //       id: 1,
  //       name: { en: 'Handcrafted Wooden Bowl', ar: 'وعاء خشبي يدوي الصنع' },
  //       description: {
  //         en: 'Beautiful handcrafted wooden bowl made from sustainable oak. Perfect for serving or as a decorative piece.',
  //         ar: 'وعاء خشبي جميل مصنوع يدوياً من خشب البلوط المستدام. مثالي للتقديم أو كقطعة ديكور.'
  //       },
  //       price: 45.99,
  //       originalPrice: 59.99,
  //       category: 'Home & Garden',
  //       image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
  //       images: [
  //         'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
  //         'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&fit=crop&crop=center',
  //         'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&fit=crop&crop=top',
  //         'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&fit=crop&crop=bottom'
  //       ],
  //       seller: 'WoodMasters',
  //       rating: 4.8,
  //       customizable: true,
  //       material: 'Oak Wood',
  //       dimensions: '12" x 8" x 3"',
  //       weight: '2.5 lbs',
  //       stock: 15,
  //       sku: 'WM-BOWL-001'
  //     },
  //     {
  //       id: 2,
  //       name: { en: 'Handwoven Cotton Rug', ar: 'سجادة قطنية منسوجة يدوياً' },
  //       description: {
  //         en: 'Traditional handwoven cotton rug with geometric patterns. Adds warmth and style to any room.',
  //         ar: 'سجادة قطنية تقليدية منسوجة يدوياً بنقوش هندسية. تضيف الدفء والأناقة لأي غرفة.'
  //       },
  //       price: 89.99,
  //       category: 'Home & Garden',
  //       image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
  //       seller: 'ArtisanCrafts',
  //       rating: 4.6,
  //       customizable: false,
  //       material: '100% Cotton',
  //       dimensions: '4\' x 6\'',
  //       weight: '8 lbs',
  //       stock: 8,
  //       sku: 'AC-RUG-002'
  //     }
  //   ];

  //   return mockProducts.find(p => p.id === id) || mockProducts[0];
  // }

  private loadReviews(): void {
    // Mock reviews data
    this.reviews = [
      {
        id: 1,
        user: {
          name: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
          country: 'USA'
        },
        rating: 5,
        comment: {
          en: 'Absolutely beautiful craftsmanship! The bowl is even more stunning in person.',
          ar: 'حرفية جميلة جداً! الوعاء أكثر إبداعاً في الواقع.'
        },
        date: '2024-01-15',
        isVerified: true
      },
      {
        id: 2,
        user: {
          name: 'Ahmed Hassan',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          country: 'Egypt'
        },
        rating: 4,
        comment: {
          en: 'Great quality and fast shipping. Highly recommend!',
          ar: 'جودة ممتازة وشحن سريع. أنصح به بشدة!'
        },
        date: '2024-01-10',
        isVerified: true
      }
    ];

    this.filteredReviews = [...this.reviews];
    this.calculateReviewStats();
  }

  private calculateReviewStats(): void {
    this.totalReviews = this.reviews.length;
    this.averageRating = this.reviews.reduce((sum, review) => sum + review.rating, 0) / this.totalReviews;

    // Calculate rating distribution
    this.ratingDistribution = [];
    for (let i = 5; i >= 1; i--) {
      const count = this.reviews.filter(r => r.rating === i).length;
      const percentage = this.totalReviews > 0 ? (count / this.totalReviews) * 100 : 0;
      this.ratingDistribution.push({ rating: i, count, percentage });
    }

    // Set up review filters
    this.reviewFilters = [
      { label: this.language === 'en' ? 'All Reviews' : 'جميع التقييمات', value: 'all', count: this.totalReviews },
      { label: '5 Stars', value: '5', count: this.ratingDistribution[0].count },
      { label: '4 Stars', value: '4', count: this.ratingDistribution[1].count },
      { label: '3 Stars', value: '3', count: this.ratingDistribution[2].count },
      { label: '2 Stars', value: '2', count: this.ratingDistribution[3].count },
      { label: '1 Star', value: '1', count: this.ratingDistribution[4].count }
    ];
  }

  private loadRelatedProducts(): void {
    // Mock related products
    // this.relatedProducts = [
    //   {
    //     id: 3,
    //     name: { en: 'Ceramic Vase', ar: 'مزهرية خزفية' },
    //     description: { en: 'Handcrafted ceramic vase', ar: 'مزهرية خزفية مصنوعة يدوياً' },
    //     price: 35.99,
    //     category: 'Home & Garden',
    //     image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
    //     seller: 'CeramicArt',
    //     rating: 4.7,
    //     customizable: true
    //   },
    //   {
    //     id: 4,
    //     name: { en: 'Leather Wallet', ar: 'محفظة جلدية' },
    //     description: { en: 'Handmade leather wallet', ar: 'محفظة جلدية مصنوعة يدوياً' },
    //     price: 29.99,
    //     category: 'Accessories',
    //     image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
    //     seller: 'LeatherCraft Co',
    //     rating: 4.5,
    //     customizable: false
    //   }
    // ];
  }

  private checkWishlistStatus(): void {
    // Mock wishlist check
    this.isInWishlist = Math.random() > 0.5;
  }

  // Image gallery methods
  selectImage(image: string): void {
    this.selectedImage = image;
  }

  // Quantity methods
  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Cart and wishlist methods
  onAddToCart(): void {
    if (!this.product) return;

    this.addingToCart = true;
    setTimeout(() => {
      console.log(`Added ${this.quantity} of ${this.product?.title} to cart`);
      this.addingToCart = false;
      // Here you would typically call a service to add to cart
    }, 1000);
  }

  onBuyNow(): void {
    if (!this.product) return;

    this.buyingNow = true;
    setTimeout(() => {
      console.log(`Buying ${this.quantity} of ${this.product?.title}`);
      this.buyingNow = false;
      // Here you would typically navigate to checkout
    }, 1000);
  }

  onAddToWishlist(): void {
    if (!this.product) return;

    this.isInWishlist = !this.isInWishlist;
    console.log(`${this.isInWishlist ? 'Added' : 'Removed'} ${this.product.title} from wishlist`);
  }

  onShare(): void {
    if (navigator.share) {
      navigator.share({
        title: this.product?.title,
        text: this.product?.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert(this.language === 'en' ? 'Link copied to clipboard!' : 'تم نسخ الرابط!');
    }
  }

  onSellerClick(): void {
    if (!this.product) return;

    const sellerId = this.getSellerIdFromName(this.product.sellerId);
    this.router.navigate(['/seller', sellerId]);
  }

  private getSellerIdFromName(sellerName: string): number {
    const sellerMap: { [key: string]: number } = {
      'ArtisanCrafts': 1,
      'WoolWonders': 2,
      'WoodMasters': 3,
      'LeatherCraft Co': 4,
      'BohoVibes': 5,
      'ArtisticSoul': 6,
      'NaturalGlow': 7,
      'BabyComfort': 8,
      'CeramicArt': 9
    };
    return sellerMap[sellerName] || 1;
  }

  // Review methods
  filterReviews(filter: string): void {
    // this.selectedFilter = filter;
    // if (filter === 'all') {
    //   this.filteredReviews = [...this.reviews];
    // } else {
    //   const rating = parseInt(filter);
    //   this.filteredReviews = this.reviews.filter(review => review.rating === rating);
    // }
  }

  loadMoreReviews(): void {
    this.loadingReviews = true;
    setTimeout(() => {
      // Mock loading more reviews
      this.loadingReviews = false;
      this.hasMoreReviews = false;
    }, 1000);
  }

  setReviewRating(rating: number): void {
    this.reviewRating = rating;
  }

  submitReview(): void {
    if (!this.reviewRating || !this.reviewComment.trim()) {
      alert(this.language === 'en' ? 'Please provide both rating and comment' : 'يرجى تقديم التقييم والتعليق');
      return;
    }

    this.submittingReview = true;
    setTimeout(() => {
      const newReview: Review = {
        id: this.reviews.length + 1,
        user: {
          name: 'Current User',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
          country: 'Unknown'
        },
        rating: this.reviewRating,
        comment: {
          en: this.reviewComment,
          ar: this.reviewComment
        },
        date: new Date().toISOString().split('T')[0],
        isVerified: false
      };

      this.reviews.unshift(newReview);
      this.calculateReviewStats();
      this.filterReviews(this.selectedFilter);

      this.showReviewForm = false;
      this.reviewRating = 0;
      this.reviewComment = '';
      this.submittingReview = false;
    }, 1000);
  }

  // Utility methods
  getStarArray(): number[] {
    return Array(5).fill(0).map((_, i) => i);
  }

  // isStarFilled(index: number, rating?: number): boolean {
  //   const targetRating = rating || this.product?.rating || 0;
  //   return index < Math.floor(targetRating);
  // }

  getDiscountPercentage(): number {
    if (!this.product?.originalPrice) return 0;
    return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
  }
}
