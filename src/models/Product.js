class Product {
  #name;
  #price;
  #quantity;
  #promotion;
  #promoStock;

  constructor(name, price, quantity, promotion = null) {
    this.#name = name;
    this.#price = price;
    this.#quantity = quantity;
    this.#promotion = promotion;
    this.#promoStock = promotion ? quantity : 0;
  }

  toString() {
    const price = this.#price.toLocaleString();
    const quantity = this.#quantity === 0 ? '재고 없음' : `${this.#quantity}개`;
    const promotion = this.#promotion ? ` ${this.#promotion}` : '';
    
    return `- ${this.#name} ${price}원 ${quantity}${promotion}`;
  }

  canDecrease(quantity) {
    return this.#quantity >= quantity;
  }

  getAvailablePromoQuantity(quantity) {
    if (!this.hasPromotion() || !this.#promoStock) return 0;
    return Math.min(quantity, this.#promoStock);
  }

  decreaseStock(quantity, promoQuantity = 0) {
    if (!this.canDecrease(quantity)) {
      throw new Error('[ERROR] 재고가 부족합니다.');
    }
    this.#quantity -= quantity;
    if (promoQuantity > 0) {
      this.#promoStock -= promoQuantity;
    }
  }

  quantity() {
    return this.#quantity;
  }

  name() {
    return this.#name;
  }

  price() {
    return this.#price;
  }

  promotion() {
    return this.#promotion;
  }

  hasPromotion() {
    return this.#promotion !== null;
  }

  promoStock() {
    return this.#promoStock;
  }
}

export default Product; 