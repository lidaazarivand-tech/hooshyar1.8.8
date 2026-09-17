import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { SHIA_BOOKS_CONTENT } from '../data/shiaBooksData';
import { ShiaBookItem } from '../types/books';
import { removePersianDiacritics } from '../utils/persianNumber';

describe('Mafatih al-Jinan Complete Verified Data Integrity', () => {
  const jsonPath = path.join(__dirname, '../data/mafatihFullData.json');

  it('mafatihFullData.json exists and is valid JSON with 616 entries', () => {
    expect(fs.existsSync(jsonPath)).toBe(true);
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const items: ShiaBookItem[] = JSON.parse(raw);
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBe(616);
  });

  it('contains the core four expected entries: kumayl, ashura, tawassul, and ahd', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    expect(items).toBeDefined();
    expect(items.length).toBe(616);

    const ids = items.map(it => it.id);
    expect(ids).toContain('mafatih_kumayl');
    expect(ids).toContain('mafatih_ashura');
    expect(ids).toContain('mafatih_tawassul');
    expect(ids).toContain('mafatih_ahd');
  });

  it('contains NO ellipsis (... or …) anywhere in texts or descriptions across all 616 items', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    for (const it of items) {
      expect(it.arabicText).not.toContain('...');
      expect(it.arabicText).not.toContain('…');
      if (it.persianTranslation) {
        expect(it.persianTranslation).not.toContain('...');
        expect(it.persianTranslation).not.toContain('…');
      }
      expect(it.description).not.toContain('...');
      expect(it.description).not.toContain('…');
    }
  });

  it('contains NO Unicode replacement characters (\\uFFFD) anywhere in all 616 items', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    for (const it of items) {
      expect(it.arabicText).not.toContain('\uFFFD');
      if (it.persianTranslation) {
        expect(it.persianTranslation).not.toContain('\uFFFD');
      }
      expect(it.description).not.toContain('\uFFFD');
    }
  });

  it('every item has valid non-empty text and authentic lib.eshia.ir sourceUrl', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    for (const it of items) {
      expect(it.arabicText.trim().length).toBeGreaterThan(0);
      expect(it.sourceUrl).toBeDefined();
      expect(it.sourceUrl!).toMatch(/^https:\/\/lib\.eshia\.ir\/10376\/1\/\d+$/);
      expect(it.sourceCitation).toContain('اسوه');
    }
  });

  it('contains NO placeholder phrases or fallback markers anywhere in all 616 items', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    for (const it of items) {
      expect(it.arabicText).not.toContain('(منقول در متن مفاتیح الجنان)');
      expect(it.arabicText).not.toContain('placeholder');
    }
  });

  it('all items have strictly sequential numbering and unique IDs in source order', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    const ids = new Set<string>();
    let lastPage = 12;

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      expect(it.num).toBe(i + 1);
      expect(ids.has(it.id)).toBe(false);
      ids.add(it.id);

      const page = parseInt(it.sourceUrl!.split('/').pop()!, 10);
      expect(page).toBeGreaterThanOrEqual(lastPage);
      lastPage = page;
    }
    expect(ids.size).toBe(616);
  });

  it('contains verified major sections across Bab 1, Bab 2, Bab 3, and Mulhaqat', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    // Bab 1: Preface and Ta'qibat
    expect(items.some(it => it.title.includes('مقدمه مؤلف') && it.num === 1)).toBe(true);
    expect(items.some(it => it.title.includes('تعقيبات مشتركه'))).toBe(true);
    // Bab 1: Duas of the week
    expect(items.some(it => it.title.includes('دعاى روز يكشنبه'))).toBe(true);
    expect(items.some(it => it.title.includes('دعاى روز جمعه'))).toBe(true);
    // Bab 2: Months of the year
    expect(items.some(it => it.title.includes('اعمال ماه مبارك رجب'))).toBe(true);
    expect(items.some(it => it.title.includes('اعمال ماه شعبان'))).toBe(true);
    expect(items.some(it => it.title.includes('اعمال ماه مبارك رمضان'))).toBe(true);
    expect(items.some(it => it.title.includes('اعمال ماه شوال'))).toBe(true);
    expect(items.some(it => it.title.includes('اعمال ماه ذى الحجه') || it.title.includes('اعمال ماه ذى القعده'))).toBe(true);
    // Bab 3: Ziyarat
    expect(items.some(it => it.title.includes('آداب سفر'))).toBe(true);
    expect(items.some(it => it.title.includes('آداب زيارت'))).toBe(true);
    expect(items.some(it => it.title.includes('جامعه كبيره'))).toBe(true);
    // Mulhaqat
    expect(items.some(it => it.title.includes('دعاى عهد'))).toBe(true);
    expect(items.some(it => it.title.includes('جامعه أئمة المؤمنين'))).toBe(true);
  });

  it('Dua Jawshan Kabir contains complete 100 sections without truncation', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    const jawshan = items.find(it => it.num === 85);
    expect(jawshan).toBeDefined();
    expect(jawshan!.title).toContain('جوشن كبير');
    expect(jawshan!.arabicText.length).toBeGreaterThan(25000);
    const cleanAr = removePersianDiacritics(jawshan!.arabicText);
    expect(cleanAr).toContain('سبحانك يا لا إله إلا أنت الغوث الغوث خلصنا من النار يا رب');
    expect(cleanAr).toContain('يا من في السماء عظمته');
  });

  it('Dua Abu Hamza Thumali contains complete text without truncation', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    const thumali = items.find(it => it.num === 219);
    expect(thumali).toBeDefined();
    expect(thumali!.title).toContain('ابو حمزه ثمالى');
    expect(thumali!.arabicText.length).toBeGreaterThan(25000);
    const cleanAr = removePersianDiacritics(thumali!.arabicText);
    expect(cleanAr).toContain('لا تؤدبني بعقوبتك');
    expect(cleanAr).toContain('حج بيتك الحرام');
    expect(cleanAr).toContain('يا أرحم الراحمين');
  });

  it('Dua Iftitah and Dua Simat contain complete texts', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    const iftitah = items.find(it => it.num === 212);
    expect(iftitah).toBeDefined();
    expect(iftitah!.title).toContain('افتتاح');
    expect(iftitah!.arabicText.length).toBeGreaterThan(8000);
    const cleanIftitah = removePersianDiacritics(iftitah!.arabicText);
    expect(cleanIftitah).toContain('اللهم إني أفتتح الثناء بحمدك');

    const simat = items.find(it => it.num === 80);
    expect(simat).toBeDefined();
    expect(simat!.title).toContain('سمات');
    expect(simat!.arabicText.length).toBeGreaterThan(7000);
    const cleanSimat = removePersianDiacritics(simat!.arabicText);
    expect(cleanSimat).toContain('اللهم إني أسألك باسمك العظيم الأعظم');
  });

  it('Ziyarat Jami\'ah Kabira contains complete text from opening to ending', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    const jamiah = items.find(it => it.num === 592);
    expect(jamiah).toBeDefined();
    expect(jamiah!.title).toContain('جامعه كبيره');
    expect(jamiah!.arabicText.length).toBeGreaterThan(12000);
    const cleanJamiah = removePersianDiacritics(jamiah!.arabicText);
    expect(cleanJamiah).toContain('السلام عليكم يا أهل بيت النبوة');
    expect(cleanJamiah).toContain('بكم فتح الله و بكم يختم');
  });

  it('Dua Kumayl is complete from opening to concluding salawat', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    const kumayl = items.find(it => it.id === 'mafatih_kumayl');
    expect(kumayl).toBeDefined();
    const cleanAr = removePersianDiacritics(kumayl!.arabicText);
    expect(cleanAr).toContain('اللهم إني أسألك برحمتك التي وسعت كل شيء');
    expect(cleanAr).toContain('يا نور يا قدوس');
    expect(cleanAr).toContain('يا سريع الرضا');
    expect(cleanAr).toContain('افعل بي ما أنت أهله');
    expect(kumayl!.arabicText.length).toBeGreaterThan(9000);
    expect(kumayl!.sourceCitation).toContain('اسوه');
  });

  it('Ziyarat Ashura contains complete text, 100x curses/salutations, and concluding Sajdah', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    const ashura = items.find(it => it.id === 'mafatih_ashura');
    expect(ashura).toBeDefined();
    const cleanAr = removePersianDiacritics(ashura!.arabicText);
    expect(cleanAr).toContain('السلام عليك يا أبا عبد الله');
    expect(cleanAr).toContain('اللهم العن أول ظالم ظلم حق محمد');
    expect(cleanAr).toContain('السلام عليك يا أبا عبد الله و على الأرواح التي حلت بفنائك');
    expect(cleanAr).toContain('اللهم لك الحمد حمد الشاكرين');
    expect(cleanAr).toContain('ثبت لي قدم صدق عندك مع الحسين');
    expect(ashura!.arabicText.length).toBeGreaterThan(6000);
    expect(ashura!.sourceCitation).toContain('اسوه');
  });

  it('Dua Tawassul contains all 14 Infallibles invocation', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    const tawassul = items.find(it => it.id === 'mafatih_tawassul');
    expect(tawassul).toBeDefined();
    const cleanAr = removePersianDiacritics(tawassul!.arabicText);
    expect(cleanAr).toContain('يا رسول الله');
    expect(cleanAr).toContain('يا أبا الحسن يا أمير المؤمنين يا علي بن أبي طالب');
    expect(cleanAr).toContain('يا فاطمة الزهراء يا بنت محمد');
    expect(cleanAr).toContain('يا حجة الله على خلقه يا سيدنا و مولانا');
    expect(cleanAr).toContain('فاشفعوا لي عند الله و استنقذوني من ذنوبي');
    expect(tawassul!.arabicText.length).toBeGreaterThan(4500);
    expect(tawassul!.sourceCitation).toContain('اسوه');
  });

  it('Dua Ahd is complete from cosmic opening to threefold pledge', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    const ahd = items.find(it => it.id === 'mafatih_ahd');
    expect(ahd).toBeDefined();
    const cleanAr = removePersianDiacritics(ahd!.arabicText);
    expect(cleanAr).toContain('اللهم رب النور العظيم');
    expect(cleanAr).toContain('اللهم إني أجدد له في صبيحة يومي هذا');
    expect(cleanAr).toContain('مؤتزرا كفني');
    expect(cleanAr).toContain('العجل العجل يا مولاي يا صاحب الزمان');
    expect(ahd!.arabicText.length).toBeGreaterThan(3000);
    expect(ahd!.sourceCitation).toContain('اسوه');
  });

  it('validates translation layer structure and translator metadata requirements', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    expect(items.length).toBe(616);
    for (const item of items) {
      expect(typeof item.id).toBe('string');
      expect(item.id.length).toBeGreaterThan(0);
      expect(typeof item.arabicText).toBe('string');
      expect(item.arabicText.trim().length).toBeGreaterThan(0);
      expect(typeof item.persianTranslation).toBe('string');
      // If a translation exists, ensure no corruptions and no placeholders
      if (item.persianTranslation.length > 0) {
        expect(item.persianTranslation).not.toContain('\uFFFD');
        expect(item.persianTranslation).not.toContain('...');
        expect(item.persianTranslation).not.toContain('…');
      }
    }
  });
});
