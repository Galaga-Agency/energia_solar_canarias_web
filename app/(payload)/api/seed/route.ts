import { NextResponse } from "next/server"
import sharp from "sharp"
import { getPayloadClient } from "@/lib/payload"

/**
 * Dev seed endpoint — creates an admin user, the four editorial pillars,
 * a set of tags and a dozen test articles with stock imagery.
 *
 * Usage:  GET /api/seed?secret=esc-seed-2026
 * Idempotent: re-running skips docs that already exist (matched by slug/email).
 * Disabled in production.
 */

const SECRET = "esc-seed-2026"

const ADMIN = { email: "soporte@galagaagency.com", password: "Galaga2024*" }

const CATEGORIES = [
  { slug: "observatorio", order: 1, label: "Observatorio", tagline: "Datos del sector",
    description: "Informes breves, actualizaciones del sector y datos locales del mercado energético canario.",
    labelEn: "Observatory", taglineEn: "Sector data",
    descriptionEn: "Brief reports, sector updates and local data on the Canary Islands energy market." },
  { slug: "casos-reales", order: 2, label: "Casos reales", tagline: "Proyectos en marcha",
    description: "Instalaciones reales, cifras y aprendizajes técnicos de proyectos ejecutados en las islas.",
    labelEn: "Real cases", taglineEn: "Projects under way",
    descriptionEn: "Real installations, figures and technical learnings from projects delivered across the islands." },
  { slug: "educativo", order: 3, label: "Educativo", tagline: "Aprende a decidir",
    description: "Contenido de valor para entender el autoconsumo, el ahorro energético y la transición renovable.",
    labelEn: "Educational", taglineEn: "Learn to decide",
    descriptionEn: "Valuable content to understand self-consumption, energy savings and the renewable transition." },
  { slug: "opinion", order: 4, label: "Opinión", tagline: "Liderazgo local",
    description: "Visión y análisis sobre el futuro energético de Canarias y el papel de las empresas insulares.",
    labelEn: "Opinion", taglineEn: "Local leadership",
    descriptionEn: "Vision and analysis on the energy future of the Canary Islands and the role of island businesses." },
]

const TAGS = [
  "autoconsumo", "fotovoltaica", "baterias", "subvenciones", "hoteles",
  "industria", "tenerife", "gran-canaria", "normativa", "ahorro",
]

const AUTHORS = ["Energía Solar Canarias", "Equipo Técnico ESC", "Observatorio ESC"]

type Article = {
  title: string; excerpt: string; body: string[]
  titleEn: string; excerptEn: string; bodyEn: string[]
  category: string; tags: string[]; imgSeed: string
}

const ARTICLES: Article[] = [
  {
    title: "El mapa solar de Canarias en 2026: dónde crece el autoconsumo",
    excerpt: "Un repaso a las islas donde más han crecido las instalaciones fotovoltaicas y qué hay detrás de cada cifra.",
    titleEn: "The 2026 solar map of the Canary Islands: where self-consumption is growing",
    excerptEn: "A look at the islands where photovoltaic installations have grown the most — and what lies behind each figure.",
    category: "observatorio", tags: ["fotovoltaica", "gran-canaria"], imgSeed: "esc-solar-map",
    body: [
      "El autoconsumo fotovoltaico ha dejado de ser una promesa para convertirse en una realidad medible en el archipiélago. Los datos de 2026 muestran un crecimiento desigual entre islas, pero sostenido en su conjunto.",
      "Gran Canaria y Tenerife concentran la mayor parte de la potencia instalada, impulsadas por el tejido hotelero e industrial. Sin embargo, las islas menores muestran las tasas de crecimiento relativo más altas.",
      "En este primer informe del Observatorio analizamos qué factores explican estas diferencias y hacia dónde apunta la tendencia para los próximos trimestres.",
    ],
    bodyEn: [
      "Photovoltaic self-consumption has stopped being a promise and become a measurable reality across the archipelago. The 2026 data shows uneven growth between islands, yet a sustained trend overall.",
      "Gran Canaria and Tenerife concentrate most of the installed capacity, driven by the hotel and industrial sectors. The smaller islands, however, show the highest relative growth rates.",
      "In this first Observatory report we analyse the factors behind these differences and where the trend points for the coming quarters.",
    ],
  },
  {
    title: "Instalación fotovoltaica en un hotel de 4 estrellas: cifras reales",
    excerpt: "Cómo un complejo hotelero del sur de Gran Canaria redujo su factura energética un 38% en el primer año.",
    titleEn: "Photovoltaic installation in a 4-star hotel: the real numbers",
    excerptEn: "How a hotel complex in the south of Gran Canaria cut its energy bill by 38% in the first year.",
    category: "casos-reales", tags: ["hoteles", "ahorro", "gran-canaria"], imgSeed: "esc-hotel",
    body: [
      "Cuando este hotel nos contactó, su consumo eléctrico representaba uno de sus mayores costes operativos fijos. El reto era claro: reducir la factura sin comprometer el confort de los huéspedes.",
      "Diseñamos una instalación de autoconsumo dimensionada a partir de su curva de carga real, priorizando las horas de mayor demanda diurna.",
      "El resultado tras doce meses: una reducción del 38% en la factura energética y una amortización proyectada por debajo de los cinco años.",
    ],
    bodyEn: [
      "When this hotel contacted us, its electricity consumption was one of its largest fixed operating costs. The challenge was clear: cut the bill without compromising guest comfort.",
      "We designed a self-consumption installation sized from its real load curve, prioritising the hours of highest daytime demand.",
      "The result after twelve months: a 38% reduction in the energy bill and a projected payback period under five years.",
    ],
  },
  {
    title: "Autoconsumo industrial: cinco preguntas antes de empezar",
    excerpt: "Las dudas que toda dirección financiera se plantea antes de invertir en energía solar para su nave o fábrica.",
    titleEn: "Industrial self-consumption: five questions before you start",
    excerptEn: "The doubts every finance director weighs up before investing in solar energy for their warehouse or factory.",
    category: "educativo", tags: ["industria", "autoconsumo", "ahorro"], imgSeed: "esc-industria",
    body: [
      "Invertir en autoconsumo industrial no es solo una decisión técnica: es una decisión financiera con implicaciones a largo plazo.",
      "Antes de pedir un presupuesto, conviene tener claras cinco preguntas: cuánto consumo realmente, en qué franjas, qué superficie disponible tengo, qué ayudas existen y cuál es mi horizonte de amortización.",
      "Responderlas con datos —no con intuiciones— es el primer paso para que la inversión tenga sentido.",
    ],
    bodyEn: [
      "Investing in industrial self-consumption is not just a technical decision: it is a financial one with long-term implications.",
      "Before asking for a quote, you should be clear on five questions: how much do I really consume, in which time bands, how much usable surface do I have, what grants exist, and what is my payback horizon.",
      "Answering them with data — not intuition — is the first step to making the investment make sense.",
    ],
  },
  {
    title: "Baterías en Canarias: ¿merecen la pena en 2026?",
    excerpt: "El almacenamiento energético deja de ser un lujo y empieza a tener números en el contexto insular.",
    titleEn: "Batteries in the Canary Islands: are they worth it in 2026?",
    excerptEn: "Energy storage is no longer a luxury and is starting to add up in the island context.",
    category: "educativo", tags: ["baterias", "autoconsumo"], imgSeed: "esc-baterias",
    body: [
      "Durante años, las baterías fueron el componente que más alargaba la amortización de cualquier instalación. Eso está cambiando.",
      "La caída sostenida del precio del almacenamiento, unida a la estructura tarifaria insular, hace que en ciertos perfiles de consumo las baterías ya tengan retorno.",
      "Analizamos en qué casos sí y en qué casos todavía no, sin atajos ni promesas vacías.",
    ],
    bodyEn: [
      "For years, batteries were the component that stretched out the payback of any installation the most. That is changing.",
      "The sustained fall in storage prices, combined with the island tariff structure, means that for certain consumption profiles batteries already pay off.",
      "We analyse where they do and where they still don't — no shortcuts, no empty promises.",
    ],
  },
  {
    title: "Subvenciones activas para autoconsumo: guía actualizada",
    excerpt: "Qué ayudas siguen vigentes en el archipiélago y cómo encajan con tu proyecto fotovoltaico.",
    titleEn: "Active self-consumption grants: an up-to-date guide",
    excerptEn: "Which grants are still available across the archipelago and how they fit your photovoltaic project.",
    category: "observatorio", tags: ["subvenciones", "normativa"], imgSeed: "esc-ayudas",
    body: [
      "El panorama de ayudas al autoconsumo cambia con frecuencia, y mantenerse al día es parte del valor que aportamos.",
      "En esta guía recogemos los programas de financiación activos, sus plazos y los requisitos clave para que tu instalación pueda acogerse a ellos.",
      "Actualizamos este contenido de forma periódica: si una convocatoria cierra o se abre otra, lo verás reflejado aquí.",
    ],
    bodyEn: [
      "The landscape of self-consumption grants changes frequently, and keeping up to date is part of the value we provide.",
      "In this guide we gather the active funding programmes, their deadlines and the key requirements for your installation to qualify.",
      "We update this content regularly: if a call closes or another opens, you'll see it reflected here.",
    ],
  },
  {
    title: "El futuro energético de Canarias pasa por la energía libre",
    excerpt: "Una reflexión sobre el papel de las empresas insulares en la transición hacia un modelo más autónomo.",
    titleEn: "The energy future of the Canary Islands runs through free energy",
    excerptEn: "A reflection on the role of island businesses in the transition towards a more self-sufficient model.",
    category: "opinion", tags: ["normativa"], imgSeed: "esc-futuro",
    body: [
      "Hablar del futuro energético de Canarias es hablar de independencia. Un territorio aislado tiene incentivos únicos para producir su propia energía.",
      "Las empresas insulares no son meras consumidoras: son actores clave en la construcción de un modelo energético más resiliente.",
      "Esta es nuestra visión, y la defenderemos con datos y con proyectos reales en cada artículo del Observatorio.",
    ],
    bodyEn: [
      "To talk about the energy future of the Canary Islands is to talk about independence. An isolated territory has unique incentives to produce its own energy.",
      "Island businesses are not mere consumers: they are key players in building a more resilient energy model.",
      "This is our vision, and we will defend it with data and real projects in every Observatory article.",
    ],
  },
  {
    title: "Cómo leer tu factura de la luz como un experto",
    excerpt: "Términos, peajes y conceptos que conviene entender antes de dar el paso al autoconsumo.",
    titleEn: "How to read your electricity bill like an expert",
    excerptEn: "Terms, tolls and concepts worth understanding before taking the step to self-consumption.",
    category: "educativo", tags: ["ahorro", "autoconsumo"], imgSeed: "esc-factura",
    body: [
      "La factura de la luz está diseñada para ser confusa. Pero entenderla es el primer paso para reducirla.",
      "Repasamos los conceptos esenciales: potencia contratada, término de energía, peajes y discriminación horaria.",
      "Con esta base, cualquier propuesta de autoconsumo que recibas dejará de ser una caja negra.",
    ],
    bodyEn: [
      "The electricity bill is designed to be confusing. But understanding it is the first step to reducing it.",
      "We go over the essential concepts: contracted power, energy term, tolls and time-of-use pricing.",
      "With this foundation, any self-consumption proposal you receive will stop being a black box.",
    ],
  },
  {
    title: "Caso real: comunidad de vecinos que comparte su energía",
    excerpt: "El autoconsumo colectivo aplicado a un edificio residencial en Tenerife, paso a paso.",
    titleEn: "Real case: a residents' community that shares its energy",
    excerptEn: "Collective self-consumption applied to a residential building in Tenerife, step by step.",
    category: "casos-reales", tags: ["autoconsumo", "tenerife"], imgSeed: "esc-comunidad",
    body: [
      "El autoconsumo colectivo permite que varios vecinos compartan una misma instalación. Sobre el papel suena simple; en la práctica, requiere coordinación.",
      "Acompañamos a esta comunidad desde la junta inicial hasta el reparto de coeficientes entre viviendas.",
      "Hoy, sus vecinos pagan menos por su energía y han convertido un tejado infrautilizado en un activo común.",
    ],
    bodyEn: [
      "Collective self-consumption lets several neighbours share a single installation. On paper it sounds simple; in practice, it takes coordination.",
      "We accompanied this community from the first residents' meeting to allocating the distribution coefficients between homes.",
      "Today, its residents pay less for their energy and have turned an underused rooftop into a shared asset.",
    ],
  },
  {
    title: "Mitos del autoconsumo que siguen frenando decisiones",
    excerpt: "«No hay sol suficiente», «es muy caro», «no compensa»: desmontamos las creencias más habituales.",
    titleEn: "Self-consumption myths that still hold decisions back",
    excerptEn: "“There isn't enough sun”, “it's too expensive”, “it doesn't pay off”: we take apart the most common beliefs.",
    category: "opinion", tags: ["autoconsumo", "ahorro"], imgSeed: "esc-mitos",
    body: [
      "Pocos sectores arrastran tantos mitos como el de la energía solar. Y muchos de ellos sobreviven pese a estar desmentidos por los datos.",
      "Repasamos los más frecuentes y los contrastamos con la realidad de las instalaciones que operamos en Canarias.",
      "El objetivo no es vender: es que decidas con información, no con prejuicios.",
    ],
    bodyEn: [
      "Few sectors carry as many myths as solar energy. And many of them survive despite being disproven by the data.",
      "We go through the most common ones and contrast them with the reality of the installations we operate in the Canary Islands.",
      "The goal isn't to sell: it's for you to decide with information, not prejudice.",
    ],
  },
  {
    title: "Mantenimiento fotovoltaico: qué incluye y por qué importa",
    excerpt: "Una instalación bien mantenida produce más y dura más. Te contamos qué vigilar.",
    titleEn: "Photovoltaic maintenance: what it includes and why it matters",
    excerptEn: "A well-maintained installation produces more and lasts longer. We tell you what to watch.",
    category: "educativo", tags: ["fotovoltaica", "industria"], imgSeed: "esc-mantenimiento",
    body: [
      "Una instalación fotovoltaica no es «ponerla y olvidarse». El mantenimiento marca la diferencia entre el rendimiento prometido y el real.",
      "Explicamos qué tareas componen un plan de mantenimiento serio: monitorización, limpieza, revisión de inversores y análisis de producción.",
      "El acompañamiento continuo es uno de nuestros pilares, y aquí está el porqué.",
    ],
    bodyEn: [
      "A photovoltaic installation is not a “set it and forget it” affair. Maintenance is the difference between the promised performance and the real one.",
      "We explain the tasks that make up a serious maintenance plan: monitoring, cleaning, inverter checks and production analysis.",
      "Continuous support is one of our pillars, and here is why.",
    ],
  },
  {
    title: "Industria canaria: el sol como ventaja competitiva",
    excerpt: "Por qué cada vez más fábricas del archipiélago integran el autoconsumo en su estrategia.",
    titleEn: "Canary Islands industry: the sun as a competitive advantage",
    excerptEn: "Why more and more factories across the archipelago are building self-consumption into their strategy.",
    category: "casos-reales", tags: ["industria", "ahorro"], imgSeed: "esc-fabrica",
    body: [
      "Para una industria, la energía es coste y, cada vez más, también es reputación. El autoconsumo aborda ambas dimensiones.",
      "Recogemos el patrón común de varias fábricas con las que hemos trabajado: dimensionado sobre demanda diurna y retorno medible.",
      "El sol, en un territorio como el nuestro, es literalmente una ventaja competitiva.",
    ],
    bodyEn: [
      "For industry, energy is a cost and, increasingly, also reputation. Self-consumption addresses both dimensions.",
      "We capture the common pattern across several factories we've worked with: sizing based on daytime demand and measurable returns.",
      "The sun, in a territory like ours, is literally a competitive advantage.",
    ],
  },
  {
    title: "Normativa de autoconsumo en Canarias: lo esencial",
    excerpt: "El marco regulatorio explicado sin tecnicismos, para que sepas a qué atenerte.",
    titleEn: "Self-consumption regulations in the Canary Islands: the essentials",
    excerptEn: "The regulatory framework explained without jargon, so you know where you stand.",
    category: "observatorio", tags: ["normativa", "subvenciones"], imgSeed: "esc-normativa",
    body: [
      "La normativa de autoconsumo puede parecer un laberinto, pero sus principios son comprensibles.",
      "Resumimos lo esencial: tipos de autoconsumo, tramitación, compensación de excedentes y particularidades del contexto insular.",
      "Mantenemos este artículo actualizado conforme evoluciona el marco regulatorio.",
    ],
    bodyEn: [
      "Self-consumption regulations can look like a maze, but their principles are understandable.",
      "We summarise the essentials: types of self-consumption, processing, surplus compensation and the particularities of the island context.",
      "We keep this article up to date as the regulatory framework evolves.",
    ],
  },
]

// ── Lexical builders ─────────────────────────────────────────────────────
type LexNode = Record<string, unknown>
const textNode = (t: string): LexNode => ({ type: "text", text: t, format: 0, style: "", mode: "normal", detail: 0, version: 1 })
const paragraph = (t: string): LexNode => ({ type: "paragraph", children: [textNode(t)], direction: "ltr", format: "", indent: 0, version: 1 })
const heading = (t: string): LexNode => ({ type: "heading", tag: "h2", children: [textNode(t)], direction: "ltr", format: "", indent: 0, version: 1 })
function buildBody(paras: string[], headingLabel: string): { root: LexNode } {
  const children: LexNode[] = []
  paras.forEach((p, i) => {
    if (i === 1) children.push(heading(headingLabel))
    children.push(paragraph(p))
  })
  return { root: { type: "root", children, direction: "ltr", format: "", indent: 0, version: 1 } }
}

function slugify(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70)
}

async function fetchWebp(url: string): Promise<Buffer> {
  const res = await fetch(url, { redirect: "follow" })
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  return sharp(buf).resize(1200, 675, { fit: "cover" }).webp({ quality: 80 }).toBuffer()
}

export async function GET(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "disabled in production" }, { status: 403 })
  }
  const url = new URL(req.url)
  if (url.searchParams.get("secret") !== SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const payload = await getPayloadClient()
  const log: string[] = []

  // 1. Admin user
  const existingUser = await payload.find({ collection: "users", where: { email: { equals: ADMIN.email } }, limit: 1 })
  if (existingUser.docs.length === 0) {
    await payload.create({ collection: "users", data: { email: ADMIN.email, password: ADMIN.password } })
    log.push(`user created: ${ADMIN.email}`)
  } else {
    log.push(`user exists: ${ADMIN.email}`)
  }

  // 2. Categories (es + en)
  const catIdBySlug = new Map<string, number | string>()
  for (const c of CATEGORIES) {
    const found = await payload.find({ collection: "categories", where: { slug: { equals: c.slug } }, limit: 1, locale: "es" })
    if (found.docs.length > 0) {
      catIdBySlug.set(c.slug, found.docs[0].id)
      continue
    }
    const doc = await payload.create({
      collection: "categories", locale: "es",
      data: { slug: c.slug, label: c.label, tagline: c.tagline, description: c.description, order: c.order },
    })
    await payload.update({
      collection: "categories", id: doc.id, locale: "en",
      data: { slug: c.slug, label: c.labelEn, tagline: c.taglineEn, description: c.descriptionEn },
    })
    catIdBySlug.set(c.slug, doc.id)
    log.push(`category: ${c.slug} (es+en)`)
  }

  // 3. Tags (es + en — slug shared, name translated)
  const tagIdBySlug = new Map<string, number | string>()
  for (const slug of TAGS) {
    const found = await payload.find({ collection: "tags", where: { slug: { equals: slug } }, limit: 1, locale: "es" })
    if (found.docs.length > 0) {
      tagIdBySlug.set(slug, found.docs[0].id)
      continue
    }
    const name = slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())
    const doc = await payload.create({ collection: "tags", locale: "es", data: { name, slug } })
    await payload.update({ collection: "tags", id: doc.id, locale: "en", data: { name, slug } })
    tagIdBySlug.set(slug, doc.id)
    log.push(`tag: ${slug}`)
  }

  // 4. Articles (es + en)
  let created = 0
  for (let i = 0; i < ARTICLES.length; i++) {
    const a = ARTICLES[i]
    const slug   = slugify(a.title)
    const slugEn = slugify(a.titleEn)

    const exists = await payload.find({ collection: "posts", where: { slug: { equals: slug } }, limit: 1, locale: "es" })
    if (exists.docs.length > 0) { log.push(`post exists: ${slug}`); continue }

    let heroId: number | string
    try {
      const webp = await fetchWebp(`https://picsum.photos/seed/${a.imgSeed}/1200/675`)
      const media = await payload.create({
        collection: "media", locale: "es",
        data: { alt: a.title },
        file: { data: webp, mimetype: "image/webp", name: `${slug}.webp`, size: webp.length },
      })
      heroId = media.id
      await payload.update({ collection: "media", id: heroId, locale: "en", data: { alt: a.titleEn } })
    } catch (e) {
      log.push(`image FAILED ${slug}: ${(e as Error).message}`)
      continue
    }

    const daysAgo = i * 5
    const publishedAt = new Date(Date.UTC(2026, 5, 25) - daysAgo * 86400000).toISOString()

    try {
      const post = await payload.create({
        collection: "posts", locale: "es",
        data: {
          title: a.title,
          slug,
          excerpt: a.excerpt,
          heroImage: heroId,
          category: catIdBySlug.get(a.category),
          author: AUTHORS[i % AUTHORS.length],
          publishedAt,
          tags: a.tags.map((t) => tagIdBySlug.get(t)).filter(Boolean),
          body: buildBody(a.body, "En detalle"),
          _status: "published",
        },
      })
      await payload.update({
        collection: "posts", id: post.id, locale: "en",
        data: {
          title: a.titleEn,
          slug: slugEn,
          excerpt: a.excerptEn,
          body: buildBody(a.bodyEn, "In detail"),
        },
      })
      created++
      log.push(`post: ${slug} → ${slugEn}`)
    } catch (e) {
      log.push(`post FAILED ${slug}: ${(e as Error).message}`)
    }
  }

  return NextResponse.json({ ok: true, created, log })
}
