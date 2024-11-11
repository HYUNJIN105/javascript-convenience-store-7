import { Console } from '@woowacourse/mission-utils';

class OutputView {
  static async printReceipt({ items, freeItems, pricing }) {
    await Console.print('\n==============W 편의점================');
    await Console.print('상품명\t\t수량\t금액');
    
    for (const item of items) {
      const name = this.padEnd(item.name, 8);
      await Console.print(`${name}\t\t${item.quantity} \t${item.price.toLocaleString()}`);
    }
    
    if (freeItems.length > 0) {
      await Console.print('=============증\t정===============');
      for (const item of freeItems) {
        const name = this.padEnd(item.name, 8);
        await Console.print(`${name}\t\t${item.quantity}`);
      }
    }
    
    await Console.print('====================================');
    await Console.print(`총구매액\t\t${pricing.totalQuantity}\t${pricing.subtotal.toLocaleString()}`);
    await Console.print(`행사할인\t\t\t-${pricing.promoDiscount.toLocaleString()}`);
    await Console.print(`멤버십할인\t\t\t-${pricing.membershipDiscount.toLocaleString()}`);
    await Console.print(`내실돈\t\t\t ${pricing.total.toLocaleString()}`);
  }

  static padEnd(str, length) {
    const korean = str.match(/[가-힣]/g) || [];
    const padding = length - str.length - korean.length;
    return str + ' '.repeat(Math.max(0, padding));
  }
  
}

export default OutputView; 