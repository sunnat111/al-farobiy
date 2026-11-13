'use server'

import { getClient } from '@/lib/payload'
import { wordCount } from '@/lib/format'

export type FormState = { ok: boolean; message: string; errors?: Record<string, string> } | null

const str = (fd: FormData, k: string, max = 2000) => String(fd.get(k) ?? '').trim().slice(0, max)
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

function msg(locale: string, uz: string, en: string) {
  return locale === 'en' ? en : uz
}

export async function submitEssay(_: FormState, fd: FormData): Promise<FormState> {
  const locale = str(fd, 'locale', 2)
  if (str(fd, 'website')) return { ok: true, message: 'ok' } // honeypot
  const competitionId = Number(fd.get('competition'))
  const data = {
    fullName: str(fd, 'fullName', 120),
    email: str(fd, 'email', 160),
    phone: str(fd, 'phone', 60),
    age: Number(fd.get('age')) || undefined,
    region: str(fd, 'region', 80),
    school: str(fd, 'school', 160),
    essayTitle: str(fd, 'essayTitle', 200),
    essay: str(fd, 'essay', 40000),
  }
  const errors: Record<string, string> = {}
  if (!data.fullName) errors.fullName = msg(locale, 'Ismingizni kiriting', 'Enter your name')
  if (!isEmail(data.email)) errors.email = msg(locale, 'Email notoʻgʻri', 'Invalid email')
  if (!data.essayTitle) errors.essayTitle = msg(locale, 'Sarlavha kiriting', 'Enter a title')
  if (fd.get('consent') !== 'on') errors.consent = msg(locale, 'Qoidalarga rozilik bildiring', 'Please accept the rules')

  const payload = await getClient()
  const comp = await payload.findByID({ collection: 'competitions', id: competitionId, depth: 0 }).catch(() => null)
  if (!comp || comp._status !== 'published' || !comp.acceptSubmissions || new Date(comp.deadline).getTime() < Date.now()) {
    return { ok: false, message: msg(locale, 'Bu tanlovga insho qabul qilish yakunlangan.', 'This competition is no longer accepting essays.') }
  }
  const words = wordCount(data.essay)
  const min = comp.minWords ?? 0
  const max = comp.maxWords ?? 100000
  if (words < min || words > max) {
    errors.essay = msg(locale, `Insho ${min}–${max} soʻz boʻlishi kerak (hozir ${words}).`, `Essay must be ${min}–${max} words (now ${words}).`)
  }
  if (Object.keys(errors).length) return { ok: false, message: msg(locale, 'Formani tekshiring.', 'Please check the form.'), errors }

  const dup = await payload.count({ collection: 'submissions', where: { and: [{ competition: { equals: competitionId } }, { email: { equals: data.email } }] } })
  if (dup.totalDocs > 0) {
    return { ok: false, message: msg(locale, 'Bu email bilan ushbu tanlovga insho allaqachon yuborilgan.', 'An essay with this email was already submitted to this competition.') }
  }

  await payload.create({ collection: 'submissions', data: { ...data, competition: competitionId, wordCount: words, status: 'new' } })
  return {
    ok: true,
    message: msg(locale, 'Rahmat! Inshoingiz qabul qilindi. Natijalar tanlov sahifasida eʼlon qilinadi.', 'Thank you! Your essay has been received. Results will be announced on the competition page.'),
  }
}

export async function submitProposal(_: FormState, fd: FormData): Promise<FormState> {
  const locale = str(fd, 'locale', 2)
  if (str(fd, 'website')) return { ok: true, message: 'ok' }
  const data = { topic: str(fd, 'topic', 200), description: str(fd, 'description', 3000), name: str(fd, 'name', 120), contact: str(fd, 'contact', 160), region: str(fd, 'region', 80) }
  const errors: Record<string, string> = {}
  if (!data.topic) errors.topic = msg(locale, 'Mavzuni yozing', 'Enter a topic')
  if (!data.name) errors.name = msg(locale, 'Ismingizni kiriting', 'Enter your name')
  if (!data.contact) errors.contact = msg(locale, 'Aloqa uchun maʼlumot kiriting', 'Enter a contact')
  if (Object.keys(errors).length) return { ok: false, message: msg(locale, 'Formani tekshiring.', 'Please check the form.'), errors }
  const payload = await getClient()
  await payload.create({ collection: 'proposals', data: { ...data, status: 'new' } })
  return { ok: true, message: msg(locale, 'Rahmat! Taklifingiz jamoaga yuborildi.', 'Thank you! Your proposal was sent to the team.') }
}

export async function submitMessage(_: FormState, fd: FormData): Promise<FormState> {
  const locale = str(fd, 'locale', 2)
  if (str(fd, 'website')) return { ok: true, message: 'ok' }
  const reason = str(fd, 'reason', 20)
  const data = {
    name: str(fd, 'name', 120),
    email: str(fd, 'email', 160),
    subject: str(fd, 'subject', 200),
    message: str(fd, 'message', 5000),
    reason: (['general', 'partnership', 'publish', 'volunteer'].includes(reason) ? reason : 'general') as 'general' | 'partnership' | 'publish' | 'volunteer',
  }
  const errors: Record<string, string> = {}
  if (!data.name) errors.name = msg(locale, 'Ismingizni kiriting', 'Enter your name')
  if (!isEmail(data.email)) errors.email = msg(locale, 'Email notoʻgʻri', 'Invalid email')
  if (!data.subject) errors.subject = msg(locale, 'Mavzuni yozing', 'Enter a subject')
  if (data.message.length < 10) errors.message = msg(locale, 'Xabar juda qisqa', 'Message is too short')
  if (Object.keys(errors).length) return { ok: false, message: msg(locale, 'Formani tekshiring.', 'Please check the form.'), errors }
  const payload = await getClient()
  await payload.create({ collection: 'messages', data: { ...data, status: 'new' } })
  return { ok: true, message: msg(locale, 'Xabaringiz yuborildi. Tez orada javob beramiz!', 'Your message was sent. We will reply soon!') }
}
