import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Discount {
  id: number;
  discountCode: string;
  discountAmount: number;
  validUntil: Date;
}

interface ApiResponse {
  estado: number;
  msg: string;
  discounts: Discount | Discount[];
  links: Array<{
  rel: string;
  href: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class DiscountsService {
  private apiUrl = 'https://wcbdf-rca-api-discounts.onrender.com/api/v1/discounts';  // Ajusta esta URL según tu entorno

  constructor(
  private http: HttpClient,
  private authService: AuthService
  ) { }

  // Obtener todos los descuentos
  getDiscounts(): Observable<ApiResponse> {
  return this.http.get<ApiResponse>(this.apiUrl, { 
    headers: this.authService.getAuthHeaders() 
  });
  }

  // Obtener un descuento por ID
  getDiscount(id: number): Observable<ApiResponse> {
  return this.http.get<ApiResponse>(`${this.apiUrl}/${id}`, { 
    headers: this.authService.getAuthHeaders() 
  });
  }

  // Crear un nuevo descuento
  createDiscount(discount: Partial<Discount>): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(this.apiUrl, discount, { 
    headers: this.authService.getAuthHeaders() 
  });
  }

  // Actualizar un descuento existente
  updateDiscount(id: number, discount: Partial<Discount>): Observable<ApiResponse> {
  return this.http.put<ApiResponse>(`${this.apiUrl}/${id}`, discount, { 
    headers: this.authService.getAuthHeaders() 
  });
  }

  // Eliminar un descuento
  deleteDiscount(id: number): Observable<ApiResponse> {
  return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`, { 
    headers: this.authService.getAuthHeaders() 
  });
  }
}
