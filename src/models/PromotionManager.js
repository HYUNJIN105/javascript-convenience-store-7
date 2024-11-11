import PromotionReader from '../utils/PromotionReader.js';
import Promotion from './Promotion.js';

class PromotionManager {
  #promotions;
  #productManager;

  constructor(productManager) {
    this.#promotions = new Map();
    this.#productManager = productManager;
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
    const promotionName = this.#productManager.findPromotion(productName);
    return promotionName ? this.#promotions.get(promotionName) : null;
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