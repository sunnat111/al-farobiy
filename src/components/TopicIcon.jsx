import React from 'react'
import { BookOpen, Coins, Flag, Globe, Landmark, MoonStar, Scale, Users } from 'lucide-react'

const icons = { landmark: Landmark, scale: Scale, coins: Coins, 'book-open': BookOpen, 'moon-star': MoonStar, flag: Flag, globe: Globe, users: Users }
const tones = {
  lapis: 'bg-lapis-50 text-lapis-700',
  turquoise: 'bg-turquoise-50 text-turquoise-700',
  gold: 'bg-gold-50 text-gold-700',
  terracotta: 'bg-terracotta-50 text-terracotta-700',
  emerald: 'bg-emerald-50 text-emerald-800',
  plum: 'bg-plum-50 text-plum-800',
}

export function TopicIcon({ topic, size = 'md' }) {
  const Icon = icons[(topic.icon ?? 'book-open')] ?? BookOpen
  const box = size === 'lg' ? 'h-14 w-14 rounded-2xl' : 'h-11 w-11 rounded-xl'
  return (
    <span className={`grid place-items-center ${box} ${tones[topic.color ?? 'lapis']}`}>
      <Icon className={size === 'lg' ? 'h-7 w-7' : 'h-5 w-5'} />
    </span>
  )
}
