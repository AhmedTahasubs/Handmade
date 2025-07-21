import { Injectable, signal, effect } from "@angular/core"

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private _isDark = signal(false)

  constructor() {
    // Initialize theme from localStorage or system preference
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme")
      if (savedTheme) {
        this._isDark.set(savedTheme === "dark")
      } else {
        this._isDark.set(window.matchMedia("(prefers-color-scheme: dark)").matches)
      }

      // Apply theme to document
      effect(() => {
        if (this._isDark()) {
          document.documentElement.classList.add("dark")
          localStorage.setItem("theme", "dark")
        } else {
          document.documentElement.classList.remove("dark")
          localStorage.setItem("theme", "light")
        }
      })
    }
  }

  isDark = this._isDark.asReadonly()

  toggleTheme(): void {
    this._isDark.update((current) => !current)
  }

  setTheme(isDark: boolean): void {
    this._isDark.set(isDark)
  }
}
