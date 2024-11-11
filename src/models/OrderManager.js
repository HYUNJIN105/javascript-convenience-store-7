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
      product.decreaseStock(order.quantity());
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
      await this.promoStock(order, product, freeCount);
    } else {
      await this.stock(order, product);
    }
  }

  async promoStock(order, product, freeCount) {
    const total = order.quantity() + freeCount;

    if (product.canDecrease(total)) {
      if (await InputView.readPromo(order.name())) {
        product.decreaseStock(total);
        this.add(order.name(), {
          ...order,
          free: freeCount
        });
        return;
      }
    }
    
    if (product.canDecrease(order.quantity())) {
      if (await InputView.readPrice(order.name(), order.quantity())) {
        product.decreaseStock(order.quantity());
        this.add(order.name(), order);
        return;
      }
    }

    throw new Error('[ERROR] 재고가 부족합니다.');
  }

  async stock(order, product) {
    if (!product.canDecrease(order.quantity())) {
      throw new Error('[ERROR] 재고가 부족합니다.');
    }

    if (await InputView.readPrice(order.name(), order.quantity())) {
      product.decreaseStock(order.quantity());
      this.add(order.name(), order);
    } else {
      throw new Error('[ERROR] 주문이 취소되었습니다.');
    }
  }

  add(name, order) {
    this.#orders.set(name, order);
  }

  validateStock(order, product) {
    if (!product.canDecrease(order.quantity())) {
      throw new Error('[ERROR] 재고가 부족합니다.');
    }
  }

  getOrders() {
    return Array.from(this.#orders.values());
  }
} 

export default OrderManager; 