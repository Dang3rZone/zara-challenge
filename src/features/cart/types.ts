export interface CartLineItem {
  /** Unique identifier for this line; distinct from productId so the same
   *  product can appear multiple times as separate lines. */
  lineId: string;
  productId: string;
  brand: string;
  name: string;
  imageUrl: string;
  color: {
    name: string;
    hexCode: string;
  };
  storage: {
    capacity: string;
    price: number;
  };
}

export interface CartState {
  items: CartLineItem[];
}
