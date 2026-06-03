import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router) {}

  onSubmit() {
    if (this.form.password !== this.form.confirmPassword) {
      this.errorMsg = 'Passwords do not match!';
      return;
    }
    if (this.form.password.length < 8) {
      this.errorMsg = 'Password must be at least 8 characters!';
      return;
    }
    // TODO: call backend API
    console.log('Register form submitted', this.form);
    this.router.navigate(['/dashboard']);
  }
}