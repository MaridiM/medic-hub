import fs from 'fs';
import path from 'path';

import languages from './locales';
import { isDev } from '@/shared/utils/is-dev.util';

export const LANGUAGES = Object.keys(languages) as (keyof typeof languages)[];
export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'en';

// ✅ убран лишний "core/i18n"
export const DEV_LOCALE_PATH = path.join(process.cwd(), 'src/core/i18n/locales');
// export const LOCALE_DIR = isDev ? DEV_LOCALE_PATH : path.join(__dirname, 'locales');
export const LOCALE_DIR = path.join(__dirname, 'locales');
export const LOCALE_FILE_PATH = path.join(LOCALE_DIR, '{{lng}}/{{ns}}.json');


for (const lang of LANGUAGES) {
  const langPath = path.join(LOCALE_DIR, lang);
  if (!fs.existsSync(langPath)) {
    console.warn(`[i18n] Missing translations folder for language: ${lang}`);
  }
}

export const NAMESPACES = fs
  .readdirSync(path.join(LOCALE_DIR, LANGUAGES[0]))
  .filter(file => file.endsWith('.json'))
  .map(file => file.replace('.json', ''));
