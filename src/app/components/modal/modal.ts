import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-modal",
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html'
})
export class Modal {
  @Input() isOpen = false
  @Input() title = ""
  @Input() showFooter = true
  @Input() showCancelButton = true
  @Input() showConfirmButton = true
  @Input() cancelText = "Cancel"
  @Input() confirmText = "Confirm"
  @Input() confirmButtonType: "primary" | "danger" | "success" = "primary"

  @Output() closed = new EventEmitter<void>()
  @Output() confirmed = new EventEmitter<void>()

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.close()
    }
  }

  close(): void {
    this.isOpen = false
    this.closed.emit()
  }

  confirm(): void {
    this.confirmed.emit()
  }

  getConfirmButtonClass(): string {
    switch (this.confirmButtonType) {
      case "danger":
        return "bg-red-600 text-white hover:bg-red-700"
      case "success":
        return "bg-green-600 text-white hover:bg-green-700"
      default:
        return "bg-blue-600 text-white hover:bg-blue-700"
    }
  }
}