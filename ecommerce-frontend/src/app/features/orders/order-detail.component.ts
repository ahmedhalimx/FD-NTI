import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../core/services/order.service';

@Component({
    selector: 'app-order-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    @if (order()) {
        <div class="order-detail">
        <button routerLink="/orders" class="btn-back">← Back to Orders</button>

        <div class="order-header">
        <div>
        <h1>Order #{{ order()!._id.substring(0, 8) }}</h1>
        <p class="order-date">Placed on {{ order()!.createdAt | date:'medium' }}</p>
        </div>
        <span class="status" [class]="order()!.status">{{ order()!.status }}</span>
        </div>

        <div class="order-content">
        <div class="order-items-section">
        <h2>Order Items</h2>
        @for (item of order()!.items; track $index) {
            <div class="order-item">
            <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p>Quantity: {{ item.quantity }}</p>
            <p class="price">\${{ item.price }} each</p>
            </div>
            <div class="item-total">
            \${{ (item.price * item.quantity).toFixed(2) }}
            </div>
            </div>
        }
        </div>

        <div class="order-summary-section">
        <h2>Order Summary</h2>
        <div class="summary-card">
        <div class="summary-row">
        <span>Subtotal:</span>
        <span>\${{ (order()!.totalPrice - order()!.taxPrice - order()!.shippingPrice).toFixed(2) }}</span>
        </div>
        <div class="summary-row">
        <span>Tax:</span>
        <span>\${{ order()!.taxPrice.toFixed(2) }}</span>
        </div>
        <div class="summary-row">
        <span>Shipping:</span>
        <span>\${{ order()!.shippingPrice.toFixed(2) }}</span>
        </div>
        <div class="summary-row total">
        <span>Total:</span>
        <span>\${{ order()!.totalPrice.toFixed(2) }}</span>
        </div>
        </div>

        <h2>Shipping Address</h2>
        <div class="info-card">
        <p>{{ order()!.shippingAddress.street }}</p>
        <p>{{ order()!.shippingAddress.city }}, {{ order()!.shippingAddress.state }} {{ order()!.shippingAddress.zipCode }}</p>
        <p>{{ order()!.shippingAddress.country }}</p>
        </div>

        <h2>Payment</h2>
        <div class="info-card">
        <p><strong>Method:</strong> {{ order()!.paymentMethod }}</p>
        <p><strong>Status:</strong> 
        <span [class.paid]="order()!.isPaid" [class.unpaid]="!order()!.isPaid">
        {{ order()!.isPaid ? 'Paid' : 'Unpaid' }}
        </span>
        </p>
        @if (order()!.isPaid) {
            <p><strong>Paid at:</strong> {{ order()!.paidAt | date:'medium' }}</p>
        }
        </div>
        </div>
        </div>
        </div>
    } @else {
        <div class="loading">Loading order details...</div>
    }
    `,
    styles: [`
        .order-detail {
            padding: 2rem 0;
        }
        .btn-back {
            background: #95a5a6;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 2rem;
        }
        .order-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 2rem;
        }
        .order-header h1 {
            margin: 0 0 0.5rem 0;
        }
        .order-date {
            color: #666;
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
        .order-content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 2rem;
        }
        .order-items-section h2,
        .order-summary-section h2 {
            margin: 0 0 1rem 0;
        }
        .order-item {
            display: flex;
            justify-content: space-between;
            padding: 1rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 1rem;
        }
        .item-info h3 {
            margin: 0 0 0.5rem 0;
        }
        .item-info p {
            margin: 0.25rem 0;
            color: #666;
        }
        .price {
            color: #27ae60;
            font-weight: bold;
        }
        .item-total {
            font-size: 1.2rem;
            font-weight: bold;
        }
        .summary-card,
        .info-card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.75rem;
        }
        .summary-row.total {
            border-top: 2px solid #ddd;
            padding-top: 0.75rem;
            margin-top: 0.75rem;
            font-size: 1.3rem;
            font-weight: bold;
        }
        .info-card p {
            margin: 0.5rem 0;
        }
        .paid {
            color: #27ae60;
            font-weight: bold;
        }
        .unpaid {
            color: #e74c3c;
            font-weight: bold;
        }
        .loading {
            text-align: center;
            padding: 3rem;
            color: #666;
        }
        @media (max-width: 968px) {
            .order-content {
                grid-template-columns: 1fr;
            }
        }
        `]
})
export class OrderDetailComponent implements OnInit {
    private orderService = inject(OrderService);
    private route = inject(ActivatedRoute);
    order = signal<Order | null>(null);

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id')!;
        this.orderService.getOrderById(id).subscribe({
            next: (res) => this.order.set(res.order),
                error: () => alert('Failed to load order')
        });
    }
}
