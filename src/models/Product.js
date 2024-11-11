class Product {
  #name;
  #price;
  #quantity;
  #promotion;

  constructor(name, price, quantity, promotion) {
    this.validate(name, price, quantity);
    this.#name = name;
    this.#price = price;
    this.#quantity = quantity;
    this.#promotion = promotion;
  }

  validate(name, price, quantity) {
    if (!name || typeof name !== 'string') {
      throw new Error('[ERROR] 상품명이 올바르지 않습니다.');
    }
    if (!Number.isInteger(price) || price <= 0) {
      throw new Error('[ERROR] 가격이 올바르지 않습니다.');
    }
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error('[ERROR] 재고 수량이 올바르지 않습니다.');
    }
  }

  name() {
    return this.#name;
  }

  price() {
    return this.#price;
  }

  quantity() {
    return this.#quantity;
  }

  promotion() {
    return this.#promotion;
  }

  hasStock() {
    return this.#quantity > 0;
  }

  toString() {
    const stockInfo = this.hasStock() ? `${this.#quantity}개` : '재고 없음';
    const promotionInfo = this.#promotion ? ` ${this.#promotion}` : '';
    
    return `- ${this.#name} ${this.#price}원 ${stockInfo}${promotionInfo}`;
  }
}

export default Product; 