export type Nutrient = {name:string; role:string; url:string; color:string};

const nutrients:Record<string,Nutrient> = {
  protein:{name:'Protein',role:'Builds and maintains body tissue',url:'https://medlineplus.gov/dietaryproteins.html',color:'#ffc928'},
  fiber:{name:'Dietary fiber',role:'Supports healthy digestion',url:'https://medlineplus.gov/dietaryfiber.html',color:'#14b8a6'},
  calcium:{name:'Calcium',role:'Helps build strong bones and teeth',url:'https://medlineplus.gov/calcium.html',color:'#8c9aff'},
  vitaminD:{name:'Vitamin D',role:'Helps the body absorb calcium',url:'https://medlineplus.gov/vitaminddeficiency.html',color:'#f8ac55'},
  vitaminC:{name:'Vitamin C',role:'Supports skin and connective tissue',url:'https://medlineplus.gov/vitaminc.html',color:'#f27b94'},
  vitaminA:{name:'Vitamin A',role:'Supports normal vision',url:'https://medlineplus.gov/vitamins.html',color:'#a989ed'},
  vitaminB12:{name:'Vitamin B12',role:'Supports nerves and red blood cells',url:'https://medlineplus.gov/ency/article/002403.htm',color:'#5ba7ec'},
  iron:{name:'Iron',role:'Helps blood carry oxygen',url:'https://medlineplus.gov/iron.html',color:'#e99a70'},
  magnesium:{name:'Magnesium',role:'Supports muscles and nerves',url:'https://medlineplus.gov/ency/article/002423.htm',color:'#9cbb69'}
};

const byOrgan:Record<string,[string,string]> = {
  Brain:['vitaminB12','protein'],Heart:['fiber','magnesium'],Lungs:['iron','protein'],
  Kidney:['fiber','vitaminC'],Intestines:['fiber','protein'],Stomach:['protein','vitaminB12'],
  Liver:['fiber','protein'],Skin:['vitaminC','protein'],Spine:['calcium','vitaminD'],
  Bladder:['fiber','vitaminC'],Knee:['calcium','vitaminD'],Head:['vitaminB12','protein'],
  Eye:['vitaminA','vitaminC'],Ear:['vitaminB12','protein'],Throat:['vitaminC','protein'],
  Tooth:['calcium','vitaminD'],Shoulder:['protein','calcium']
};

export function nutritionTopicsFor(organ:string):Nutrient[] {
  return (byOrgan[organ]??['protein','fiber']).map(key=>nutrients[key]);
}
