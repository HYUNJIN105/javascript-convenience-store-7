import InputView from '../views/InputView.js';
import Order from './Order.js';

class OrderManager {
  #productManager;
  #promotionManager;
  #orders;
  #useMembership;

  constructor(productManager, promotionManager) {
    this.#productManager = productManager;
    this.#promotionManager = promotionManager;
    this.#orders = new Map();
    this.#useMembership = false;
  }

  async process(orders) {
    this.#orders.clear();
    
    for (const order of orders) {
      const totalAvailable = this.#productManager.getTotalAvailableQuantity(order.name());
      if (totalAvailable < order.quantity()) {
        throw new Error('[ERROR] 재고가 부족합니다.');
      }
      
      const product = this.#productManager.find(order.name());
      order.setPrice(product.price());

      // MD추천상품 확인 및 처리
      if (this.#promotionManager.isMDRecommended(order.name()) && order.quantity() === 1) {
        const addMD = await InputView.readMDPromotion(order.name());
        if (addMD) {
          order = new Order(order.name(), 2, order.price());
        }
      }

      await this.processOrder(order);
    }
  }

  async processOrder(order) {
    const promoProduct = this.#productManager.getPromotionProduct(order.name());
    const regularProduct = this.#productManager.getNonPromotionProduct(order.name());
    
    // MD추천상품 체크 및 안내
    if (this.#promotionManager.isMDRecommended(order.name())) {
      const proceed = await InputView.readMDPromotion(order.name());
      if (proceed) {
        const newQuantity = order.quantity() + 1;
        order = new Order(order.name(), newQuantity, order.price());
      }
    }
  
    let promoQuantity = 0;
    let regularQuantity = order.quantity();
  
    // 프로모션 상품이 있는 경우
    if (promoProduct && this.#promotionManager.hasActive(order.name())) {
      const promotion = this.#promotionManager.get(order.name());
      const buy = promotion.getBuyQuantity();
      
      const maxPromoSets = Math.floor(promoProduct.quantity() / buy);
      const neededSets = Math.floor(order.quantity() / buy);
      const appliedSets = Math.min(maxPromoSets, neededSets);
      
      promoQuantity = appliedSets * buy;
      regularQuantity = order.quantity() - promoQuantity;
    }
  
    // 프로모션 재고 부족 시 안내
    if (regularQuantity > 0 && promoProduct && promoProduct.quantity() < order.quantity()) {
      const proceed = await InputView.readPrice(order.name(), regularQuantity);
      if (!proceed) {
        throw new Error('[ERROR] 구매를 취소합니다.');
      }
    }
  
    // 재고 차감
    if (promoQuantity > 0) {
      promoProduct.decreaseStock(promoQuantity);
    }
    if (regularQuantity > 0) {
      const remainingPromoStock = promoProduct ? promoProduct.quantity() : 0;
      const regularFromPromo = Math.min(remainingPromoStock, regularQuantity);
      const regularFromNormal = regularQuantity - regularFromPromo;
  
      if (regularFromPromo > 0) {
        promoProduct.decreaseStock(regularFromPromo);
      }
      if (regularFromNormal > 0) {
        regularProduct.decreaseStock(regularFromNormal);
      }
    }
  
    this.#orders.set(order.name(), {
      name: order.name(),
      quantity: order.quantity(),
      promoQuantity,
      price: order.price() * order.quantity()
    });
  }
  

  setMembershipUse(use) {
    this.#useMembership = use;
  }

  getOrderDetails() {
    const items = Array.from(this.#orders.entries()).map(([name, order]) => ({
      name,
      quantity: order.quantity,
      price: order.price
    }));

    const freeItems = this.calculateFreeItems(items);
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const promoDiscount = this.calculatePromoDiscount(items);
    const membershipDiscount = this.calculateMembershipDiscount(subtotal - promoDiscount);

    return {
      items,
      freeItems,
      pricing: {
        totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        promoDiscount,
        membershipDiscount,
        total: subtotal - promoDiscount - membershipDiscount
      }
    };
  }

  calculateFreeItems(items) {
    const freeItems = [];
    
    for (const item of items) {
      const order = this.#orders.get(item.name);
      
      if (this.#promotionManager.hasActive(item.name)) {
        const promoQuantity = order.promoQuantity;
        const freeQuantity = Math.floor(promoQuantity / 2);  // 2개 구매당 1개 증정
        if (freeQuantity > 0) {
          freeItems.push({
            name: item.name,
            quantity: freeQuantity
          });
        }
      }
    }
    
    return freeItems;
  }

  calculatePromoDiscount(items) {
    let totalDiscount = 0;

    for (const item of items) {
      const order = this.#orders.get(item.name);
      const unitPrice = item.price / order.quantity;

      if (this.#promotionManager.hasActive(item.name)) {
        const promoQuantity = Math.min(order.quantity, this.#productManager.getPromotionProduct(item.name).promoStock());
        const freeQuantity = Math.floor(promoQuantity / 2);  // 2개당 1개 무료
        totalDiscount += freeQuantity * unitPrice;
      }

      if (this.#promotionManager.isMDRecommended(item.name) || 
          this.#promotionManager.isFlashSale(item.name)) {
        totalDiscount += unitPrice;  // 1개 가격만큼 할인
      }
    }

    return totalDiscount;
  }

  calculateMembershipDiscount(priceAfterPromo) {
    return this.#useMembership ? Math.floor(priceAfterPromo * 0.3) : 0;
  }  
} 

export default OrderManager; 