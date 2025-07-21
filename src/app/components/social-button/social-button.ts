import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-social-button",
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-button.html'
})
export class SocialButton {
  @Input() provider: "google" | "facebook" | "github" | "apple" = "google"
  @Input() text = ""
  @Input() type: "button" | "submit" = "button"
  @Input() disabled = false
  @Input() loading = false
  @Input() fullWidth = true

  @Output() buttonClick = new EventEmitter<void>()

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit()
    }
  }

  getProviderIcon(): string {
    const icons = {
      google: `
        <i class="fa-brands fa-google"></i>
      `,
      facebook: `
        <i class="fa-brands fa-facebook-f"></i>
      `,
      github: `
        <i class="fa-brands fa-github"></i>
      `,
      apple: `
        <svg viewBox="0 0 24 24" class="w-5 h-5">
          <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      `,
    }
    return icons[this.provider]
  }

  getButtonClasses(): string {
    const baseClasses = `
      flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600
      rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
      hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 
      focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400
      transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    `

    const widthClass = this.fullWidth ? "w-full" : ""

    return `${baseClasses} ${widthClass}`.replace(/\s+/g, " ").trim()
  }
}