import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-form-button",
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-button.html'
})
export class FormButton {
  @Input() text = ""
  @Input() type: "button" | "submit" | "reset" = "button"
  @Input() variant: "primary" | "secondary" | "outline" | "ghost" = "primary"
  @Input() size: "sm" | "md" | "lg" = "md"
  @Input() disabled = false
  @Input() loading = false
  @Input() icon: string = ""
  @Input() fullWidth = false

  @Output() buttonClick = new EventEmitter<void>()

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit()
    }
  }

  getButtonClasses(): string {
    const baseClasses = `
      inline-flex items-center justify-center font-medium rounded-lg
      transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      transform hover:scale-[1.02] active:scale-[0.98]
    `

    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-sm",
      lg: "px-6 py-4 text-base",
    }

    const variantClasses = {
      primary: `
        bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
        text-white shadow-lg hover:shadow-xl
        focus:ring-blue-500 dark:focus:ring-blue-400
      `,
      secondary: `
        bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600
        text-white shadow-md hover:shadow-lg
        focus:ring-gray-500 dark:focus:ring-gray-400
      `,
      outline: `
        border-2 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20
        text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300
        focus:ring-blue-500 dark:focus:ring-blue-400
      `,
      ghost: `
        hover:bg-gray-100 dark:hover:bg-gray-800
        text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
        focus:ring-gray-500 dark:focus:ring-gray-400
      `,
    }

    const widthClass = this.fullWidth ? "w-full" : ""

    return `
      ${baseClasses}
      ${sizeClasses[this.size]}
      ${variantClasses[this.variant]}
      ${widthClass}
    `.replace(/\s+/g, " ").trim()
  }
}