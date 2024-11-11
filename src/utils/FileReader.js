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
      .filter(line => line.trim())
      .slice(1);
    
    return filteredLines.map(line => {
      return line.split(',').map(item => item.trim());
    });
  }
}

export default FileReader; 