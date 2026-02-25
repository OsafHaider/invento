export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
  sku_code: string;
  createdBy?: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
products: Product[]
pagination: { total: number; page: number; limit: number; pages: number };
}



export interface CreateProductInput {

  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  sku_code: string;
}



