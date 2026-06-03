import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  activeTab = 'book';

  cylinders = [
    { id: 1, icon: '🟠', name: 'LPG Cylinder', description: 'Commercial LPG for restaurants & hotels', price: 950 },
    { id: 2, icon: '🔵', name: 'Oxygen Cylinder', description: 'Medical & industrial oxygen supply', price: 1200 },
    { id: 3, icon: '⚙️', name: 'Industrial Gas', description: 'Nitrogen, Argon, CO2 for manufacturing', price: 1500 }
  ];

  selectedCylinder: any = null;

  booking = {
    quantity: 1,
    date: '',
    address: ''
  };

  orders: any[] = [
    { icon: '🟠', cylinderName: 'LPG Cylinder', quantity: 5, date: '2024-06-10', address: 'Plot 12, HITEC City, Hyderabad', status: 'delivered', amount: 4750 },
    { icon: '🔵', cylinderName: 'Oxygen Cylinder', quantity: 2, date: '2024-06-15', address: 'Plot 12, HITEC City, Hyderabad', status: 'pending', amount: 2400 }
  ];

  constructor(private router: Router) {}

  selectCylinder(cylinder: any) {
    this.selectedCylinder = cylinder;
    this.booking = { quantity: 1, date: '', address: '' };
  }

  placeOrder() {
    if (!this.booking.date || !this.booking.address) {
      alert('Please fill in delivery date and address!');
      return;
    }
    const newOrder = {
      icon: this.selectedCylinder.icon,
      cylinderName: this.selectedCylinder.name,
      quantity: this.booking.quantity,
      date: this.booking.date,
      address: this.booking.address,
      status: 'pending',
      amount: this.selectedCylinder.price * this.booking.quantity
    };
    this.orders.unshift(newOrder);
    this.selectedCylinder = null;
    this.activeTab = 'orders';
    alert('✅ Order placed successfully!');
  }

  logout() {
    this.router.navigate(['/']);
  }
}