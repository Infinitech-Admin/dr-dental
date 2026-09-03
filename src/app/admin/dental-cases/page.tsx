"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"

import ProtectedNav from "@/components/layout/ProtectedNavbar"

/* ─────────────────────────────────────────
    TYPES — matches App\Models\DentalCase
───────────────────────────────────────── */
type Case = {
  id: number
  title: string
  category: string
  description: string
  before: string
  after: string
  note: string | null
  created_at: string
}

type FormState = {
  title: string
  category: string
  description: string
  before: File | null
  after: File | null
  note: string
}

type Pagination = {
  current_page: number
  last_page: number
  total: number
}

/* ─────────────────────────────────────────
    CONSTANTS
───────────────────────────────────────── */
const CATEGORIES = [
  "All",
  "Whitening",
  "Veneers",
  "Orthodontics",
  "Implants",
  "Restorative",
] as const

const EMPTY_FORM: FormState = {
  title: "",
  category: "Whitening",
  description: "",
  before: null,
  after: null,
  note: "",
}

/* ─────────────────────────────────────────
    PAGE
───────────────────────────────────────── */
export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All")

  const [modal, setModal] = useState<"create" | "edit" | "view" | "delete" | null>(null)
  const [selected, setSelected] = useState<Case | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [saving, setSaving] = useState(false)

  /* ───────────────── fetch ───────────────── */
  const fetchCases = useCallback(async () => {
    setLoading(true)

    const params = new URLSearchParams({
      search,
      category: category === "All" ? "" : category,
      page: String(page),
    })

    // Proxy request via Next.js API route/rewrite
    const res = await fetch(`/api/cases?${params.toString()}`)
    const data = await res.json()

    setCases(data.data || [])
    setPagination({
      current_page: data.current_page || 1,
      last_page: data.last_page || 1,
      total: data.total || 0,
    })

    setLoading(false)
  }, [search, category, page])

  useEffect(() => {
    fetchCases()
  }, [fetchCases])

  useEffect(() => {
    setPage(1)
  }, [search, category])

  /* ───────────────── CRUD ───────────────── */
  const buildFormData = () => {
    const fd = new FormData()

    fd.append("title", form.title)
    fd.append("category", form.category)
    fd.append("description", form.description)
    fd.append("note", form.note)

    if (form.before) fd.append("before", form.before)
    if (form.after) fd.append("after", form.after)

    return fd
  }

  const handleCreate = async () => {
    setSaving(true)
    await fetch(`/api/cases`, {
      method: "POST",
      body: buildFormData(),
    })
    setSaving(false)
    closeModal()
    fetchCases()
  }

  const handleUpdate = async () => {
    if (!selected) return

    setSaving(true)
    const fd = buildFormData()
    fd.append("_method", "PUT") // Laravel form-data PUT workaround

    await fetch(`/api/cases/${selected.id}`, {
      method: "PUT",
      body: fd,
    })
    setSaving(false)
    closeModal()
    fetchCases()
  }

  const handleDelete = async () => {
    if (!selected) return

    setSaving(true)
    await fetch(`/api/cases/${selected.id}`, {
      method: "DELETE",
    })
    setSaving(false)
    closeModal()
    fetchCases()
  }

  const closeModal = () => {
    setModal(null)
    setSelected(null)
    setForm(EMPTY_FORM)
  }

  const imgUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_URL}${path}`

  /* ───────────────── UI ───────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-white text-slate-800">
      <main className="min-h-screen bg-[#f4f8ff] pt-[12px] pb-12 px-4">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pt-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Smile Gallery — Cases
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage before &amp; after cases shown on the public smile gallery
            </p>
          </div>

          <button
            onClick={() => {
              setForm(EMPTY_FORM)
              setModal("create")
            }}
            className="h-11 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/20 text-white font-medium flex items-center gap-2"
          >
            <Plus size={18} />
            Add Case
          </button>
        </div>

        {/* FILTERS */}
        <div className="bg-white/85 backdrop-blur-xl border border-emerald-100 rounded-3xl p-5 shadow-sm mb-6">
          <div className="relative mb-4">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                  category === c
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE LIST */}
        <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div>
              <h2 className="font-semibold text-slate-900">Case Records</h2>
              <p className="text-sm text-slate-500">{pagination?.total || 0} total cases</p>
            </div>
          </div>

          {loading ? (
            <div className="p-16 text-center text-slate-500">Loading cases...</div>
          ) : cases.length === 0 ? (
            <div className="p-16 text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <Search className="text-emerald-500" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">No Cases Found</h3>
              <p className="text-sm text-slate-500">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Images</th>
                    <th className="py-4 px-6">Title &amp; Category</th>
                    <th className="py-4 px-6">Description</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {cases.map((c) => (
                    <tr key={c.id} className="hover:bg-emerald-50/50 transition-all duration-200">
                      {/* IMAGES (Responsive Landscape Layout) */}
                      <td className="py-4 px-6">
                        <div className="flex items-center -space-x-4">
                          <div className="relative w-20 sm:w-24 aspect-[16/9] rounded-xl border-2 border-white shadow-sm overflow-hidden bg-slate-100 shrink-0">
                            <Image src={imgUrl(c.before)} alt={`${c.title} before`} fill className="object-cover" sizes="(max-width: 640px) 80px, 96px" />
                          </div>
                          <div className="relative w-20 sm:w-24 aspect-[16/9] rounded-xl border-2 border-white shadow-sm overflow-hidden bg-slate-100 shrink-0">
                            <Image src={imgUrl(c.after)} alt={`${c.title} after`} fill className="object-cover" sizes="(max-width: 640px) 80px, 96px" />
                          </div>
                        </div>
                      </td>

                      {/* TITLE & CATEGORY */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900">{c.title}</div>
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          {c.category}
                        </span>
                      </td>

                      {/* DESCRIPTION */}
                      <td className="py-4 px-6 max-w-xs text-slate-500">
                        <p className="line-clamp-2">{c.description}</p>
                      </td>

                      {/* ACTIONS */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelected(c)
                              setModal("view")
                            }}
                            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 transition flex items-center justify-center"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() => {
                              setSelected(c)
                              setForm({
                                title: c.title,
                                category: c.category,
                                description: c.description,
                                before: null,
                                after: null,
                                note: c.note || "",
                              })
                              setModal("edit")
                            }}
                            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 transition flex items-center justify-center"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => {
                              setSelected(c)
                              setModal("delete")
                            }}
                            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-red-100 hover:text-red-600 transition flex items-center justify-center"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={(pagination?.current_page || 1) <= 1}
            className="h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 transition flex items-center gap-2 text-sm font-medium disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft size={16} />
            Prev
          </button>

          <div className="bg-white border border-slate-200 rounded-xl px-5 h-11 flex items-center text-sm font-medium shadow-sm">
            Page {pagination?.current_page || 1} of {pagination?.last_page || 1}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(pagination?.last_page || 1, p + 1))}
            disabled={(pagination?.current_page || 1) >= (pagination?.last_page || 1)}
            className="h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 transition flex items-center gap-2 text-sm font-medium disabled:opacity-40 disabled:pointer-events-none"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </main>

      {/* MODALS */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl border border-emerald-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* HEADER */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {modal === "create" && "Create Case"}
                  {modal === "edit" && "Edit Case"}
                  {modal === "view" && "Case Details"}
                  {modal === "delete" && "Delete Case"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">Manage before/after transformation records</p>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-xl hover:bg-slate-100 transition flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="p-6">
              {/* VIEW */}
              {modal === "view" && selected && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">Before</p>
                      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border">
                        <Image
                          src={imgUrl(selected.before)}
                          alt={`Before photo for ${selected.title}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 280px"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">After</p>
                      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border">
                        <Image
                          src={imgUrl(selected.after)}
                          alt={`After photo for ${selected.title}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 280px"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-400">Title</p>
                      <p className="font-medium">{selected.title}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Category</p>
                      <p className="font-medium">{selected.category}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Description</p>
                      <p>{selected.description}</p>
                    </div>
                    {selected.note && (
                      <div>
                        <p className="text-slate-400">Note</p>
                        <p>{selected.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FORM */}
              {(modal === "create" || modal === "edit") && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Title</label>
                    <input
                      placeholder="e.g. Full Arch Whitening"
                      className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Category</label>
                    <select
                      className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      {CATEGORIES.filter((c) => c !== "All").map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Description</label>
                    <textarea
                      placeholder="Describe the treatment and outcome..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition min-h-[100px]"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Note <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      placeholder="e.g. Three in-office sessions, four shades lighter."
                      className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition"
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Before Image {modal === "edit" && <span className="text-slate-400 font-normal">(leave blank to keep current)</span>}
                      </label>
                      <label className="block border-2 border-dashed border-slate-200 rounded-2xl p-5 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/40 transition cursor-pointer">
                        <div className="mb-3">
                          <p className="text-sm font-medium text-slate-700">
                            {form.before ? form.before.name : "Upload before photo"}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP up to 10MB</p>
                        </div>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="text-sm text-slate-500"
                          onChange={(e) => setForm({ ...form, before: e.target.files?.[0] || null })}
                        />
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        After Image {modal === "edit" && <span className="text-slate-400 font-normal">(leave blank to keep current)</span>}
                      </label>
                      <label className="block border-2 border-dashed border-slate-200 rounded-2xl p-5 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/40 transition cursor-pointer">
                        <div className="mb-3">
                          <p className="text-sm font-medium text-slate-700">
                            {form.after ? form.after.name : "Upload after photo"}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP up to 10MB</p>
                        </div>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="text-sm text-slate-500"
                          onChange={(e) => setForm({ ...form, after: e.target.files?.[0] || null })}
                        />
                      </label>
                    </div>
                  </div>

                  {modal === "create" && (!form.before || !form.after) && (
                    <p className="text-xs text-amber-600">Both before and after images are required.</p>
                  )}
                </div>
              )}

              {/* DELETE */}
              {modal === "delete" && selected && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-red-100 flex items-center justify-center mb-4">
                    <Trash2 className="text-red-600" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">Delete “{selected.title}”?</h3>
                  <p className="text-sm text-slate-500">This action cannot be undone.</p>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={closeModal}
                className="h-11 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 transition font-medium"
              >
                Cancel
              </button>

              {modal === "create" && (
                <button
                  onClick={handleCreate}
                  disabled={saving || !form.title || !form.description || !form.before || !form.after}
                  className="h-11 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-500/20 text-white font-medium transition disabled:opacity-50 disabled:pointer-events-none"
                >
                  {saving ? "Creating..." : "Create Case"}
                </button>
              )}

              {modal === "edit" && (
                <button
                  onClick={handleUpdate}
                  disabled={saving || !form.title || !form.description}
                  className="h-11 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-500/20 text-white font-medium transition disabled:opacity-50 disabled:pointer-events-none"
                >
                  {saving ? "Saving..." : "Update Case"}
                </button>
              )}

              {modal === "delete" && (
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="h-11 px-5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-medium transition disabled:opacity-50"
                >
                  {saving ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}