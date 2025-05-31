document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el usuario está autenticado
  const currentUser = localStorage.getItem("currentUser")

  if (!currentUser) {
    // Redirigir al login si no hay usuario autenticado
    window.location.href = "../index.html"
    return
  }

  // Configurar el botón de logout
  const logoutBtn = document.getElementById("logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()

      // Eliminar la sesión del usuario
      localStorage.removeItem("currentUser")

      // Redirigir al login
      window.location.href = "../index.html"
    })
  }

  // Actualizar la UI con la información del usuario
  const user = JSON.parse(currentUser)
  const profileName = document.querySelector(".header-profile-name")
  const profileAvatar = document.querySelector(".header-profile-avatar img")

  if (profileName) {
    profileName.textContent = user.name
  }

  if (profileAvatar) {
    profileAvatar.src = user.avatar
    profileAvatar.alt = user.name
  }
})
