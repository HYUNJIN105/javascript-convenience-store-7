import FileReader from '../utils/FileReader.js';

class ProductReader {
  static read() {
    const PRODUCTS_FILE_PATH = 'public/products.md';
    const productLines = FileReader.readFile(PRODUCTS_FILE_PATH);
    
    return this.convertToProductData(productLines);
  }

  static convertToProductData(lines) {
    return lines.map(line => {
      if (line.length < 3) {
        throw new Error('[ERROR] 상품 데이터 형식이 올바르지 않습니다.');
      }

      const productData = {
        name: line[0],
        price: this.parseNumber(line[1]),
        quantity: this.parseNumber(line[2])
      };

      if (line[3] && line[3] !== 'null') {
        productData.promotion = line[3];
      }

      return productData;
    });
  }

  static parseNumber(value) {
    const number = parseInt(value, 10);
    
    if (Number.isNaN(number)) {
      throw new Error('[ERROR] 숫자 형식이 올바르지 않습니다.');
    }

    return number;
  }
}

export default ProductReader; 