import { TableAction, TableColumn, DataTable } from './../../components/data-table/data-table';
import { Modal } from './../../components/modal/modal';
import { FormButton } from './../../components/form-button/form-button';
import { ThemeService } from './../../services/theme.service';
import { LanguageService } from './../../services/language.service';
import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

interface User {
  id: number
  name: string
  email: string
  phone: string
  role: string
  status: string
  avatar: string
  joinDate: string
  lastLogin: string
  totalOrders: number
  totalSpent: number
}

@Component({
  selector: "app-users-management",
  standalone: true,
  imports: [CommonModule, FormsModule, DataTable, Modal],
  templateUrl: "./users-management.html"
})
export class UsersManagement {
  showModal = false
  showDeleteModal = false
  isEditing = false
  userToDelete: User | null = null

  currentUser: Partial<User> = {
    name: "",
    email: "",
    phone: "",
    role: "customer",
    status: "active",
  }

  users: User[] = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      role: "admin",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      joinDate: "2023-01-15",
      lastLogin: "2024-01-20",
      totalOrders: 0,
      totalSpent: 0,
    },
    {
      id: 2,
      name: "Emma Johnson",
      email: "emma.johnson@example.com",
      phone: "+1 (555) 234-5678",
      role: "artisan",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      joinDate: "2023-02-20",
      lastLogin: "2024-01-19",
      totalOrders: 45,
      totalSpent: 2340.5,
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "+1 (555) 345-6789",
      role: "customer",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      joinDate: "2023-03-10",
      lastLogin: "2024-01-18",
      totalOrders: 12,
      totalSpent: 890.25,
    },
    {
      id: 4,
      name: "Sarah Davis",
      email: "sarah.davis@example.com",
      phone: "+1 (555) 456-7890",
      role: "moderator",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      joinDate: "2023-04-05",
      lastLogin: "2024-01-17",
      totalOrders: 0,
      totalSpent: 0,
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david.wilson@example.com",
      phone: "+1 (555) 567-8901",
      role: "customer",
      status: "inactive",
      avatar: "/placeholder.svg?height=40&width=40",
      joinDate: "2023-05-12",
      lastLogin: "2023-12-15",
      totalOrders: 8,
      totalSpent: 456.75,
    },
    {
      id: 6,
      name: "Lisa Anderson",
      email: "lisa.anderson@example.com",
      phone: "+1 (555) 678-9012",
      role: "artisan",
      status: "suspended",
      avatar: "/placeholder.svg?height=40&width=40",
      joinDate: "2023-06-18",
      lastLogin: "2024-01-10",
      totalOrders: 23,
      totalSpent: 1250.0,
    },
  ]

  columns: TableColumn[] = [
    { key: "avatar", label: "Avatar", type: "image", width: "80px" },
    { key: "name", label: "Name", sortable: true, type: "text" },
    { key: "email", label: "Email", sortable: true, type: "text" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "role", label: "Role", sortable: true, type: "badge" },
    { key: "status", label: "Status", sortable: true, type: "badge" },
    { key: "joinDate", label: "Join Date", sortable: true, type: "date" },
    { key: "totalOrders", label: "Orders", sortable: true, type: "text" },
    { key: "totalSpent", label: "Total Spent", sortable: true, type: "currency" },
  ]

  actions: TableAction[] = [
    { label: "View Details", icon: "eye", color: "primary", action: "view" },
    { label: "Edit User", icon: "edit", color: "secondary", action: "edit" },
    { label: "Delete User", icon: "trash", color: "danger", action: "delete" },
  ]

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService,
  ) {}

  get modalTitle(): string {
    return this.isEditing ? "Edit User" : "Add New User"
  }

  openCreateModal(): void {
    this.isEditing = false
    this.currentUser = {
      name: "",
      email: "",
      phone: "",
      role: "customer",
      status: "active",
    }
    this.showModal = true
  }

  closeModal(): void {
    this.showModal = false
    this.currentUser = {}
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false
    this.userToDelete = null
  }

  onAction(event: { action: string; item: User }): void {
    const { action, item } = event

    switch (action) {
      case "view":
        this.viewUser(item)
        break
      case "edit":
        this.editUser(item)
        break
      case "delete":
        this.deleteUser(item)
        break
    }
  }

  viewUser(user: User): void {
    console.log("View user:", user)
  }

  editUser(user: User): void {
    this.isEditing = true
    this.currentUser = { ...user }
    this.showModal = true
  }

  deleteUser(user: User): void {
    this.userToDelete = user
    this.showDeleteModal = true
  }

  saveUser(): void {
    if (this.isEditing) {
      const index = this.users.findIndex((u) => u.id === this.currentUser.id)
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...this.currentUser }
      }
    } else {
      const newUser: User = {
        id: Math.max(...this.users.map((u) => u.id)) + 1,
        name: this.currentUser.name || "",
        email: this.currentUser.email || "",
        phone: this.currentUser.phone || "",
        role: this.currentUser.role || "customer",
        status: this.currentUser.status || "active",
        avatar: "/placeholder.svg?height=40&width=40",
        joinDate: new Date().toISOString().split("T")[0],
        lastLogin: new Date().toISOString().split("T")[0],
        totalOrders: 0,
        totalSpent: 0,
      }
      this.users.push(newUser)
    }

    this.closeModal()
  }

  confirmDelete(): void {
    if (this.userToDelete) {
      this.users = this.users.filter((u) => u.id !== this.userToDelete!.id)
      this.closeDeleteModal()
    }
  }

  onExport(): void {
    console.log("Export users data")
  }
}