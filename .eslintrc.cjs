module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Airbnb 기본 스타일 설정
    'no-var': 'error', // var 사용 금지, let이나 const 사용
    'prefer-const': 'error', // const 사용 권장
    'arrow-parens': ['error', 'always'], // 화살표 함수 매개변수 괄호 항상 사용
    'prefer-template': 'error', // 문자열 연결 대신 템플릿 리터럴 사용
    'object-curly-newline': ['error', { consistent: true }], // 중괄호 안에서 줄바꿈 규칙
    'comma-dangle': ['error', 'always-multiline'], // 여러 줄일 때 마지막에 쉼표 허용
    'no-console': 'warn', // console.log는 경고로 표시
    'no-alert': 'error', // alert, confirm, prompt 사용 금지
    'consistent-return': 'error', // 일관된 반환 값 강제
    'no-redeclare': 'error', // 동일한 변수 재선언 금지
    'default-case': 'error', // switch문에서 default case 강제
    'no-shadow': 'error', // 변수 이름이 상위 스코프의 변수와 겹치는 것 금지
    'no-use-before-define': 'error', // 변수를 정의하기 전에 사용 금지
    'func-names': 'warn', // 익명 함수 대신 이름을 명시하도록 경고
    'import/order': ['error', { groups: ['builtin', 'external', 'internal'] }], // import 순서 정리
    'prefer-arrow-callback': 'error', // 콜백에 화살표 함수 사용 권장
    'spaced-comment': ['error', 'always'], // 주석 앞에 공백 추가

    // 과제 요구사항 추가 규칙
    'max-depth': ['error', 2], // 들여쓰기 깊이 2로 제한
    'max-lines-per-function': ['error', 10], // 함수 길이 최대 10줄로 제한
    'no-ternary': 'error', // 삼항 연산자 사용 금지
  },
};