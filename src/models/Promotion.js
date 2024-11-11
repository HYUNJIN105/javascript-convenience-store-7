import { DateTimes } from '@woowacourse/mission-utils';

class Promotion {
  #type;
  #startDate;
  #endDate;

  constructor(type, startDate, endDate) {
    this.validateDates(startDate, endDate);
    this.#type = type;
    this.#startDate = new Date(startDate);
    this.#endDate = new Date(endDate);
  }

  validateDates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('[ERROR] 프로모션 날짜 형식이 올바르지 않습니다.');
    }
    if (start > end) {
      throw new Error('[ERROR] 프로모션 시작일이 종료일보다 늦을 수 없습니다.');
    }
  }

  isActive() {
    const currentDate = DateTimes.now();
    return currentDate >= this.#startDate && currentDate <= this.#endDate;
  }

  getType() {
    return this.#type;
  }

  getFreeQuantity(purchaseQuantity) {
    if (!this.isActive()) return 0;
    
    if (this.#type === '1+1') {
      return Math.floor(purchaseQuantity / 2);
    }
    if (this.#type === '2+1') {
      return Math.floor(purchaseQuantity / 3);
    }
    return 0;
  }
}

export default Promotion; 