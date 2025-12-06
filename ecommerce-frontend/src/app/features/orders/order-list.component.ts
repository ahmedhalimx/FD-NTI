import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../core/services/order.service';

@Component({
    selector: 'app-order-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="orders-page">
    <h1>My Orders</h1>

    @if (loading()) {
        <div class="loading">Loading orders...</div>
    } @else if (orders().length === 0) {
        <div class="no-orders">
        <p>You haven't placed any orders yet</p>
        <a routerLink="/products" class="btn btn-primary">Start Shopping</a>
        </div>
    } @else {
        <div class="orders-list">
        @for (order of orders(); track order._id) {
            <div class="order-card">
            <div class="order-header">
            <div>
            <h3>Order #{{ order._id.substring(0, 8) }}</h3>
            <p class="order-date">{{ order.createdAt | date }}</p>
            </div>
            <span class="status" [class]="order.status">{{ order.status }}</span>
            </div>
            <div class="order-items">
            <p><strong>Items:</strong> {{ order.items.length }}</p>
            <p><strong>Total:</strong> \${{ order.totalPrice.toFixed(2) }}</p>
            </div>
            <a [routerLink]="['/orders', order._id]" class="btn btn-secondary">View Details</a>
            </div>
        }
        </div>
    }
    </div>
    `,
    styles: [`
        .orders-page {
            padding: 2rem 0;
        }
        .loading,
        .no-orders {
            text-align: center;
            padding: 3rem;
        }
        .no-orders p {
            color: #666;
            margin-bottom: 2rem;
        }
        .orders-list {
            display: grid;
            gap: 1.5rem;
        }
        .order-card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .order-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #eee;
        }
        .order-header h3 {
            margin: 0 0 0.5rem 0;
        }
        .order-date {
            color: #666;
            font-size: 0.9rem;
        }
        .status {
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
            text-transform: capitalize;
        }
        .status.pending {
            background: #fff3cd;
            color: #856404;
        }
        .status.processing {
            background: #cce5ff;
            color: #004085;
        }
        .status.shipped {
            background: #d1ecf1;
            color: #0c5460;
        }
        .status.delivered {
            background: #d4edda;
            color: #155724;
        }
        .status.cancelled {
            background: #f8d7da;
            color: #721c24;
        }
        .order-items {
            display: flex;
            gap: 2rem;
            margin-bottom: 1rem;
        }
        .order-items p {
            margin: 0.5rem 0;
        }
        .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 4px;
            text-decoration: none;
            cursor: pointer;
        }
        .btn-primary {
            background: #3498db;
            color: white;
        }
        .btn-secondary {
            background: #95a5a6;
            color: white;
        }
        `]
})
export class OrderListComponent implements OnInit {
    private orderService = inject(OrderService);
    orders = signal<Order[]>([]);
    loading = signal(true);

    ngOnInit() {
        this.orderService.getMyOrders().subscribe({
            next: (res) => {
                this.orders.set(res.orders);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }
}
