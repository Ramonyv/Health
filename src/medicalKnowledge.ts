import data from './knowledge.json';
import hindi from './knowledge.hi.json';
import hindiQuestions from './questions.hi.json';
import spanish from './knowledge.es.json';
import french from './knowledge.fr.json';
import chinese from './knowledge.zh.json';
import spanishQuestions from './questions.es.json';
import frenchQuestions from './questions.fr.json';
import chineseQuestions from './questions.zh.json';

export type Answer = {question:string; text:string; source:string; url:string};
const knowledge = data as Record<string, string[][]>;
const hindiKnowledge = hindi as Record<string, string[]>;
const questionsHi = hindiQuestions as Record<string, string[]>;
const translatedKnowledge:Record<string,Record<string,string[]>>={hi:hindiKnowledge,es:spanish,fr:french,zh:chinese};
const translatedQuestions:Record<string,Record<string,string[]>>={hi:questionsHi,es:spanishQuestions,fr:frenchQuestions,zh:chineseQuestions};
const stopWords = new Set('a about am an and are can do does for have how i in is it my of on or the to what why with your'.split(' '));
const words = (value:string) => value.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(word => word.length > 2 && !stopWords.has(word));

export function answersFor(organ:string):Answer[] {
  return (knowledge[organ] ?? []).map(([question,text,source,keywords,url]) => ({question,text,source,url}));
}

export function translatedAnswer(organ:string, answer:Answer, language:string):string {
  if(!translatedKnowledge[language])return answer.text;
  const index=knowledge[organ]?.findIndex(([question])=>question===answer.question)??-1;
  return translatedKnowledge[language][organ]?.[index]??answer.text;
}

export function translatedQuestion(organ:string, answer:Answer, language:string):string {
  if(!translatedQuestions[language])return answer.question;
  const index=knowledge[organ]?.findIndex(([question])=>question===answer.question)??-1;
  return translatedQuestions[language][organ]?.[index]??answer.question;
}

export function matchLocalizedAnswer(organ:string, query:string, language:string):Answer|undefined {
  if(language==='hi')return matchHindiAnswer(organ,query);
  if(!translatedKnowledge[language])return undefined;
  const normalize=(value:string)=>value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const stop=new Set('a al au aux de del des du el en et la las le les los un una une y que que es est se su sus son pour por con avec dans como comment que quoi sur me mi mon ma mes the of and or what is how can'.split(' '));
  const tokens=(value:string)=>normalize(value).split(/[^a-z\p{Script=Han}]+/u).filter(word=>word.length>2&&!stop.has(word));
  const queryTokens=language==='zh'?[...normalize(query).replace(/[^\p{Script=Han}]/gu,'')].map((_,i,all)=>all.slice(i,i+2).join('')).filter(x=>x.length===2):tokens(query);
  if(!queryTokens.length)return undefined;
  let best=-1,score=0;
  translatedKnowledge[language][organ]?.forEach((text,index)=>{
    const body=normalize(`${translatedQuestions[language][organ]?.[index]??''} ${text}`);
    const words=language==='zh'?null:new Set(tokens(body));
    const found=queryTokens.filter(term=>language==='zh'?body.includes(term):words?.has(term)).length;
    if(found>score){score=found;best=index}
  });
  return score>0?answersFor(organ)[best]:undefined;
}

export function matchHindiAnswer(organ:string, query:string):Answer|undefined {
  const normalize=(value:string)=>value.toLocaleLowerCase('hi').normalize('NFD').replace(/[ँं़]/g,'');
  const ignore=new Set(['क्या','है','हैं','मेरे','मेरी','में','और','का','की','के','से','को','हो','रहा','रही','क्यों','बारे','बताएं','बताइए']);
  const terms=normalize(query).split(/[^\p{L}\p{M}]+/u).filter(term=>term.length>2&&!ignore.has(term));
  if(!terms.length)return undefined;
  let best=-1,score=0;
  (hindiKnowledge[organ]??[]).forEach((text,index)=>{const words=new Set(normalize(text).split(/[^\p{L}\p{M}]+/u));const found=terms.filter(term=>words.has(term)).length;if(found>score){score=found;best=index}});
  return score>0?answersFor(organ)[best]:undefined;
}

export function matchAnswer(organ:string, query:string):Answer|undefined {
  const entries = answersFor(organ);
  const normalized = query.toLowerCase();
  if (/\b(how|what)\b.*\b(work|function|do)\b|\blearn about\b/.test(normalized)) return entries[0];
  const organWords = new Set(words(organ));
  const queryWords = new Set(words(query).filter(word => !organWords.has(word)));
  let best:Answer|undefined;
  let bestScore = 0;
  entries.forEach((entry,index) => {
    const terms = new Set(words(knowledge[organ][index][3]+' '+entry.question).filter(word => !organWords.has(word)));
    const score = [...queryWords].reduce((sum,word) => sum + (terms.has(word) ? 1 : 0),0);
    if (score > bestScore) {bestScore=score;best=entry;}
  });
  return bestScore > 0 ? best : undefined;
}

export function searchUrl(query:string):string {
  return `https://medlineplus.gov/search/?query=${encodeURIComponent(query)}`;
}
