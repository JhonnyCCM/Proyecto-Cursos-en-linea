/**
 * Cronograma Page JavaScript
 * Maneja el calendario y eventos de estudio
 */

class CronogramaPage {
  constructor() {
    this.currentDate = new Date()
    this.currentView = "month"
    this.events = []
    this.init()
  }

  init() {
    this.loadEvents()
    this.setupCalendar()
    this.setupEventModal()
    this.setupViewControls()
    this.setupNavigation()
    this.renderCalendar()
    this.updateTodayEvents()
    this.updateUpcomingEvents()
  }

  /**
   * Cargar eventos desde localStorage
   */
  loadEvents() {
    const savedEvents = localStorage.getItem("studyEvents")
    if (savedEvents) {
      this.events = JSON.parse(savedEvents)
    } else {
      // Eventos de ejemplo
      this.events = [
        {
          id: 1,
          title: "Clase de UI/UX Design",
          description: "Introducción a Principios de Diseño",
          date: new Date().toISOString().split("T")[0],
          time: "10:00",
          duration: 90,
          course: "ui-ux",
          type: "class",
          reminder: true,
          status: "studying",
        },
        {
          id: 2,
          title: "Práctica de Figma",
          description: "Wireframing básico",
          date: new Date().toISOString().split("T")[0],
          time: "14:00",
          duration: 60,
          course: "ui-ux",
          type: "practice",
          reminder: true,
          status: "pending",
        },
      ]
      this.saveEvents()
    }
  }

  /**
   * Guardar eventos en localStorage
   */
  saveEvents() {
    localStorage.setItem("studyEvents", JSON.stringify(this.events))
  }

  /**
   * Configurar calendario principal
   */
  setupCalendar() {
    const container = document.getElementById("calendar-container")
    container.innerHTML = this.generateCalendarHTML()
    this.updateCurrentPeriod()
  }

  /**
   * Generar HTML del calendario
   */
  generateCalendarHTML() {
    const year = this.currentDate.getFullYear()
    const month = this.currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

    let html = '<div class="calendar-month">'

    // Headers de días
    daysOfWeek.forEach((day) => {
      html += `<div class="calendar-day-header">${day}</div>`
    })

    // Generar días del calendario
    const currentDate = new Date(startDate)
    for (let week = 0; week < 6; week++) {
      for (let day = 0; day < 7; day++) {
        const isCurrentMonth = currentDate.getMonth() === month
        const isToday = this.isToday(currentDate)
        const dayEvents = this.getEventsForDate(currentDate)

        html += `
                    <div class="calendar-day ${isCurrentMonth ? "" : "other-month"} ${isToday ? "today" : ""}" 
                         data-date="${currentDate.toISOString().split("T")[0]}">
                        <div class="day-number">${currentDate.getDate()}</div>
                        <div class="day-events">
                            ${dayEvents
                              .map(
                                (event) => `
                                <div class="mini-event ${event.type}" title="${event.title}">
                                    ${event.title}
                                </div>
                            `,
                              )
                              .join("")}
                        </div>
                    </div>
                `

        currentDate.setDate(currentDate.getDate() + 1)
      }

      // Si ya pasamos el último día del mes, salir
      if (currentDate.getMonth() !== month && week > 3) break
    }

    html += "</div>"
    return html
  }

  /**
   * Obtener eventos para una fecha específica
   */
  getEventsForDate(date) {
    const dateStr = date.toISOString().split("T")[0]
    return this.events.filter((event) => event.date === dateStr)
  }

  /**
   * Verificar si una fecha es hoy
   */
  isToday(date) {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  /**
   * Actualizar período actual mostrado
   */
  updateCurrentPeriod() {
    const periodElement = document.getElementById("current-period")
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]

    periodElement.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`
  }

  /**
   * Configurar modal de eventos
   */
  setupEventModal() {
    const addBtn = document.getElementById("add-event-btn")
    const modal = document.getElementById("add-event-modal")
    const closeBtn = modal.querySelector(".modal-close")
    const cancelBtn = document.getElementById("cancel-event")
    const saveBtn = document.getElementById("save-event")

    // Abrir modal
    addBtn.addEventListener("click", () => {
      this.openEventModal()
    })

    // Cerrar modal
    closeBtn.addEventListener("click", () => {
      this.closeEventModal()
    })

    cancelBtn.addEventListener("click", () => {
      this.closeEventModal()
    })

    // Cerrar con backdrop
    modal.querySelector(".modal-backdrop").addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-backdrop")) {
        this.closeEventModal()
      }
    })

    // Guardar evento
    saveBtn.addEventListener("click", () => {
      this.saveNewEvent()
    })

    // Establecer fecha por defecto
    document.getElementById("event-date").value = new Date().toISOString().split("T")[0]
  }

  /**
   * Abrir modal de evento
   */
  openEventModal() {
    const modal = document.getElementById("add-event-modal")
    modal.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  /**
   * Cerrar modal de evento
   */
  closeEventModal() {
    const modal = document.getElementById("add-event-modal")
    modal.classList.remove("active")
    document.body.style.overflow = ""

    // Limpiar formulario
    document.getElementById("add-event-form").reset()
    document.getElementById("event-date").value = new Date().toISOString().split("T")[0]
  }

  /**
   * Guardar nuevo evento
   */
  saveNewEvent() {
    const formData = {
      id: Date.now(),
      title: document.getElementById("event-title").value,
      description: document.getElementById("event-description").value,
      date: document.getElementById("event-date").value,
      time: document.getElementById("event-time").value,
      duration: Number.parseInt(document.getElementById("event-duration").value),
      course: document.getElementById("event-course").value,
      type: document.getElementById("event-type").value,
      reminder: document.getElementById("event-reminder").checked,
      status: "pending",
    }

    if (!formData.title || !formData.date || !formData.time) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    this.events.push(formData)
    this.saveEvents()
    this.renderCalendar()
    this.updateTodayEvents()
    this.updateUpcomingEvents()
    this.closeEventModal()

    this.showToast("Evento agregado correctamente", "success")
  }

  /**
   * Configurar controles de vista
   */
  setupViewControls() {
    const viewBtns = document.querySelectorAll(".view-btn")

    viewBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        viewBtns.forEach((b) => b.classList.remove("active"))
        btn.classList.add("active")

        this.currentView = btn.dataset.view
        this.renderCalendar()
      })
    })
  }

  /**
   * Configurar navegación del calendario
   */
  setupNavigation() {
    const prevBtn = document.getElementById("prev-btn")
    const nextBtn = document.getElementById("next-btn")
    const todayBtn = document.getElementById("today-btn")

    prevBtn.addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1)
      this.renderCalendar()
    })

    nextBtn.addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1)
      this.renderCalendar()
    })

    todayBtn.addEventListener("click", () => {
      this.currentDate = new Date()
      this.renderCalendar()
    })
  }

  /**
   * Renderizar calendario
   */
  renderCalendar() {
    this.setupCalendar()
    this.setupCalendarEvents()
  }

  /**
   * Configurar eventos del calendario (clicks en días)
   */
  setupCalendarEvents() {
    const dayElements = document.querySelectorAll(".calendar-day")

    dayElements.forEach((day) => {
      day.addEventListener("click", () => {
        const date = day.dataset.date
        if (date) {
          // Pre-llenar modal con la fecha seleccionada
          document.getElementById("event-date").value = date
          this.openEventModal()
        }
      })
    })
  }

  /**
   * Actualizar eventos de hoy
   */
  updateTodayEvents() {
    const today = new Date().toISOString().split("T")[0]
    const todayEvents = this.events.filter((event) => event.date === today)

    const container = document.getElementById("today-events")
    container.innerHTML = todayEvents
      .map(
        (event) => `
            <div class="event-item">
                <div class="event-time">${event.time}</div>
                <div class="event-info">
                    <h4>${event.title}</h4>
                    <p>${event.description}</p>
                    <span class="event-course">${this.getCourseLabel(event.course)}</span>
                </div>
                <div class="event-status ${event.status}">
                    ${event.status === "studying" ? "📚" : "⏰"}
                </div>
            </div>
        `,
      )
      .join("")
  }

  /**
   * Actualizar próximos eventos
   */
  updateUpcomingEvents() {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const upcomingEvents = this.events
      .filter((event) => new Date(event.date) > today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5)

    const container = document.getElementById("upcoming-events")
    container.innerHTML = upcomingEvents
      .map((event) => {
        const eventDate = new Date(event.date)
        const dateLabel = this.getDateLabel(eventDate)

        return `
                <div class="event-item">
                    <div class="event-date">${dateLabel}</div>
                    <div class="event-info">
                        <h4>${event.title}</h4>
                        <p>${event.description}</p>
                        <span class="event-course">${this.getCourseLabel(event.course)}</span>
                    </div>
                </div>
            `
      })
      .join("")
  }

  /**
   * Obtener etiqueta de fecha relativa
   */
  getDateLabel(date) {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === tomorrow.toDateString()) {
      return "Mañana"
    }

    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    return days[date.getDay()]
  }

  /**
   * Obtener etiqueta del curso
   */
  getCourseLabel(courseId) {
    const courses = {
      "ui-ux": "UI/UX Designer",
      javascript: "JavaScript Pro",
      react: "React Masterclass",
      node: "Node.js Backend",
    }
    return courses[courseId] || "Curso"
  }

  /**
   * Mostrar toast de notificación
   */
  showToast(message, type = "info") {
    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.textContent = message

    Object.assign(toast.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: type === "success" ? "#10b981" : "#6366f1",
      color: "white",
      padding: "1rem 1.5rem",
      borderRadius: "8px",
      zIndex: "1001",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
    })

    document.body.appendChild(toast)

    setTimeout(() => {
      toast.style.transform = "translateX(0)"
    }, 100)

    setTimeout(() => {
      toast.style.transform = "translateX(100%)"
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast)
        }
      }, 300)
    }, 3000)
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new CronogramaPage()
})
