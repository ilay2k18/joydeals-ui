import { Injectable } from '@angular/core';
import { string } from 'postcss-selector-parser';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  cartItems: CartItem[] = [];
  cartQuantity: number | undefined;

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = sessionStorage;

  constructor() {

    //Read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems')!);
    console.log("Cart items >>>>>>>>", data);
    if (data != null) {
      this.cartItems = data;

      //compute totals based on the data fhat read from storage
      this.computeCartTotals();
    }
  }

  addToCart(theCartItem: CartItem) {

    // Check if already items in cart
    let alreadyExistsIncart: boolean = false;
    let existingCartItem: CartItem | undefined;

    if (this.cartItems.length > 0) {
      // find the item in the card based on item id

      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      // check if we found it
      alreadyExistsIncart = (existingCartItem != undefined);
    }

    if (alreadyExistsIncart && existingCartItem?.quantity != undefined) {
      //increment the quantity
      existingCartItem.quantity++;
    }
    else {
      this.cartItems.push(theCartItem);
    }

    //compute total price and total quantity
    this.computeCartTotals();

  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      if (currentCartItem.quantity && currentCartItem.unitPrice) {
        totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
        totalQuantityValue += currentCartItem.quantity;
      }
    }

    // publish the new values ... all subscribers will receive new data

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log cart data (debug)
    this.logCartData(totalPriceValue, totalQuantityValue);

    //persist cart data
    this.persistCartItems();
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems))
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of hte cart');
    for (let tempCartItem of this.cartItems) {
      if (tempCartItem.quantity && tempCartItem.unitPrice) {
        const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
        console.log(`name: ${tempCartItem.name}, quantity : ${tempCartItem.quantity},unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
      }

    }
  }

  decrementQuantity(theCartItem: CartItem) {
    if (theCartItem.quantity) {
      theCartItem.quantity--;
      if (theCartItem.quantity === 0) {
        this.remove(theCartItem);
      }
      else {
        this.computeCartTotals();
      }
    }
  }
  remove(theCartItem: CartItem) {
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);
    // if found, remove the item from the array at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

}