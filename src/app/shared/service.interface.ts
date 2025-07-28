// src/app/shared/interfaces/service.interface.ts

// **هذه الواجهة تمثل البيانات التي تأتي من الـ API الخاص بـ C# DTO**
export interface ServiceDto {
  id: number;
  title: string;
  description: string;
  basePrice: number;
  deliveryTime: number;
  status: string;
  sellerName: string;
  categoryName: string;
  avgRating: number;
  sellerId: string;
  categoryId: number;
  imageUrl: string | null;
  products: ProductDisplayDto[]; // <-- هنا استخدمنا الواجهة الجديدة ProductDisplayDto
}

// **هذه الواجهة تمثل بيانات المنتج كما تأتي من الـ C# DTO**
// **تم تعديلها لتطابق ProductDisplayDTO تمامًا**
export interface ProductDisplayDto {
  id: number;
  title: string;       // كانت name في ProductDto القديمة
  description: string;
  price: number;
  quantity: number;    // خاصية جديدة من C#
  status: string;      // خاصية جديدة من C#
  createdAt: string;   // خاصية جديدة من C#
  sellerId: string;
  serviceId: number;
  imageUrl: string | null;
  // لو الـ C# ProductDisplayDTO فيه avgRating أو sellerName أو categoryName، ضيفهم هنا
  // avgRating?: number;
  // sellerName?: string;
  // categoryName?: string;
}


// **هذه الواجهة تمثل البيانات التي يستخدمها الـ Frontend ServiceCardComponent (أو أي مكان يعرض الخدمات بشكل مبسط)**
export interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string | null;
  category: string;
  seller: string;
  isCustomizable: boolean;
  deliveryTime: string;
}

// **هذه الواجهة تمثل بيانات تفاصيل الخدمة التي يستخدمها ServiceDetailPage**
export interface ServiceDetail extends Service {
  fullDescription: { en: string; ar: string; };
  features: { en: string[]; ar: string[]; };
  packages: ServicePackage[];
  gallery: string[];
  faq: FAQ[];
  requirements: { en: string[]; ar: string[]; };
  sellerInfo: SellerInfo;
  products: Product[]; // المنتجات الخاصة بالبائع - تمثل ما يعرضه الـ ProductCardComponent
}

// **الواجهات الفرعية (Sub-interfaces) كما هي عندك**
export interface ServicePackage {
  id: number;
  name: { en: string; ar: string; };
  description: { en: string; ar: string; };
  price: number;
  deliveryTime: string;
  revisions: number;
  features: { en: string[]; ar: string[]; };
  isPopular?: boolean;
}

export interface FAQ {
  id: number;
  question: { en: string; ar: string; };
  answer: { en: string; ar: string; };
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
  description: { en: string; ar: string; };
  skills: string[];
  languages: string[];
  isOnline: boolean;
  isVerified: boolean;
  joinDate: string;
  location: string;
}

// واجهة المنتج التي يستخدمها ProductCardComponent
export interface Product {
  id: number;
  name: { en: string; ar: string; };
  description: { en: string; ar: string; };
  price: number;
  category: string; // ممكن تكون فاضية لو الـ DTO مش بيرجعها
  image: string; // لاحظ أنها image هنا وليست imageUrl
  seller: string; // ممكن تكون فاضية لو الـ DTO مش بيرجعها
  rating: number; // ممكن تكون 0 لو الـ DTO مش بيرجعها
  customizable: boolean;
}

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