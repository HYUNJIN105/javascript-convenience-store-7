class Promotion {
  #type;

  constructor(type) {
    this.#type = type;
  }

  type() {
    return this.#type;
  }

  calculateFree(quantity) {
    const [buy, get] = this.#type.split('+').map(Number);
    return Math.floor(quantity / buy) * get;
  }

  getBuyQuantity() {
    return Number(this.#type.split('+')[0]);
  }
}

export default Promotion; 