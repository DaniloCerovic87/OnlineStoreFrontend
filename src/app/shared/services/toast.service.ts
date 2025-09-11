import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private snack: MatSnackBar) {}

  private show(message: string, panelClass: string, duration = 3000) {
    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [panelClass],
    };

    this.snack.open(message, '×', config);
  }

  success(message: string) {
    this.show(message, 'snack-success');
  }

  error(message: string) {
    this.show(message, 'snack-error', 5000); // error traje duže
  }

  info(message: string) {
    this.show(message, 'snack-info');
  }
}
