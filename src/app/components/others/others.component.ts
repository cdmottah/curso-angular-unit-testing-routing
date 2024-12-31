import { Component, inject } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/product.service';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.scss']
})
export class OthersComponent {

  color = 'yellow';
  text = 'Un texto';
  products: Product[] = [];

  constructor(
    private _productService: ProductsService
  ) { }

  ngOnInit() {
    this._productService.getAll().subscribe(products => this.products = products)
  }

}
