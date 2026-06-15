export interface CategoryItem {
  key: string
  label: string
  characters: string[]
}

export const categories: CategoryItem[] = [
  {
    key: 'all',
    label: '全部',
    characters: [],
  },
  {
    key: 'number',
    label: '数字',
    characters: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万'],
  },
  {
    key: 'direction',
    label: '方位',
    characters: ['东', '南', '西', '北', '中', '上', '下', '左', '右', '前', '后'],
  },
  {
    key: 'nature',
    label: '自然',
    characters: [
      '天', '地', '日', '月', '水', '火', '木', '金', '土',
      '山', '石', '田', '风', '雨', '云', '雪',
      '春', '夏', '秋', '冬',
      '江', '河', '海', '湖',
    ],
  },
  {
    key: 'plant',
    label: '植物',
    characters: ['禾', '米', '竹', '草', '花', '树', '林'],
  },
  {
    key: 'family',
    label: '家庭',
    characters: ['家', '父', '母', '子', '女', '兄', '弟', '姐', '妹', '亲', '友'],
  },
  {
    key: 'body',
    label: '人体',
    characters: ['人', '心', '手', '足', '目', '耳', '口', '头', '身'],
  },
  {
    key: 'culture',
    label: '文化',
    characters: ['学', '生', '书', '文', '字', '画', '诗', '词', '歌', '乐'],
  },
  {
    key: 'printing',
    label: '印刷',
    characters: ['印', '刷', '纸', '墨', '笔', '排', '版'],
  },
  {
    key: 'color',
    label: '色彩',
    characters: ['红', '黄', '蓝', '绿', '白', '黑', '光', '明', '暗'],
  },
  {
    key: 'building',
    label: '建筑',
    characters: ['城', '乡', '路', '桥', '门', '窗', '屋', '床', '桌', '椅'],
  },
]

export function getCharactersByCategory(categoryKey: string): string[] {
  const category = categories.find((c) => c.key === categoryKey)
  return category ? category.characters : []
}

export function isCharacterInCategory(char: string, categoryKey: string): boolean {
  if (categoryKey === 'all') return true
  const chars = getCharactersByCategory(categoryKey)
  return chars.includes(char)
}
