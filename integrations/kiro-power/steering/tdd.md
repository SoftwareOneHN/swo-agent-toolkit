---
inclusion: manual
---

# TDD Workflow (Red-Green-Refactor)

## Khi nào dùng
- User yêu cầu viết test
- User nói "tdd", "unit test", "test first"
- Tạo feature mới (luôn TDD)
- Fix bug (viết failing test trước)

## Iron Law (P0)

> **KHÔNG CÓ PRODUCTION CODE MÀ KHÔNG CÓ FAILING TEST TRƯỚC.**
> Code viết trước test → XOÁ. Làm lại.

## The Loop

### 🔴 RED — Write Failing Test

1. Viết test MINIMAL — chỉ test 1 behavior
2. Chạy test → verify nó FAIL
3. Verify failure là EXPECTED (không phải typo/import error)
4. Failure message phải có ý nghĩa

```typescript
// ✅ Good — clear intent
it('should reject login with expired token', () => {
  const expired = createToken({ exp: pastDate });
  expect(() => auth.verify(expired)).toThrow('TOKEN_EXPIRED');
});
```

### 🟢 GREEN — Write Simplest Code

1. Viết code ĐƠN GIẢN NHẤT để pass test
2. Không optimize, không thêm features
3. Chạy test → verify PASS
4. YAGNI — chỉ code cho test hiện tại

### 🔵 REFACTOR — Clean While Green

1. Clean up code (extract, rename, simplify)
2. Chạy test SAU MỖI refactor step
3. Nếu test fail → revert refactor step đó
4. Không thêm behavior mới trong refactor

## Test Structure: AAA (Mandatory)

Mọi test PHẢI theo Arrange-Act-Assert:

```typescript
it('should calculate total with discount', () => {
  // Arrange
  const cart = new Cart();
  cart.add(item({ price: 100 }));
  const discount = Discount.percent(10);

  // Act
  const total = cart.calculateTotal(discount);

  // Assert
  expect(total).toBe(90);
});
```

## Coverage Thresholds

| Metric | Minimum |
|--------|---------|
| Statement | 80% |
| Function | 80% |
| Line | 80% |
| Branch | 75% |

## Mock Rules

| ALWAYS Mock | NEVER Mock |
|-------------|------------|
| HTTP calls / external APIs | Fast internal services (<200ms) |
| Time/Date (use fake timers) | Pure domain logic |
| Filesystem I/O | Simple data transformations |
| Random/UUID generation | Value objects |

## Completion Checklist

- [ ] Mỗi function/method mới có failing test trước?
- [ ] Failure messages đúng expected (không phải typo)?
- [ ] Code minimal — chỉ đủ pass test?
- [ ] AAA structure trong mọi tests?
- [ ] Coverage thresholds đạt?
- [ ] Không có test-after (viết test sau code)?

## Anti-Patterns

| Pattern | Vấn đề | Fix |
|---------|--------|-----|
| Test-after | Defeats TDD purpose | Delete code, write test first |
| No assertion | Test không verify gì | Add meaningful assert |
| Testing implementation | Brittle, breaks on refactor | Test behavior/contract |
| God test | 1 test verify 10 things | Split into focused tests |
| Flaky test | Random pass/fail | Fix timing, mock externals |
