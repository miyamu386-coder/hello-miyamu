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
  name: "牛丼",
  baseName: "牛丼",
  kcal: 650,
  isDefault: true,
},

  // 外食メニュー

// なか卯
{
  id: "nakau-oyakodon",
  name: "親子丼",
  baseName: "親子丼",
  kcal: 742,
  isDefault: true,
},
{
  id: "nakau-katsudon",
  name: "カツ丼",
  baseName: "カツ丼",
  kcal: 798,
  isDefault: true,
},
{
  id: "nakau-gyudon",
  name: "なか卯 牛丼",
  baseName: "なか卯牛丼",
  kcal: 633,
  isDefault: true,
},
{
  id: "nakau-haikara-udon",
  name: "はいからうどん",
  baseName: "はいからうどん",
  kcal: 303,
  isDefault: true,
},

// 松屋
{
  id: "matsuya-gyumeshi",
  name: "牛めし 並",
  baseName: "牛めし",
  kcal: 632,
  isDefault: true,
},
{
  id: "matsuya-curry",
  name: "カレー",
  baseName: "カレー",
  kcal: 737,
  isDefault: true,
},
{
  id: "matsuya-teishoku",
  name: "定食",
  baseName: "定食",
  kcal: 850,
  isDefault: true,
},

// すき家
{
  id: "sukiya-gyudon",
  name: "すき家 牛丼 並",
  baseName: "すき家牛丼",
  kcal: 733,
  isDefault: true,
},
{
  id: "sukiya-cheese-gyudon",
  name: "とろ〜り3種のチーズ牛丼",
  baseName: "チーズ牛丼",
  kcal: 1039,
  isDefault: true,
},

// 吉野家
{
  id: "yoshinoya-gyudon",
  name: "吉野家 牛丼 並",
  baseName: "吉野家牛丼",
  kcal: 633,
  isDefault: true,
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

// 伝説のすた丼
{
  id: "sutadon",
  name: "すた丼",
  baseName: "すた丼",
  kcal: 1150,
  isDefault: true,
},
{
  id: "tororo-sutadon",
  name: "とろろすた丼",
  baseName: "とろろすた丼",
  kcal: 1080,
  isDefault: true,
},
];