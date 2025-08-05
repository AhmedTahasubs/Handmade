import { Component, inject, OnInit } from '@angular/core'; // استيراد OnInit
import { Product } from '../../components/product-card/product-card';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { CategoryService, CategoryDto } from '../../services/category'; // استيراد الخدمة الجديدة و DTO
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Add this import
import { ProductService } from '../../services/products.service'; // Make sure to import the ProductService
// تحديث واجهة Category لتتوافق مع DTO من API لاسم الفئة
// قد ترغب في الاحتفاظ بالاسم: { en: string; ar: string } لأغراض العرض،
// ولكن بالنسبة للبيانات التي تم جلبها، سنستخدم بنية CategoryDto.
// لتبسيط هذا المثال، سأقوم بضبط `Category` لتعكس البيانات التي تم جلبها مبدئيًا.
interface Category {
  id: number; // تم التغيير إلى number ليتوافق مع CategoryDto
  name: string; // الآن مجرد string من API
  imageUrl: string | null; // من API
  productCount: number; // من المحتمل أن يأتي هذا من API منفصل أو يتم حسابه
  featured: boolean; // من المحتمل أن يأتي هذا من API منفصل أو يتم تحديده من جانب العميل
}

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // استيراد RouterModule
    FormsModule 
  ]
})
export class HomeComponent implements OnInit { // تطبيق OnInit
  private languageService = inject(LanguageService);
  private categoryService = inject(CategoryService); // حقن الخدمة الجديدة
   aiSearchQuery = '';
  token: string | null = localStorage.getItem('token');
  // الحصول على اللغة من الخدمة لاستخدامها في القالب
  get language(): 'en' | 'ar' {
    return this.languageService.currentLanguage();
  }

  // حالات الفلتر
  searchTerm = '';
  selectedCategory: string | number = 'all'; // السماح بـ string 'all' أو number لمعرف الفئة
  priceRange = [0, 200];
  showCustomizable = false;

  // بيانات المنتجات الوهمية (مع الاحتفاظ بها مؤقتًا، ولكن ستطبق نفس المنطق لجلبها)
  // products: Product[] = [
  //   // ... (بيانات المنتجات الوهمية الموجودة لديك)
  //   {
  //     id: 1,
  //     name: {
  //       en: 'Handwoven Ceramic Vase',
  //       ar: 'مزهرية خزفية منسوجة يدوياً'
  //     },
  //     description: {
  //       en: 'Beautiful handcrafted ceramic vase with intricate patterns',
  //       ar: 'مزهرية خزفية جميلة مصنوعة يدوياً بأنماط معقدة'
  //     },
  //     price: 45.99,
  //     category: 'ceramics', // سيحتاج هذا إلى المطابقة مع معرف الفئة التي تم جلبها
  //     image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
  //     seller: 'ArtisanCrafts',
  //     rating: 4.8,
  //     customizable: true
  //   },
  //   {
  //     id: 2,
  //     name: {
  //       en: 'Knitted Wool Scarf',
  //       ar: 'وشاح صوف محبوك'
  //     },
  //     description: {
  //       en: 'Soft and warm hand-knitted wool scarf in multiple colors',
  //       ar: 'وشاح صوف محبوك يدوياً ناعم ودافئ بألوان متعددة'
  //     },
  //     price: 32.5,
  //     category: 'textiles',
  //     image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=300&h=300&fit=crop',
  //     seller: 'WoolWonders',
  //     rating: 4.9,
  //     customizable: true
  //   },
  //   {
  //     id: 3,
  //     name: {
  //       en: 'Wooden Jewelry Box',
  //       ar: 'صندوق مجوهرات خشبي'
  //     },
  //     description: {
  //       en: 'Handcrafted wooden jewelry box with velvet interior',
  //       ar: 'صندوق مجوهرات خشبي مصنوع يدوياً بداخلية مخملية'
  //     },
  //     price: 78.0,
  //     category: 'woodwork',
  //     image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
  //     seller: 'WoodMasters',
  //     rating: 4.7,
  //     customizable: false
  //   },
  //   {
  //     id: 4,
  //     name: {
  //       en: 'Leather Wallet',
  //       ar: 'محفظة جلدية'
  //     },
  //     description: {
  //       en: 'Premium handmade leather wallet with multiple compartments',
  //       ar: 'محفظة جلدية فاخرة مصنوعة يدوياً بعدة أقسام'
  //     },
  //     price: 65.99,
  //     category: 'leather',
  //     image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
  //     seller: 'LeatherCraft Co',
  //     rating: 4.6,
  //     customizable: true
  //   },
  //   {
  //     id: 5,
  //     name: {
  //       en: 'Macrame Wall Hanging',
  //       ar: 'معلقة جدارية مكرمية'
  //     },
  //     description: {
  //       en: 'Boho-style macrame wall decoration for modern homes',
  //       ar: 'زينة جدارية مكرمية بأسلوب البوهو للمنازل العصرية'
  //     },
  //     price: 28.75,
  //     category: 'textiles',
  //     image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
  //     seller: 'BohoVibes',
  //     rating: 4.5,
  //     customizable: true
  //   },
  //   {
  //     id: 6,
  //     name: {
  //       en: 'Hand-painted Canvas Art',
  //       ar: 'لوحة فنية مرسومة يدوياً'
  //     },
  //     description: {
  //       en: 'Original abstract painting on canvas by local artist',
  //       ar: 'لوحة تجريدية أصلية على القماش من فنان محلي'
  //     },
  //     price: 120.0,
  //     category: 'art',
  //     image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop',
  //     seller: 'ArtisticSoul',
  //     rating: 4.9,
  //     customizable: false
  //   },
  //   {
  //     id: 7,
  //     name: {
  //       en: 'Handmade Soap Set',
  //       ar: 'مجموعة صابون مصنوع يدوياً'
  //     },
  //     description: {
  //       en: 'Natural organic soap set with essential oils',
  //       ar: 'مجموعة صابون طبيعي عضوي بالزيوت الأساسية'
  //     },
  //     price: 24.99,
  //     category: 'beauty',
  //     image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
  //     seller: 'NaturalGlow',
  //     rating: 4.8,
  //     customizable: true
  //   },
  //   {
  //     id: 8,
  //     name: {
  //       en: 'Crocheted Baby Blanket',
  //       ar: 'بطانية أطفال محبوكة'
  //     },
  //     description: {
  //       en: 'Soft crocheted baby blanket in pastel colors',
  //       ar: 'بطانية أطفال محبوكة ناعمة بألوان الباستيل'
  //     },
  //     price: 42.5,
  //     category: 'textiles',
  //     image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=300&fit=crop',
  //     seller: 'BabyComfort',
  //     rating: 4.9,
  //     customizable: true
  //   }
  // ];


  allCategories: Category[] = [];
  featuredCategories: Category[] = [];

  constructor(private router : Router,private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: CategoryDto[]) => {
        // قم بتحويل CategoryDto التي تم جلبها إلى واجهة Category المحلية الخاصة بك
        // ستحتاج إلى تحديد كيفية التعامل مع 'productCount' و 'featured'
        // إذا لم تكن متاحة مباشرة من نقطة نهاية API.
        this.allCategories = data.map(dto => ({
          id: dto.id,
          name: dto.name,
          imageUrl: dto.imageUrl,
          productCount: 0, // قيمة افتراضية، قم بجلبها أو حسابها من API آخر إذا لزم الأمر
          featured: false // قيمة افتراضية، قم بتحديدها بناءً على بيانات API أو قاعدة
        }));

        // بالنسبة للفئات المميزة، يمكنك التصفية من allCategories
        // أو لديك نقطة نهاية API منفصلة للفئات المميزة.
        // في الوقت الحالي، دعنا نختار القليل الأول كمثال.
        this.featuredCategories = this.allCategories.slice(0, 3).map(cat => ({
          ...cat,
          featured: true // وضع علامة عليها كمميزة للعرض
        }));

        console.log('Fetched Categories:', this.allCategories);
        console.log('Featured Categories:', this.featuredCategories);
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        // التعامل مع الخطأ، على سبيل المثال، إظهار رسالة سهلة الاستخدام
      }
    });
  }

  // get filteredProducts(): Product[] {
  //   return this.products.filter(product => {
  //     // لتصفية الفئات، ستحتاج إلى مقارنة `product.category` (string)
  //     // مع `this.selectedCategory` (string 'all' أو معرف رقمي للفئة).
  //     // ستحتاج إلى طريقة لربط اسم فئة المنتج (مثل 'ceramics')
  //     // بمعرف الفئة الفعلي (مثل 1) الذي تحصل عليه من API الخاص بك. عادةً ما يتطلب هذا جدول بحث.
  //     const categoryMatches = this.selectedCategory === 'all' ||
  //                             this.findCategoryIdByName(product.category) === this.selectedCategory;

  //     const matchesSearch =
  //       product.name[this.language].toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //       product.description[this.language].toLowerCase().includes(this.searchTerm.toLowerCase());

  //     const matchesPrice = product.price >= this.priceRange[0] && product.price <= this.priceRange[1];
  //     const matchesCustomizable = !this.showCustomizable || product.customizable;


  //     return matchesSearch && categoryMatches && matchesPrice && matchesCustomizable;
  //   });
  // }
  navigateToCategoryServices(categoryId: number): void {
  this.router.navigate(['/category/services', categoryId]);
}


  // دالة مساعدة للعثور على معرف الفئة بالاسم، وهي حاسمة لتصفية المنتجات
  private findCategoryIdByName(categoryName: string): number | undefined {
    // ستحتاج إلى ربط أسماء فئات المنتجات الوهمية (مثل 'ceramics')
    // بمعرفات الفئات الفعلية التي تحصل عليها من API الخاص بك.
    // في الوقت الحالي، سأقدم جدول بحث مبسط.
    const categoryMap: { [key: string]: number } = {
      'ceramics': 1,
      'textiles': 2,
      'woodwork': 3,
      'leather': 4,
      'art': 6,
      'beauty': 7
      // أضف المزيد حسب الحاجة بناءً على فئات المنتجات الوهمية ومعرفات API
    };
    return categoryMap[categoryName];
  }


  getCategoryIcon(categoryId: string | number): string { // السماح بـ string أو number
    // قد تحتاج إلى تعديل هذا لاستخدام المعرف الرقمي من API
    // إذا كانت أيقوناتك مرتبطة بالمعرفات بدلاً من الأسماء النصية.
    const icons: { [key: string]: string } = {
      'ceramics': 'palette', // بافتراض أن فئات منتجاتك لا تزال تستخدم أسماء نصية
      'textiles': 'tshirt',
      'woodwork': 'tree',
      'leather': 'shoe-prints',
      'jewelry': 'gem',
      'art': 'paint-brush',
      'beauty': 'spa',
      'home': 'home',
      'bags': 'shopping-bag',
      'toys': 'gamepad',
      'candles': 'fire',
      'stationery': 'pen'
    };
    // إذا كنت بحاجة إلى ربط معرف رقمي باسم نصي للبحث عن الأيقونة:
    const categoryName = this.allCategories.find(c => c.id === categoryId)?.name.toLowerCase() || String(categoryId);
    return icons[categoryName] || 'tag';
  }

  onSearchTermChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
  }

  onSelectedCategoryChange(category: string | number): void { // السماح بـ string أو number
    this.selectedCategory = category;
  }

  onPriceRangeChange(priceRange: number[]): void {
    this.priceRange = priceRange;
  }

  onShowCustomizableChange(showCustomizable: boolean): void {
    this.showCustomizable = showCustomizable;
  }

  onClearAllFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.priceRange = [0, 200];
    this.showCustomizable = false;
  }

  onAddToCart(product: Product): void {
    console.log('Added to cart:', product);
    // تنفيذ وظيفة سلة التسوق
  }

  onAddToWishlist(product: Product): void {
    console.log('Added to wishlist:', product);
    // تنفيذ وظيفة قائمة الأمنيات
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
  // **** أضف هذه الدالة الجديدة ****
  trackByCategoryId(index: number, category: Category): number {
    return category.id;
  }


   onAiSearch(): void {
    if (!this.aiSearchQuery.trim()) return;
    
    // Call the AI search API
    this.productService.search({
      query: this.aiSearchQuery,
      maxResults: Math.round(Math.random() * 10 + 5) // Randomly set maxResults between 5 and 15
    }).subscribe({
      next: (products) => {
        // Navigate to products page with search results
        this.router.navigate(['/products'], {
          state: { 
            searchResults: products,
            searchQuery: this.aiSearchQuery
          }
        });
      },
      error: (error) => {
        console.error('AI search error:', error);
        // You might want to show an error message to the user
      }
    });
  }
}
