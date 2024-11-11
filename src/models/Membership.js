class Membership {
  static #DISCOUNT_RATE = 0.3;
  static #MAX_DISCOUNT = 8000;

  calculateDiscount(price) {
    const discount = Math.floor(price * Membership.#DISCOUNT_RATE);
    return Math.min(discount, Membership.#MAX_DISCOUNT);
  }
}

export default Membership; 