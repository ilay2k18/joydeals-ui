import { OrderHistory } from "./order-history"

export class GetResponseOrderHistory {
    _embedded?: {
        orders: OrderHistory[];
    }
}
