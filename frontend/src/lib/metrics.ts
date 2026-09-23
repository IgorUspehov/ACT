export function cpa(spend: number, purchases: number) {
  return purchases === 0 ? null : spend / purchases
}

export function roas(revenue: number, spend: number) {
  return spend === 0 ? null : revenue / spend
}
