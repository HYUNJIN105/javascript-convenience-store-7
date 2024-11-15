import { Console } from '@woowacourse/mission-utils';
import ProductManager from './models/ProductManager.js';
import PromotionManager from './models/PromotionManager.js';
import InputView from './views/InputView.js';
import Order from './models/Order.js';
import OrderManager from './models/OrderManager.js';
import OutputView from './views/OutputView.js';

class App {
  #productManager;
  #promotionManager;
  #orderManager;

  constructor() {
    this.#productManager = new ProductManager();
    this.#promotionManager = new PromotionManager(this.#productManager);
    this.#orderManager = new OrderManager(this.#productManager, this.#promotionManager);
  }

  async run() {
    try {
      await this.welcome();
      await this.show();
      await this.start();
    } catch (error) {
      await this.error(error);
    }
  }

  async start() {
    while (true) {
      await this.retry(() => this.processOrder());
      
      if (!await this.askForMorePurchase()) {
        break;
      }
      
      await this.welcome();
      await this.show();
    }
  }

  async retry(callback) {
    while (true) {
      try {
        await callback();
        break;
      } catch (error) {
        await this.error(error);
      }
    }
  }

  async processOrder() {
    const orderInputs = await InputView.read();
    const orders = this.createOrders(orderInputs);
    await this.#orderManager.process(orders);
    
    const useMembership = await InputView.readMembershipDiscount();
    this.#orderManager.setMembershipUse(useMembership);
    
    const orderDetails = this.#orderManager.getOrderDetails();
    await OutputView.printReceipt(orderDetails);
  }

  createOrders(orderInputs) {
    return orderInputs.map(({ name, quantity }) => 
      new Order(name, quantity)
    );
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

  async askForMorePurchase() {
    return await InputView.readMorePurchase();
  }
}

export default App;
