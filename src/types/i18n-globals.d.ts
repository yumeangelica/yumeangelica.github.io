import 'vue'
import type { RawTranslator, TextTranslator } from '../i18n'

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: TextTranslator
    $tm: RawTranslator
  }
}
