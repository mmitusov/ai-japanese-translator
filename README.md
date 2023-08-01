npm i sass
npm i react-speech-recognition
npm i --save regenerator-runtime //To fix an Error [ReferenceError]: regeneratorRuntime is not defined - import 'regenerator-runtime/runtime'
npm i kuroshiro - for kanji annotation
npm i kuroshiro-analyzer-kuromoji - for kanji annotation
npm i dompurify - XSS sanitizer for HTML, MathML and SVG when we're using 'dangerouslySetInnerHTML'

# Описание приложения
Данное приложение может переводить любой текст на японский, после чего озвучить перевод или отобразить его в виде фуриганы.

За каждый из этапов отвечает отдельный искуственный интелект:
- Whisper AI - речь в текст;
- DeepL - перевод;
- VOICEVOX - текст в речь.

Приложение состоит из двух основных компонентов: Input.tsx и Translation.tsx. Input.tsx отвечает за запись речи в аудио файл, трансформацию аудио в текст и перевод сгенерированого текста. Translation.tsx отвечает за отображение текстового перевода и дополнительно генерацию перевода в аудио файл, а также отображение перевода в виде фуриганы.

# Тех особенности приложения
Изначально планировалость сделать распознавание речи через библиотеку "react-speech-recognition", но вместо этого я решил сделать собственнй контеризированный API с Whisper AI. API принимает form-data с полем 'file', в котором сохранен аудио файл.

Когда я получаею от Whisper AI траскрипт моей речи в виде текста, почему-то строка всегда сожержит пустой пробел в своем начале. Поэтому перед сохранением строки, сперва я избавляюсь от пробела - "const data = await response.data.results[0].transcript.trimStart();".

VOICEVOX, для конвертации текста в голос, сперва должен сгенерировать параметры для этой конвертации, а после чего уже по этим параметрам засентезировать голос. Генерация параметров вылняется POST запросом на "/audio_query". После чего мы передаем сгенерированные параметры POST запросом в "/synthesis".

При полочении аудиофайла с бекенда и попытке его воспроизвести, изначально я поличил следующею ошибку: NotAllowedError: The request is not allowed by the user agent or the platform in the current context, possibly because the user denied permission. (https://arrangeactassert.com/posts/how-to-fix-the-request-is-not-allowed-by-the-user-agent-or-the-platform-in-the-current-context-possibly-because-the-user-denied-permission/). Данная ошибка возникла, так как я попытался инициализировать аудио и сразу же его проиграть сразу же внутри одной функции. После чего я получил эту ошибку так как браузер don't allow sites to autoplay audio or videos without user interaction. Поэтому после того как я разбил этот функционал на две разные части (отдельно инициализация, отдельно проигрывание) - ошибка изчезла.

If we want we can convert one Blob data type into another Blob data type (e.g. video to audio) by using following method: "const audioBlob = new Blob(audioChunks, {type: audio/mpeg});".

Для аннотации кандзи, например в фуригану, я воспользовался библиотекой 'kuroshiro'. Ее можно использовать как для бекенда, так и для фронтенда. Однако для ее работы на фронтенде нужно знать о ее некоторых особенностях.

Для аннотации кандзи 'kuroshiro' использует группу своих библиотек (dictionaries), где хранятся данные по которым идет преобразование кандзи. Эти библиотеки храняться в `node_modules -> kuromoji -> dict`. Модуль 'kuromoji' устанавливается автоматически, вместе с установкой 'kuroshiro-analyzer-kuromoji'. И при инициализации 'analyzer', нам нужно передавать путь к этим библиотекам, для корректной работы приложения:
```
const analyzer = new KuromojiAnalyzer({
  dictPath: '/dict/',
});
```

Однако при работе с NextJS, возникает проблема. Так как по дефолту все статические файлы должны храниться в папке 'public'.　Поэтому из коробки NextJS не дает достучаться к папке `node_modules -> kuromoji -> dict`, а ищет данные все в папке 'public'. Как временное решение данной проблемы, я копировал папку 'dict' из 'kuromoji' в 'public'. После чего уже указал путь к данным файлам. С такими изменениями приложение начало нормально работать.
Ссылка на найденое решение: https://github.com/hexenq/kuroshiro-analyzer-kuromoji/issues/5#issuecomment-441417026.
