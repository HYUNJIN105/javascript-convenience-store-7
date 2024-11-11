export default class Order {
  #name;
  #quantity;
  #price;

  constructor(name, quantity, price = 0) {
    this.validate(name, quantity);
    this.#name = name;
    this.#quantity = quantity;
    this.#price = price;
  }

  validate(name, quantity) {
    if (!name || typeof name !== 'string') {
      throw new Error('[ERROR] 상품명이 올바르지 않습니다.');
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('[ERROR] 수량은 1 이상의 정수여야 합니다.');
    }
  }

  name() {
    return this.#name;
  }

  quantity() {
    return this.#quantity;
  }

  price() {
    return this.#price;
  }

  setPrice(price) {
    this.#price = price;
  }
} 