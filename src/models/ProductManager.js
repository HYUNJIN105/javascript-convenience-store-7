import ProductReader from '../utils/ProductReader.js';
import Product from './Product.js';

class ProductManager {
  #products;

  constructor() {
    this.#products = [];
    this.init();
  }

  init() {
    const rawProducts = ProductReader.read();
    this.#products = rawProducts.map(({ name, price, quantity, promotion }) => 
      new Product(
        name,
        parseInt(price, 10),
        parseInt(quantity, 10),
        promotion !== 'null' ? promotion : undefined
      )
    );
  }

  list() {
    return [...this.#products];
  }

  find(name) {
    const product = this.#products.find(product => product.name() === name);
    if (!product) {
      throw new Error('[ERROR] 존재하지 않는 상품입니다.');
    }
    return product;
  }

  findPromotion(name) {
    const product = this.find(name);
    return product.promotion();
  }

  findAllByName(name) {
    return this.#products.filter(product => product.name() === name);
  }

  getTotalAvailableQuantity(name) {
    const products = this.findAllByName(name);
    if (!products.length) {
      throw new Error('[ERROR] 존재하지 않는 상품입니다.');
    }
    return products.reduce((sum, product) => sum + product.quantity(), 0);
  }

  getPromotionProduct(name) {
    return this.#products.find(product => 
      product.name() === name && product.hasPromotion()
    );
  }

  getNonPromotionProduct(name) {
    return this.#products.find(product => 
      product.name() === name && !product.hasPromotion()
    );
  }
}

export default ProductManager; 