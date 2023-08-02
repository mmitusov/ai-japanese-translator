import * as DOMPurify from 'dompurify';
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

const kuroshiro = new Kuroshiro();
const analyzer = new KuromojiAnalyzer({
  dictPath: '/dict/',
});
const initializeKuroshiro = async () => {
  await kuroshiro.init(analyzer);
};
initializeKuroshiro()

interface Kanji {
  cleanRomaji: string;
  cleanFurigana: string;
}

export const kanjiAnnotation = async (kanji: string): Promise<Kanji> => {
  const cleanRomaji = await kuroshiro.convert(kanji, {
    to: 'romaji',
    mode: 'spaced',
    romajiSystem: 'passport',
  });
  const furigana = await kuroshiro.convert(kanji, {
    mode:"furigana", 
    to:"hiragana"
  });
  const cleanFurigana = DOMPurify.sanitize(furigana);

  return {cleanRomaji, cleanFurigana}
}