export interface PresetPhrase {
  text: string
  category: 'slogan' | 'poetry'
}

export const presetPhrases: PresetPhrase[] = [
  { text: '不忘初心，方得始终', category: 'slogan' },
  { text: '砥砺前行，再创辉煌', category: 'slogan' },
  { text: '团结奋进，开拓创新', category: 'slogan' },
  { text: '精益求精，追求卓越', category: 'slogan' },
  { text: '匠心筑梦，品质致远', category: 'slogan' },
  { text: '厚德载物，自强不息', category: 'slogan' },
  { text: '知行合一，止于至善', category: 'slogan' },
  { text: '守正创新，笃行不怠', category: 'slogan' },
  { text: '海内存知己，天涯若比邻', category: 'poetry' },
  { text: '会当凌绝顶，一览众山小', category: 'poetry' },
  { text: '明月几时有，把酒问青天', category: 'poetry' },
  { text: '大漠孤烟直，长河落日圆', category: 'poetry' },
  { text: '采菊东篱下，悠然见南山', category: 'poetry' },
  { text: '落霞与孤鹜齐飞', category: 'poetry' },
  { text: '人生自古谁无死', category: 'poetry' },
  { text: '长风破浪会有时', category: 'poetry' },
  { text: '天生我材必有用', category: 'poetry' },
  { text: '千金散尽还复来', category: 'poetry' },
]
