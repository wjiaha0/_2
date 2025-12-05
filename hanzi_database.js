/**
 * 汉字学习网站 - 汉字数据库
 * 本文件包含所有汉字数据，与主逻辑分离以便轻松扩展
 * 格式说明：
 *   char: 汉字字符
 *   pinyin: 拼音（带声调）
 *   phrase: 常用词组（用顿号分隔）
 *   meaning: 英文释义（可选）
 *   category: 分类（可选，用于分组学习）
 *   strokes: 笔画数（可选）
 *   radical: 部首（可选）
 */

// 基础汉字数据库（初学者级别）
const hanziDatabase = [
  {
    char: "人",
    pinyin: "rén",
    phrase: "人们、大人、个人",
    meaning: "person, people",
    category: "基础",
    strokes: 2,
    radical: "人"
  },
  {
    char: "大",
    pinyin: "dà",
    phrase: "大小、大学、大家",
    meaning: "big, large, great",
    category: "基础",
    strokes: 3,
    radical: "大"
  },
  {
    char: "中",
    pinyin: "zhōng",
    phrase: "中国、中间、中文",
    meaning: "middle, center, China",
    category: "基础",
    strokes: 4,
    radical: "丨"
  },
  {
    char: "国",
    pinyin: "guó",
    phrase: "国家、中国、国际",
    meaning: "country, nation, state",
    category: "基础",
    strokes: 8,
    radical: "囗"
  },
  {
    char: "学",
    pinyin: "xué",
    phrase: "学习、学校、学生",
    meaning: "study, learn, school",
    category: "教育",
    strokes: 8,
    radical: "子"
  },
  {
    char: "生",
    pinyin: "shēng",
    phrase: "生活、生日、学生",
    meaning: "life, to be born, student",
    category: "基础",
    strokes: 5,
    radical: "生"
  },
  {
    char: "汉",
    pinyin: "hàn",
    phrase: "汉字、汉语、汉族",
    meaning: "Han Chinese, Chinese language",
    category: "语言",
    strokes: 5,
    radical: "氵"
  },
  {
    char: "字",
    pinyin: "zì",
    phrase: "汉字、字母、名字",
    meaning: "character, word, letter",
    category: "语言",
    strokes: 6,
    radical: "子"
  },
  {
    char: "语",
    pinyin: "yǔ",
    phrase: "语言、英语、汉语",
    meaning: "language, speech, to speak",
    category: "语言",
    strokes: 9,
    radical: "讠"
  },
  {
    char: "文",
    pinyin: "wén",
    phrase: "文化、中文、文学",
    meaning: "language, culture, writing",
    category: "文化",
    strokes: 4,
    radical: "文"
  },
  {
    char: "天",
    pinyin: "tiān",
    phrase: "天空、今天、天气",
    meaning: "sky, day, heaven",
    category: "自然",
    strokes: 4,
    radical: "大"
  },
  {
    char: "地",
    pinyin: "dì",
    phrase: "地方、地球、土地",
    meaning: "earth, ground, place",
    category: "自然",
    strokes: 6,
    radical: "土"
  },
  {
    char: "水",
    pinyin: "shuǐ",
    phrase: "水果、水平、喝水",
    meaning: "water, liquid, river",
    category: "自然",
    strokes: 4,
    radical: "水"
  },
  {
    char: "火",
    pinyin: "huǒ",
    phrase: "火车、火灾、火锅",
    meaning: "fire, flame, anger",
    category: "自然",
    strokes: 4,
    radical: "火"
  },
  {
    char: "日",
    pinyin: "rì",
    phrase: "日本、日记、生日",
    meaning: "sun, day, date",
    category: "自然",
    strokes: 4,
    radical: "日"
  },
  {
    char: "月",
    pinyin: "yuè",
    phrase: "月亮、月份、十月",
    meaning: "moon, month",
    category: "自然",
    strokes: 4,
    radical: "月"
  },
  {
    char: "年",
    pinyin: "nián",
    phrase: "年轻、今年、新年",
    meaning: "year, age, harvest",
    category: "时间",
    strokes: 6,
    radical: "干"
  },
  {
    char: "时",
    pinyin: "shí",
    phrase: "时间、时候、小时",
    meaning: "time, hour, season",
    category: "时间",
    strokes: 7,
    radical: "日"
  },
  {
    char: "家",
    pinyin: "jiā",
    phrase: "家庭、家乡、国家",
    meaning: "home, family, household",
    category: "家庭",
    strokes: 10,
    radical: "宀"
  },
  {
    char: "好",
    pinyin: "hǎo",
    phrase: "好吃、你好、好看",
    meaning: "good, well, nice",
    category: "基础",
    strokes: 6,
    radical: "女"
  },
  {
    char: "上",
    pinyin: "shàng",
    phrase: "上学、上班、上面",
    meaning: "up, above, previous",
    category: "方位",
    strokes: 3,
    radical: "一"
  },
  {
    char: "下",
    pinyin: "xià",
    phrase: "下午、下面、下班",
    meaning: "down, below, under",
    category: "方位",
    strokes: 3,
    radical: "一"
  },
  {
    char: "左",
    pinyin: "zuǒ",
    phrase: "左边、左手、左右",
    meaning: "left, east, unorthodox",
    category: "方位",
    strokes: 5,
    radical: "工"
  },
  {
    char: "右",
    pinyin: "yòu",
    phrase: "右边、右手、左右",
    meaning: "right, west, conservative",
    category: "方位",
    strokes: 5,
    radical: "口"
  },
  {
    char: "前",
    pinyin: "qián",
    phrase: "前面、以前、前进",
    meaning: "front, forward, before",
    category: "方位",
    strokes: 9,
    radical: "刂"
  },
  {
    char: "后",
    pinyin: "hòu",
    phrase: "后面、以后、后来",
    meaning: "back, behind, after",
    category: "方位",
    strokes: 6,
    radical: "口"
  },
  {
    char: "来",
    pinyin: "lái",
    phrase: "来自、回来、未来",
    meaning: "to come, coming, future",
    category: "动词",
    strokes: 7,
    radical: "木"
  },
  {
    char: "去",
    pinyin: "qù",
    phrase: "去年、出去、过去",
    meaning: "to go, to leave, past",
    category: "动词",
    strokes: 5,
    radical: "厶"
  },
  {
    char: "有",
    pinyin: "yǒu",
    phrase: "有关、没有、所有",
    meaning: "to have, there is, to exist",
    category: "动词",
    strokes: 6,
    radical: "月"
  },
  {
    char: "没",
    pinyin: "méi",
    phrase: "没有、没事、没关系",
    meaning: "not, have not, there is not",
    category: "动词",
    strokes: 7,
    radical: "氵"
  },
  {
    char: "是",
    pinyin: "shì",
    phrase: "不是、但是、可是",
    meaning: "to be, yes, correct",
    category: "动词",
    strokes: 9,
    radical: "日"
  },
  {
    char: "不",
    pinyin: "bù",
    phrase: "不是、不会、不同",
    meaning: "no, not, un-",
    category: "副词",
    strokes: 4,
    radical: "一"
  },
  {
    char: "我",
    pinyin: "wǒ",
    phrase: "我们、自我、我家",
    meaning: "I, me, my",
    category: "代词",
    strokes: 7,
    radical: "戈"
  },
  {
    char: "你",
    pinyin: "nǐ",
    phrase: "你们、你好、你的",
    meaning: "you (singular)",
    category: "代词",
    strokes: 7,
    radical: "亻"
  },
  {
    char: "他",
    pinyin: "tā",
    phrase: "他们、其他、他的",
    meaning: "he, him, his",
    category: "代词",
    strokes: 5,
    radical: "亻"
  },
  {
    char: "她",
    pinyin: "tā",
    phrase: "她们、她的",
    meaning: "she, her, hers",
    category: "代词",
    strokes: 6,
    radical: "女"
  },
  {
    char: "们",
    pinyin: "men",
    phrase: "我们、你们、他们",
    meaning: "plural marker for pronouns",
    category: "代词",
    strokes: 5,
    radical: "亻"
  },
  {
    char: "的",
    pinyin: "de",
    phrase: "我的、你的、他的",
    meaning: "possessive particle, of",
    category: "助词",
    strokes: 8,
    radical: "白"
  },
  {
    char: "了",
    pinyin: "le",
    phrase: "来了、去了、吃了",
    meaning: "completed action marker",
    category: "助词",
    strokes: 2,
    radical: "乛"
  },
  {
    char: "在",
    pinyin: "zài",
    phrase: "现在、存在、在家",
    meaning: "at, in, on, to exist",
    category: "动词",
    strokes: 6,
    radical: "土"
  },
  {
    char: "和",
    pinyin: "hé",
    phrase: "和平、和谐、我和你",
    meaning: "and, with, harmony",
    category: "连词",
    strokes: 8,
    radical: "禾"
  },
  {
    char: "说",
    pinyin: "shuō",
    phrase: "说话、说明、小说",
    meaning: "to speak, to say, to explain",
    category: "动词",
    strokes: 9,
    radial: "讠"
  },
  {
    char: "看",
    pinyin: "kàn",
    phrase: "看见、看书、好看",
    meaning: "to look, to see, to watch",
    category: "动词",
    strokes: 9,
    radical: "目"
  },
  {
    char: "听",
    pinyin: "tīng",
    phrase: "听说、听力、听音乐",
    meaning: "to listen, to hear, to obey",
    category: "动词",
    strokes: 7,
    radical: "口"
  },
  {
    char: "读",
    pinyin: "dú",
    phrase: "读书、阅读、读音",
    meaning: "to read, to study, to attend school",
    category: "教育",
    strokes: 10,
    radical: "讠"
  },
  {
    char: "写",
    pinyin: "xiě",
    phrase: "写字、写作、写信",
    meaning: "to write, to compose",
    category: "教育",
    strokes: 5,
    radical: "冖"
  },
  {
    char: "吃",
    pinyin: "chī",
    phrase: "吃饭、好吃、吃药",
    meaning: "to eat, to consume",
    category: "生活",
    strokes: 6,
    radical: "口"
  },
  {
    char: "喝",
    pinyin: "hē",
    phrase: "喝酒、喝水、喝茶",
    meaning: "to drink",
    category: "生活",
    strokes: 12,
    radical: "口"
  },
  {
    char: "睡",
    pinyin: "shuì",
    phrase: "睡觉、睡眠、睡衣",
    meaning: "to sleep, to lie down",
    category: "生活",
    strokes: 13,
    radical: "目"
  },
  {
    char: "工",
    pinyin: "gōng",
    phrase: "工作、工人、工厂",
    meaning: "work, worker, industry",
    category: "职业",
    strokes: 3,
    radical: "工"
  },
  {
    char: "作",
    pinyin: "zuò",
    phrase: "工作、作业、作家",
    meaning: "to do, to make, to write",
    category: "动词",
    strokes: 7,
    radical: "亻"
  },
  {
    char: "开",
    pinyin: "kāi",
    phrase: "开始、开车、开门",
    meaning: "to open, to start, to operate",
    category: "动词",
    strokes: 4,
    radical: "廾"
  },
  {
    char: "关",
    pinyin: "guān",
    phrase: "关系、关心、关门",
    meaning: "to close, to shut, to concern",
    category: "动词",
    strokes: 6,
    radical: "丷"
  },
  {
    char: "心",
    pinyin: "xīn",
    phrase: "心情、心脏、关心",
    meaning: "heart, mind, core",
    category: "身体",
    strokes: 4,
    radical: "心"
  },
  {
    char: "手",
    pinyin: "shǒu",
    phrase: "手机、手工、手表",
    meaning: "hand, to hold, skill",
    category: "身体",
    strokes: 4,
    radical: "手"
  },
  {
    char: "足",
    pinyin: "zú",
    phrase: "足球、满足、足够",
    meaning: "foot, sufficient, enough",
    category: "身体",
    strokes: 7,
    radical: "足"
  },
  {
    char: "口",
    pinyin: "kǒu",
    phrase: "口语、人口、出口",
    meaning: "mouth, opening, entrance",
    category: "身体",
    strokes: 3,
    radical: "口"
  },
  {
    char: "目",
    pinyin: "mù",
    phrase: "目的、目标、节目",
    meaning: "eye, item, list",
    category: "身体",
    strokes: 5,
    radical: "目"
  },
  {
    char: "耳",
    pinyin: "ěr",
    phrase: "耳朵、耳机、木耳",
    meaning: "ear, handle",
    category: "身体",
    strokes: 6,
    radical: "耳"
  },
  {
    char: "白",
    pinyin: "bái",
    phrase: "白天、白色、明白",
    meaning: "white, clear, pure",
    category: "颜色",
    strokes: 5,
    radical: "白"
  },
  {
    char: "黑",
    pinyin: "hēi",
    phrase: "黑色、黑暗、黑板",
    meaning: "black, dark, secret",
    category: "颜色",
    strokes: 12,
    radical: "黑"
  },
  {
    char: "红",
    pinyin: "hóng",
    phrase: "红色、红包、红酒",
    meaning: "red, popular, revolutionary",
    category: "颜色",
    strokes: 6,
    radical: "纟"
  },
  {
    char: "黄",
    pinyin: "huáng",
    phrase: "黄色、黄河、黄瓜",
    meaning: "yellow, Huang He river",
    category: "颜色",
    strokes: 11,
    radical: "黄"
  },
  {
    char: "蓝",
    pinyin: "lán",
    phrase: "蓝色、蓝天、蓝图",
    meaning: "blue, indigo plant",
    category: "颜色",
    strokes: 13,
    radical: "艹"
  },
  {
    char: "绿",
    pinyin: "lǜ",
    phrase: "绿色、绿茶、绿灯",
    meaning: "green, chlorine",
    category: "颜色",
    strokes: 11,
    radical: "纟"
  },
  {
    char: "一",
    pinyin: "yī",
    phrase: "一天、一起、第一",
    meaning: "one, a, an, single",
    category: "数字",
    strokes: 1,
    radical: "一"
  },
  {
    char: "二",
    pinyin: "èr",
    phrase: "第二、二月、十二",
    meaning: "two, second",
    category: "数字",
    strokes: 2,
    radical: "二"
  },
  {
    char: "三",
    pinyin: "sān",
    phrase: "第三、三月、十三",
    meaning: "three, third",
    category: "数字",
    strokes: 3,
    radical: "一"
  },
  {
    char: "四",
    pinyin: "sì",
    phrase: "第四、四月、十四",
    meaning: "four, fourth",
    category: "数字",
    strokes: 5,
    radical: "囗"
  },
  {
    char: "五",
    pinyin: "wǔ",
    phrase: "第五、五月、十五",
    meaning: "five, fifth",
    category: "数字",
    strokes: 4,
    radical: "二"
  },
  {
    char: "六",
    pinyin: "liù",
    phrase: "第六、六月、十六",
    meaning: "six, sixth",
    category: "数字",
    strokes: 4,
    radical: "八"
  },
  {
    char: "七",
    pinyin: "qī",
    phrase: "第七、七月、十七",
    meaning: "seven, seventh",
    category: "数字",
    strokes: 2,
    radical: "一"
  },
  {
    char: "八",
    pinyin: "bā",
    phrase: "第八、八月、十八",
    meaning: "eight, eighth",
    category: "数字",
    strokes: 2,
    radical: "八"
  },
  {
    char: "九",
    pinyin: "jiǔ",
    phrase: "第九、九月、十九",
    meaning: "nine, ninth",
    category: "数字",
    strokes: 2,
    radical: "丿"
  },
  {
    char: "十",
    pinyin: "shí",
    phrase: "第十、十月、二十",
    meaning: "ten, tenth, topmost",
    category: "数字",
    strokes: 2,
    radical: "十"
  },
  {
    char: "百",
    pinyin: "bǎi",
    phrase: "一百、百万、百货",
    meaning: "hundred, numerous",
    category: "数字",
    strokes: 6,
    radical: "白"
  },
  {
    char: "千",
    pinyin: "qiān",
    phrase: "一千、千万、千克",
    meaning: "thousand, many",
    category: "数字",
    strokes: 3,
    radical: "十"
  },
  {
    char: "万",
    pinyin: "wàn",
    phrase: "一万、万一、万里",
    meaning: "ten thousand, myriad",
    category: "数字",
    strokes: 3,
    radical: "一"
  },
  {
    char: "爸",
    pinyin: "bà",
    phrase: "爸爸、老爸、爸妈",
    meaning: "father, dad, pa",
    category: "家庭",
    strokes: 8,
    radical: "父"
  },
  {
    char: "妈",
    pinyin: "mā",
    phrase: "妈妈、老妈、爸妈",
    meaning: "mother, mom, ma",
    category: "家庭",
    strokes: 6,
    radical: "女"
  },
  {
    char: "哥",
    pinyin: "gē",
    phrase: "哥哥、大哥、哥们",
    meaning: "older brother",
    category: "家庭",
    strokes: 10,
    radical: "口"
  },
  {
    char: "弟",
    pinyin: "dì",
    phrase: "弟弟、兄弟、弟子",
    meaning: "younger brother, disciple",
    category: "家庭",
    strokes: 7,
    radical: "弓"
  },
  {
    char: "姐",
    pinyin: "jiě",
    phrase: "姐姐、大姐、姐妹",
    meaning: "older sister",
    category: "家庭",
    strokes: 8,
    radical: "女"
  },
  {
    char: "妹",
    pinyin: "mèi",
    phrase: "妹妹、姐妹、小妹",
    meaning: "younger sister",
    category: "家庭",
    strokes: 8,
    radical: "女"
  },
  {
    char: "朋",
    pinyin: "péng",
    phrase: "朋友、亲朋好友",
    meaning: "friend, companion",
    category: "社交",
    strokes: 8,
    radical: "月"
  },
  {
    char: "友",
    pinyin: "yǒu",
    phrase: "朋友、友情、友好",
    meaning: "friend, friendship, friendly",
    category: "社交",
    strokes: 4,
    radical: "又"
  },
  {
    char: "爱",
    pinyin: "ài",
    phrase: "爱情、爱心、爱国",
    meaning: "love, affection, to like",
    category: "情感",
    strokes: 10,
    radical: "爫"
  },
  {
    char: "喜",
    pinyin: "xǐ",
    phrase: "喜欢、喜剧、喜庆",
    meaning: "to like, to be fond of, happiness",
    category: "情感",
    strokes: 12,
    radical: "口"
  },
  {
    char: "乐",
    pinyin: "lè",
    phrase: "快乐、音乐、乐趣",
    meaning: "happy, joyful, music",
    category: "情感",
    strokes: 5,
    radical: "丿"
  },
  {
    char: "高",
    pinyin: "gāo",
    phrase: "高兴、高级、高度",
    meaning: "high, tall, lofty",
    category: "形容词",
    strokes: 10,
    radical: "高"
  },
  {
    char: "兴",
    pinyin: "xìng",
    phrase: "高兴、兴趣、兴奋",
    meaning: "interest, excitement, prosperous",
    category: "情感",
    strokes: 6,
    radical: "八"
  },
  {
    char: "快",
    pinyin: "kuài",
    phrase: "快乐、快速、快递",
    meaning: "fast, quick, happy",
    category: "形容词",
    strokes: 7,
    radical: "忄"
  },
  {
    char: "慢",
    pinyin: "màn",
    phrase: "慢慢、慢点、慢走",
    meaning: "slow, leisurely, to postpone",
    category: "形容词",
    strokes: 14,
    radical: "忄"
  },
  {
    char: "多",
    pinyin: "duō",
    phrase: "多少、很多、多数",
    meaning: "many, much, more",
    category: "形容词",
    strokes: 6,
    radical: "夕"
  },
  {
    char: "少",
    pinyin: "shǎo",
    phrase: "多少、少数、减少",
    meaning: "few, little, less",
    category: "形容词",
    strokes: 4,
    radical: "小"
  },
  {
    char: "长",
    pinyin: "cháng",
    phrase: "长江、长度、长短",
    meaning: "long, length, forever",
    category: "形容词",
    strokes: 4,
    radical: "长"
  },
  {
    char: "短",
    pinyin: "duǎn",
    phrase: "短信、短处、短期",
    meaning: "short, brief, to lack",
    category: "形容词",
    strokes: 12,
    radical: "矢"
  },
  {
    char: "新",
    pinyin: "xīn",
    phrase: "新闻、新鲜、新年",
    meaning: "new, fresh, recent",
    category: "形容词",
    strokes: 13,
    radical: "斤"
  },
  {
    char: "旧",
    pinyin: "jiù",
    phrase: "旧书、旧年、旧事",
    meaning: "old, past, used",
    category: "形容词",
    strokes: 5,
    radical: "丨"
  },
  {
    char: "男",
    pinyin: "nán",
    phrase: "男人、男性、男生",
    meaning: "male, man, son",
    category: "社会",
    strokes: 7,
    radical: "田"
  },
  {
    char: "女",
    pinyin: "nǚ",
    phrase: "女人、女性、女儿",
    meaning: "female, woman, daughter",
    category: "社会",
    strokes: 3,
    radical: "女"
  },
  {
    char: "老",
    pinyin: "lǎo",
    phrase: "老师、老人、老板",
    meaning: "old, aged, experienced",
    category: "形容词",
    strokes: 6,
    radical: "老"
  },
  {
    char: "师",
    pinyin: "shī",
    phrase: "老师、师傅、律师",
    meaning: "teacher, master, specialist",
    category: "教育",
    strokes: 6,
    radical: "巾"
  },
  {
    char: "医",
    pinyin: "yī",
    phrase: "医生、医院、医学",
    meaning: "doctor, medicine, medical",
    category: "职业",
    strokes: 7,
    radical: "匸"
  },
  {
    char: "院",
    pinyin: "yuàn",
    phrase: "医院、院长、学院",
    meaning: "courtyard, institution, hospital",
    category: "场所",
    strokes: 9,
    radical: "阝"
  },
  {
    char: "学",
    pinyin: "xué",
    phrase: "学校、学生、学习",
    meaning: "to learn, to study, school",
    category: "教育",
    strokes: 8,
    radical: "子"
  },
  {
    char: "校",
    pinyin: "xiào",
    phrase: "学校、校长、校园",
    meaning: "school, military officer",
    category: "教育",
    strokes: 10,
    radical: "木"
  },
  {
    char: "公",
    pinyin: "gōng",
    phrase: "公司、公园、公共",
    meaning: "public, common, fair",
    category: "社会",
    strokes: 4,
    radical: "八"
  },
  {
    char: "司",
    pinyin: "sī",
    phrase: "公司、司机、司法",
    meaning: "to take charge of, department",
    category: "社会",
    strokes: 5,
    radical: "口"
  },
  {
    char: "车",
    pinyin: "chē",
    phrase: "汽车、火车、车站",
    meaning: "vehicle, car, cart",
    category: "交通",
    strokes: 4,
    radical: "车"
  },
  {
    char: "站",
    pinyin: "zhàn",
    phrase: "车站、站台、网站",
    meaning: "to stand, station, stop",
    category: "交通",
    strokes: 10,
    radical: "立"
  },
  {
    char: "飞",
    pinyin: "fēi",
    phrase: "飞机、飞行、飞快",
    meaning: "to fly, rapid, unexpected",
    category: "交通",
    strokes: 3,
    radical: "飞"
  },
  {
    char: "机",
    pinyin: "jī",
    phrase: "飞机、机会、手机",
    meaning: "machine, opportunity, aircraft",
    category: "科技",
    strokes: 6,
    radical: "木"
  },
  {
    char: "电",
    pinyin: "diàn",
    phrase: "电话、电视、电脑",
    meaning: "electricity, electric, telegram",
    category: "科技",
    strokes: 5,
    radical: "田"
  },
  {
    char: "脑",
    pinyin: "nǎo",
    phrase: "电脑、大脑、脑袋",
    meaning: "brain, mind, head",
    category: "身体",
    strokes: 10,
    radical: "月"
  },
  {
    char: "网",
    pinyin: "wǎng",
    phrase: "网络、网站、互联网",
    meaning: "net, network, web",
    category: "科技",
    strokes: 6,
    radical: "冂"
  },
  {
    char: "路",
    pinyin: "lù",
    phrase: "路上、道路、思路",
    meaning: "road, path, journey",
    category: "地理",
    strokes: 13,
    radical: "足"
  },
  {
    char: "道",
    pinyin: "dào",
    phrase: "道路、道理、知道",
    meaning: "road, path, way, to say",
    category: "哲学",
    strokes: 12,
    radical: "辶"
  },
  {
    char: "市",
    pinyin: "shì",
    phrase: "城市、市场、市民",
    meaning: "city, market, municipal",
    category: "地理",
    strokes: 5,
    radical: "巾"
  },
  {
    char: "城",
    pinyin: "chéng",
    phrase: "城市、城墙、长城",
    meaning: "city, town, city wall",
    category: "地理",
    strokes: 9,
    radical: "土"
  },
  {
    char: "山",
    pinyin: "shān",
    phrase: "山西、山东、高山",
    meaning: "mountain, hill, peak",
    category: "地理",
    strokes: 3,
    radical: "山"
  },
  {
    char: "川",
    pinyin: "chuān",
    phrase: "四川、河川、山川",
    meaning: "river, stream, plain",
    category: "地理",
    strokes: 3,
    radical: "川"
  },
  {
    char: "河",
    pinyin: "hé",
    phrase: "河南、河北、黄河",
    meaning: "river, stream, creek",
    category: "地理",
    strokes: 8,
    radical: "氵"
  },
  {
    char: "海",
    pinyin: "hǎi",
    phrase: "海南、上海、海洋",
    meaning: "sea, ocean, maritime",
    category: "地理",
    strokes: 10,
    radical: "氵"
  },
  {
    char: "花",
    pinyin: "huā",
    phrase: "花园、花朵、花钱",
    meaning: "flower, blossom, to spend",
    category: "自然",
    strokes: 7,
    radical: "艹"
  },
  {
    char: "树",
    pinyin: "shù",
    phrase: "树木、树叶、树林",
    meaning: "tree, to plant, to set up",
    category: "自然",
    strokes: 9,
    radical: "木"
  },
  {
    char: "林",
    pinyin: "lín",
    phrase: "森林、树林、林业",
    meaning: "forest, woods, grove",
    category: "自然",
    strokes: 8,
    radical: "木"
  },
  {
    char: "森",
    pinyin: "sēn",
    phrase: "森林、森严、阴森",
    meaning: "forest, gloomy, full of trees",
    category: "自然",
    strokes: 12,
    radical: "木"
  }
];

// 导出数据库（兼容不同的模块系统）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = hanziDatabase;
} else if (typeof define === 'function' && define.amd) {
  define([], function() { return hanziDatabase; });
} else {
  window.hanziDatabase = hanziDatabase;
}