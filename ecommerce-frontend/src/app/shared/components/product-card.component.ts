import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/services/product.service';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [RouterLink, CommonModule],
    template: `
    <div class="card">
    <div class="card-image">
    @if (product.images && product.images.length > 0) {
        <img [src]="product.images[0]" [alt]="product.name">
    } @else {
        <div class="no-image">No Image</div>
    }
    </div>
    <div class="card-content">
    <h3>{{ product.name }}</h3>
    <p class="description">{{ product.description.substring(0, 100) }}...</p>
    <div class="card-footer">
    <span class="price">\${{ product.price }}</span>
    <span class="stock">Stock: {{ product.stock }}</span>
    </div>
    <div class="card-actions">
    <a [routerLink]="['/products', product._id]" class="btn btn-secondary">View Details</a>
    <button (click)="addToCart()" class="btn btn-primary" [disabled]="product.stock === 0">
    {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
    </button>
    </div>
    </div>
    </div>
    `,
    styles: [`
        .card {
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .card-image {
            height: 200px;
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .no-image {
            color: #999;
        }
        .card-content {
            padding: 1rem;
        }
        h3 {
            margin: 0 0 0.5rem 0;
            font-size: 1.1rem;
        }
        .description {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        .price {
            font-size: 1.5rem;
            font-weight: bold;
            color: #27ae60;
        }
        .stock {
            color: #666;
            font-size: 0.9rem;
        }
        .card-actions {
            display: flex;
            gap: 0.5rem;
        }
        .btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            text-align: center;
            flex: 1;
            transition: background 0.3s;
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
        .btn-secondary {
            background: #95a5a6;
            color: white;
        }
        .btn-secondary:hover {
            background: #7f8c8d;
        }
        `]
})
export class ProductCardComponent {
    @Input({ required: true }) product!: Product;
    private cartService = inject(CartService);

    addToCart() {
        this.cartService.addToCart(this.product._id).subscribe({
            next: () => alert('Product added to cart!'),
                error: (err) => alert('Failed to load product')
        });
    }

    addToCart() {
        this.cartService.addToCart(this.product()!._id, this.quantity).subscribe({
            next: () => alert('Product added to cart!'),
                error: (err) => alert('Failed to add to cart')
        });
    }

    submitReview() {
        this.productService.addReview(this.product()!._id, this.rating, this.comment).subscribe({
            next: () => {
                alert('Review submitted!');
                this.comment = '';
                this.rating = 5;
                // Reload product to show new review
                const id = this.route.snapshot.paramMap.get('id')!;
                this.productService.getProductById(id).subscribe({
                    next: (res) => this.product.set(res.product)
                });
            },
            error: (err) => alert('Failed to submit review')
        });
    }
}
