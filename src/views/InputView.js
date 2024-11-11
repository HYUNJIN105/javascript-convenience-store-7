import { Console } from '@woowacourse/mission-utils';

class InputView {
  static async read() {
    const input = await Console.readLineAsync(
      '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n'
    );
    return this.parse(input);
  }

  static parse(input) {
    this.validate(input);
    return this.split(input);
  }

  static validate(input) {
    const pattern = /^(\[[가-힣]+-[0-9]+\],)*\[[가-힣]+-[0-9]+\]$/;
    if (!pattern.test(input)) {
      throw new Error('[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.');
    }
  }

  static split(input) {
    const pattern = /\[([가-힣]+)-([0-9]+)\]/g;
    const orders = [];
    let match;

    while ((match = pattern.exec(input)) !== null) {
      orders.push({
        name: match[1],
        quantity: parseInt(match[2], 10)
      });
    }

    return orders;
  }
}

export default InputView; 