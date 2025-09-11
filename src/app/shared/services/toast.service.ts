import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private snack: MatSnackBar) {}

  private show(message: string, panelClass: string, duration: number) {
    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [panelClass],
    };

    this.snack.open(message, '×', config);
  }

  success(message: string, duration: number) {
    this.show(message, 'snack-success', duration);
  }

  error(message: string, duration: number) {
    this.show(message, 'snack-error', duration);
  }

  info(message: string, duration: number) {
    this.show(message, 'snack-info', duration);
  }
}
