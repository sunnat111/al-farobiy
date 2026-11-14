const monthsUz = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const TZ_OFFSET = 5 * 60 // Asia/Tashkent, UTC+5, no DST

function tashkent(d) {
  const date = typeof d === 'string' ? new Date(d) : d
  return new Date(date.getTime() + TZ_OFFSET * 60_000)
}

export function formatDate(d, locale, opts = {}) {
  if (!d) return ''
  const t = tashkent(d)
  const day = t.getUTCDate()
  const month = (locale === 'uz' ? monthsUz : monthsEn)[t.getUTCMonth()]
  const year = t.getUTCFullYear()
  const showYear = opts.year ?? true
  const time = opts.time ? `, ${String(t.getUTCHours()).padStart(2, '0')}:${String(t.getUTCMinutes()).padStart(2, '0')}` : ''
  if (locale === 'uz') return `${showYear ? `${year}-yil ` : ''}${day}-${month}${time}`
  return `${day} ${month}${showYear ? ` ${year}` : ''}${time}`
}

export function dayMonth(d, locale) {
  const t = tashkent(d)
  return { day: t.getUTCDate(), month: (locale === 'uz' ? monthsUz : monthsEn)[t.getUTCMonth()].slice(0, 3) }
}

export function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function isPast(d) {
  return d ? new Date(d).getTime() < Date.now() : false
}
