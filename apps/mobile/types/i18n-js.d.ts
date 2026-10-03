declare module 'i18n-js' {
    interface Translations {
      [key: string]: Record<string, string>;
    }
  
    interface I18n {
      translations: Translations;
      defaultLocale: string;
      locale: string;
      fallbacks: boolean;
      t: (key: string) => string;
    }
  
    const i18n: I18n;
    export = i18n;
  }
  