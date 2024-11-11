import { Console } from '@woowacourse/mission-utils';
import ProductManager from './models/ProductManager.js';
import PromotionManager from './models/PromotionManager.js';

class App {
  #productManager;
  #promotionManager;

  constructor() {
    this.#productManager = new ProductManager();
    this.#promotionManager = new PromotionManager();
  }

  async run() {
    try {
      await this.displayWelcomeMessage();
      await this.displayProducts();
    } catch (error) {
      await this.handleError(error);
    }
  }

  async displayWelcomeMessage() {
    await Console.print('안녕하세요. W편의점입니다.');
    await Console.print('현재 보유하고 있는 상품입니다.\n');
  }

  async displayProducts() {
    const products = this.#productManager.getProducts();
    for (const product of products) {
      const hasPromotion = this.#promotionManager.hasActive(product.getName());
      await Console.print(product.toString(hasPromotion));
    }
  }

  async handleError(error) {
    await Console.print(error.message);
  }
}

export default App;
