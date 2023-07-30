import * as DOMPurify from 'dompurify';
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

const kuroshiro = new Kuroshiro();
const analyzer = new KuromojiAnalyzer({
  dictPath: '/dict/',
});

const kanjiAnnotation = async (kanji: string) => {
    await kuroshiro.init(analyzer);
    const romaji = await kuroshiro.convert(kanji, {
      to: 'romaji',
      mode: 'spaced',
      romajiSystem: 'passport',
    });
    const furigana = await kuroshiro.convert(kanji, {
      mode:"furigana", 
      to:"hiragana"
    });
    const clean = DOMPurify.sanitize(furigana);
}

