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

  calculatePromoDiscount() {
    let discount = 0;
    
    this.#orders.forEach((order, name) => {
      if (order.free) {
        const product = this.#productManager.find(name);
        discount += product.price() * order.free;
      }
    });

    return discount;
  }

  calculateMembershipDiscount(amount) {
    if (!this.useMembership) return 0;

    const DISCOUNT_RATE = 0.3;
    const MAX_DISCOUNT = 8000;
    
    const discount = Math.floor(amount * DISCOUNT_RATE);
    return Math.min(discount, MAX_DISCOUNT);
  }

  calculateFinalPrice() {
    const summary = {
      subtotal: 0,          // 할인 전 금액
      promoDiscount: 0,     // 프로모션 할인
      membershipDiscount: 0, // 멤버십 할인
      total: 0              // 최종 금액
    };


    this.#orders.forEach((order, name) => {
      const product = this.#productManager.find(name);
      summary.subtotal += product.price() * order.quantity();
    });


    summary.promoDiscount = this.calculatePromoDiscount();

    const nonPromoAmount = summary.subtotal - summary.promoDiscount;
    summary.membershipDiscount = this.calculateMembershipDiscount(nonPromoAmount);


    summary.total = summary.subtotal - summary.promoDiscount - summary.membershipDiscount;

    return summary;
  }

  setMembershipUse(use) {
    this.useMembership = use;
  }

  getOrderDetails() {
    return {
      items: this.#orders.map((order, name) => ({
        name,
        quantity: order.quantity(),
        price: this.#productManager.find(name).price() * order.quantity()
      })),
      freeItems: Array.from(this.#orders.entries())
        .filter(([_, order]) => order.free)
        .map(([name, order]) => ({
          name,
          quantity: order.free
        })),
      pricing: this.calculateFinalPrice()
    };
  }
} 

export default OrderManager; 