// src/app/components/discount/discount.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { DiscountsService } from '../../services/discounts.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

interface Discount {
  id: number;
  discountCode: string;
  discountAmount: number;
  validUntil: Date;
}

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
})
export class LogComponent implements OnInit {
  @ViewChild('discountModal') discountModal: any;
  listadoDiscounts: Discount[] = [];
  loading = false;
  discountForm: FormGroup;
  isEditMode = false;
  currentDiscountId: number | null = null;

  constructor(
    private discountService: DiscountsService,
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.discountForm = this.fb.group({
      discountCode: ['', [Validators.required, Validators.minLength(3)]],
      discountAmount: ['', [Validators.required, Validators.min(1)]],
      validUntil: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.cargarDiscounts();
  }

  cargarDiscounts() {
    if (this.authService.hasAuthority('READ')) {
      this.loading = true;
      this.discountService.getDiscounts().subscribe({
        next: (response) => {
          this.listadoDiscounts = Array.isArray(response.discounts) ? response.discounts.map(d => ({
            id: d.id,
            discountCode: d.discountCode,
            discountAmount: d.discountAmount,
            validUntil: new Date(d.validUntil)
          })) : [{
            id: response.discounts.id,
            discountCode: response.discounts.discountCode,
            discountAmount: response.discounts.discountAmount,
            validUntil: new Date(response.discounts.validUntil)
          }];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar los descuentos:', error);
          this.loading = false;
        },
      });
    }
  }

  createDiscount() {
    this.isEditMode = false;
    this.discountForm.reset();
    this.modalService.open(this.discountModal, { backdrop: 'static', size: 'lg' });
  }

  editDiscount(discount: Discount) {
    this.isEditMode = true;
    this.currentDiscountId = discount.id;
    this.discountForm.patchValue({
      discountCode: discount.discountCode,
      discountAmount: discount.discountAmount,
      validUntil: discount.validUntil
    });
    this.modalService.open(this.discountModal, { backdrop: 'static', size: 'lg' });
  }

  eliminarDiscount(discountId: number) {
    if (this.authService.hasAuthority('DELETE')) {
      if (confirm('¿Está seguro que desea eliminar este descuento?')) {
        this.discountService.deleteDiscount(discountId).subscribe({
          next: () => {
            this.cargarDiscounts();
          },
          error: (error) => {
            console.error('Error al eliminar el descuento:', error);
          },
        });
      }
    } else {
      alert('No tienes permiso para eliminar descuentos.');
    }
  }

  onSubmitDiscount(modal: any) {
    if (this.discountForm.invalid) {
      return;
    }

    const discountData: Partial<Discount> = {
      ...this.discountForm.value
    };

    if (this.isEditMode && this.currentDiscountId) {
      if (!this.authService.hasAuthority('UPDATE')) {
        alert('No tienes permiso para actualizar descuentos.');
        return;
      }
      this.discountService.updateDiscount(this.currentDiscountId, discountData).subscribe({
        next: () => {
          modal.close();
          this.cargarDiscounts();
        },
        error: (err) => {
          console.error('Error al actualizar el descuento:', err);
        },
      });
    } else {
      if (!this.authService.hasAuthority('CREATE')) {
        alert('No tienes permiso para crear descuentos.');
        return;
      }
      this.discountService.createDiscount(discountData).subscribe({
        next: () => {
          modal.close();
          this.cargarDiscounts();
        },
        error: (err) => {
          console.error('Error al crear el descuento:', err);
        },
      });
    }
  }
}
