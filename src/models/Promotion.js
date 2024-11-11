import { DateTimes } from '@woowacourse/mission-utils';

class Promotion {
  #type;
  #startDate;
  #endDate;

  constructor(type, startDate, endDate) {
    this.validate(startDate, endDate);
    this.#type = type;
    this.#startDate = new Date(startDate);
    this.#endDate = new Date(endDate);
  }

  validate(startDate, endDate) {
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

  type() {
    return this.#type;
  }

  calculateFree(quantity) {
    if (!this.isActive()) return 0;
    
    const [buy, get] = this.#type.split('+').map(Number);
    return Math.floor(quantity / buy) * get;
  }
}

export default Promotion; 