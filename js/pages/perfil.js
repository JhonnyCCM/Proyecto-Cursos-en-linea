/**
 * Profile Page JavaScript
 * Maneja la funcionalidad de la página de perfil
 */

class ProfilePage {
  constructor() {
    this.editModal = null
    this.init()
  }

  init() {
    this.setupEditProfile()
    this.setupPictureUpload()
    this.setupSkillsAnimation()
    this.loadProfileData()
    this.setupGoalsInteraction()
  }

  /**
   * Configurar edición de perfil
   */
  setupEditProfile() {
    const editBtn = document.getElementById("edit-profile-btn")
    const editBioBtn = document.getElementById("edit-bio-btn")
    const modal = document.getElementById("edit-profile-modal")
    const closeBtn = modal.querySelector(".modal-close")
    const cancelBtn = document.getElementById("cancel-edit")
    const saveBtn = document.getElementById("save-profile")

    // Abrir modal
    editBtn.addEventListener("click", () => {
      this.openEditModal()
    })

    editBioBtn.addEventListener("click", () => {
      this.openEditModal()
      // Focus en el textarea de biografía
      setTimeout(() => {
        document.getElementById("edit-bio").focus()
      }, 100)
    })

    // Cerrar modal
    closeBtn.addEventListener("click", () => {
      this.closeEditModal()
    })

    cancelBtn.addEventListener("click", () => {
      this.closeEditModal()
    })

    // Cerrar con backdrop
    modal.querySelector(".modal-backdrop").addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-backdrop")) {
        this.closeEditModal()
      }
    })

    // Guardar cambios
    saveBtn.addEventListener("click", () => {
      this.saveProfile()
    })
  }

  /**
   * Abrir modal de edición
   */
  openEditModal() {
    const modal = document.getElementById("edit-profile-modal")
    modal.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  /**
   * Cerrar modal de edición
   */
  closeEditModal() {
    const modal = document.getElementById("edit-profile-modal")
    modal.classList.remove("active")
    document.body.style.overflow = ""
  }

  /**
   * Guardar perfil
   */
  saveProfile() {
    const formData = {
      name: document.getElementById("edit-name").value,
      title: document.getElementById("edit-title").value,
      bio: document.getElementById("edit-bio").value,
      email: document.getElementById("edit-email").value,
      location: document.getElementById("edit-location").value,
      linkedin: document.getElementById("edit-linkedin").value,
    }

    // Actualizar DOM
    document.querySelector(".profile-name").textContent = formData.name
    document.querySelector(".profile-title").textContent = formData.title
    document.getElementById("bio-text").textContent = formData.bio

    // Actualizar información de contacto
    const contactItems = document.querySelectorAll(".contact-text")
    contactItems[0].textContent = formData.email
    contactItems[1].textContent = formData.location
    contactItems[2].textContent = formData.linkedin

    // Actualizar header
    document.querySelector(".user-menu span").textContent = formData.name

    // Guardar en localStorage
    localStorage.setItem("profileData", JSON.stringify(formData))

    // Cerrar modal
    this.closeEditModal()

    // Mostrar mensaje de éxito
    this.showToast("Perfil actualizado correctamente", "success")
  }

  /**
   * Configurar subida de foto de perfil
   */
  setupPictureUpload() {
    const changeBtn = document.querySelector(".change-picture-btn")

    changeBtn.addEventListener("click", () => {
      // Crear input file
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/*"

      input.addEventListener("change", (e) => {
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const profileImg = document.getElementById("profile-img")
            profileImg.src = e.target.result

            // Guardar en localStorage
            localStorage.setItem("profilePicture", e.target.result)

            this.showToast("Foto de perfil actualizada", "success")
          }
          reader.readAsDataURL(file)
        }
      })

      input.click()
    })
  }

  /**
   * Configurar animación de skills
   */
  setupSkillsAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const skillBars = entry.target.querySelectorAll(".skill-progress")
          skillBars.forEach((bar, index) => {
            setTimeout(() => {
              bar.style.transform = "scaleX(1)"
            }, index * 200)
          })
        }
      })
    })

    const skillsSection = document.querySelector(".skills-container")
    if (skillsSection) {
      // Inicializar barras en 0
      const skillBars = skillsSection.querySelectorAll(".skill-progress")
      skillBars.forEach((bar) => {
        bar.style.transformOrigin = "left"
        bar.style.transform = "scaleX(0)"
        bar.style.transition = "transform 0.8s ease"
      })

      observer.observe(skillsSection)
    }
  }

  /**
   * Cargar datos del perfil
   */
  loadProfileData() {
    const savedData = localStorage.getItem("profileData")
    const savedPicture = localStorage.getItem("profilePicture")

    if (savedData) {
      const data = JSON.parse(savedData)

      // Actualizar formulario
      document.getElementById("edit-name").value = data.name
      document.getElementById("edit-title").value = data.title
      document.getElementById("edit-bio").value = data.bio
      document.getElementById("edit-email").value = data.email
      document.getElementById("edit-location").value = data.location
      document.getElementById("edit-linkedin").value = data.linkedin
    }

    if (savedPicture) {
      document.getElementById("profile-img").src = savedPicture
    }
  }

  /**
   * Configurar interacción con metas
   */
  setupGoalsInteraction() {
    const goalItems = document.querySelectorAll(".goal-item")

    goalItems.forEach((item) => {
      item.addEventListener("click", () => {
        const status = item.querySelector(".goal-status")
        const currentClass = status.className.split(" ")[1]

        // Ciclar entre estados
        if (currentClass === "pending") {
          status.className = "goal-status in-progress"
          status.textContent = "🔄"
        } else if (currentClass === "in-progress") {
          status.className = "goal-status completed"
          status.textContent = "✅"
        } else {
          status.className = "goal-status pending"
          status.textContent = "⏳"
        }
      })
    })
  }

  /**
   * Mostrar toast de notificación
   */
  showToast(message, type = "info") {
    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.textContent = message

    // Estilos del toast
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

    // Animar entrada
    setTimeout(() => {
      toast.style.transform = "translateX(0)"
    }, 100)

    // Remover después de 3 segundos
    setTimeout(() => {
      toast.style.transform = "translateX(100%)"
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 3000)
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new ProfilePage()
})
