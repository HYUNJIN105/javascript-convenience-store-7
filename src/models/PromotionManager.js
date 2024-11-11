import PromotionReader from '../utils/PromotionReader.js';
import Promotion from './Promotion.js';

class PromotionManager {
  #promotions;

  constructor() {
    this.#promotions = new Map();
    this.initializePromotions();
  }

  initializePromotions() {
    const rawPromotions = PromotionReader.readPromotionsFile();
    rawPromotions.forEach(({ name, type, startDate, endDate }) => {
      this.#promotions.set(
        name,
        new Promotion(type, startDate, endDate)
      );
    });
  }

  getPromotion(productName) {
    return this.#promotions.get(productName);
  }

  hasActive(productName) {
    const promotion = this.getPromotion(productName);
    return promotion ? promotion.isActive() : false;
  }

  calculateFree(productName, quantity) {
    const promotion = this.getPromotion(productName);
    return promotion ? promotion.getFreeQuantity(quantity) : 0;
  }
}

export default PromotionManager; 