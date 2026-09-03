"use client"

import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import {
  Edit,
  ImageIcon,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAdminRoute } from "@/hooks/use-protected-route"
import ProtectedNav from "@/components/layout/ProtectedNavbar"

type ImageType = "clinic" | "team"

interface BranchImage {
  id: number
  branch_id: string
  type: ImageType
  url: string
  alt: string
  sort_order: number
}

interface Branch {
  id: number
  branch_id: string
  name: string
  area: string
  phone: string | null
  email: string | null
  address: string
  hours: string | null
  mapQuery: string | null
  directionsUrl: string | null
  blurb: string | null
  facebook: string | null
  instagram: string | null
  images?: BranchImage[]
}

const EMPTY_FORM = {
  name: "",
  area: "",
  phone: "",
  email: "",
  address: "",
  hours: "",
  mapQuery: "",
  directionsUrl: "",
  blurb: "",
  facebook: "",
  instagram: "",
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export default function BranchesPage() {
  useAdminRoute()

  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const [branchModalOpen, setBranchModalOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [savingBranch, setSavingBranch] = useState(false)
  const [branchForm, setBranchForm] = useState(EMPTY_FORM)

  const [existingImages, setExistingImages] = useState<BranchImage[]>([])
  const [uploadType, setUploadType] = useState<ImageType>("clinic")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null)
  const [deleteImageId, setDeleteImageId] = useState<number | null>(null)

  const [deleteBranchId, setDeleteBranchId] = useState<string | null>(null)
  const [deletingBranch, setDeletingBranch] = useState(false)

  const fetchBranches = useCallback(async () => {
    try {
      setLoading(true)

      const response = await fetch("/api/branches", {
        cache: "no-store",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch branches")
      }

      setBranches(data?.branches ?? [])
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch branches",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchBranches()
  }, [fetchBranches])

  const filteredBranches = useMemo(() => {
    const value = search.trim().toLowerCase()

    if (!value) {
      return branches
    }

    return branches.filter(
      (branch) =>
        branch.name.toLowerCase().includes(value) ||
        branch.area.toLowerCase().includes(value) ||
        branch.branch_id.toLowerCase().includes(value),
    )
  }, [branches, search])

  function resetImageState() {
    setExistingImages([])
    setUploadType("clinic")
    setSelectedFiles([])
  }

  function openCreateBranch() {
    setEditingBranch(null)
    setBranchForm({ ...EMPTY_FORM })
    resetImageState()
    setBranchModalOpen(true)
  }

  function openEditBranch(branch: Branch) {
    setEditingBranch(branch)

    setBranchForm({
      name: branch.name,
      area: branch.area,
      phone: branch.phone ?? "",
      email: branch.email ?? "",
      address: branch.address,
      hours: branch.hours ?? "",
      mapQuery: branch.mapQuery ?? "",
      directionsUrl: branch.directionsUrl ?? "",
      blurb: branch.blurb ?? "",
      facebook: branch.facebook ?? "",
      instagram: branch.instagram ?? "",
    })

    setExistingImages(branch.images ?? [])
    setUploadType("clinic")
    setSelectedFiles([])

    setBranchModalOpen(true)
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])

    const valid: File[] = []
    const errors: string[] = []

    files.forEach((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        errors.push(`${file.name}: JPG, PNG, or WEBP only.`)
        return
      }
      if (file.size > MAX_IMAGE_SIZE) {
        errors.push(`${file.name}: maximum size is 5MB.`)
        return
      }
      valid.push(file)
    })

    if (errors.length) {
      toast({
        title: "Some files were rejected",
        description: errors.join(" "),
        variant: "destructive",
      })
    }

    setSelectedFiles((current) => [...current, ...valid])

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function removeSelectedFile(index: number) {
    setSelectedFiles((files) => files.filter((_, i) => i !== index))
  }

  async function confirmDeleteImage() {
    if (deleteImageId === null) return

    const imageId = deleteImageId
    setDeletingImageId(imageId)

    try {
      const response = await fetch(`/api/branch-images/${imageId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete image")
      }

      setExistingImages((images) => images.filter((img) => img.id !== imageId))
      toast({
        title: "Image deleted",
        description: "Image removed successfully.",
      })
      setDeleteImageId(null)
    } catch (error) {
      toast({
        title: "Delete failed",
        description:
          error instanceof Error ? error.message : "Failed to delete image",
        variant: "destructive",
      })
    } finally {
      setDeletingImageId(null)
    }
  }

  async function uploadImagesForBranch(branchId: string) {
    if (selectedFiles.length === 0) return

    const formData = new FormData()
    formData.append("type", uploadType)
    selectedFiles.forEach((file) => formData.append("images[]", file))

    const response = await fetch(
      `/api/branches/${encodeURIComponent(branchId)}/images`,
      {
        method: "POST",
        body: formData,
      },
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.message || "Failed to upload images")
    }
  }

  async function saveBranch() {
    if (!branchForm.name.trim() || !branchForm.area.trim()) {
      toast({
        title: "Required fields",
        description: "Branch name and area are required.",
        variant: "destructive",
      })
      return
    }

    setSavingBranch(true)

    try {
      const payload = {
        name: branchForm.name.trim(),
        area: branchForm.area.trim(),
        phone: branchForm.phone.trim() || null,
        email: branchForm.email.trim() || null,
        address: branchForm.address.trim(),
        hours: branchForm.hours.trim() || null,
        map_query: branchForm.mapQuery.trim() || null,
        directions_url: branchForm.directionsUrl.trim() || null,
        blurb: branchForm.blurb.trim() || null,
        facebook: branchForm.facebook.trim() || null,
        instagram: branchForm.instagram.trim() || null,
      }

      const url = editingBranch
        ? `/api/branches/${encodeURIComponent(editingBranch.branch_id)}`
        : "/api/branches"

      const response = await fetch(url, {
        method: editingBranch ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || "Failed to save branch")
      }

      const branchId: string | undefined =
        editingBranch?.branch_id ?? data?.branch?.branch_id ?? data?.branch_id

      if (branchId && selectedFiles.length > 0) {
        try {
          await uploadImagesForBranch(branchId)
        } catch (uploadError) {
          toast({
            title: "Branch saved, but image upload failed",
            description:
              uploadError instanceof Error
                ? uploadError.message
                : "Failed to upload images",
            variant: "destructive",
          })
        }
      }

      toast({
        title: editingBranch ? "Branch updated" : "Branch created",
        description: editingBranch
          ? "Branch information updated successfully."
          : "Branch created successfully.",
      })

      setBranchModalOpen(false)
      setEditingBranch(null)
      resetImageState()

      await fetchBranches()
    } catch (error) {
      toast({
        title: "Save failed",
        description:
          error instanceof Error ? error.message : "Failed to save branch",
        variant: "destructive",
      })
    } finally {
      setSavingBranch(false)
    }
  }

  async function handleDeleteBranch() {
    if (!deleteBranchId) return

    setDeletingBranch(true)

    try {
      const response = await fetch(
        `/api/branches/${encodeURIComponent(deleteBranchId)}`,
        {
          method: "DELETE",
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete branch")
      }

      toast({
        title: "Branch deleted",
        description: "Branch and its images were removed.",
      })

      setDeleteBranchId(null)

      await fetchBranches()
    } catch (error) {
      toast({
        title: "Delete failed",
        description:
          error instanceof Error ? error.message : "Failed to delete branch",
        variant: "destructive",
      })
    } finally {
      setDeletingBranch(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-gradient-to-br from-slate-50 via-emerald-50 to-white">
      <ProtectedNav userRole="admin" />

      <main className="flex-1 min-w-0 bg-[#f4f8ff] p-4 sm:p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
            Branches
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Manage your clinic branches.
          </p>
        </div>

        <Card className="gap-0 p-0 overflow-hidden rounded-2xl border border-emerald-100 shadow-lg">
          <CardHeader className="py-4 px-4 sm:px-6 bg-gradient-to-r from-emerald-600 to-emerald-700">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search branches..."
                className="bg-white border-0 w-full sm:max-w-sm"
              />

              <Button
                className="bg-white text-emerald-700 hover:bg-emerald-50 w-full sm:w-auto"
                onClick={openCreateBranch}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Branch
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-3 sm:p-4">
            {filteredBranches.length === 0 ? (
              <div className="py-16 text-center">
                <MapPin className="mx-auto h-10 w-10 text-emerald-300" />
                <p className="mt-2 font-medium text-slate-600">
                  No branches found
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredBranches.map((branch) => {
                  const clinicCount =
                    branch.images?.filter((image) => image.type === "clinic")
                      .length ?? 0

                  const teamCount =
                    branch.images?.filter((image) => image.type === "team")
                      .length ?? 0

                  const thumbnail = branch.images?.[0]?.url

                  return (
                    <div
                      key={branch.branch_id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 hover:border-emerald-200 transition"
                    >
                      <div className="flex items-center gap-3 sm:contents">
                        <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-emerald-50">
                          {thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={thumbnail}
                              alt={branch.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-emerald-200" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-slate-900 truncate">
                              {branch.name}
                            </p>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                              {branch.branch_id}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500">
                            {branch.area}
                          </p>

                          <div className="flex gap-3 mt-1 text-[11px] text-slate-400">
                            <span>Clinic {clinicCount}</span>
                            <span>Team {teamCount}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-1 border-t sm:border-t-0 pt-2 sm:pt-0 mt-1 sm:mt-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Edit / Manage Images"
                          onClick={() => openEditBranch(branch)}
                        >
                          <Edit className="h-4 w-4 text-slate-500" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          title="Delete"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => setDeleteBranchId(branch.branch_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Branch Modal */}
        <Dialog open={branchModalOpen} onOpenChange={setBranchModalOpen}>
          <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border-0 shadow-2xl p-0 text-gray-950">
            <div className="sticky top-0 z-10 bg-emerald-900 px-4 sm:px-6 py-4 sm:py-5 rounded-t-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
                  {editingBranch ? "Edit Branch" : "Add Branch"}
                </DialogTitle>
                <DialogDescription className="text-white/70 text-xs sm:text-sm mt-0.5">
                  Manage branch information and images
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-4 sm:p-5 space-y-4 bg-[#f0f4ea]">
              <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-4 sm:p-5 bg-white grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-900 font-semibold">
                      Branch Name *
                    </Label>
                    <Input
                      value={branchForm.name}
                      onChange={(e) =>
                        setBranchForm({
                          ...branchForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="SM City General Santos"
                      className="border-gray-300 focus:border-emerald-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-gray-900 font-semibold">
                      Area *
                    </Label>
                    <Input
                      value={branchForm.area}
                      onChange={(e) =>
                        setBranchForm({
                          ...branchForm,
                          area: e.target.value,
                        })
                      }
                      placeholder="General Santos City"
                      className="border-gray-300 focus:border-emerald-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-gray-900 font-semibold">Phone</Label>
                    <Input
                      value={branchForm.phone}
                      onChange={(e) =>
                        setBranchForm({
                          ...branchForm,
                          phone: e.target.value,
                        })
                      }
                      className="border-gray-300 focus:border-emerald-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-gray-900 font-semibold">Email</Label>
                    <Input
                      type="email"
                      value={branchForm.email}
                      onChange={(e) =>
                        setBranchForm({
                          ...branchForm,
                          email: e.target.value,
                        })
                      }
                      className="border-gray-300 focus:border-emerald-900"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-gray-900 font-semibold">
                      Address
                    </Label>
                    <Textarea
                      value={branchForm.address}
                      onChange={(e) =>
                        setBranchForm({
                          ...branchForm,
                          address: e.target.value,
                        })
                      }
                      className="border-gray-300 focus:border-emerald-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-gray-900 font-semibold">Hours</Label>
                    <Input
                      value={branchForm.hours}
                      onChange={(e) =>
                        setBranchForm({
                          ...branchForm,
                          hours: e.target.value,
                        })
                      }
                      className="border-gray-300 focus:border-emerald-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-gray-900 font-semibold">
                      Map Query
                    </Label>
                    <Input
                      value={branchForm.mapQuery}
                      onChange={(e) =>
                        setBranchForm({
                          ...branchForm,
                          mapQuery: e.target.value,
                        })
                      }
                      className="border-gray-300 focus:border-emerald-900"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-gray-900 font-semibold">
                      Directions URL
                    </Label>
                    <Input
                      value={branchForm.directionsUrl}
                      onChange={(e) =>
                        setBranchForm({
                          ...branchForm,
                          directionsUrl: e.target.value,
                        })
                      }
                      className="border-gray-300 focus:border-emerald-900"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-gray-900 font-semibold">
                      Description
                    </Label>
                    <Textarea
                      value={branchForm.blurb}
                      onChange={(e) =>
                        setBranchForm({
                          ...branchForm,
                          blurb: e.target.value,
                        })
                      }
                      className="border-gray-300 focus:border-emerald-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-gray-900 font-semibold">
                      Facebook
                    </Label>
                    <Input
                      value={branchForm.facebook}
                      onChange={(e) =>
                        setBranchForm({
                          ...branchForm,
                          facebook: e.target.value,
                        })
                      }
                      className="border-gray-300 focus:border-emerald-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-gray-900 font-semibold">
                      Instagram
                    </Label>
                    <Input
                      value={branchForm.instagram}
                      onChange={(e) =>
                        setBranchForm({
                          ...branchForm,
                          instagram: e.target.value,
                        })
                      }
                      className="border-gray-300 focus:border-emerald-900"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-4 sm:p-5 bg-white space-y-4">
                  <Label className="text-gray-900 font-semibold">Images</Label>

                  {editingBranch && existingImages.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-500">
                        Existing images — hover to remove
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {existingImages.map((img) => (
                          <div
                            key={img.id}
                            className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.url}
                              alt={img.alt}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[9px] capitalize rounded bg-black/60 text-white">
                              {img.type}
                            </span>
                            <button
                              type="button"
                              onClick={() => setDeleteImageId(img.id)}
                              disabled={deletingImageId === img.id}
                              className="absolute top-1 right-1 rounded-full bg-red-500/90 hover:bg-red-600 text-white p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition disabled:opacity-100"
                            >
                              {deletingImageId === img.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <X className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-gray-900 font-semibold text-xs">
                        New image type
                      </Label>
                      <Select
                        value={uploadType}
                        onValueChange={(value) =>
                          setUploadType(value as ImageType)
                        }
                      >
                        <SelectTrigger className="border-gray-300 focus:border-emerald-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clinic">Clinic</SelectItem>
                          <SelectItem value="team">Team</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-gray-900 font-semibold text-xs hidden sm:block">
                        &nbsp;
                      </Label>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-10 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-emerald-200 bg-emerald-50/50 text-emerald-600 hover:bg-emerald-50 transition text-sm font-medium"
                      >
                        <UploadCloud className="w-4 h-4" />
                        Select images
                      </button>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />

                  <p className="text-xs text-slate-400">
                    JPG, PNG or WEBP, up to 5MB each — multiple allowed.
                    {editingBranch
                      ? " New images upload when you save changes."
                      : " Images upload right after the branch is created."}
                  </p>

                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-500">
                        {selectedFiles.length} new image
                        {selectedFiles.length === 1 ? "" : "s"} selected
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={`${file.name}-${index}`}
                            className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeSelectedFile(index)}
                              className="absolute top-1 right-1 rounded-full bg-black/60 hover:bg-black/80 text-white p-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pb-2">
                <Button
                  variant="outline"
                  className="flex-1 h-10 text-gray-600 border-gray-300 bg-white order-2 sm:order-1"
                  onClick={() => setBranchModalOpen(false)}
                  disabled={savingBranch}
                >
                  Cancel
                </Button>

                <Button
                  className="flex-1 h-10 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-md order-1 sm:order-2"
                  onClick={saveBranch}
                  disabled={savingBranch}
                >
                  {savingBranch ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingBranch ? (
                    "Save Changes"
                  ) : (
                    "Create Branch"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Image Confirmation */}
        <Dialog
          open={deleteImageId !== null}
          onOpenChange={(open) => {
            if (!open && deletingImageId === null) {
              setDeleteImageId(null)
            }
          }}
        >
          <DialogContent className="w-[95vw] sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-black">Delete Image</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this image? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex flex-col-reverse sm:flex-row justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteImageId(null)}
                disabled={deletingImageId !== null}
                className="bg-transparent text-black"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteImage}
                disabled={deletingImageId !== null}
              >
                {deletingImageId !== null ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Confirm Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Branch Confirmation */}
        <Dialog
          open={deleteBranchId !== null}
          onOpenChange={(open) => {
            if (!open && !deletingBranch) {
              setDeleteBranchId(null)
            }
          }}
        >
          <DialogContent className="w-[95vw] sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-black">Delete Branch</DialogTitle>
              <DialogDescription>
                This will delete branch <span className="font-semibold text-slate-900">{deleteBranchId}</span> and all of its images. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex flex-col-reverse sm:flex-row justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteBranchId(null)}
                disabled={deletingBranch}
                className="bg-transparent text-black"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteBranch}
                disabled={deletingBranch}
              >
                {deletingBranch ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Confirm Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}