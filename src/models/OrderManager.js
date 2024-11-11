import InputView from '../views/InputView.js';

class OrderManager {
  #productManager;
  #promotionManager;
  #orders;

  constructor(productManager, promotionManager) {
    this.#productManager = productManager;
    this.#promotionManager = promotionManager;
    this.#orders = new Map();
  }

  async add(orders) {
    for (const order of orders) {
      await this.process(order);
    }
  }

  async process(order) {
    const product = this.#productManager.find(order.name());
    
    if (this.#promotionManager.hasActive(order.name())) {
      await this.processPromo(order, product);
    } else {
      this.validateStock(order, product);
      this.#orders.set(order.name(), order);
    }
  }

  async processPromo(order, product) {
    const freeCount = this.#promotionManager.calculateFree(order.name(), order.quantity());
    
    if (freeCount > 0) {
      const hasStock = product.quantity() >= (order.quantity() + freeCount);
      
      if (hasStock && await InputView.readPromo(order.name())) {
        this.#orders.set(order.name(), {
          ...order,
          free: freeCount
        });
        return;
      }
    }

    if (await InputView.readPrice(order.name(), order.quantity())) {
      this.validateStock(order, product);
      this.#orders.set(order.name(), order);
    } else {
      throw new Error('[ERROR] 주문이 취소되었습니다.');
    }
  }

  validateStock(order, product) {
    if (order.quantity() > product.quantity()) {
      throw new Error('[ERROR] 재고 수량을 초과하여 구매할 수 없습니다.');
    }
  }

  getOrders() {
    return Array.from(this.#orders.values());
  }
} 

export default OrderManager; 