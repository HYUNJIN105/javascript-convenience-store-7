# Week4 - 편의점

## 기능 요구 사항
미션 `편의점` 은 구매자의 할인 혜택과 재고 상황을 고려하여 최종 결제 금액을 계산하고 안내하는 결제 시스템을 구현한다.

- 사용자가 입력한 상품의 가격과 수량을 기반으로 최종 결제 금액을 계산.
    - 총구매액은 상품별 가격과 수량을 곱하여 계산하며, 프로모션 및 멤버십 할인 정책을 반영하여 최종 결제 금액을 산출.

- 구매 내역과 산출한 금액 정보를 영수증으로 출력한다.

- 영수증 출력 후 추가 구매를 진행할지 또는 종료할지를 선택할 수 있다.

- 사용자가 잘못된 값을 입력할 경우 "[ERROR]"로 시작하는 메시지와 함께 Error를 발생시키고 해당 메시지를 출력한 다음 해당 지점부터 다시 입력을 받는다.

- 재고 관리
    - 각 상품의 재고 수량을 고려하여 결제 가능 여부를 확인.
    - 고객이 상품을 구매할 때마다, 결제된 수량만큼 해당 상품의 재고에서 차감하여 수량을 관리.
    - 재고를 차감하면서 시스템은 최신 재고 상태를 유지하고, 다음 고객이 구매할 때 최신 재고 정보를 제공.

- 프로모션 할인
    - 오늘 날짜가 프로모션 기간 내에 포함된 경우에만 할인을 적용.
    - 프로모션은 N개 구매 시 1개 무료 증정의 형태로 진행.
    - 1+1 또는 2+1 프로모션이 각각 지정된 상품에 적용되며, 동일 상품에 여러 프로모션은 적용x.
    - 프로모션 혜택은 프로모션 재고 내에서만 적용.
    - 프로모션 기간 중이라면 프로모션 재고를 우선적으로 차감하며, 프로모션 재고가 부족할 경우에 일반 재고를 사용.
    - 프로모션 적용이 가능한 상품에 대해 고객이 해당 수량보다 적게 가져온 경우, 필요 수량을 추가로 가져오면 혜택을 받을 수 있음을 안내.
    - 프로모션 재고가 부족하여 일부 수량을 프로모션 혜택 없이 결제해야 하는 경우, 일부 수량에 대해 정가로 결제하게 됨을 안내.

- 멤버십 할인
    - 멤버십 회원은 프로모션 미적용 금액의 30%를 할인.
    - 프로모션 적용 후 남은 금액에 대해 멤버십 할인을 적용.
    - 멤버십 할인의 최대 한도는 8,000원.

- 영수증 출력
    - 영수증은 고객의 구매 내역과 할인을 요약하여 출력.
    - 영수증 항목
        - 구매 상품 내역: 구매한 상품명, 수량, 가격
        - 증정 상품 내역: 프로모션에 따라 무료로 제공된 증정 상품의 목록
        - 금액 정보:
            - 총 구매액: 구매한 상품의 총 수량과 총 금액
            - 행사할인: 프로모션에 의해 할인된 금액
            - 멤버십할인: 멤버십에 의해 추가로 할인된 금액
            - 내실돈: 최종 결제 금액
        - 영수증의 구성 요소를 보기 좋게 정렬하여 쉽게 금액과 수량을 확인할 수 있도록 작성.

## 입출력 요구 사항

### 입력
- 구현에 필요한 상품 목록과 행사 목록을 파일 입출력을 통해 불러온다.
  - `public/products.md`과 `public/promotions.md` 파일을 이용
  - 두 파일 모두 내용의 형식을 유지한다면 값은 수정 가능

- 구매할 상품과 수량 입력
  - 형식: 상품명, 수량은 하이픈(-)으로, 개별 상품은 대괄호([])로 묶어 쉼표(,)로 구분
  - 예시: `[콜라-10],[사이다-3]`

- 프로모션 추가 구매 여부 입력
  - `Y`: 증정 받을 수 있는 상품을 추가
  - `N`: 증정 받을 수 있는 상품을 추가하지 않음

- 정가 결제 여부 입력
  - `Y`: 일부 수량에 대해 정가로 결제
  - `N`: 정가로 결제해야하는 수량만큼 제외한 후 결제 진행

- 멤버십 할인 적용 여부 입력
  - `Y`: 멤버십 할인을 적용
  - `N`: 멤버십 할인을 적용하지 않음

- 추가 구매 여부 입력
  - `Y`: 재고가 업데이트된 상품 목록을 확인 후 추가로 구매를 진행
  - `N`: 구매를 종료

### 출력
- 환영 인사와 함께 상품명, 가격, 프로모션 이름, 재고를 안내
  ```
  안녕하세요. W편의점입니다.
  현재 보유하고 있는 상품입니다.

  - 콜라 1,000원 10개 탄산2+1
  - 콜라 1,000원 10개
  - 사이다 1,000원 8개 탄산2+1
  ...
  ```

- 프로모션 관련 안내 메시지
  - 추가 구매 가능 시: `현재 {상품명}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`
  - 정가 결제 필요 시: `현재 {상품명} {수량}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)`

- 멤버십 할인 안내: `멤버십 할인을 받으시겠습니까? (Y/N)`

- 영수증 출력
  ```
  ==============W 편의점================
  상품명		수량	금액
  콜라		3 	3,000
  에너지바 		5 	10,000
  =============증	정===============
  콜라		1
  ====================================
  총구매액		8	13,000
  행사할인			-1,000
  멤버십할인			-3,000
  내실돈			 9,000
  ```

- 추가 구매 안내: `감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)`

- 에러 메시지 (형식: "[ERROR] 메시지")
  - 잘못된 형식: `[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.`
  - 존재하지 않는 상품: `[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.`
  - 재고 초과: `[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.`
  - 기타 오류: `[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.`

### 실행 예시
```
안녕하세요. W편의점입니다.
현재 보유하고 있는 상품입니다.

- 콜라 1,000원 10개 탄산2+1
- 콜라 1,000원 10개
...

구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])
[콜라-3],[에너지바-5]

멤버십 할인을 받으시겠습니까? (Y/N)
Y 

==============W 편의점================
상품명		수량	금액
콜라		3 	3,000
에너지바 		5 	10,000
=============증	정===============
콜라		1
====================================
총구매액		8	13,000
행사할인			-1,000
멤버십할인			-3,000
내실돈			 9,000

감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)
N
```

## 기능 구현 목록 체크 리스트
### 1. 상품 관리
- [x] 상품 목록 파일 읽기 및 파싱
- [x] 상품 정보 관리 (이름, 가격, 재고)
- [x] 프로모션 정보 관리

### 2. 입력 처리
- [x] 상품 구매 입력 검증
- [x] 프로모션 관련 선택 입력 처리
- [x] 멤버십 할인 선택 입력 처리

### 3. 재고 관리
- [x] 재고 수량 확인
- [ ] 구매 시 재고 차감
- [ ] 프로모션 재고 관리

### 4. 할인 계산
- [ ] 프로모션 할인 계산
- [ ] 멤버십 할인 계산
- [ ] 최종 금액 계산

### 5. 영수증 출력
- [ ] 구매 상품 내역 출력
- [ ] 증정 상품 내역 출력
- [ ] 금액 정보 출력





## 프로그래밍 요구 사항

- [ ] `Node.js 20.17.0` 버전에서 실행 가능해야 한다.

- [ ] package.json 파일은 변경할 수 없다.
    - 제공된 라이브러리와 스타일 라이브러리 이외의 외부 라이브러리 사용은 불가하다.

- [ ] 프로그래밍 요구 사항에서 달리 명시하지 않는 한 파일, 패키지 등의 이름을 바꾸거나 이동하지 않는다.

- [ ] 자바스크립트 코드 컨벤션을 지키면서 프로그래밍한다.
    - 기본적으로 [JavaScript Style Guide](https://github.com/airbnb/javascript)를 원칙으로 한다.

- [ ] indent(인덴트, 들여쓰기) depth를 3이 넘지 않도록 구현한다. 2까지만 허용한다.

- [ ] 3항 연산자를 쓰지 않는다.
 
- [ ] 함수(또는 메서드)가 한 가지 일만 하도록 최대한 작게 만들어라.

- [ ] Jest를 이용하여 정리한 기능 목록이 정상적으로 작동하는지 테스트 코드로 확인한다.

- [ ] 함수(또는 메서드)의 길이가 10라인을 넘어가지 않도록 구현한다.

- [ ] else를 지양한다.

- [ ] `@woowacourse/mission-utils`에서 제공하는 `Console` 및 `DateTimes` API를 사용하여 구현해야 한다.
    - 현재 날짜와 시간을 가져오려면 `DateTimes의 now()`를 활용한다.
사용자의 값을 입력 및 출력하려면 `Console.readLineAsync()`와 `Console.print()`를 활용한다.

- [ ] 입출력을 담당하는 클래스를 별도로 구현한다. 
    아래 InputView, OutputView 클래스를 참고하여 입출력 클래스를 구현한다.
    - 클래스 이름, 메소드 반환 유형, 시그니처 등은 자유롭게 수정할 수 있다.
  ```javascript
  const InputView = {
      async readItem() {
          const input = await MissionUtils.Console.readLineAsync("구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])");
          // ...
      }
      // ...
  }
  ```
  ```javascript
  const OutputView = {
      printProducts() {
          MissionUtils.Console.print("- 콜라 1,000원 10개 탄산2+1");
          // ...
      }
      // ...
  }
  ```

&nbsp;


### 프로그래밍 환경 설정

- [ ] `airbnb style guide` 로 코드 컨벤션 설정.
    - [ ] `ESLint` 세팅


&nbsp;



## 실행 요구 사항 및 제출 체크 리스트

- [ ] 프로그램 실행의 시작점은 App.js의 run().

- [ ] 프로그램 종료 시 process.exit()는 호출하지 않는다.

- [ ] 요구 사항에 명시된 출력 형식을 따르지 않으면 `0점`

- [ ] 테스트가 실패하면 점수가 `0점`이 되므로 제출하기 전에 반드시 확인한다.