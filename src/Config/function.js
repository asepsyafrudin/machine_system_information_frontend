//roundFormat
export const round = (n, dp) => {
  const h = +"1".padEnd(dp + 1, "0"); // 10 or 100 or 1000 or etc
  return Math.round(n * h) / h;
};
