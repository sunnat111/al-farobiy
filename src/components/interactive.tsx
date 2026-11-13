'use client'

import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'

export function Countdown({ to, labels }: { to: string; labels: { days: string; hours: string; minutes: string; seconds: string } }) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = Math.max(0, new Date(to).getTime() - (now ?? new Date(to).getTime()))
  const parts = [
    [Math.floor(diff / 86400000), labels.days],
    [Math.floor((diff / 3600000) % 24), labels.hours],
    [Math.floor((diff / 60000) % 60), labels.minutes],
    [Math.floor((diff / 1000) % 60), labels.seconds],
  ] as const
  return (
    <div className="flex gap-2" suppressHydrationWarning>
      {parts.map(([v, l]) => (
        <div key={l} className="min-w-[64px] rounded-xl bg-white/10 px-3 py-2 text-center ring-1 ring-white/15">
          <div className="font-display text-2xl font-bold tabular-nums text-white">{now === null ? '–' : String(v).padStart(2, '0')}</div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-lapis-200">{l}</div>
        </div>
      ))}
    </div>
  )
}

type Q = { question: string; options: string[]; correct: number; explanation?: string | null }

export function Quiz({ questions, labels }: { questions: Q[]; labels: { check: string; retry: string; score: string } }) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [checked, setChecked] = useState(false)
  const score = questions.filter((q, i) => answers[i] === q.correct).length
  return (
    <div className="space-y-5">
      {questions.map((q, i) => (
        <fieldset key={i} className="card p-5">
          <legend className="sr-only">{q.question}</legend>
          <p className="font-display text-lg font-bold text-lapis-900">
            {i + 1}. {q.question}
          </p>
          <div className="mt-3 grid gap-2">
            {q.options.map((o, j) => {
              const n = j + 1
              const selected = answers[i] === n
              const isRight = checked && n === q.correct
              const isWrong = checked && selected && n !== q.correct
              return (
                <label
                  key={j}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-2.5 text-[15px] transition ${
                    isRight ? 'border-emerald-600 bg-emerald-50' : isWrong ? 'border-terracotta-500 bg-terracotta-50' : selected ? 'border-lapis-400 bg-lapis-50' : 'border-line hover:border-lapis-200'
                  }`}
                >
                  <input type="radio" name={`q${i}`} className="accent-lapis-700" checked={selected} disabled={checked} onChange={() => setAnswers((a) => ({ ...a, [i]: n }))} />
                  <span className="flex-1">{o}</span>
                  {isRight && <Check className="h-4 w-4 text-emerald-600" />}
                  {isWrong && <X className="h-4 w-4 text-terracotta-500" />}
                </label>
              )
            })}
          </div>
          {checked && q.explanation && <p className="mt-3 rounded-lg bg-sand px-3.5 py-2.5 text-sm text-ink/80">{q.explanation}</p>}
        </fieldset>
      ))}
      <div className="flex flex-wrap items-center gap-4">
        {!checked ? (
          <button className="btn-lapis" onClick={() => setChecked(true)} disabled={Object.keys(answers).length < questions.length}>
            {labels.check}
          </button>
        ) : (
          <>
            <span className="font-display text-xl font-bold text-lapis-900">
              {labels.score}: {score} / {questions.length}
            </span>
            <button
              className="btn-ghost"
              onClick={() => {
                setAnswers({})
                setChecked(false)
              }}
            >
              <RotateCcw className="h-4 w-4" /> {labels.retry}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/** A <select> that updates the URL query string on change (library filters). */
export function FilterSelect({ name, value, options, label }: { name: string; value: string; options: { value: string; label: string }[]; label: string }) {
  const params = useSearchParams()
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted">{label}</span>
      <select
        className="field py-2"
        value={value}
        onChange={(e) => {
          const p = new URLSearchParams(params?.toString())
          if (e.target.value) p.set(name, e.target.value)
          else p.delete(name)
          // update the URL in place; the list filters itself in the browser (works on static hosting too)
          window.history.pushState(null, '', `${window.location.pathname}${p.size ? `?${p}` : ''}`)
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function ShareButton({ label }: { label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      className="btn-ghost"
      onClick={async () => {
        const url = window.location.href
        if (navigator.share) {
          try {
            await navigator.share({ url, title: document.title })
            return
          } catch {
            /* ignore */
          }
        }
        await navigator.clipboard?.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
      }}
    >
      {copied ? '✓' : label}
    </button>
  )
}

/** Link that only changes the query string in place (no page request). */
export function QueryLink({ query, className, children }: { query: string; className?: string; children: React.ReactNode }) {
  return (
    <a
      href={query || '?'}
      data-query-link=""
      className={className}
      onClick={(e) => {
        e.preventDefault()
        window.history.pushState(null, '', `${window.location.pathname}${query}`)
      }}
    >
      {children}
    </a>
  )
}
