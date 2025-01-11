import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-creditos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './creditos.component.html',
  styleUrl: './creditos.component.css'
})
export class CreditosComponent {
  developer = {
    name: 'Raul Cardos Acevedo',
    group: '7CM1',
    email: 'rcardosoa2100@alumno.ipn.mx'
  };
}

