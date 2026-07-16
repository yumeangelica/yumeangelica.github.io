import 'vue-router'

interface SeoMeta {
  title: string
  description: string
}

declare module 'vue-router' {
  interface RouteMeta {
    seo?: SeoMeta
  }
}
