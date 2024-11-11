import { Console } from '@woowacourse/mission-utils';

class OutputView {
  static async printReceipt(orderDetails) {
    await this.printHeader();
    await this.printOrders(orderDetails.items);
    await this.printFreeItems(orderDetails.freeItems);
    await this.printPricing(orderDetails.pricing);
  }

  static async printHeader() {
    await Console.print('\n==============W 편의점================');
    await Console.print('상품명\t\t수량\t금액');
  }

  static async printOrders(items) {
    for (const item of items) {
      await Console.print(
        `${item.name}\t\t${item.quantity}\t${item.price.toLocaleString()}`
      );
    }
  }

  static async printFreeItems(items) {
    if (items.length === 0) return;
    
    await Console.print('=============증\t정===============');
    for (const item of items) {
      await Console.print(`${item.name}\t\t${item.quantity}`);
    }
  }

  static async printPricing(pricing) {
    await Console.print('====================================');
    await Console.print(`총구매액\t\t\t${pricing.subtotal.toLocaleString()}`);
    await Console.print(`행사할인\t\t\t-${pricing.promoDiscount.toLocaleString()}`);
    await Console.print(`멤버십할인\t\t\t-${pricing.membershipDiscount.toLocaleString()}`);
    await Console.print(`내실돈\t\t\t${pricing.total.toLocaleString()}`);
  }
}

export default OutputView; 