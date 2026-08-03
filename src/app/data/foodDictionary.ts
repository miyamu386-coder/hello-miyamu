export type FoodDictionaryItem = {
  id: string;
  name: string;
  baseName: string;
  kcal: number;
  isDefault?: boolean;
  aliases?: string[];
};

export const FOOD_DICTIONARY: FoodDictionaryItem[] = [
  // 主食
  {
  id: "rice-150g",
  name: "ご飯 150g",
  baseName: "ご飯",
  kcal: 234,
  isDefault: true,
},
{
  id: "rice-200g",
  name: "ご飯 200g",
  baseName: "ご飯",
  kcal: 312,
},
  {

  id: "bread-6slice-1",
  name: "食パン 6枚切り 1枚",
  baseName: "食パン",
  kcal: 150,
  isDefault: true,
},
  {
  id: "udon-1serving",
  name: "うどん 1玉",
  baseName: "うどん",
  kcal: 240,
  isDefault: true,
},
  {
  id: "pasta-boiled-200g",
  name: "パスタ ゆで 200g",
  baseName: "パスタ",
  kcal: 300,
  isDefault: true,
},

  // たんぱく質
  {
  id: "natto-1pack",
  name: "納豆 1パック",
  baseName: "納豆",
  kcal: 90,
  isDefault: true,
},
  {
  id: "egg-1",
  name: "卵 1個",
  baseName: "卵",
  kcal: 71,
  isDefault: true,
},
  {
  id: "chicken-breast-100g",
  name: "鶏むね肉 100g",
  baseName: "鶏むね肉",
  kcal: 133,
  isDefault: true,
},
  {
  id: "chicken-thigh-100g",
  name: "鶏もも肉 100g",
  baseName: "鶏もも肉",
  kcal: 190,
  isDefault: true,
},
  {
  id: "tofu-150g",
  name: "豆腐 150g",
  baseName: "豆腐",
  kcal: 110,
  isDefault: true,
},

  // 乳製品・飲み物
{
  id: "milk-200ml",
  name: "牛乳 200ml",
  baseName: "牛乳",
  kcal: 122,
  isDefault: true,
},
{
  id: "yogurt-100g",
  name: "プレーンヨーグルト 100g",
  baseName: "プレーンヨーグルト",
  kcal: 56,
  isDefault: true,
},
{
  id: "cola-500ml",
  name: "コーラ 500ml",
  baseName: "コーラ",
  kcal: 225,
  isDefault: true,
},
// 果物・軽食
{
  id: "banana-1",
  name: "バナナ 1本",
  baseName: "バナナ",
  kcal: 90,
  isDefault: true,
},
{
  id: "apple-half",
  name: "りんご 1/2個",
  baseName: "りんご",
  kcal: 70,
  isDefault: true,
},

{
  id: "onigiri-1",
  name: "おにぎり 1個",
  baseName: "おにぎり",
  kcal: 180,
  isDefault: true,
},
  {
  id: "gyudon-default",
  name: "牛丼 並",
  baseName: "牛丼",
  kcal: 650,
  isDefault: true,
},
{
  id: "gyudon-large",
  name: "牛丼 大盛",
  baseName: "牛丼",
  kcal: 850,
},
{
  id: "gyudon-extra-large",
  name: "牛丼 特盛",
  baseName: "牛丼",
  kcal: 1050,
},

  // 外食メニュー

// なか卯
{
  id: "nakau-oyakodon-normal",
  name: "なか卯 親子丼 並盛",
  baseName: "なか卯親子丼",
  kcal: 742,
  isDefault: true,
},
{
  id: "nakau-oyakodon-large",
  name: "なか卯 親子丼 ごはん大盛",
  baseName: "なか卯親子丼",
  kcal: 898,
},

{
  id: "nakau-katsudon-normal",
  name: "なか卯 カツ丼 並盛",
  baseName: "なか卯カツ丼",
  kcal: 798,
  isDefault: true,
},
{
  id: "nakau-katsudon-large",
  name: "なか卯 カツ丼 ごはん大盛",
  baseName: "なか卯カツ丼",
  kcal: 954,
},

{
  id: "nakau-gyudon-normal",
  name: "なか卯 牛丼 並盛",
  baseName: "なか卯牛丼",
  kcal: 633,
  isDefault: true,
},
{
  id: "nakau-gyudon-large",
  name: "なか卯 牛丼 ごはん大盛",
  baseName: "なか卯牛丼",
  kcal: 789,
},

{
  id: "nakau-haikara-udon-small",
  name: "なか卯 はいからうどん 小",
  baseName: "なか卯はいからうどん",
  kcal: 180,
},
{
  id: "nakau-haikara-udon-normal",
  name: "なか卯 はいからうどん 並",
  baseName: "なか卯はいからうどん",
  kcal: 303,
  isDefault: true,
},
// 松屋
{
  id: "matsuya-gyumeshi-small",
  name: "松屋 牛めし 小盛",
  baseName: "松屋牛めし",
  kcal: 507,
},
{
  id: "matsuya-gyumeshi-normal",
  name: "松屋 牛めし 並盛",
  baseName: "松屋牛めし",
  kcal: 687,
  isDefault: true,
},
{
  id: "matsuya-gyumeshi-head-large",
  name: "松屋 牛めし あたま大盛",
  baseName: "松屋牛めし",
  kcal: 765,
},
{
  id: "matsuya-gyumeshi-large",
  name: "松屋 牛めし 大盛",
  baseName: "松屋牛めし",
  kcal: 933,
},
{
  id: "matsuya-gyumeshi-extra-large",
  name: "松屋 牛めし 特盛",
  baseName: "松屋牛めし",
  kcal: 1237,
},
// 松屋 カレー
{
  id: "matsuya-curry-normal",
  name: "松屋 カレー 並盛",
  baseName: "松屋カレー",
  kcal: 737,
  isDefault: true,
},
{
  id: "matsuya-curry-large",
  name: "松屋 カレー 大盛",
  baseName: "松屋カレー",
  kcal: 905,
},
{
  id: "matsuya-curry-extra-large",
  name: "松屋 カレー 特盛",
  baseName: "松屋カレー",
  kcal: 1073,
},

// 松屋 定食
{
  id: "matsuya-teishoku-normal",
  name: "松屋 定食 並盛",
  baseName: "松屋定食",
  kcal: 850,
  isDefault: true,
},
{
  id: "matsuya-teishoku-large",
  name: "松屋 定食 大盛",
  baseName: "松屋定食",
  kcal: 1018,
},
{
  id: "matsuya-teishoku-extra-large",
  name: "松屋 定食 特盛",
  baseName: "松屋定食",
  kcal: 1186,
},

// すき家 牛丼
{
  id: "sukiya-gyudon-mini",
  name: "すき家 牛丼 ミニ",
  baseName: "すき家牛丼",
  kcal: 464,
},
{
  id: "sukiya-gyudon-normal",
  name: "すき家 牛丼 並盛",
  baseName: "すき家牛丼",
  kcal: 695,
  isDefault: true,
},
{
  id: "sukiya-gyudon-middle",
  name: "すき家 牛丼 中盛",
  baseName: "すき家牛丼",
  kcal: 752,
},
{
  id: "sukiya-gyudon-large",
  name: "すき家 牛丼 大盛",
  baseName: "すき家牛丼",
  kcal: 908,
},
{
  id: "sukiya-gyudon-extra-large",
  name: "すき家 牛丼 特盛",
  baseName: "すき家牛丼",
  kcal: 1100,
},
{
  id: "sukiya-gyudon-mega",
  name: "すき家 牛丼 メガ",
  baseName: "すき家牛丼",
  kcal: 1365,
},

// すき家 とろ〜り3種のチーズ牛丼
{
  id: "sukiya-cheese-gyudon-mini",
  name: "すき家 とろ〜り3種のチーズ牛丼 ミニ",
  baseName: "すき家チーズ牛丼",
  kcal: 640,
},
{
  id: "sukiya-cheese-gyudon-normal",
  name: "すき家 とろ〜り3種のチーズ牛丼 並盛",
  baseName: "すき家チーズ牛丼",
  kcal: 871,
  isDefault: true,
},
{
  id: "sukiya-cheese-gyudon-middle",
  name: "すき家 とろ〜り3種のチーズ牛丼 中盛",
  baseName: "すき家チーズ牛丼",
  kcal: 928,
},
{
  id: "sukiya-cheese-gyudon-large",
  name: "すき家 とろ〜り3種のチーズ牛丼 大盛",
  baseName: "すき家チーズ牛丼",
  kcal: 1084,
},
{
  id: "sukiya-cheese-gyudon-extra-large",
  name: "すき家 とろ〜り3種のチーズ牛丼 特盛",
  baseName: "すき家チーズ牛丼",
  kcal: 1276,
},
{
  id: "sukiya-cheese-gyudon-mega",
  name: "すき家 とろ〜り3種のチーズ牛丼 メガ",
  baseName: "すき家チーズ牛丼",
  kcal: 1541,
},
// すき家 ねぎ玉牛丼
{
  id: "sukiya-negi-tama-gyudon-mini",
  name: "すき家 ねぎ玉牛丼 ミニ",
  baseName: "すき家ねぎ玉牛丼",
  kcal: 562,
},
{
  id: "sukiya-negi-tama-gyudon-normal",
  name: "すき家 ねぎ玉牛丼 並盛",
  baseName: "すき家ねぎ玉牛丼",
  kcal: 793,
  isDefault: true,
},
{
  id: "sukiya-negi-tama-gyudon-middle",
  name: "すき家 ねぎ玉牛丼 中盛",
  baseName: "すき家ねぎ玉牛丼",
  kcal: 855,
},
{
  id: "sukiya-negi-tama-gyudon-large",
  name: "すき家 ねぎ玉牛丼 大盛",
  baseName: "すき家ねぎ玉牛丼",
  kcal: 1006,
},
{
  id: "sukiya-negi-tama-gyudon-extra-large",
  name: "すき家 ねぎ玉牛丼 特盛",
  baseName: "すき家ねぎ玉牛丼",
  kcal: 1198,
},
{
  id: "sukiya-negi-tama-gyudon-mega",
  name: "すき家 ねぎ玉牛丼 メガ",
  baseName: "すき家ねぎ玉牛丼",
  kcal: 1463,
},
// すき家 キムチ牛丼
{
  id: "sukiya-kimchi-gyudon-mini",
  name: "すき家 キムチ牛丼 ミニ",
  baseName: "すき家キムチ牛丼",
  kcal: 558,
},
{
  id: "sukiya-kimchi-gyudon-normal",
  name: "すき家 キムチ牛丼 並盛",
  baseName: "すき家キムチ牛丼",
  kcal: 789,
  isDefault: true,
},
{
  id: "sukiya-kimchi-gyudon-middle",
  name: "すき家 キムチ牛丼 中盛",
  baseName: "すき家キムチ牛丼",
  kcal: 846,
},
{
  id: "sukiya-kimchi-gyudon-large",
  name: "すき家 キムチ牛丼 大盛",
  baseName: "すき家キムチ牛丼",
  kcal: 1002,
},
{
  id: "sukiya-kimchi-gyudon-extra-large",
  name: "すき家 キムチ牛丼 特盛",
  baseName: "すき家キムチ牛丼",
  kcal: 1194,
},
{
  id: "sukiya-kimchi-gyudon-mega",
  name: "すき家 キムチ牛丼 メガ",
  baseName: "すき家キムチ牛丼",
  kcal: 1459,
},
// すき家 おろしポン酢牛丼
{
  id: "sukiya-oroshi-ponzu-gyudon-mini",
  name: "すき家 おろしポン酢牛丼 ミニ",
  baseName: "すき家おろしポン酢牛丼",
  kcal: 511,
},
{
  id: "sukiya-oroshi-ponzu-gyudon-normal",
  name: "すき家 おろしポン酢牛丼 並盛",
  baseName: "すき家おろしポン酢牛丼",
  kcal: 742,
  isDefault: true,
},
{
  id: "sukiya-oroshi-ponzu-gyudon-middle",
  name: "すき家 おろしポン酢牛丼 中盛",
  baseName: "すき家おろしポン酢牛丼",
  kcal: 799,
},
{
  id: "sukiya-oroshi-ponzu-gyudon-large",
  name: "すき家 おろしポン酢牛丼 大盛",
  baseName: "すき家おろしポン酢牛丼",
  kcal: 955,
},
{
  id: "sukiya-oroshi-ponzu-gyudon-extra-large",
  name: "すき家 おろしポン酢牛丼 特盛",
  baseName: "すき家おろしポン酢牛丼",
  kcal: 1147,
},
{
  id: "sukiya-oroshi-ponzu-gyudon-mega",
  name: "すき家 おろしポン酢牛丼 メガ",
  baseName: "すき家おろしポン酢牛丼",
  kcal: 1412,
},
// すき家 高菜明太マヨ牛丼
{
  id: "sukiya-takana-mentai-mayo-gyudon-mini",
  name: "すき家 高菜明太マヨ牛丼 ミニ",
  baseName: "すき家高菜明太マヨ牛丼",
  kcal: 648,
},
{
  id: "sukiya-takana-mentai-mayo-gyudon-normal",
  name: "すき家 高菜明太マヨ牛丼 並盛",
  baseName: "すき家高菜明太マヨ牛丼",
  kcal: 879,
  isDefault: true,
},
{
  id: "sukiya-takana-mentai-mayo-gyudon-middle",
  name: "すき家 高菜明太マヨ牛丼 中盛",
  baseName: "すき家高菜明太マヨ牛丼",
  kcal: 936,
},
{
  id: "sukiya-takana-mentai-mayo-gyudon-large",
  name: "すき家 高菜明太マヨ牛丼 大盛",
  baseName: "すき家高菜明太マヨ牛丼",
  kcal: 1092,
},
{
  id: "sukiya-takana-mentai-mayo-gyudon-extra-large",
  name: "すき家 高菜明太マヨ牛丼 特盛",
  baseName: "すき家高菜明太マヨ牛丼",
  kcal: 1284,
},
{
  id: "sukiya-takana-mentai-mayo-gyudon-mega",
  name: "すき家 高菜明太マヨ牛丼 メガ",
  baseName: "すき家高菜明太マヨ牛丼",
  kcal: 1549,
},

// 吉野家 牛丼
{
  id: "yoshinoya-gyudon-small",
  name: "吉野家 牛丼 小盛",
  baseName: "吉野家牛丼",
  kcal: 474,
},
{
  id: "yoshinoya-gyudon-normal",
  name: "吉野家 牛丼 並盛",
  baseName: "吉野家牛丼",
  kcal: 633,
  isDefault: true,
},
{
  id: "yoshinoya-gyudon-head-large",
  name: "吉野家 牛丼 アタマの大盛",
  baseName: "吉野家牛丼",
  kcal: 725,
},
{
  id: "yoshinoya-gyudon-large",
  name: "吉野家 牛丼 大盛",
  baseName: "吉野家牛丼",
  kcal: 823,
},
{
  id: "yoshinoya-gyudon-extra-large",
  name: "吉野家 牛丼 特盛",
  baseName: "吉野家牛丼",
  kcal: 1006,
},
{
  id: "yoshinoya-gyudon-super-large",
  name: "吉野家 牛丼 超特盛",
  baseName: "吉野家牛丼",
  kcal: 1159,
},
// 吉野家 ねぎ玉牛丼
{
  id: "yoshinoya-negi-tama-gyudon-small",
  name: "吉野家 ねぎ玉牛丼 小盛",
  baseName: "吉野家ねぎ玉牛丼",
  kcal: 448,
},
{
  id: "yoshinoya-negi-tama-gyudon-normal",
  name: "吉野家 ねぎ玉牛丼 並盛",
  baseName: "吉野家ねぎ玉牛丼",
  kcal: 599,
  isDefault: true,
},
{
  id: "yoshinoya-negi-tama-gyudon-head-large",
  name: "吉野家 ねぎ玉牛丼 アタマの大盛",
  baseName: "吉野家ねぎ玉牛丼",
  kcal: 684,
},
{
  id: "yoshinoya-negi-tama-gyudon-large",
  name: "吉野家 ねぎ玉牛丼 大盛",
  baseName: "吉野家ねぎ玉牛丼",
  kcal: 769,
},
{
  id: "yoshinoya-negi-tama-gyudon-extra-large",
  name: "吉野家 ねぎ玉牛丼 特盛",
  baseName: "吉野家ねぎ玉牛丼",
  kcal: 971,
},
{
  id: "yoshinoya-negi-tama-gyudon-super-large",
  name: "吉野家 ねぎ玉牛丼 超特盛",
  baseName: "吉野家ねぎ玉牛丼",
  kcal: 1079,
},
// 吉野家 キムチ牛丼
{
  id: "yoshinoya-kimchi-gyudon-small",
  name: "吉野家 キムチ牛丼 小盛",
  baseName: "吉野家キムチ牛丼",
  kcal: 523,
},
{
  id: "yoshinoya-kimchi-gyudon-normal",
  name: "吉野家 キムチ牛丼 並盛",
  baseName: "吉野家キムチ牛丼",
  kcal: 682,
  isDefault: true,
},
{
  id: "yoshinoya-kimchi-gyudon-head-large",
  name: "吉野家 キムチ牛丼 アタマの大盛",
  baseName: "吉野家キムチ牛丼",
  kcal: 774,
},
{
  id: "yoshinoya-kimchi-gyudon-large",
  name: "吉野家 キムチ牛丼 大盛",
  baseName: "吉野家キムチ牛丼",
  kcal: 872,
},
{
  id: "yoshinoya-kimchi-gyudon-extra-large",
  name: "吉野家 キムチ牛丼 特盛",
  baseName: "吉野家キムチ牛丼",
  kcal: 1055,
},
{
  id: "yoshinoya-kimchi-gyudon-super-large",
  name: "吉野家 キムチ牛丼 超特盛",
  baseName: "吉野家キムチ牛丼",
  kcal: 1208,
},
// 吉野家 牛焼肉丼
{
  id: "yoshinoya-gyu-yakiniku-don-normal",
  name: "吉野家 牛焼肉丼 並盛",
  baseName: "吉野家牛焼肉丼",
  kcal: 707,
  isDefault: true,
},
{
  id: "yoshinoya-gyu-yakiniku-don-large",
  name: "吉野家 牛焼肉丼 大盛",
  baseName: "吉野家牛焼肉丼",
  kcal: 957,
},
// 吉野家 親子丼（期間限定メニュー・概算）
{
  id: "yoshinoya-oyakodon-normal",
  name: "吉野家 親子丼 並盛",
  baseName: "吉野家親子丼",
  kcal: 650,
  isDefault: true,
},
{
  id: "yoshinoya-oyakodon-large",
  name: "吉野家 親子丼 大盛",
  baseName: "吉野家親子丼",
  kcal: 850,
},
// ガスト
{
  id: "gusto-cheesein-hamburg",
  name: "チーズINハンバーグ",
  baseName: "チーズINハンバーグ",
  kcal: 821,
  isDefault: true,
},
{
  id: "gusto-daily-lunch",
  name: "日替わりランチ",
  baseName: "日替わりランチ",
  kcal: 750,
  isDefault: true,
},
{
  id: "gusto-chikiteki-spice",
  name: "ガスト チキテキスパイス焼き",
  baseName: "ガストチキテキスパイス焼き",
  kcal: 599,
  isDefault: true,
},

// 伝説のすた丼
{
  id: "sutadon-normal",
  name: "すた丼",
  baseName: "すた丼",
  kcal: 1150,
  isDefault: true,
},
{
  id: "sutadon-rice-large",
  name: "すた丼 ご飯大盛",
  baseName: "すた丼",
  kcal: 1330,
},
{
  id: "tororo-sutadon",
  name: "とろろすた丼",
  baseName: "とろろすた丼",
  kcal: 1080,
  isDefault: true,
},
{
  id: "tororo-sutadon-rice-large",
  name: "とろろすた丼 ご飯大盛",
  baseName: "とろろすた丼",
  kcal: 1260,
},
{
  id: "karaage-sutadon",
  name: "唐揚げ合盛りすた丼",
  baseName: "唐揚げ合盛りすた丼",
  kcal: 1450,
  isDefault: true,
},
{
  id: "shogayaki-sutadon",
  name: "生姜焼きすた丼",
  baseName: "生姜焼きすた丼",
  kcal: 1090,
  isDefault: true,
},
];