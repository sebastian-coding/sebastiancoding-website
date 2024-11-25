export const showDefaultLang = false;

export const languages = {
    en: 'English',
    es: 'Español',
};

export const defaultLang = 'en';

export const ui = {
    en: {
        'site.title': 'sebastiancoding - Through life and coding',
        'nav.home': 'Home',
        'nav.about': 'About me',
        'copyright:content': 'The content of',
        'copyright.site': 'this website',
        'copyright.connector': 'by',
        'copyright.license': 'is licensed under',
        'social.twitter': 'Follow me on Twitter',
        'social.instagram': 'Follow me on Instagram',
        'social.linkedin': 'Add me on LinkedIn',
        'social.github': 'Take a look at my coding style',
    },
    es: {
        'site.title': 'sebastiancoding - Entre la vida y el código',
        'nav.home': 'Inicio',
        'nav.about': 'Sobre mí',
        'copyright:content': 'El contenido de',
        'copyright.site': 'este sitio web',
        'copyright.connector': 'por',
        'copyright.license': 'se encuentra bajo licencia',
        'social.twitter': 'Sígueme en Twitter',
        'social.instagram': 'Sígueme en Instagram',
        'social.linkedin': 'Agrégame a LinkedIn',
        'social.github': 'Dale un vistazo a mi código',
    },
} as const;

type RoutesType = {
    [key: string]: Record<string, string>;
};

export const routes: RoutesType = {
    es: {
        'blog': 'blog',
        'about': 'sobre-mi'
    },
}