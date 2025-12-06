import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, CommonModule],
    template: `
    <nav class="navbar">
    <div class="nav-container">
    <a routerLink="/" class="logo">🛒 E-Shop</a>

    <div class="nav-links">
    <a routerLink="/products" routerLinkActive="active">Products</a>

    @if (authService.isLoggedIn()) {
        <a routerLink="/cart" routerLinkActive="active">
        Cart 
        @if (cartService.itemCount() > 0) {
            <span class="badge">{{ cartService.itemCount() }}</span>
        }
        </a>
        <a routerLink="/orders" routerLinkActive="active">Orders</a>
        <a routerLink="/profile" routerLinkActive="active">Profile</a>

        @if (authService.isAdmin()) {
            <a routerLink="/admin" routerLinkActive="active">Admin</a>
        }

        <button (click)="logout()" class="btn-logout">Logout</button>
    } @else {
        <a routerLink="/login" routerLinkActive="active">Login</a>
        <a routerLink="/register" routerLinkActive="active">Register</a>
    }
    </div>
    </div>
    </nav>
    `,
    styles: [`
        .navbar {
            background: #2c3e50;
            color: white;
            padding: 1rem 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
        }
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: white;
            text-decoration: none;
        }
        .nav-links {
            display: flex;
            gap: 1.5rem;
            align-items: center;
        }
        .nav-links a {
            color: white;
            text-decoration: none;
            position: relative;
            transition: color 0.3s;
        }
        .nav-links a:hover,
        .nav-links a.active {
            color: #3498db;
        }
        .badge {
            background: #e74c3c;
            color: white;
            border-radius: 50%;
            padding: 2px 6px;
            font-size: 0.7rem;
            margin-left: 4px;
        }
        .btn-logout {
            background: #e74c3c;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .btn-logout:hover {
            background: #c0392b;
        }
        `]
})
export class NavbarComponent {
    authService = inject(AuthService);
    cartService = inject(CartService);

    constructor() {
        if (this.authService.isAuthenticated()) {
            this.cartService.getCart().subscribe();
        }
    }

    logout() {
        this.authService.logout();
    }
}
