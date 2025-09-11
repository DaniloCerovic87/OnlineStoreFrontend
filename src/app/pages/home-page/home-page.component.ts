import {Component, inject, OnInit} from '@angular/core';
import {OidcSecurityService} from "angular-auth-oidc-client";
import {Product} from "../../model/product";
import {ProductService} from "../../services/product/product.service";
import {Router} from "@angular/router";
import {Order} from "../../model/order";
import {FormsModule} from "@angular/forms";
import {OrderService} from "../../services/order/order.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './home-page.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);
  isAuthenticated = false;
  products: Array<Product> = [];
  quantityIsNull = false;
  orderSuccess = false;
  orderFailed = false;

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

  orderProduct(product: Product, quantity: string) {

    this.oidcSecurityService.userData$.subscribe(result => {
      const claims = result.userData as { [key: string]: any };

      const userDetails = {
        email: claims['email'],
        firstName: claims['given_name'],
        lastName: claims['family_name'],
      }

      if(!quantity) {
        this.orderFailed = true;
        this.orderSuccess = false;
        this.quantityIsNull = true;
      } else {
        console.log("product: " , product);
        const order: Order = {
          skuCode: product.skuCode,
          price: product.price,
          quantity: Number(quantity),
          userDetails: userDetails
        }

        this.orderService.orderProduct(order).subscribe(() => {
          console.log("order success");
          this.orderSuccess = true;
        }, error => {
          console.log("order error ", error);
          this.orderFailed = false;
        })
      }
    })
  }
}
