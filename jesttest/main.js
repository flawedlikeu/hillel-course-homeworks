function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Очікував ${expected}, отримав ${actual}`);
      }
    },
  };
}

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (error) {
    console.log(`❌ ${name}\n   ${error.message}`);
  }
}

function getAgeCategory(age) {
  if (typeof age !== 'number' || Number.isNaN(age) || age < 0) {
    return 'некоректний вік';
  }
  if (age <= 12) return 'дитина';
  if (age <= 17) return 'підліток';
  if (age <= 64) return 'дорослий';
  return 'пенсіонер';
}

function calculateTotal(price, quantity, discount = 0) {
  if (price < 0 || quantity < 0 || discount > 100) {
    return null;
  }
  const total = price * quantity;
  return total - (total * discount) / 100;
}

test('getAgeCategory(5) → "дитина"', () => {
  expect(getAgeCategory(5)).toBe('дитина');
});

test('getAgeCategory(12) → "дитина" (верхня межа)', () => {
  expect(getAgeCategory(12)).toBe('дитина');
});

test('getAgeCategory(13) → "підліток" (нижня межа)', () => {
  expect(getAgeCategory(13)).toBe('підліток');
});

test('getAgeCategory(17) → "підліток" (верхня межа)', () => {
  expect(getAgeCategory(17)).toBe('підліток');
});

test('getAgeCategory(18) → "дорослий" (нижня межа)', () => {
  expect(getAgeCategory(18)).toBe('дорослий');
});

test('getAgeCategory(64) → "дорослий" (верхня межа)', () => {
  expect(getAgeCategory(64)).toBe('дорослий');
});

test('getAgeCategory(65) → "пенсіонер" (нижня межа)', () => {
  expect(getAgeCategory(65)).toBe('пенсіонер');
});

test('getAgeCategory(90) → "пенсіонер"', () => {
  expect(getAgeCategory(90)).toBe('пенсіонер');
});

test('getAgeCategory(-1) → "некоректний вік"', () => {
  expect(getAgeCategory(-1)).toBe('некоректний вік');
});

test('getAgeCategory("abc") → "некоректний вік"', () => {
  expect(getAgeCategory('abc')).toBe('некоректний вік');
});

test('getAgeCategory(NaN) → "некоректний вік"', () => {
  expect(getAgeCategory(NaN)).toBe('некоректний вік');
});

test('calculateTotal(100, 3) → 300 (без знижки)', () => {
  expect(calculateTotal(100, 3)).toBe(300);
});

test('calculateTotal(100, 3, 10) → 270 (знижка 10%)', () => {
  expect(calculateTotal(100, 3, 10)).toBe(270);
});

test('calculateTotal(100, 3, 0) → 300 (знижка 0%)', () => {
  expect(calculateTotal(100, 3, 0)).toBe(300);
});

test('calculateTotal(100, 3, 100) → 0 (знижка 100%)', () => {
  expect(calculateTotal(100, 3, 100)).toBe(0);
});

test('calculateTotal(100, 0) → 0 (кількість 0)', () => {
  expect(calculateTotal(100, 0)).toBe(0);
});

test('calculateTotal(-100, 3) → null (від\'ємна ціна)', () => {
  expect(calculateTotal(-100, 3)).toBe(null);
});

test('calculateTotal(100, -3) → null (від\'ємна кількість)', () => {
  expect(calculateTotal(100, -3)).toBe(null);
});

test('calculateTotal(100, 3, 101) → null (знижка більша за 100)', () => {
  expect(calculateTotal(100, 3, 101)).toBe(null);
});