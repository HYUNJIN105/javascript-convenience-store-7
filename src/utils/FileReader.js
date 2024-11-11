import { readFileSync } from 'fs';

class FileReader {
  static readFile(filePath) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      return this.parseContent(content);
    } catch (error) {
      throw new Error('[ERROR] 파일을 불러오는데 실패했습니다.');
    }
  }

  static parseContent(content) {
    const lines = content.split('\n');
    const filteredLines = lines
      .filter(line => line.trim())  // 빈 줄 제거
      .slice(1);  // 헤더 줄 제거
    
    return filteredLines.map(line => {
      return line.split(',').map(item => item.trim());
    });
  }
}

export default FileReader; 