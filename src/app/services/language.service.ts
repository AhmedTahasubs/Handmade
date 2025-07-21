import { Injectable, signal } from "@angular/core"

@Injectable({
  providedIn: "root",
})
export class LanguageService {
  private _currentLanguage = signal<"en" | "ar">("en")

  constructor() {
    // Initialize language from localStorage
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as "en" | "ar"
      if (savedLanguage) {
        this._currentLanguage.set(savedLanguage)
      }
    }
  }

  currentLanguage = this._currentLanguage.asReadonly()

  toggleLanguage(): void {
    const newLanguage = this._currentLanguage() === "en" ? "ar" : "en"
    this._currentLanguage.set(newLanguage)

    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLanguage)

      // Update document direction
      document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr"
      document.documentElement.lang = newLanguage
    }
  }

  setLanguage(language: "en" | "ar"): void {
    this._currentLanguage.set(language)

    if (typeof window !== "undefined") {
      localStorage.setItem("language", language)
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
      document.documentElement.lang = language
    }
  }
}
