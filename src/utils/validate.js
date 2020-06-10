/* 正整数 */
export function isPositiveInteger(str) {
  const reg = /^[0-9]+$/;
  return reg.test(str);
}
