import { ProductCategory } from "./product-category";

export interface GetResponseProductCategory {
    _embedded: {
        productCategory: ProductCategory[];
    }
}