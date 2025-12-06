import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

interface CartItem {
    product: any;
    quantity: number;
    price: number;
}

interface Cart {
    items: CartItem[];
    totalPrice: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
    private apiUrl = 'http://localhost:5000/api/cart';
    private cart = signal<Cart>({ items: [], totalPrice: 0 });

    cartItems = computed(() => this.cart().items);
    totalPrice = computed(() => this.cart().totalPrice);
    itemCount = computed(() => this.cart().items.reduce((sum, item) => sum + item.quantity, 0));

    constructor(private http: HttpClient) {}

    getCart() {
        return this.http.get<{ success: boolean; cart: Cart }>(this.apiUrl)
        .pipe(tap(res => this.cart.set(res.cart)));
    }

    addToCart(productId: string, quantity: number = 1) {
        return this.http.post<{ success: boolean; cart: Cart }>(`${this.apiUrl}/add`, { productId, quantity })
        .pipe(tap(res => this.cart.set(res.cart)));
    }

    updateCartItem(productId: string, quantity: number) {
        return this.http.put<{ success: boolean; cart: Cart }>(`${this.apiUrl}/update`, { productId, quantity })
        .pipe(tap(res => this.cart.set(res.cart)));
    }

    removeFromCart(productId: string) {
        return this.http.delete<{ success: boolean; cart: Cart }>(`${this.apiUrl}/remove/${productId}`)
        .pipe(tap(res => this.cart.set(res.cart)));
    }

    clearCart() {
        return this.http.delete(`${this.apiUrl}/clear`)
        .pipe(tap(() => this.cart.set({ items: [], totalPrice: 0 })));
    }
}
