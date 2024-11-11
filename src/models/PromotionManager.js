import PromotionReader from '../utils/PromotionReader.js';
import Promotion from './Promotion.js';

class PromotionManager {
  #promotions;

  constructor() {
    this.#promotions = new Map();
    this.init();
  }

  init() {
    const rawPromotions = PromotionReader.read();
    rawPromotions.forEach(({ name, type, startDate, endDate }) => {
      this.#promotions.set(
        name,
        new Promotion(type, startDate, endDate)
      );
    });
  }

  get(productName) {
    return this.#promotions.get(productName);
  }

  hasActive(productName) {
    const promotion = this.get(productName);
    return promotion ? promotion.isActive() : false;
  }

  calculateFree(productName, quantity) {
    const promotion = this.get(productName);
    return promotion ? promotion.calculateFree(quantity) : 0;
  }
}

export default PromotionManager; 