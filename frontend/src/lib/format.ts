const wholeUsd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const exactUsd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const numberFormat = new Intl.NumberFormat("en-US")

export function formatMoney(value: number, digits: 0 | 2 = 0) {
  return (digits === 0 ? wholeUsd : exactUsd).format(value)
}

export function formatNumber(value: number) {
  return numberFormat.format(value)
}

export function formatRoas(value: number) {
  return `${value.toFixed(2)}x`
}

export function formatPercent(value: number) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(1)}%`
}
