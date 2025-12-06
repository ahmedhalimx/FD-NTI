import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
    message?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:5000/api/auth';
    private currentUser = signal<User | null>(null);

    user = this.currentUser.asReadonly();
    isLoggedIn = computed(() => !!this.currentUser());

    constructor(private http: HttpClient, private router: Router) {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            this.currentUser.set(JSON.parse(userStr));
        }
    }

    register(name: string, email: string, password: string) {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { name, email, password })
        .pipe(tap(res => this.handleAuth(res)));
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
        .pipe(tap(res => this.handleAuth(res)));
    }

    private handleAuth(response: AuthResponse) {
        if (response.success) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            this.currentUser.set(response.user);
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    isAdmin(): boolean {
        const user = this.currentUser();
        return user?.role === 'admin';
    }

    getProfile() {
        return this.http.get<{ success: boolean; user: User }>(`${this.apiUrl}/profile`);
    }

    updateProfile(data: any) {
        return this.http.put<AuthResponse>(`${this.apiUrl}/profile`, data);
    }
}
