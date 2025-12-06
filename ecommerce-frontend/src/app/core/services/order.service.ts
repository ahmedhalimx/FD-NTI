import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Order {
    _id: string;
    items: any[];
    totalPrice: number;
    status: string;
    createdAt: string;
    shippingAddress: any;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
    private apiUrl = 'http://localhost:5000/api/orders';
    orders = signal<Order[]>([]);

    constructor(private http: HttpClient) {}

    createOrder(shippingAddress: any, paymentMethod: string) {
        return this.http.post<{ success: boolean; order: Order }>(`${this.apiUrl}/create`, {
            shippingAddress,
            paymentMethod
        });
    }

    getMyOrders() {
        return this.http.get<{ success: boolean; orders: Order[] }>(`${this.apiUrl}/my-orders`);
    }

    getOrderById(id: string) {
        return this.http.get<{ success: boolean; order: Order }>(`${this.apiUrl}/${id}`);
    }

    processPayment(orderId: string, token: string) {
        return this.http.post(`${this.apiUrl}/payment`, { orderId, token });
    }
}
