import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/products', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'products',
        loadComponent: () => import('./features/products/product-list.component').then(m => m.ProductListComponent)
    },
    {
        path: 'products/:id',
        loadComponent: () => import('./features/products/product-detail.component').then(m => m.ProductDetailComponent)
    },
    {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
            canActivate: [authGuard]
    },
    {
        path: 'orders',
        loadComponent: () => import('./features/orders/order-list.component').then(m => m.OrderListComponent),
            canActivate: [authGuard]
    },
    {
        path: 'orders/:id',
        loadComponent: () => import('./features/orders/order-detail.component').then(m => m.OrderDetailComponent),
            canActivate: [authGuard]
    },
    {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
            canActivate: [authGuard]
    },
    {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent)
            },
            {
                path: 'products',
                loadComponent: () => import('./features/admin/admin-products.component').then(m => m.AdminProductsComponent)
            },
            {
                path: 'orders',
                loadComponent: () => import('./features/admin/admin-orders.component').then(m => m.AdminOrdersComponent)
            }
        ]
    },
    { path: '**', redirectTo: '/products' }
];
