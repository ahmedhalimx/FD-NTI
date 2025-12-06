import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    images: string[];
    rating: number;
    numReviews: number;
    reviews: any[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
    private apiUrl = 'http://localhost:5000/api/products';
    products = signal<Product[]>([]);
    loading = signal(false);

    constructor(private http: HttpClient) {}

    getProducts(params?: any) {
        this.loading.set(true);
        return this.http.get<{ success: boolean; products: Product[] }>(this.apiUrl, { params })
        .pipe(tap(res => {
            this.products.set(res.products);
            this.loading.set(false);
        }));
    }

    getProductById(id: string) {
        return this.http.get<{ success: boolean; product: Product }>(`${this.apiUrl}/${id}`);
    }

    addReview(id: string, rating: number, comment: string) {
        return this.http.post(`${this.apiUrl}/${id}/reviews`, { rating, comment });
    }
}
