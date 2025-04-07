interface word {
  id: number
  content: string
  translation: string
  pronunciation?: string
  voiceUrl?: string
}

export const words: word[] = [
  {
    id: 1,
    content: 'hello',
    translation: '你好',
    voiceUrl:
      'https://dictionary.cambridge.org/media/english-chinese-traditional/us_pron/h/hel/hello/hello.mp3',
  },
  {
    id: 2,
    content: 'world',
    translation: '世界',
    voiceUrl:
      'https://dictionary.cambridge.org/media/english-chinese-traditional/us_pron/w/wor/world/world.mp3',
  },
  {
    id: 3,
    content: 'practice',
    translation: '练习',
    voiceUrl:
      'https://dictionary.cambridge.org/media/english-chinese-traditional/us_pron/p/pra/pract/practice.mp3',
  },
  {
    id: 4,
    content: 'make',
    translation: '做',
  },
  {
    id: 5,
    content: 'perfect',
    translation: '完美',
  },
]
