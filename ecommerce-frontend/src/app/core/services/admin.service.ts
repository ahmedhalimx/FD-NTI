import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AdminService {
    private apiUrl = 'http://localhost:5000/api/admin';

    constructor(private http: HttpClient) {}

    getDashboardStats() {
        return this.http.get<any>(`${this.apiUrl}/dashboard`);
    }

    createProduct(product: any) {
        return this.http.post(`${this.apiUrl}/products`, product);
    }

    updateProduct(id: string, product: any) {
        return this.http.put(`${this.apiUrl}/products/${id}`, product);
    }

    deleteProduct(id: string) {
        return this.http.delete(`${this.apiUrl}/products/${id}`);
    }

    getAllOrders() {
        return this.http.get<any>(`${this.apiUrl}/orders`);
    }

    updateOrderStatus(id: string, status: string) {
        return this.http.put(`${this.apiUrl}/orders/${id}/status`, { status });
    }

    getAllUsers() {
        return this.http.get<any>(`${this.apiUrl}/users`);
    }
}
