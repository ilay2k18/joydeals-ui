import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { GetResponseProductCategory } from '../common/get-response-product-category'
import { GetResponseProducts } from '../common/get-response-products';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = environment.joyDealsApiUrl;
  private categoryUrl = `${this.baseUrl}/product-category`;
  constructor(private httpClient: HttpClient) { }
  getProductList(theCategoryId: number): Observable<Product[]> {
    const params = new HttpParams().set('id', theCategoryId);
    const searchurl = `${this.baseUrl}/products/search/findByCategoryId`;
    return this.getProducts(searchurl, params);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }


  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/products/search/findByNameContaining`;
    const params = new HttpParams().set('name', theKeyword);
    console.log("Search Products URL >>>>", searchUrl + params);
    return this.getProducts(searchUrl, params);
  }

  searchProductsPaginate(thePage: number,
    thePageSize: number,
    theKeyword: string): Observable<GetResponseProducts> {
    const params = new HttpParams().set('name', theKeyword)
      .set('page', thePage)
      .set('size', thePageSize);
    const searchurl = `${this.baseUrl}/products/search/findByNameContaining?`;
    const searchParam = searchurl + params;
    console.log(searchParam);
    return this.httpClient.get<GetResponseProducts>(searchParam);
  }


  getProducts(searchUrl: string, params: HttpParams): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl, { params }).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(theProductId: number): Observable<Product> {
    // product details
    const productUrl = `${this.baseUrl}/products/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);

  }

  getProductListPaginate(thePage: number,
    thePageSize: number,
    theCategoryId: number): Observable<GetResponseProducts> {
    const params = new HttpParams().set('id', theCategoryId)
      .set('page', thePage)
      .set('size', thePageSize);
    const searchurl = `${this.baseUrl}/products/search/findByCategoryId?`;
    const searchParam = searchurl + params;
    console.log(searchParam);
    return this.httpClient.get<GetResponseProducts>(searchParam);
  }
}






