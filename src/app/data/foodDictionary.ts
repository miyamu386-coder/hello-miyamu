export type FoodDictionaryItem = {
  id: string;
  name: string;
  kcal: number;
};

export const FOOD_DICTIONARY: FoodDictionaryItem[] = [
  // 主食
  {
    id: "rice-150g",
    name: "ご飯 150g",
    kcal: 234,
  },
  {
    id: "rice-200g",
    name: "ご飯 200g",
    kcal: 312,
  },
  {
    id: "bread-6slice-1",
    name: "食パン 6枚切り 1枚",
    kcal: 150,
  },
  {
    id: "udon-1serving",
    name: "うどん 1玉",
    kcal: 240,
  },
  {
    id: "pasta-boiled-200g",
    name: "パスタ ゆで 200g",
    kcal: 300,
  },

  // たんぱく質
  {
    id: "natto-1pack",
    name: "納豆 1パック",
    kcal: 90,
  },
  {
    id: "egg-1",
    name: "卵 1個",
    kcal: 71,
  },
  {
    id: "chicken-breast-100g",
    name: "鶏むね肉 100g",
    kcal: 133,
  },
  {
    id: "chicken-thigh-100g",
    name: "鶏もも肉 100g",
    kcal: 190,
  },
  {
    id: "tofu-150g",
    name: "豆腐 150g",
    kcal: 110,
  },

  // 乳製品・飲み物
  {
    id: "milk-200ml",
    name: "牛乳 200ml",
    kcal: 122,
  },
  {
    id: "yogurt-100g",
    name: "プレーンヨーグルト 100g",
    kcal: 56,
  },
  {
    id: "cola-500ml",
    name: "コーラ 500ml",
    kcal: 225,
  },

  // 果物・軽食
  {
    id: "banana-1",
    name: "バナナ 1本",
    kcal: 90,
  },
  {
    id: "apple-half",
    name: "りんご 1/2個",
    kcal: 70,
  },
  {
    id: "onigiri-1",
    name: "おにぎり 1個",
    kcal: 180,
  },
];