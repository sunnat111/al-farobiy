import React from 'react'

const tips = [
  ['Yangi material qoʻshish', 'Chap menyudan boʻlimni tanlang (masalan “Kurslar” yoki “Nashrlar”) va “Create New” tugmasini bosing.'],
  ['Qoralama va eʼlon qilish', '“Save Draft” — saytda koʻrinmaydi. “Publish changes” — darhol saytda chiqadi.'],
  ['Ikki til', 'Yuqoridagi “Locale” tugmasi orqali oʻzbekcha va inglizcha matnni alohida kiriting. Inglizchasi boʻsh boʻlsa, oʻzbekchasi koʻrsatiladi.'],
  ['Kiruvchi murojaatlar', '“Topshirilgan insholar”, “Muhokama uchun takliflar” va “Aloqa xabarlari” — saytdagi formalardan keladi.'],
]

export const Welcome = () => (
  <div
    style={{
      border: '1px solid var(--theme-elevation-150)',
      borderRadius: 8,
      padding: '20px 24px',
      marginBottom: 24,
      background: 'var(--theme-elevation-50)',
    }}
  >
    <h3 style={{ margin: '0 0 6px' }}>Xush kelibsiz! 👋</h3>
    <p style={{ margin: '0 0 14px', opacity: 0.8 }}>
      Bu yerda saytdagi barcha maʼlumotlarni qoʻshish va tahrirlash mumkin. Qisqa yoʻriqnoma:
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
      {tips.map(([t, d]) => (
        <div key={t}>
          <strong>{t}</strong>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>{d}</div>
        </div>
      ))}
    </div>
    <p style={{ margin: '14px 0 0', fontSize: 13 }}>
      <a href="/uz" target="_blank" rel="noreferrer">
        Saytni yangi oynada ochish →
      </a>
    </p>
  </div>
)
