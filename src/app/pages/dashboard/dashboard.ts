import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { BookingService } from '../../services/booking';
import { PaymentService } from '../../services/payment';

declare var Razorpay: any;

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  activeTab = 'book';
  user: any;
  orders: any[] = [];
  loading = false;
  showToast = false;
  toastMessage = '';

  cylinders = [
    { id: 1, icon: '🟠', name: 'LPG Cylinder', type: 'lpg', description: 'Commercial LPG for restaurants & hotels', price: 950 },
    { id: 2, icon: '🔵', name: 'Oxygen Cylinder', type: 'oxygen', description: 'Medical & industrial oxygen supply', price: 1200 },
    { id: 3, icon: '⚙️', name: 'Industrial Gas', type: 'industrial', description: 'Nitrogen, Argon, CO2 for manufacturing', price: 1500 }
  ];

  selectedCylinder: any = null;

  booking = {
    quantity: 1,
    date: '',
    address: ''
  };

  constructor(
    private router: Router,
    private authService: Auth,
    private bookingService: BookingService,
    private paymentService: PaymentService
  ) {
    this.user = this.authService.getUser();
    this.loadOrders();
  }

  selectCylinder(cylinder: any) {
    this.selectedCylinder = cylinder;
    this.booking = { quantity: 1, date: '', address: '' };
  }

  placeOrder() {
    if (!this.booking.date || !this.booking.address) {
      alert('Please fill in delivery date and address!');
      return;
    }

    this.loading = true;

    const orderData = {
      cylinderType: this.selectedCylinder.type,
      cylinderName: this.selectedCylinder.name,
      quantity: this.booking.quantity,
      pricePerUnit: this.selectedCylinder.price,
      deliveryDate: this.booking.date,
      address: this.booking.address
    };

    // Step 1 — Create booking first
    this.bookingService.createBooking(orderData).subscribe({
      next: (res) => {
        console.log('Booking response:', res);  
        console.log('Booking ID:', res.booking._id);
        const bookingId = res.booking._id;
        const amount = res.booking.totalAmount;
        this.initiatePayment(bookingId, amount);
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Booking failed!');
      }
    });
  }

  initiatePayment(bookingId: string, amount: number) {
    this.paymentService.createOrder(bookingId, amount).subscribe({
      next: (res) => {
        this.loading = false;

        const options = {
          key: res.keyId,
          amount: res.amount,
          currency: res.currency,
          name: 'CylinderBook',
          description: 'Cylinder Booking Payment',
          order_id: res.orderId,
          handler: (response: any) => {
            // Step 3 — Verify payment
            this.verifyPayment(response, bookingId);
          },
          prefill: {
            name: this.user?.name,
            email: this.user?.email
          },
          theme: {
            color: '#f5a623'
          }
        };

        const rzp = new Razorpay(options);
        rzp.open();
      },
      error: (err) => {
        this.loading = false;
        alert('Payment initiation failed!');
      }
    });
  }

  verifyPayment(response: any, bookingId: string) {
    const verifyData = {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      bookingId: bookingId
    };

    this.paymentService.verifyPayment(verifyData).subscribe({
      next: (res) => {
        this.selectedCylinder = null;
        this.booking = { quantity: 1, date: '', address: '' };
        this.loadOrders();
        this.activeTab = 'orders';
        this.showSuccess('✅ Payment successful! Booking confirmed!');
      },
      error: (err) => {
        alert('Payment verification failed!');
      }
    });
  }

  showSuccess(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 4000);
  }

  loadOrders() {
    this.bookingService.getUserBookings().subscribe({
      next: (res) => {
        this.orders = res.bookings.map((b: any) => ({
          id: b._id,
          icon: this.cylinders.find(c => c.type === b.cylinderType)?.icon || '🔵',
          cylinderName: b.cylinderName,
          quantity: b.quantity,
          date: new Date(b.deliveryDate).toLocaleDateString(),
          address: b.address,
          status: b.status,
          paymentStatus: b.paymentStatus,
          amount: b.totalAmount
        }));
      },
      error: (err) => console.error(err)
    });
  }

  logout() {
    this.authService.logout();
  }
}