/**
 * 字库主题分类配置
 *
 * 将字库中的汉字按语义划分为多个主题分类，用于字库查阅页面的标签筛选。
 * 每个分类包含唯一标识 key、显示标签 label 以及所包含的汉字数组 characters。
 * "all" 为特殊分类，characters 为空数组，表示不进行分类过滤、展示字库全集。
 * 各非 "all" 分类的 characters 并集须覆盖字库全集，以确保任何汉字至少属于一个分类。
 */

/** 单个主题分类条目 */
export interface CategoryItem {
  /** 分类唯一标识，如 "number"、"direction" */
  key: string
  /** 分类显示名称，如 "数字"、"方位" */
  label: string
  /** 该分类下包含的汉字列表 */
  characters: string[]
}

/**
 * 全部主题分类列表
 *
 * 第一项固定为 "all"（全部），其余按语义分组。
 * 新增字库汉字时，须将其归入至少一个非 "all" 分类，以保证并集覆盖字库全集。
 */
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
  {
    key: 'adjective',
    label: '形容',
    characters: ['大', '小', '多', '少', '长', '短', '高', '低'],
  },
  {
    key: 'action',
    label: '动作',
    characters: ['来', '去', '行', '走', '看', '听', '说', '读', '写'],
  },
  {
    key: 'blessing',
    label: '吉祥',
    characters: ['好', '美', '爱', '和', '平', '安', '福', '寿', '喜'],
  },
  {
    key: 'life',
    label: '生活',
    characters: ['衣', '食', '住', '活'],
  },
  {
    key: 'society',
    label: '社会',
    characters: ['国', '工', '农', '商', '医', '师'],
  },
  {
    key: 'time',
    label: '时间',
    characters: ['时', '间', '年', '岁', '今', '昨', '早', '晚'],
  },
]

/**
 * 根据分类 key 获取该分类下的汉字列表
 *
 * @param categoryKey - 分类唯一标识
 * @returns 对应分类的汉字数组；若 key 不存在则返回空数组
 */
export function getCharactersByCategory(categoryKey: string): string[] {
  const category = categories.find((c) => c.key === categoryKey)
  return category ? category.characters : []
}

/**
 * 判断指定汉字是否属于给定分类
 *
 * 当 categoryKey 为 "all" 时始终返回 true（不过滤）。
 * 否则在对应分类的 characters 列表中查找该汉字。
 *
 * @param char - 待判断的单个汉字
 * @param categoryKey - 分类唯一标识
 * @returns 该汉字是否属于指定分类
 */
export function isCharacterInCategory(char: string, categoryKey: string): boolean {
  if (categoryKey === 'all') return true
  const chars = getCharactersByCategory(categoryKey)
  return chars.includes(char)
}

/**
 * 根据分类 key 获取分类的显示名称
 *
 * @param categoryKey - 分类唯一标识
 * @returns 对应分类的显示名称；若 key 不存在则返回空字符串
 */
export function getCategoryLabel(categoryKey: string): string {
  const category = categories.find((c) => c.key === categoryKey)
  return category ? category.label : ''
}
