import { CommonModule } from '@angular/common';
import { TableAction, TableColumn, DataTable } from './../../components/data-table/data-table';
import { Modal } from './../../components/modal/modal';
import { LanguageService } from './../../services/language.service';
import { ThemeService } from './../../services/theme.service';
import { Component } from "@angular/core";
 
interface Product {
  id: number;
  name: string;
  description: string;
  artisan: {
    name: string;
    email: string;
    avatar: string;
  };
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: "active" | "inactive" | "out_of_stock";
  rating: number;
  reviewCount: number;
  favoriteCount: number;
  soldCount: number;
  createdDate: string;
  lastUpdated: string;
  images: string[];
  tags: string[];
  specifications: { [key: string]: string };
  isCustomizable: boolean;
  processingTime: string;
}

@Component({
  selector: "app-products-management",
  templateUrl: "./products-management.html",
  standalone: true,
  imports: [DataTable, Modal,CommonModule],
})
export class ProductsManagement {
  showDetailsModal = false;
  selectedProduct: Product | null = null;
  currentCategoryFilter = "all";
  Object = Object;

  categoryFilters = [
    { label: "All", value: "all", icon: "fas fa-tag" },
    { label: "Ceramics", value: "Ceramics", icon: "fas fa-box" },
    { label: "Textiles", value: "Textiles", icon: "fas fa-box" },
    { label: "Woodwork", value: "Woodwork", icon: "fas fa-box" },
    { label: "Jewelry", value: "Jewelry", icon: "fas fa-box" },
    { label: "Leather", value: "Leather", icon: "fas fa-box" },
  ];

  products: Product[] = [
    {
      id: 1,
      name: "Handwoven Ceramic Vase",
      description: "Beautiful handcrafted ceramic vase with intricate patterns and glazed finish. Perfect for home decoration or as a gift.",
      artisan: {
        name: "Emma Thompson",
        email: "emma@ceramicstudio.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "Ceramics",
      price: 89.99,
      originalPrice: 120.0,
      stock: 15,
      status: "active",
      rating: 4.8,
      reviewCount: 24,
      favoriteCount: 67,
      soldCount: 89,
      createdDate: "2023-12-15",
      lastUpdated: "2024-01-18",
      images: [
        "/placeholder.svg?height=300&width=300",
        "/placeholder.svg?height=300&width=300",
        "/placeholder.svg?height=300&width=300",
      ],
      tags: ["ceramic", "vase", "handmade", "decorative", "glazed"],
      specifications: {
        Material: "Ceramic",
        Height: "25 cm",
        Diameter: "15 cm",
        Weight: "800g",
        Color: "Blue & White",
      },
      isCustomizable: true,
      processingTime: "3-5 business days",
    },
    {
      id: 2,
      name: "Knitted Wool Scarf",
      description: "Soft and warm hand-knitted wool scarf in multiple colors. Made from premium merino wool.",
      artisan: {
        name: "Sarah Mitchell",
        email: "sarah@weavingstudio.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "Textiles",
      price: 45.5,
      stock: 8,
      status: "active",
      rating: 4.9,
      reviewCount: 31,
      favoriteCount: 45,
      soldCount: 156,
      createdDate: "2023-11-20",
      lastUpdated: "2024-01-15",
      images: ["/placeholder.svg?height=300&width=300", "/placeholder.svg?height=300&width=300"],
      tags: ["wool", "scarf", "knitted", "winter", "warm"],
      specifications: {
        Material: "100% Merino Wool",
        Length: "180 cm",
        Width: "25 cm",
        Care: "Hand wash only",
      },
      isCustomizable: true,
      processingTime: "1-2 weeks",
    },
    {
      id: 3,
      name: "Wooden Jewelry Box",
      description: "Handcrafted wooden jewelry box with velvet interior and multiple compartments for organization.",
      artisan: {
        name: "David Wilson",
        email: "david@woodcraft.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "Woodwork",
      price: 125.0,
      stock: 0,
      status: "out_of_stock",
      rating: 4.7,
      reviewCount: 18,
      favoriteCount: 89,
      soldCount: 34,
      createdDate: "2023-10-10",
      lastUpdated: "2024-01-10",
      images: [
        "/placeholder.svg?height=300&width=300",
        "/placeholder.svg?height=300&width=300",
        "/placeholder.svg?height=300&width=300",
        "/placeholder.svg?height=300&width=300",
      ],
      tags: ["wood", "jewelry", "box", "storage", "handcrafted"],
      specifications: {
        Material: "Oak Wood",
        Dimensions: "20x15x8 cm",
        Interior: "Velvet lined",
        Compartments: "6 sections",
      },
      isCustomizable: false,
      processingTime: "2-3 weeks",
    },
    {
      id: 4,
      name: "Silver Wire Earrings",
      description: "Elegant handmade silver wire earrings with natural gemstone accents. Lightweight and comfortable.",
      artisan: {
        name: "Lisa Anderson",
        email: "lisa@jewelrydesign.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "Jewelry",
      price: 65.0,
      stock: 12,
      status: "active",
      rating: 4.6,
      reviewCount: 42,
      favoriteCount: 78,
      soldCount: 123,
      createdDate: "2023-12-01",
      lastUpdated: "2024-01-12",
      images: ["/placeholder.svg?height=300&width=300", "/placeholder.svg?height=300&width=300"],
      tags: ["silver", "earrings", "gemstone", "elegant", "handmade"],
      specifications: {
        Material: "Sterling Silver",
        Gemstone: "Amethyst",
        Length: "4 cm",
        Weight: "3g each",
      },
      isCustomizable: true,
      processingTime: "1 week",
    },
    {
      id: 5,
      name: "Leather Messenger Bag",
      description: "Premium handcrafted leather messenger bag with adjustable strap and multiple pockets.",
      artisan: {
        name: "Michael Brown",
        email: "michael@leatherworks.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "Leather",
      price: 189.99,
      stock: 6,
      status: "active",
      rating: 4.9,
      reviewCount: 15,
      favoriteCount: 34,
      soldCount: 28,
      createdDate: "2023-11-15",
      lastUpdated: "2024-01-08",
      images: [
        "/placeholder.svg?height=300&width=300",
        "/placeholder.svg?height=300&width=300",
        "/placeholder.svg?height=300&width=300",
      ],
      tags: ["leather", "bag", "messenger", "premium", "handcrafted"],
      specifications: {
        Material: "Full Grain Leather",
        Dimensions: "38x28x10 cm",
        Strap: "Adjustable 70-130 cm",
        Pockets: "3 exterior, 2 interior",
      },
      isCustomizable: true,
      processingTime: "2-4 weeks",
    },
    {
      id: 6,
      name: "Macrame Wall Hanging",
      description: "Boho-style macrame wall decoration for modern homes. Made with natural cotton cord.",
      artisan: {
        name: "Anna Garcia",
        email: "anna@bohovibes.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "Textiles",
      price: 35.75,
      stock: 20,
      status: "active",
      rating: 4.5,
      reviewCount: 28,
      favoriteCount: 56,
      soldCount: 78,
      createdDate: "2023-12-20",
      lastUpdated: "2024-01-16",
      images: ["/placeholder.svg?height=300&width=300"],
      tags: ["macrame", "wall", "hanging", "boho", "cotton"],
      specifications: {
        Material: "100% Cotton Cord",
        Dimensions: "60x40 cm",
        Style: "Bohemian",
        Mounting: "Wooden dowel included",
      },
      isCustomizable: false,
      processingTime: "3-7 days",
    },
  ];

  columns: TableColumn[] = [
    { key: "images.0", label: "Image", type: "image", width: "80px" },
    { key: "name", label: "Product Name", sortable: true, type: "text" },
    { key: "artisan.name", label: "Artisan", sortable: true, type: "text" },
    { key: "category", label: "Category", sortable: true, type: "badge" },
    { key: "price", label: "Price", sortable: true, type: "currency" },
    { key: "stock", label: "Stock", sortable: true, type: "text" },
    { key: "rating", label: "Rating", sortable: true, type: "text" },
    { key: "soldCount", label: "Sold", sortable: true, type: "text" },
    { key: "status", label: "Status", sortable: true, type: "badge" },
  ];

  actions: TableAction[] = [{ label: "View Details", icon: "fas fa-eye", color: "primary", action: "view" }];

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService,
  ) {}

  get filteredProducts(): Product[] {
    if (this.currentCategoryFilter === "all") {
      return this.products;
    }
    return this.products.filter((product) => product.category === this.currentCategoryFilter);
  }

  setCategoryFilter(category: string): void {
    this.currentCategoryFilter = category;
  }

  getFilterButtonClass(category: string): string {
    const baseClass = "px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2";
    if (this.currentCategoryFilter === category) {
      return `${baseClass} bg-blue-600 text-white`;
    }
    return `${baseClass} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600`;
  }

  getCategoryCount(category: string): number {
    if (category === "all") {
      return this.products.length;
    }
    return this.products.filter((product) => product.category === category).length;
  }

  getActiveProductsCount(): number {
    return this.products.filter((product) => product.status === "active").length;
  }

  getTotalSales(): string {
    const total = this.products.reduce((sum, product) => sum + product.price * product.soldCount, 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(total);
  }

  getAverageRating(): string {
    const totalRating = this.products.reduce((sum, product) => sum + product.rating, 0);
    const average = totalRating / this.products.length;
    return average.toFixed(1);
  }

  onAction(event: { action: string; item: Product }): void {
    const { action, item } = event;

    if (action === "view") {
      this.viewProduct(item);
    }
  }

  viewProduct(product: Product): void {
    this.selectedProduct = product;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedProduct = null;
  }

  getSpecifications(specs: { [key: string]: string }): { key: string; value: string }[] {
    return Object.entries(specs).map(([key, value]) => ({ key, value }));
  }

  onExport(): void {
    console.log("Export products data");
  }
}