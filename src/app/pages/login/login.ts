import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router) {}

  onSubmit() {
    if (!this.form.email || !this.form.password) {
      this.errorMsg = 'Please fill in all fields!';
      return;
    }
    // TODO: call backend API
    console.log('Login submitted', this.form);
    this.router.navigate(['/dashboard']);
  }
}