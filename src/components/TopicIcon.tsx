import React from 'react'
import { BookOpen, Coins, Flag, Globe, Landmark, MoonStar, Scale, Users } from 'lucide-react'
import type { Topic } from '@/payload-types'

const icons = { landmark: Landmark, scale: Scale, coins: Coins, 'book-open': BookOpen, 'moon-star': MoonStar, flag: Flag, globe: Globe, users: Users }
const tones: Record<string, string> = {
  lapis: 'bg-lapis-50 text-lapis-700',
  turquoise: 'bg-turquoise-50 text-turquoise-700',
  gold: 'bg-gold-50 text-gold-700',
  terracotta: 'bg-terracotta-50 text-terracotta-700',
  emerald: 'bg-emerald-50 text-emerald-800',
  plum: 'bg-plum-50 text-plum-800',
}

export function TopicIcon({ topic, size = 'md' }: { topic: Topic; size?: 'md' | 'lg' }) {
  const Icon = icons[(topic.icon ?? 'book-open') as keyof typeof icons] ?? BookOpen
  const box = size === 'lg' ? 'h-14 w-14 rounded-2xl' : 'h-11 w-11 rounded-xl'
  return (
    <span className={`grid place-items-center ${box} ${tones[topic.color ?? 'lapis']}`}>
      <Icon className={size === 'lg' ? 'h-7 w-7' : 'h-5 w-5'} />
    </span>
  )
}
