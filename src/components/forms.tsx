'use client'

import React, { useActionState, useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { submitEssay, submitMessage, submitProposal, type FormState } from '@/app/(frontend)/actions'
import type { Locale } from '@/i18n/dict'

const L = (locale: Locale, uz: string, en: string) => (locale === 'en' ? en : uz)

function Field({ name, label, error, children, hint }: { name: string; label: string; error?: string; children: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="label">
        {label}
      </label>
      {children}
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
      {error && <p className="mt-1 text-sm font-semibold text-terracotta-500">{error}</p>}
    </div>
  )
}

function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <input name="website" tabIndex={-1} autoComplete="off" />
    </div>
  )
}

function Result({ state }: { state: FormState }) {
  if (!state || state.ok) return null
  return <div className="rounded-lg bg-terracotta-50 px-4 py-3 text-sm font-semibold text-terracotta-700">{state.message}</div>
}

function Success({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-5 text-emerald-800">
      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" />
      <p className="font-semibold">{message}</p>
    </div>
  )
}

export function EssayForm({ locale, competitionId, minWords, maxWords }: { locale: Locale; competitionId: number; minWords: number; maxWords: number }) {
  const [state, action, pending] = useActionState(submitEssay, null)
  const [words, setWords] = useState(0)
  if (state?.ok) return <Success message={state.message} />
  const e = state?.errors ?? {}
  const inRange = words >= minWords && words <= maxWords
  return (
    <form action={action} className="relative grid gap-4">
      <Honeypot />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="competition" value={competitionId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="fullName" label={L(locale, 'Ism-familiya *', 'Full name *')} error={e.fullName}>
          <input id="fullName" name="fullName" className="field" required />
        </Field>
        <Field name="age" label={L(locale, 'Yoshingiz', 'Age')}>
          <input id="age" name="age" type="number" min={10} max={40} className="field" />
        </Field>
        <Field name="email" label="Email *" error={e.email}>
          <input id="email" name="email" type="email" className="field" required />
        </Field>
        <Field name="phone" label={L(locale, 'Telefon yoki Telegram', 'Phone or Telegram')}>
          <input id="phone" name="phone" className="field" placeholder="@username" />
        </Field>
        <Field name="region" label={L(locale, 'Viloyat / shahar', 'Region / city')}>
          <input id="region" name="region" className="field" />
        </Field>
        <Field name="school" label={L(locale, 'Maktab yoki OTM', 'School or university')}>
          <input id="school" name="school" className="field" />
        </Field>
      </div>
      <Field name="essayTitle" label={L(locale, 'Insho sarlavhasi *', 'Essay title *')} error={e.essayTitle}>
        <input id="essayTitle" name="essayTitle" className="field" required />
      </Field>
      <Field
        name="essay"
        label={L(locale, 'Insho matni *', 'Essay text *')}
        error={e.essay}
        hint={
          <span className={inRange ? 'font-semibold text-emerald-600' : ''}>
            {words} / {minWords}–{maxWords} {L(locale, 'soʻz', 'words')}
          </span>
        }
      >
        <textarea
          id="essay"
          name="essay"
          rows={14}
          className="field font-display text-[17px] leading-relaxed"
          required
          onChange={(ev) => setWords(ev.target.value.trim().split(/\s+/).filter(Boolean).length)}
        />
      </Field>
      <label className="flex items-start gap-2.5 text-sm text-muted">
        <input type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-lapis-700" />
        <span>
          {L(locale, 'Insho oʻzim tomonimdan yozilganini tasdiqlayman va tanlov qoidalariga roziman.', 'I confirm I wrote this essay myself and accept the competition rules.')}
          {e.consent && <span className="block font-semibold text-terracotta-500">{e.consent}</span>}
        </span>
      </label>
      <Result state={state} />
      <div>
        <button disabled={pending} className="btn-lapis disabled:opacity-60">
          <Send className="h-4 w-4" /> {pending ? L(locale, 'Yuborilmoqda…', 'Sending…') : L(locale, 'Inshoni yuborish', 'Submit essay')}
        </button>
      </div>
    </form>
  )
}

export function ProposalForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(submitProposal, null)
  if (state?.ok) return <Success message={state.message} />
  const e = state?.errors ?? {}
  return (
    <form action={action} className="relative grid gap-4">
      <Honeypot />
      <input type="hidden" name="locale" value={locale} />
      <Field name="topic" label={L(locale, 'Muhokama mavzusi *', 'Discussion topic *')} error={e.topic}>
        <input id="topic" name="topic" className="field" required />
      </Field>
      <Field name="description" label={L(locale, 'Nega bu mavzu muhim?', 'Why does it matter?')}>
        <textarea id="description" name="description" rows={4} className="field" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field name="name" label={L(locale, 'Ism *', 'Name *')} error={e.name}>
          <input id="name" name="name" className="field" required />
        </Field>
        <Field name="contact" label={L(locale, 'Email yoki Telegram *', 'Email or Telegram *')} error={e.contact}>
          <input id="contact" name="contact" className="field" required />
        </Field>
        <Field name="region" label={L(locale, 'Viloyat', 'Region')}>
          <input id="region" name="region" className="field" />
        </Field>
      </div>
      <Result state={state} />
      <div>
        <button disabled={pending} className="btn-lapis disabled:opacity-60">
          <Send className="h-4 w-4" /> {pending ? L(locale, 'Yuborilmoqda…', 'Sending…') : L(locale, 'Taklif yuborish', 'Send proposal')}
        </button>
      </div>
    </form>
  )
}

export function ContactForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(submitMessage, null)
  if (state?.ok) return <Success message={state.message} />
  const e = state?.errors ?? {}
  return (
    <form action={action} className="relative grid gap-4">
      <Honeypot />
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label={L(locale, 'Ism *', 'Name *')} error={e.name}>
          <input id="name" name="name" className="field" required />
        </Field>
        <Field name="email" label="Email *" error={e.email}>
          <input id="email" name="email" type="email" className="field" required />
        </Field>
      </div>
      <Field name="reason" label={L(locale, 'Murojaat turi', 'Reason')}>
        <select id="reason" name="reason" className="field">
          <option value="general">{L(locale, 'Umumiy savol', 'General question')}</option>
          <option value="partnership">{L(locale, 'Hamkorlik', 'Partnership')}</option>
          <option value="publish">{L(locale, 'Maqola yoki tahlilnoma yuborish', 'Submit a paper or brief')}</option>
          <option value="volunteer">{L(locale, 'Mentor yoki koʻngilli boʻlish', 'Become a mentor or volunteer')}</option>
        </select>
      </Field>
      <Field name="subject" label={L(locale, 'Mavzu *', 'Subject *')} error={e.subject}>
        <input id="subject" name="subject" className="field" required />
      </Field>
      <Field name="message" label={L(locale, 'Xabar *', 'Message *')} error={e.message}>
        <textarea id="message" name="message" rows={5} className="field" required />
      </Field>
      <Result state={state} />
      <div>
        <button disabled={pending} className="btn-lapis disabled:opacity-60">
          <Send className="h-4 w-4" /> {pending ? L(locale, 'Yuborilmoqda…', 'Sending…') : L(locale, 'Yuborish', 'Send')}
        </button>
      </div>
    </form>
  )
}
