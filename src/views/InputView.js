import { Console } from '@woowacourse/mission-utils';

class InputView {
  static async read() {
    const input = await Console.readLineAsync(
      '\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n'
    );
    return this.parse(input);
  }

  static async readPromo(productName) {
    const input = await Console.readLineAsync(
      `\n현재 ${productName}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`
    );
    return this.parseAnswer(input);
  }

  static async readPrice(productName, quantity) {
    const input = await Console.readLineAsync(
      `\n현재 ${productName} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`
    );
    return this.parseAnswer(input);
  }

  static async readMembershipDiscount() {
    while (true) {
      try {
        const input = await Console.readLineAsync(
          '\n멤버십 할인을 받으시겠습니까? (Y/N)\n'
        );
        return this.parseAnswer(input);
      } catch (error) {
        await Console.print(error.message);
      }
    }
  }

  static async readMorePurchase() {
    while (true) {
      try {
        const input = await Console.readLineAsync(
          '\n감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n'
        );
        return this.parseAnswer(input);
      } catch (error) {
        await Console.print(error.message);
      }
    }
  }

  static async readMDPromotion(productName) {
    const input = await Console.readLineAsync(
      `\n현재 ${productName}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`
    );
    return this.parseAnswer(input);
  }

  static parseAnswer(input) {
    const answer = input.trim().toUpperCase();
    if (answer !== 'Y' && answer !== 'N') {
      throw new Error('[ERROR] Y 또는 N으로 입력해 주세요.');
    }
    return answer === 'Y';
  }

  static parseMembership(input) {
    const grade = input.trim();
    if (!['1', '2'].includes(grade)) {
      throw new Error('[ERROR] 유효하지 않은 멤버십 등급입니다.');
    }
    return grade === '2' ? 'VIP' : '일반';
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