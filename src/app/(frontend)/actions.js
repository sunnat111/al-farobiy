'use server'

/**
 * Form handlers. They run on the Next.js server and forward the form to the Python backend,
 * which checks every rule and saves the data. The result { ok, message, errors } goes back to the form.
 */
import { postForm } from '@/lib/api'

const str = (fd, key, max = 2000) => String(fd.get(key) ?? '').trim().slice(0, max)

const failed = (locale) => ({
  ok: false,
  message: locale === 'en' ? 'Something went wrong. Please try again later.' : 'Xatolik yuz berdi. Keyinroq qayta urinib koʻring.',
  errors: {},
})

async function send(name, body) {
  try {
    return await postForm(name, body)
  } catch (error) {
    console.error(error)
    return failed(body.locale)
  }
}

export async function submitEssay(_previous, fd) {
  return send('essay', {
    locale: str(fd, 'locale', 2),
    website: str(fd, 'website'),
    competition: Number(fd.get('competition')),
    fullName: str(fd, 'fullName', 200),
    email: str(fd, 'email', 200),
    phone: str(fd, 'phone', 100),
    age: Number(fd.get('age')) || null,
    region: str(fd, 'region', 120),
    school: str(fd, 'school', 200),
    essayTitle: str(fd, 'essayTitle', 300),
    essay: str(fd, 'essay', 40000),
    consent: fd.get('consent') === 'on',
  })
}

export async function submitProposal(_previous, fd) {
  return send('proposal', {
    locale: str(fd, 'locale', 2),
    website: str(fd, 'website'),
    topic: str(fd, 'topic', 300),
    description: str(fd, 'description', 3000),
    name: str(fd, 'name', 200),
    contact: str(fd, 'contact', 200),
    region: str(fd, 'region', 120),
  })
}

export async function submitMessage(_previous, fd) {
  return send('message', {
    locale: str(fd, 'locale', 2),
    website: str(fd, 'website'),
    name: str(fd, 'name', 200),
    email: str(fd, 'email', 200),
    reason: str(fd, 'reason', 20),
    subject: str(fd, 'subject', 300),
    message: str(fd, 'message', 5000),
  })
}
