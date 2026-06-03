import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  form = {
    email: '',
    password: ''
  };

  errorMsg = '';
  loading = false;

  constructor(private authService: Auth, private router: Router) {}

  onSubmit() {
    if (!this.form.email || !this.form.password) {
      this.errorMsg = 'Please fill in all fields!';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.authService.login(this.form).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token, res.user);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Login failed!';
        this.loading = false;
      }
    });
  }
}