import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="cart-page">
    <h1>Shopping Cart</h1>

    @if (cartService.cartItems().length === 0) {
        <div class="empty-cart">
        <p>Your cart is empty</p>
        <a routerLink="/products" class="btn btn-primary">Continue Shopping</a>
        </div>
    } @else {
        <div class="cart-content">
        <div class="cart-items">
        @for (item of cartService.cartItems(); track item.product._id) {
            <div class="cart-item">
            <div class="item-image">
            @if (item.product.images && item.product.images.length > 0) {
                <img [src]="item.product.images[0]" [alt]="item.product.name">
            }
            </div>
            <div class="item-info">
            <h3>{{ item.product.name }}</h3>
            <p class="price">\${{ item.price }}</p>
            </div>
            <div class="item-quantity">
            <label>Quantity:</label>
            <input 
            type="number" 
            [value]="item.quantity" 
            (change)="updateQuantity(item.product._id, $event)"
            min="1" 
            [max]="item.product.stock"
            >
            </div>
            <div class="item-total">
            <p>\${{ (item.price * item.quantity).toFixed(2) }}</p>
            </div>
            <button (click)="removeItem(item.product._id)" class="btn-remove">Remove</button>
            </div>
        }
        </div>

        <div class="cart-summary">
        <h3>Order Summary</h3>
        <div class="summary-row">
        <span>Subtotal:</span>
        <span>\${{ cartService.totalPrice().toFixed(2) }}</span>
        </div>
        <div class="summary-row">
        <span>Tax (10%):</span>
        <span>\${{ (cartService.totalPrice() * 0.1).toFixed(2) }}</span>
        </div>
        <div class="summary-row">
        <span>Shipping:</span>
        <span>\${{ cartService.totalPrice() > 100 ? 0 : 10 }}</span>
        </div>
        <div class="summary-row total">
        <span>Total:</span>
        <span>\${{ getTotal() }}</span>
        </div>

        @if (!showCheckout()) {
            <button (click)="proceedToCheckout()" class="btn btn-primary">Proceed to Checkout</button>
        } @else {
            <div class="checkout-form">
            <h4>Shipping Address</h4>
            <input type="text" [(ngModel)]="shippingAddress.street" placeholder="Street" required>
            <input type="text" [(ngModel)]="shippingAddress.city" placeholder="City" required>
            <input type="text" [(ngModel)]="shippingAddress.state" placeholder="State" required>
            <input type="text" [(ngModel)]="shippingAddress.zipCode" placeholder="Zip Code" required>
            <input type="text" [(ngModel)]="shippingAddress.country" placeholder="Country" required>

            <h4>Payment Method</h4>
            <select [(ngModel)]="paymentMethod">
            <option value="card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="cod">Cash on Delivery</option>
            </select>

            <button (click)="placeOrder()" class="btn btn-primary" [disabled]="placing()">
            {{ placing() ? 'Placing Order...' : 'Place Order' }}
            </button>
            </div>
        }
        </div>
        </div>
    }
    </div>
    `,
    styles: [`
        .cart-page {
            padding: 2rem 0;
        }
        .empty-cart {
            text-align: center;
            padding: 3rem;
        }
        .empty-cart p {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 2rem;
        }
        .cart-content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 2rem;
        }
        .cart-items {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .cart-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .item-image {
            width: 100px;
            height: 100px;
            background: #f5f5f5;
            border-radius: 4px;
            overflow: hidden;
        }
        .item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .item-info {
            flex: 1;
        }
        .item-info h3 {
            margin: 0 0 0.5rem 0;
        }
        .price {
            color: #27ae60;
            font-weight: bold;
        }
        .item-quantity {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        .item-quantity input {
            width: 70px;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .item-total {
            font-size: 1.2rem;
            font-weight: bold;
            min-width: 100px;
            text-align: right;
        }
        .btn-remove {
            background: #e74c3c;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
        }
        .btn-remove:hover {
            background: #c0392b;
        }
        .cart-summary {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            height: fit-content;
        }
        .cart-summary h3 {
            margin: 0 0 1.5rem 0;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
        }
        .summary-row.total {
            border-top: 2px solid #ddd;
            padding-top: 1rem;
            font-size: 1.3rem;
            font-weight: bold;
        }
        .checkout-form {
            margin-top: 1.5rem;
        }
        .checkout-form h4 {
            margin: 1rem 0 0.5rem 0;
        }
        .checkout-form input,
        .checkout-form select {
            width: 100%;
            padding: 0.75rem;
            margin-bottom: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .btn {
            width: 100%;
            padding: 1rem;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 1rem;
        }
        .btn-primary {
            background: #3498db;
            color: white;
        }
        .btn-primary:hover:not(:disabled) {
            background: #2980b9;
        }
        .btn-primary:disabled {
            background: #95a5a6;
            cursor: not-allowed;
        }
        @media (max-width: 968px) {
            .cart-content {
                grid-template-columns: 1fr;
            }
        }
        `]
})
export class CartComponent implements OnInit {
    cartService = inject(CartService);
    private orderService = inject(OrderService);
    private router = inject(Router);

    showCheckout = signal(false);
    placing = signal(false);

    shippingAddress = {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    };
    paymentMethod = 'card';

    ngOnInit() {
        this.cartService.getCart().subscribe();
    }

    updateQuantity(productId: string, event: Event) {
        const input = event.target as HTMLInputElement;
        const quantity = parseInt(input.value);
        if (quantity > 0) {
            this.cartService.updateCartItem(productId, quantity).subscribe();
        }
    }

    removeItem(productId: string) {
        if (confirm('Remove this item from cart?')) {
            this.cartService.removeFromCart(productId).subscribe();
        }
    }

    getTotal(): string {
        const subtotal = this.cartService.totalPrice();
        const tax = subtotal * 0.1;
        const shipping = subtotal > 100 ? 0 : 10;
        return (subtotal + tax + shipping).toFixed(2);
    }

    proceedToCheckout() {
        this.showCheckout.set(true);
    }

    placeOrder() {
        if (!this.shippingAddress.street || !this.shippingAddress.city) {
            alert('Please fill in all shipping address fields');
            return;
        }

        this.placing.set(true);
        this.orderService.createOrder(this.shippingAddress, this.paymentMethod).subscribe({
            next: (res) => {
                this.placing.set(false);
                alert('Order placed successfully!');
                this.router.navigate(['/orders', res.order._id]);
            },
            error: (err) => {
                this.placing.set(false);
                alert('Failed to place order: ' + err.error.message);
            }
        });
    }
}
