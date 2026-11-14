'use client'

import { useEffect } from 'react'

/**
 * Static snapshot only (GitHub Pages): there is no server to answer Next.js client-side navigation,
 * so internal links do a normal full page load instead. Links that only change the query string
 * (library filters) keep working in place.
 */
export function StaticNav() {
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target)?.closest?.('a')
      if (!a || a.target === '_blank' || a.hasAttribute('download') || a.dataset.queryLink !== undefined) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return // same-page anchor
      e.preventDefault()
      e.stopPropagation()
      window.location.assign(url.href)
    }
    window.addEventListener('click', onClick, true)
    return () => window.removeEventListener('click', onClick, true)
  }, [])
  return null
}
