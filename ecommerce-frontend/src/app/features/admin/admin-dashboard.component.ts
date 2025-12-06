import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>

    @if (stats()) {
        <div class="stats-grid">
        <div class="stat-card">
        <h3>Total Users</h3>
        <p class="stat-value">{{ stats()!.totalUsers }}</p>
        </div>
        <div class="stat-card">
        <h3>Total Products</h3>
        <p class="stat-value">{{ stats()!.totalProducts }}</p>
        </div>
        <div class="stat-card">
        <h3>Total Orders</h3>
        <p class="stat-value">{{ stats()!.totalOrders }}</p>
        </div>
        <div class="stat-card">
        <h3>Total Revenue</h3>
        <p class="stat-value">\${{ stats()!.totalRevenue.toFixed(2) }}</p>
        </div>
        </div>

        <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
        <a routerLink="/admin/products" class="action-btn">
        <span class="icon">📦</span>
        <span>Manage Products</span>
        </a>
        <a routerLink="/admin/orders" class="action-btn">
        <span class="icon">📋</span>
        <span>Manage Orders</span>
        </a>
        </div>
        </div>

        @if (stats()!.recentOrders && stats()!.recentOrders.length > 0) {
            <div class="recent-orders">
            <h2>Recent Orders</h2>
            <div class="orders-table">
            @for (order of stats()!.recentOrders; track order._id) {
                <div class="order-row">
                <span class="order-id">#{{ order._id.substring(0, 8) }}</span>
                <span class="order-customer">{{ order.user?.name || 'N/A' }}</span>
                <span class="order-total">\${{ order.totalPrice.toFixed(2) }}</span>
                <span class="order-status" [class]="order.status">{{ order.status }}</span>
                </div>
            }
            </div>
            </div>
        }
    } @else {
        <div class="loading">Loading dashboard...</div>
    }
    </div>
    `,
    styles: [`
        .admin-orders {
            padding: 2rem 0;
        }
        h1 {
            margin-bottom: 2rem;
        }
        .no-orders {
            text-align: center;
            padding: 3rem;
            color: #666;
        }
        .orders-table {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .order-row {
            display: grid;
            grid-template-columns: 2fr 1fr auto;
            align-items: center;
            gap: 2rem;
            padding: 1.5rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .order-info h3 {
            margin: 0 0 0.5rem 0;
        }
        .order-info p {
            margin: 0.25rem 0;
            color: #666;
        }
        .date {
            font-size: 0.9rem;
        }
        .order-details p {
            margin: 0.25rem 0;
        }
        .order-status select {
            padding: 0.5rem 1rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
        }
        `]
})
export class AdminOrdersComponent implements OnInit {
    private adminService = inject(AdminService);
    orders = signal<any[]>([]);

    ngOnInit() {
        this.loadOrders();
    }

    loadOrders() {
        this.adminService.getAllOrders().subscribe({
            next: (res) => this.orders.set(res.orders),
                error: () => alert('Failed to load orders')
        });
    }

    updateStatus(orderId: string, status: string) {
        this.adminService.updateOrderStatus(orderId, status).subscribe({
            next: () => alert('Order status updated!'),
                error: () => alert('Failed to update order status')
        });
    }
}
