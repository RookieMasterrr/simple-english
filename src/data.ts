interface word {
  id: number
  content: string
  translation: string
  voice?: string
}

export const words: word[] = [
  { id: 1, content: 'hello', translation: '你好' },
  { id: 2, content: 'world', translation: '世界' },
  { id: 3, content: 'practice', translation: '联系' },
  { id: 4, content: 'make', translation: '做' },
  { id: 5, content: 'perfect', translation: '完美' },
]
