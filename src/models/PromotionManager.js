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
    rawPromotions.forEach(({ name, type }) => {
      this.#promotions.set(name, new Promotion(type));
    });
  }

  get(productName) {
    const promotionName = this.#productManager.findPromotion(productName);
    return promotionName ? this.#promotions.get(promotionName) : null;
  }

  hasActive(productName) {
    const product = this.#productManager.find(productName);
    return product && product.promotion() && product.promotion().includes('2+1');
  }

  isMDRecommended(productName) {
    const product = this.#productManager.find(productName);
    return product && product.promotion() === 'MD추천상품';
  }

  isFlashSale(productName) {
    const product = this.#productManager.find(productName);
    return product && product.promotion() === '반짝할인';
  }

  calculateFree(productName, quantity) {
    const promotion = this.get(productName);
    return promotion ? promotion.calculateFree(quantity) : 0;
  }
}

export default PromotionManager; 