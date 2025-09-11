import {Component, inject, OnInit} from '@angular/core';
import {OidcSecurityService} from "angular-auth-oidc-client";
import {Product} from "../../model/product";
import {ProductService} from "../../services/product/product.service";
import {Router} from "@angular/router";
import {Order} from "../../model/order";
import {FormsModule, NgForm, NgModel} from "@angular/forms";
import {OrderService} from "../../services/order/order.service";
import {ToastService} from '../../shared/services/toast.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-homepage',
  templateUrl: './home-page.component.html',
  standalone: true,
  imports: [
    FormsModule, CommonModule
  ],
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  isAuthenticated = false;
  products: Array<Product> = [];

  ngOnInit(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({isAuthenticated}) => {
        this.isAuthenticated = isAuthenticated;
        this.productService.getProducts()
          .pipe()
          .subscribe(product => {
            this.products = product;
          })
      }
    )
  }

  goToCreateProductPage() {
    this.router.navigateByUrl('/add-product');
  }

  orderProduct(product: Product, qty: NgModel, form: NgForm) {
    if (form.invalid) {
      return;
    }

    const quantity = Number(qty.value);

    if (!quantity || quantity < 1) {
      return;
    }

    this.oidcSecurityService.userData$.subscribe(result => {
      const claims = result.userData as { [key: string]: any };

      const userDetails = {
        email: claims['email'],
        firstName: claims['given_name'],
        lastName: claims['family_name'],
      }

      const order: Order = {
        skuCode: product.skuCode,
        price: product.price,
        quantity: Number(quantity),
        userDetails: userDetails
      }

      this.orderService.orderProduct(order).subscribe({
        next: (res) => {
          this.toastService.success(
            `You order is placed successfully. Order number: #${res.orderNumber})`
          );
          form.resetForm();
        },
        error: (err) => {
          this.toastService.error(err?.error?.message ?? 'Failed to place order');
        }
      });
    });
  }
}
