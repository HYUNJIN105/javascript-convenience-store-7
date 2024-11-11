import ProductReader from '../utils/ProductReader.js';
import Product from './Product.js';

class ProductManager {
  #products;

  constructor() {
    this.#products = [];
    this.initializeProducts();
  }

  initializeProducts() {
    const rawProducts = ProductReader.readProductsFile();
    this.#products = rawProducts.map(({ name, price, quantity, promotion }) => 
      new Product(
        name,
        parseInt(price, 10),
        parseInt(quantity, 10),
        promotion !== 'null' ? promotion : undefined
      )
    );
  }

  getProducts() {
    return [...this.#products];
  }

  findProduct(name) {
    const product = this.#products.find(product => product.getName() === name);
    if (!product) {
      throw new Error('[ERROR] 존재하지 않는 상품입니다.');
    }
    return product;
  }
}

export default ProductManager; 