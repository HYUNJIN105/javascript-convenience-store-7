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
      await this.welcome();
      await this.show();
    } catch (error) {
      await this.error(error);
    }
  }

  async welcome() {
    await Console.print('안녕하세요. W편의점입니다.');
    await Console.print('현재 보유하고 있는 상품입니다.\n');
  }

  async show() {
    const products = this.#productManager.list();
    for (const product of products) {
      const hasPromo = this.#promotionManager.hasActive(product.name());
      await Console.print(product.toString(hasPromo));
    }
  }

  async error(error) {
    await Console.print(error.message);
  }
}

export default App;
