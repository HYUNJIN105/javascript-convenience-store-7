import { Console } from '@woowacourse/mission-utils';
import ProductReader from './models/ProductReader.js';

class App {
  async run() {
    try {
      const products = ProductReader.read();
      await this.displayProducts(products);
    } catch (error) {
      await this.handleError(error);
    }
  }

  async displayProducts(products) {
    await Console.print('안녕하세요. W편의점입니다.');
    await Console.print('현재 보유하고 있는 상품입니다.\n');
    
    products.forEach(async (product) => {
      const message = this.formatProductInfo(product);
      await Console.print(message);
    });
  }

  formatProductInfo(product) {
    const quantityInfo = `${product.quantity}개`;
    const promotionInfo = product.promotion ? ` ${product.promotion}` : '';
    
    return `- ${product.name} ${product.price}원 ${quantityInfo}${promotionInfo}`;
  }

  async handleError(error) {
    await Console.print(error.message);
  }
}

export default App;
