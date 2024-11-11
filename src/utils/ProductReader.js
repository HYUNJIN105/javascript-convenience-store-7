import { readFileSync } from 'fs';

class ProductReader {
  static read() {
    try {
      const content = readFileSync('public/products.md', 'utf-8');
      return this.parse(content);
    } catch (error) {
      throw new Error('[ERROR] 상품 목록을 불러오는데 실패했습니다.');
    }
  }

  static parse(content) {
    const lines = content.split('\n');
    const filteredLines = lines
      .filter(line => line.trim())
      .slice(1);
    
    return filteredLines.map(line => {
      const [name, price, quantity, promotion] = line.split(',').map(item => item.trim());
      return { name, price, quantity, promotion };
    });
  }
}

export default ProductReader; 