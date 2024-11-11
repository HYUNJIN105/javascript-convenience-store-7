import InputView from '../views/InputView.js';
import Membership from './Membership.js';

class OrderManager {
  #productManager;
  #promotionManager;
  #orders;
  #membership;

  constructor(productManager, promotionManager) {
    this.#productManager = productManager;
    this.#promotionManager = promotionManager;
    this.#orders = new Map();
    this.#membership = new Membership();
  }

  async process(orders) {
    for (const order of orders) {
      await this.processOrder(order);
    }
    return await this.processMembership();
  }

  async processOrder(order) {
    const product = this.#productManager.find(order.name());
    
    if (this.#promotionManager.hasActive(order.name())) {
      await this.processPromo(order, product);
    } else {
      this.validateStock(order, product);
      this.#orders.set(order.name(), order);
    }
  }

  async processMembership() {
    const useMembership = await InputView.readMembershipDiscount();
    if (!useMembership) return false;

    const nonPromoPrice = this.calculateNonPromoPrice();
    const membershipDiscount = this.#membership.calculateDiscount(nonPromoPrice);
    
    return membershipDiscount;
  }

  calculateNonPromoPrice() {
    let total = 0;
    this.#orders.forEach((order, name) => {
      if (!this.#promotionManager.hasActive(name)) {
        const product = this.#productManager.find(name);
        total += product.price() * order.quantity();
      }
    });
    return total;
  }

  async add(orders) {
    for (const order of orders) {
      await this.process(order);
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