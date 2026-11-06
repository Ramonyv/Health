import data from './knowledge.json';

export type Answer = {question:string; text:string; source:string; url:string};
const knowledge = data as Record<string, string[][]>;
const stopWords = new Set('a about am an and are can do does for have how i in is it my of on or the to what why with your'.split(' '));
const words = (value:string) => value.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(word => word.length > 2 && !stopWords.has(word));

export function answersFor(organ:string):Answer[] {
  return (knowledge[organ] ?? []).map(([question,text,source,keywords,url]) => ({question,text,source,url}));
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
