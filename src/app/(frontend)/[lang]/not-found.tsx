import Link from 'next/link'
import React from 'react'
import { LogoMark } from '@/components/Logo'

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <LogoMark className="h-16 w-16 text-lapis-800" />
      <h1 className="mt-6 font-display text-4xl font-bold text-lapis-950">404</h1>
      <p className="mt-2 text-muted">Sahifa topilmadi · Page not found</p>
      <Link href="/uz" className="btn-lapis mt-6">
        Bosh sahifa
      </Link>
    </section>
  )
}
