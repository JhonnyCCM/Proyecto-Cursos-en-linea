/**
 * Configuración de los elementos del menú del sidebar
 * Cada elemento puede tener:
 * - id: Identificador único
 * - text: Texto a mostrar
 * - icon: Emoji o icono
 * - url: URL de destino
 * - roles: Array de roles que pueden ver este elemento (opcional)
 * - badge: Número o texto para mostrar como badge (opcional)
 * - children: Submenús (opcional)
 */
const SIDEBAR_MENU = [
  {
    id: "home",
    text: "Inicio",
    icon: "🏠",
    url: "inicio.html",
  },
  {
    id: "dashboard",
    text: "Panel",
    icon: "📊",
    url: "panel.html",
  },
  {
    id: "classroom",
    text: "Aula Virtual",
    icon: "📝",
    url: "aula.html",
  },
  {
    id: "schedule",
    text: "Cronograma",
    icon: "📅",
    url: "cronograma.html",
  },
  {
    id: "courses",
    text: "Cursos",
    icon: "📚",
    url: "cursos.html",
  },
  {
    id: "profile",
    text: "Mi Perfil",
    icon: "👤",
    url: "perfil.html",
  },
  {
    id: "settings",
    text: "Configuración",
    icon: "⚙️",
    url: "#",
    roles: ["admin", "instructor"],
  },
]

// Exportar la configuración
if (typeof module !== "undefined" && module.exports) {
  module.exports = { SIDEBAR_MENU }
} else {
  // Para uso en navegador
  window.SIDEBAR_MENU = SIDEBAR_MENU
}
