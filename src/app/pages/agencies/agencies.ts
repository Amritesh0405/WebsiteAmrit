import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agencies',
  imports: [CommonModule, FormsModule],
  templateUrl: './agencies.html',
  styleUrl: './agencies.css'
})
export class Agencies  {
  map: any;
  loading = false;
  citySearch = '';
  activeFilter = 'all';
  viewMode = 'list';
  agencies: any[] = [];
  markers: any[] = [];

  // ✅ Runtime cache: stores fetched agencies per "city_filter" key
  // No hardcoded data — all real from OSM/Overpass API
  private cache = new Map<string, any[]>();

  filters = [
    { label: 'All', value: 'all', icon: '🔍' },
    { label: 'LPG', value: 'lpg', icon: '🟠' },
    { label: 'CNG/PNG', value: 'cng', icon: '🔵' },
    { label: 'Biogas', value: 'biogas', icon: '🟢' },
    { label: 'Solar', value: 'solar', icon: '⚡' },
    { label: 'Industrial', value: 'industrial', icon: '⚙️' }
  ];

  platforms = [
    { icon: '🔴', name: 'HP Gas', description: 'Hindustan Petroleum LPG booking', url: 'https://www.hindustanpetroleum.com/hpgas' },
    { icon: '🔵', name: 'Indane Gas', description: 'Indian Oil LPG booking portal', url: 'https://iocl.com/lpg-services' },
    { icon: '🟢', name: 'Bharat Gas', description: 'Bharat Petroleum LPG booking', url: 'https://www.ebharatgas.com' },
    { icon: '🟡', name: 'IGL Online', description: 'Indraprastha Gas CNG/PNG', url: 'https://www.iglonline.net' },
    { icon: '🟠', name: 'Mahanagar Gas', description: 'Mumbai CNG & PNG services', url: 'https://www.mahanagargas.com' },
    { icon: '⚡', name: 'MNRE Solar', description: 'Ministry of New & Renewable Energy', url: 'https://mnre.gov.in' },
    { icon: '🔴', name: 'Bio Gas', description: 'Ministry of Biogas', url: 'https://biogas.mnre.gov.in/about-the-programmes' }
  ];


}