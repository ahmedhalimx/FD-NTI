import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="profile-page">
    <h1>My Profile</h1>

    <div class="profile-card">
    <h2>Personal Information</h2>
    <form (ngSubmit)="updateProfile()">
    <div class="form-group">
    <label>Name</label>
    <input type="text" [(ngModel)]="name" name="name" required>
    </div>
    <div class="form-group">
    <label>Email</label>
    <input type="email" [(ngModel)]="email" name="email" required>
    </div>
    <div class="form-group">
    <label>Phone</label>
    <input type="tel" [(ngModel)]="phone" name="phone">
    </div>

    <h3>Address</h3>
    <div class="form-group">
    <label>Street</label>
    <input type="text" [(ngModel)]="address.street" name="street">
    </div>
    <div class="form-row">
    <div class="form-group">
    <label>City</label>
    <input type="text" [(ngModel)]="address.city" name="city">
    </div>
    <div class="form-group">
    <label>State</label>
    <input type="text" [(ngModel)]="address.state" name="state">
    </div>
    </div>
    <div class="form-row">
    <div class="form-group">
    <label>Zip Code</label>
    <input type="text" [(ngModel)]="address.zipCode" name="zipCode">
    </div>
    <div class="form-group">
    <label>Country</label>
    <input type="text" [(ngModel)]="address.country" name="country">
    </div>
    </div>

    @if (message()) {
        <div class="message" [class.success]="success()" [class.error]="!success()">
        {{ message() }}
        </div>
    }

    <button type="submit" class="btn btn-primary" [disabled]="loading()">
    {{ loading() ? 'Updating...' : 'Update Profile' }}
    </button>
    </form>
    </div>
    </div>
    `,
    styles: [`
        .profile-page {
            padding: 2rem 0;
            max-width: 800px;
            margin: 0 auto;
        }
        .profile-card {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1, h2 {
            margin-bottom: 1.5rem;
        }
        h3 {
            margin: 2rem 0 1rem 0;
            color: #666;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }
        .message {
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 1rem;
        }
        .message.success {
            background: #d4edda;
            color: #155724;
        }
        .message.error {
            background: #f8d7da;
            color: #721c24;
        }
        .btn {
            width: 100%;
            padding: 0.75rem;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
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
        `]
})
export class ProfileComponent implements OnInit {
    private authService = inject(AuthService);

    name = '';
    email = '';
    phone = '';
    address = {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    };

    loading = signal(false);
    message = signal('');
    success = signal(false);

    ngOnInit() {
        this.authService.getProfile().subscribe({
            next: (res) => {
                this.name = res.user.name;
                this.email = res.user.email;
                this.phone = res.user.phone || '';
                this.address = res.user.address || this.address;
            }
        });
    }

    updateProfile() {
        this.loading.set(true);
        this.message.set('');

        this.authService.updateProfile({
            name: this.name,
            email: this.email,
            phone: this.phone,
            address: this.address
        }).subscribe({
            next: () => {
                this.loading.set(false);
                this.message.set('Profile updated successfully!');
                this.success.set(true);
                setTimeout(() => this.message.set(''), 3000);
            },
            error: (err) => {
                this.loading.set(false);
                this.message.set(err.error.message || 'Failed to update profile');
                this.success.set(false);
            }
        });
    }
}
