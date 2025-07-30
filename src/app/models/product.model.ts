// product.model.ts
export interface ProductDisplayDTO {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  status: string;
  createdAt: string;
  sellerId: string;
  sellerName: string;
  serviceId: number;
  imageUrl?: string;
}

export interface Product {
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
  category: string;
  image: string;
  seller: string;
  sellerId?: string;
  rating: number;
  customizable: boolean;
  stock?: number;
  status?: string;
  createdAt?: string;
  serviceId?: number;
}

export interface CartItem {
  product: ProductDisplayDTO;
  quantity: number;
}

export interface ProductRequest {
  title: string;
  description: string;
  price: number;
  quantity: number;
  serviceId: number;
}
