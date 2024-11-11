import { readFileSync } from 'fs';

class PromotionReader {
  static read() {
    try {
      const content = readFileSync('public/promotions.md', 'utf-8');
      return this.parse(content);
    } catch (error) {
      throw new Error('[ERROR] 프로모션 목록을 불러오는데 실패했습니다.');
    }
  }

  static parse(content) {
    const lines = content.split('\n');
    const filteredLines = lines
      .filter(line => line.trim())
      .slice(1);
    
    return filteredLines.map(line => {
      const [name, buy, get] = line.split(',').map(item => item.trim());
      return { 
        name, 
        type: `${buy}+${get}`
      };
    });
  }
}

export default PromotionReader; 