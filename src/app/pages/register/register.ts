import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  form = {
    orgName: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  errorMsg = '';
  loading = false;

  constructor(private authService: Auth, private router: Router) {}

  onSubmit() {
    if (this.form.password !== this.form.confirmPassword) {
      this.errorMsg = 'Passwords do not match!';
      return;
    }
    if (this.form.password.length < 8) {
      this.errorMsg = 'Password must be at least 8 characters!';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    const { confirmPassword, ...registerData } = this.form;

    this.authService.register(registerData).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token, res.user);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Registration failed!';
        this.loading = false;
      }
    });
  }
}