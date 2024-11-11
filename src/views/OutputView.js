import { Console } from '@woowacourse/mission-utils';

class OutputView {
  static async printPromoDiscount(discount) {
    if (discount > 0) {
      await Console.print(`\n프로모션 할인: -${discount.toLocaleString()}원`);
    }
  }
}

export default OutputView; 