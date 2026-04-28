import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as 'es' | 'en')) {
    locale = routing.defaultLocale
  }

  const [common, home, soluciones, proyectos, sobreNosotros, contacto, blog] = await Promise.all([
    import(`../locales/${locale}/common.json`),
    import(`../locales/${locale}/home.json`),
    import(`../locales/${locale}/soluciones.json`),
    import(`../locales/${locale}/proyectos.json`),
    import(`../locales/${locale}/sobre-nosotros.json`),
    import(`../locales/${locale}/contacto.json`),
    import(`../locales/${locale}/blog.json`),
  ])

  return {
    locale,
    messages: {
      ...common.default,
      home: home.default,
      soluciones: soluciones.default,
      proyectos: proyectos.default,
      'sobre-nosotros': sobreNosotros.default,
      contacto: contacto.default,
      blog: blog.default,
    },
  }
})
