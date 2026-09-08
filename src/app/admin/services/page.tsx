"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Stethoscope,
  AlertTriangle,
  ChevronDown,
  Layers,
  FolderTree,
} from "lucide-react"
import Image from "next/image"

/* ─────────────────────────────────────────
    TYPES
───────────────────────────────────────── */

type Service = {
  id: number
  name: string
  category: string
  duration?: string
  price: number | string
  status: "Active" | "Draft" | "Inactive"
  description?: string
}

type ServiceCategory = {
  id: number
  name: string
  description: string
  image: string | null
  created_at?: string
  updated_at?: string
}

type FormState = {
  name: string
  category: string
  price: string
  status: string
  description: string
}

type CategoryFormState = {
  name: string
  description: string
  image: File | string | null
}

type Pagination = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

/* ─────────────────────────────────────────
    IMAGE HELPER
───────────────────────────────────────── */

function getImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null

  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || ""

  return imagePath.startsWith("http") ? imagePath : `${baseUrl}/${imagePath}`
}

/* ─────────────────────────────────────────
    HELPERS & COMPONENTS
───────────────────────────────────────── */

function statusStyle(status: string) {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200"

    case "Draft":
      return "bg-amber-50 text-amber-700 border border-amber-200"

    default:
      return "bg-red-50 text-red-700 border border-red-200"
  }
}

type ActionBtnProps = {
  icon: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}

function ActionBtn({ icon, label, onClick, danger }: ActionBtnProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
        danger
          ? "text-slate-400 hover:text-red-600 hover:bg-red-50"
          : "text-slate-400 hover:text-emerald-600 hover:bg-slate-100"
      }`}
    >
      {icon}
    </button>
  )
}

function Modal({
  title,
  children,
  onClose,
  size = "md",
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
  size?: "sm" | "md" | "lg"
}) {
  const maxWidth =
    size === "sm" ? "max-w-sm" : size === "lg" ? "max-w-2xl" : "max-w-lg"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div
        className={`bg-white rounded-2xl shadow-xl border border-slate-200 w-full ${maxWidth} overflow-hidden flex flex-col max-h-[90vh]`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">{children}</div>
      </div>
    </div>
  )
}

function ModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-slate-50 border-t border-slate-100 mt-auto">
      {children}
    </div>
  )
}

function PrimaryBtn({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition shadow-sm"
    >
      {children}
    </button>
  )
}

function OutlineBtn({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-sm transition"
    >
      {children}
    </button>
  )
}

function DangerBtn({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition shadow-sm"
    >
      {children}
    </button>
  )
}

/* ─────────────────────────────────────────
    SERVICE FORM
───────────────────────────────────────── */

function ServiceForm({
  form,
  setForm,
  categories,
}: {
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  categories: ServiceCategory[]
}) {
  return (
    <>
      <div>
        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
          Service Name
        </label>

        <input
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          placeholder="e.g. Teeth Whitening"
          className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
          Category
        </label>

        <select
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value,
            })
          }
          className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
          Price (₱)
        </label>

        <input
          type="number"
          value={form.price}
          onChange={(e) =>
            setForm({
              ...form,
              price: e.target.value,
            })
          }
          placeholder="1500"
          className="w-full h-10 px-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
          Status
        </label>

        <select
          value={form.status}
          onChange={(e) =>
            setForm({
              ...form,
              status: e.target.value,
            })
          }
          className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
          Description
        </label>

        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          placeholder="Optional service details..."
          rows={3}
          className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        />
      </div>
    </>
  )
}

/* ─────────────────────────────────────────
    CATEGORY FORM
───────────────────────────────────────── */

function CategoryForm({
  form,
  setForm,
  imagePreview,
  setImagePreview,
}: {
  form: CategoryFormState
  setForm: React.Dispatch<React.SetStateAction<CategoryFormState>>
  imagePreview: string | null
  setImagePreview: (url: string | null) => void
}) {
  return (
    <>
      <div>
        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
          Category Name
        </label>

        <input
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          placeholder="e.g. Cosmetic Dentistry"
          className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
          Description
        </label>

        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          placeholder="Brief overview of category..."
          rows={3}
          className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
          Category Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]

            if (file) {
              setForm({
                ...form,
                image: file,
              })

              setImagePreview(URL.createObjectURL(file))
            }
          }}
          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
        />

        {imagePreview && (
          <div className="mt-3 relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover"
              unoptimized={imagePreview.startsWith("blob:")}
            />
          </div>
        )}
      </div>
    </>
  )
}

/* ─────────────────────────────────────────
    VIEW SERVICE
───────────────────────────────────────── */

function ViewService({ service }: { service: Service }) {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <span className="text-xs font-semibold uppercase text-slate-400">
          Name
        </span>

        <p className="font-semibold text-slate-900 text-base">{service.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-xs font-semibold uppercase text-slate-400">
            Category
          </span>

          <p className="text-slate-700 font-medium mt-0.5">
            {service.category}
          </p>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase text-slate-400">
            Price
          </span>

          <p className="text-emerald-600 font-bold mt-0.5">
            ₱{Number(service.price).toLocaleString()}
          </p>
        </div>
      </div>

      <div>
        <span className="text-xs font-semibold uppercase text-slate-400">
          Status
        </span>

        <div className="mt-1">
          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle(
              service.status,
            )}`}
          >
            {service.status}
          </span>
        </div>
      </div>

      <div>
        <span className="text-xs font-semibold uppercase text-slate-400">
          Description
        </span>

        <p className="text-slate-600 mt-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
          {service.description || "No description provided."}
        </p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
    PAGE
───────────────────────────────────────── */

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<"services" | "categories">(
    "services",
  )

  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])

  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(false)

  const [pagination, setPagination] = useState<Pagination | null>(null)

  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const [page, setPage] = useState(1)
  const [categorySearch, setCategorySearch] = useState("")

  const [modal, setModal] = useState<
    | "create"
    | "edit"
    | "view"
    | "delete"
    | "create_category"
    | "edit_category"
    | "delete_category"
    | null
  >(null)

  const [selected, setSelected] = useState<Service | null>(null)

  const [selectedCategoryItem, setSelectedCategoryItem] =
    useState<ServiceCategory | null>(null)

  const [form, setForm] = useState<FormState>({
    name: "",
    category: "General Dentistry",
    price: "",
    status: "Active",
    description: "",
  })

  const [categoryForm, setCategoryForm] = useState<CategoryFormState>({
    name: "",
    description: "",
    image: null,
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  /* ─────────────────────────────────────────
      FETCH SERVICES
  ───────────────────────────────────────── */

  const fetchServices = useCallback(async () => {
    setLoading(true)

    const params = new URLSearchParams({
      search,
      category: selectedCategory === "All" ? "" : selectedCategory,
      page: String(page),
    })

    try {
      const res = await fetch(`/api/services?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch services: ${res.status}`)
      }

      const data = await res.json()

      const serviceData = Array.isArray(data)
        ? data
        : data.data || data.services || []

      setServices(serviceData)

      setPagination({
        current_page: data.current_page || page,
        last_page: data.last_page || 1,
        per_page: data.per_page || 10,
        total: data.total || serviceData.length,
      })
    } catch (error) {
      console.error("Failed to fetch services:", error)

      setServices([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [search, selectedCategory, page])

  /* ─────────────────────────────────────────
      FETCH CATEGORIES
  ───────────────────────────────────────── */

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true)

    try {
      const res = await fetch("/api/service-categories", {
        method: "GET",
        cache: "no-store",
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch categories: ${res.status}`)
      }

      const data = await res.json()

      const categoryData = Array.isArray(data)
        ? data
        : data.data || data.categories || []

      setCategories(categoryData)
    } catch (error) {
      console.error("Failed to fetch categories:", error)

      setCategories([])
    } finally {
      setCategoriesLoading(false)
    }
  }, [])

  /* ─────────────────────────────────────────
      INITIAL FETCH
  ───────────────────────────────────────── */

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  /* ─────────────────────────────────────────
      SERVICE FORM DATA
  ───────────────────────────────────────── */

  const buildFormData = () => {
    const fd = new FormData()

    Object.entries(form).forEach(([key, value]) => {
      if (value === null || value === "") return

      fd.append(key, String(value))
    })

    return fd
  }

  /* ─────────────────────────────────────────
      CREATE SERVICE
  ───────────────────────────────────────── */

  const handleCreate = async () => {
    try {
      const fd = buildFormData()

      const res = await fetch("/api/services", {
        method: "POST",
        body: fd,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)

        throw new Error(
          data?.message || `Failed to create service: ${res.status}`,
        )
      }

      closeModal()
      await fetchServices()
    } catch (error) {
      console.error("Failed to create service:", error)
    }
  }

  /* ─────────────────────────────────────────
      UPDATE SERVICE
  ───────────────────────────────────────── */

  const handleUpdate = async () => {
    if (!selected) return

    try {
      const res = await fetch(`/api/services/${selected.id}`, {
        method: "PUT",
        body: buildFormData(),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)

        throw new Error(
          data?.message || `Failed to update service: ${res.status}`,
        )
      }

      closeModal()
      await fetchServices()
    } catch (error) {
      console.error("Failed to update service:", error)
    }
  }

  /* ─────────────────────────────────────────
      DELETE SERVICE
  ───────────────────────────────────────── */

  const handleDelete = async () => {
    if (!selected) return

    try {
      const res = await fetch(`/api/services/${selected.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)

        throw new Error(
          data?.message || `Failed to delete service: ${res.status}`,
        )
      }

      closeModal()
      await fetchServices()
    } catch (error) {
      console.error("Failed to delete service:", error)
    }
  }

  /* ─────────────────────────────────────────
      CATEGORY FORM DATA
  ───────────────────────────────────────── */

  const buildCategoryFormData = () => {
    const fd = new FormData()

    fd.append("name", categoryForm.name)
    fd.append("description", categoryForm.description)

    if (categoryForm.image instanceof File) {
      fd.append("image", categoryForm.image)
    }

    return fd
  }

  /* ─────────────────────────────────────────
      CREATE CATEGORY
  ───────────────────────────────────────── */

  const handleCreateCategory = async () => {
    try {
      const fd = buildCategoryFormData()

      const res = await fetch("/api/service-categories", {
        method: "POST",
        body: fd,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)

        throw new Error(
          data?.message || `Failed to create category: ${res.status}`,
        )
      }

      closeModal()
      await fetchCategories()
    } catch (error) {
      console.error("Failed to create category:", error)
    }
  }

  /* ─────────────────────────────────────────
      UPDATE CATEGORY
  ───────────────────────────────────────── */

  const handleUpdateCategory = async () => {
    if (!selectedCategoryItem) return

    try {
      const fd = buildCategoryFormData()


      const res = await fetch(
        `/api/service-categories/${selectedCategoryItem.id}`,
        {
          method: "PUT",
          body: fd,
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => null)

        throw new Error(
          data?.message || `Failed to update category: ${res.status}`,
        )
      }

      closeModal()
      await fetchCategories()
    } catch (error) {
      console.error("Failed to update category:", error)
    }
  }

  /* ─────────────────────────────────────────
      DELETE CATEGORY
  ───────────────────────────────────────── */

  const handleDeleteCategory = async () => {
    if (!selectedCategoryItem) return

    try {
      const res = await fetch(
        `/api/service-categories/${selectedCategoryItem.id}`,
        {
          method: "DELETE",
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => null)

        throw new Error(
          data?.message || `Failed to delete category: ${res.status}`,
        )
      }

      closeModal()
      await fetchCategories()
    } catch (error) {
      console.error("Failed to delete category:", error)
    }
  }

  /* ─────────────────────────────────────────
      OPEN MODALS
  ───────────────────────────────────────── */

  const openCreate = () => {
    setForm({
      name: "",
      category: categories[0]?.name || "",
      price: "",
      status: "Active",
      description: "",
    })

    setModal("create")
  }

  const openEdit = (s: Service) => {
    setSelected(s)

    setForm({
      name: s.name,
      category: s.category,
      price: String(s.price),
      status: s.status,
      description: s.description ?? "",
    })

    setModal("edit")
  }

  const openView = (s: Service) => {
    setSelected(s)
    setModal("view")
  }

  const openDelete = (s: Service) => {
    setSelected(s)
    setModal("delete")
  }

  const openCreateCategory = () => {
    setCategoryForm({
      name: "",
      description: "",
      image: null,
    })

    setImagePreview(null)
    setModal("create_category")
  }

  const openEditCategory = (c: ServiceCategory) => {
    setSelectedCategoryItem(c)

    setCategoryForm({
      name: c.name,
      description: c.description,
      image: c.image,
    })

    setImagePreview(getImageUrl(c.image))

    setModal("edit_category")
  }

  const openDeleteCategory = (c: ServiceCategory) => {
    setSelectedCategoryItem(c)
    setModal("delete_category")
  }

  /* ─────────────────────────────────────────
      CLOSE MODAL
  ───────────────────────────────────────── */

  const closeModal = () => {
    setModal(null)

    setSelected(null)
    setSelectedCategoryItem(null)

    setForm({
      name: "",
      category: "",
      price: "",
      status: "Active",
      description: "",
    })

    setCategoryForm({
      name: "",
      description: "",
      image: null,
    })

    setImagePreview(null)
  }

  /* ─────────────────────────────────────────
      FILTER CATEGORIES
  ───────────────────────────────────────── */

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
      c.description.toLowerCase().includes(categorySearch.toLowerCase()),
  )

  /* ─────────────────────────────────────────
      RENDER
  ───────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <main className="min-h-screen bg-[#f4f8ff] pt-[12px] pb-12 px-4 max-w-7xl mx-auto">
        {/* HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pt-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Services &amp; Categories
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage dental &amp; aesthetic clinic services and classification
              categories
            </p>
          </div>

          <button
            onClick={activeTab === "services" ? openCreate : openCreateCategory}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold shadow-sm transition-colors w-full sm:w-auto justify-center"
          >
            <Plus size={16} />

            {activeTab === "services" ? "Add Service" : "Add Category"}
          </button>
        </div>

        {/* TABS */}

        <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab("services")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "services"
                ? "border-emerald-600 text-emerald-600 bg-white/50 rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Layers size={16} />
            Services List
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "categories"
                ? "border-emerald-600 text-emerald-600 bg-white/50 rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <FolderTree size={16} />
            Categories ({categories.length})
          </button>
        </div>

        {/* SERVICES TAB */}

        {activeTab === "services" && (
          <>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />

                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setPage(1)
                    }}
                    placeholder="Search services…"
                    className="w-full h-10 rounded-lg border border-slate-200 text-slate-900 bg-slate-50 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>

                <div className="relative w-full sm:w-56 shrink-0">
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value)
                      setPage(1)
                    }}
                    className="w-full h-10 appearance-none rounded-lg border text-slate-900 border-slate-200 bg-slate-50 px-4 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition cursor-pointer"
                  >
                    <option value="All">All Categories</option>

                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* SERVICES TABLE */}

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
                  Loading services…
                </div>
              ) : services.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                  <Search size={32} strokeWidth={1.5} />

                  <p className="text-sm">No services found</p>
                </div>
              ) : (
                <>
                  <div className="hidden md:block">
                    <table className="w-full text-sm table-fixed">
                      <colgroup>
                        <col className="w-[35%]" />
                        <col className="w-[18%]" />
                        <col className="w-[15%]" />
                        <col className="w-[15%]" />
                        <col className="w-[17%]" />
                      </colgroup>

                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                          <th className="text-left px-5 py-3 font-semibold text-slate-500 uppercase tracking-wide text-xs">
                            Service
                          </th>

                          <th className="text-left px-4 py-3 font-semibold text-slate-500 uppercase tracking-wide text-xs">
                            Category
                          </th>

                          <th className="text-left px-4 py-3 font-semibold text-slate-500 uppercase tracking-wide text-xs">
                            Price
                          </th>

                          <th className="text-left px-4 py-3 font-semibold text-slate-500 uppercase tracking-wide text-xs">
                            Status
                          </th>

                          <th className="text-right px-5 py-3 font-semibold text-slate-500 uppercase tracking-wide text-xs">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-50">
                        {services.map((s) => (
                          <tr
                            key={s.id}
                            className="hover:bg-slate-50/80 transition-colors group"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-lg bg-slate-100 shrink-0 flex items-center justify-center text-slate-400">
                                  <Stethoscope size={16} />
                                </div>

                                <span className="font-medium text-slate-900 truncate">
                                  {s.name}
                                </span>
                              </div>
                            </td>

                            <td className="px-4 py-4 text-slate-600 truncate">
                              <Stethoscope
                                size={14}
                                className="inline mr-1 opacity-60"
                              />

                              {s.category}
                            </td>

                            <td className="px-4 py-4 text-slate-800 font-semibold">
                              ₱{Number(s.price).toLocaleString()}
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle(
                                  s.status,
                                )}`}
                              >
                                {s.status}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-1">
                                <ActionBtn
                                  icon={<Eye size={15} />}
                                  label="View"
                                  onClick={() => openView(s)}
                                />

                                <ActionBtn
                                  icon={<Pencil size={15} />}
                                  label="Edit"
                                  onClick={() => openEdit(s)}
                                />

                                <ActionBtn
                                  icon={<Trash2 size={15} />}
                                  label="Delete"
                                  onClick={() => openDelete(s)}
                                  danger
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE */}

                  <div className="md:hidden divide-y divide-slate-100">
                    {services.map((s) => (
                      <div key={s.id} className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0 flex items-center justify-center text-slate-400">
                              <Stethoscope size={16} />
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 truncate">
                                {s.name}
                              </p>

                              <p className="text-xs text-slate-500 mt-0.5 truncate">
                                <Stethoscope
                                  size={14}
                                  className="inline mr-1 opacity-60"
                                />

                                {s.category}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle(
                              s.status,
                            )}`}
                          >
                            {s.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-emerald-600 font-semibold text-sm">
                            ₱{Number(s.price).toLocaleString()}
                          </span>

                          <div className="flex gap-1">
                            <ActionBtn
                              icon={<Eye size={15} />}
                              label="View"
                              onClick={() => openView(s)}
                            />

                            <ActionBtn
                              icon={<Pencil size={15} />}
                              label="Edit"
                              onClick={() => openEdit(s)}
                            />

                            <ActionBtn
                              icon={<Trash2 size={15} />}
                              label="Delete"
                              onClick={() => openDelete(s)}
                              danger
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* PAGINATION */}

              <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/60">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <ChevronLeft size={15} />
                  Previous
                </button>

                <span className="text-sm text-slate-500">
                  Page{" "}
                  <span className="font-semibold text-slate-700">{page}</span>
                  {pagination && pagination.last_page > 0 && (
                    <>
                      {" "}
                      of{" "}
                      <span className="font-semibold text-slate-700">
                        {pagination.last_page}
                      </span>
                    </>
                  )}
                </span>

                <button
                  disabled={
                    loading ||
                    !pagination ||
                    page >= (pagination.last_page || 1)
                  }
                  onClick={() => setPage((p) => p + 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* CATEGORIES TAB */}

        {activeTab === "categories" && (
          <>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />

                <input
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Search categories by name or description…"
                  className="w-full h-10 rounded-lg border border-slate-200 text-slate-900 bg-slate-50 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {categoriesLoading ? (
              <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
                Loading categories…
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center text-slate-400 shadow-sm">
                <FolderTree size={36} className="mx-auto mb-2 opacity-40" />

                <p className="text-sm">No categories found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((cat) => {
                  const imageUrl = getImageUrl(cat.image)

                  return (
                    <div
                      key={cat.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                    >
                      {/* CATEGORY IMAGE */}

                      <div className="relative h-40 bg-slate-100 w-full overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-400">
                            <Stethoscope size={28} />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h3 className="font-bold text-base truncate">
                            {cat.name}
                          </h3>
                        </div>
                      </div>

                      {/* CATEGORY INFO */}

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>

                        <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-slate-100">
                          <ActionBtn
                            icon={<Pencil size={15} />}
                            label="Edit Category"
                            onClick={() => openEditCategory(cat)}
                          />

                          <ActionBtn
                            icon={<Trash2 size={15} />}
                            label="Delete Category"
                            onClick={() => openDeleteCategory(cat)}
                            danger
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* CREATE SERVICE */}

      {modal === "create" && (
        <Modal title="Add New Service" onClose={closeModal}>
          <ServiceForm form={form} setForm={setForm} categories={categories} />

          <ModalFooter>
            <OutlineBtn onClick={closeModal}>Cancel</OutlineBtn>

            <PrimaryBtn onClick={handleCreate}>Create Service</PrimaryBtn>
          </ModalFooter>
        </Modal>
      )}

      {/* EDIT SERVICE */}

      {modal === "edit" && selected && (
        <Modal title="Edit Service" onClose={closeModal}>
          <ServiceForm form={form} setForm={setForm} categories={categories} />

          <ModalFooter>
            <OutlineBtn onClick={closeModal}>Cancel</OutlineBtn>

            <PrimaryBtn onClick={handleUpdate}>Save Changes</PrimaryBtn>
          </ModalFooter>
        </Modal>
      )}

      {/* VIEW SERVICE */}

      {modal === "view" && selected && (
        <Modal title="Service Details" onClose={closeModal}>
          <ViewService service={selected} />

          <ModalFooter>
            <PrimaryBtn onClick={closeModal}>Close</PrimaryBtn>
          </ModalFooter>
        </Modal>
      )}

      {/* DELETE SERVICE */}

      {modal === "delete" && selected && (
        <Modal title="Delete Service" onClose={closeModal} size="sm">
          <div className="flex flex-col items-center text-center gap-3 py-2">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle size={22} className="text-red-500" />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                Delete &quot;{selected.name}&quot;?
              </p>

              <p className="text-sm text-slate-500 mt-1">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <ModalFooter>
            <OutlineBtn onClick={closeModal}>Cancel</OutlineBtn>

            <DangerBtn onClick={handleDelete}>Delete</DangerBtn>
          </ModalFooter>
        </Modal>
      )}

      {/* CREATE CATEGORY */}

      {modal === "create_category" && (
        <Modal title="Add New Service Category" onClose={closeModal}>
          <CategoryForm
            form={categoryForm}
            setForm={setCategoryForm}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
          />

          <ModalFooter>
            <OutlineBtn onClick={closeModal}>Cancel</OutlineBtn>

            <PrimaryBtn onClick={handleCreateCategory}>
              Create Category
            </PrimaryBtn>
          </ModalFooter>
        </Modal>
      )}

      {/* EDIT CATEGORY */}

      {modal === "edit_category" && selectedCategoryItem && (
        <Modal title="Edit Service Category" onClose={closeModal}>
          <CategoryForm
            form={categoryForm}
            setForm={setCategoryForm}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
          />

          <ModalFooter>
            <OutlineBtn onClick={closeModal}>Cancel</OutlineBtn>

            <PrimaryBtn onClick={handleUpdateCategory}>Save Changes</PrimaryBtn>
          </ModalFooter>
        </Modal>
      )}

      {/* DELETE CATEGORY */}

      {modal === "delete_category" && selectedCategoryItem && (
        <Modal title="Delete Category" onClose={closeModal} size="sm">
          <div className="flex flex-col items-center text-center gap-3 py-2">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle size={22} className="text-red-500" />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                Delete Category &quot;
                {selectedCategoryItem.name}
                &quot;?
              </p>

              <p className="text-sm text-slate-500 mt-1">
                This will delete the category classification.
              </p>
            </div>
          </div>

          <ModalFooter>
            <OutlineBtn onClick={closeModal}>Cancel</OutlineBtn>

            <DangerBtn onClick={handleDeleteCategory}>Delete</DangerBtn>
          </ModalFooter>
        </Modal>
      )}
    </div>
  )
}
