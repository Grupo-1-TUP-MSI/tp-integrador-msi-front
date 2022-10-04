import { LanguageType } from '@app/interfaces/interfaces';

interface Language {
  id: number;
  name: LanguageType;
  title: string;
  countryCode: string;
}

export const languages: Language[] = [
  {
    id: 1,
    name: 'es',
    title: 'Spanish',
    countryCode: 'es',
  },
  {
    id: 2,
    name: 'pt',
    title: 'Português',
    countryCode: 'pt',
  },
];
