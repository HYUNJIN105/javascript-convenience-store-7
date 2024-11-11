import { readFileSync } from 'fs';

class PromotionReader {
  static readPromotionsFile() {
    try {
      const content = readFileSync('public/promotions.md', 'utf-8');
      return this.parseContent(content);
    } catch (error) {
      throw new Error('[ERROR] 프로모션 목록을 불러오는데 실패했습니다.');
    }
  }

  static parseContent(content) {
    const lines = content.split('\n');
    const filteredLines = lines
      .filter(line => line.trim())
      .slice(1);
    
    return filteredLines.map(line => {
      const [name, type, startDate, endDate] = line.split(',').map(item => item.trim());
      return { name, type, startDate, endDate };
    });
  }
}

export default PromotionReader; 