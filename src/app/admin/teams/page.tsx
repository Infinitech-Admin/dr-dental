"use client"

import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import {
  Edit,
  Loader2,
  Plus,
  Trash2,
  UploadCloud,
  User,
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
import { useToast } from "@/hooks/use-toast"
import { useAdminRoute } from "@/hooks/use-protected-route"
import ProtectedNav from "@/components/layout/ProtectedNavbar"

interface Branch {
  id: number
  branch_id: string
  name: string
}

interface TeamMember {
  id: number
  branchId: string
  branchName: string
  name: string
  position: string | null
  image: string | null
  sortOrder: number
}

const EMPTY_FORM = {
  branchId: "",
  name: "",
  position: "",
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export default function TeamsPage() {
  useAdminRoute()

  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [teams, setTeams] = useState<TeamMember[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const [deleteTeamId, setDeleteTeamId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true)

      const response = await fetch("/api/teams", { cache: "no-store" })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch team members")
      }

      setTeams(data?.teams ?? [])
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch team members",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const fetchBranches = useCallback(async () => {
    try {
      const response = await fetch("/api/branches", { cache: "no-store" })
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
    }
  }, [toast])

  useEffect(() => {
    fetchTeams()
    fetchBranches()
  }, [fetchTeams, fetchBranches])

  const filteredTeams = useMemo(() => {
    const value = search.trim().toLowerCase()

    if (!value) return teams

    return teams.filter(
      (team) =>
        team.name.toLowerCase().includes(value) ||
        (team.position ?? "").toLowerCase().includes(value) ||
        team.branchName.toLowerCase().includes(value),
    )
  }, [teams, search])

  function resetImageState() {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  function openCreate() {
    setEditingTeam(null)
    setForm({ ...EMPTY_FORM, branchId: branches[0]?.branch_id ?? "" })
    resetImageState()
    setModalOpen(true)
  }

  function openEdit(team: TeamMember) {
    setEditingTeam(team)
    setForm({
      branchId: team.branchId,
      name: team.name,
      position: team.position ?? "",
    })
    setSelectedFile(null)
    setPreviewUrl(team.image)
    setModalOpen(true)
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file",
        description: "JPG, PNG, or WEBP only.",
        variant: "destructive",
      })
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum size is 5MB.",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function saveTeam() {
    if (!form.name.trim() || !form.branchId) {
      toast({
        title: "Required fields",
        description: "Name and branch are required.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const formData = new FormData()
      formData.append("branch_id", form.branchId)
      formData.append("name", form.name.trim())
      formData.append("position", form.position.trim())

      if (selectedFile) {
        formData.append("image", selectedFile)
      }

      const url = editingTeam
        ? `/api/teams/${editingTeam.id}`
        : "/api/teams"

      if (editingTeam) {
        formData.append("_method", "PUT")
      }

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || "Failed to save team member")
      }

      toast({
        title: editingTeam ? "Team member updated" : "Team member created",
      })

      setModalOpen(false)
      setEditingTeam(null)
      resetImageState()

      await fetchTeams()
    } catch (error) {
      toast({
        title: "Save failed",
        description:
          error instanceof Error ? error.message : "Failed to save",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteTeam() {
    if (deleteTeamId === null) return

    setDeleting(true)

    try {
      const response = await fetch(`/api/teams/${deleteTeamId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete team member")
      }

      toast({ title: "Team member deleted" })
      setDeleteTeamId(null)

      await fetchTeams()
    } catch (error) {
      toast({
        title: "Delete failed",
        description:
          error instanceof Error ? error.message : "Failed to delete",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
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
            Team
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Manage team members shown per branch.
          </p>
        </div>

        <Card className="gap-0 p-0 overflow-hidden rounded-2xl border border-emerald-100 shadow-lg">
          <CardHeader className="py-4 px-4 sm:px-6 bg-gradient-to-r from-emerald-600 to-emerald-700">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search team members..."
                className="bg-white border-0 w-full sm:max-w-sm"
              />

              <Button
                className="bg-white text-emerald-700 hover:bg-emerald-50 w-full sm:w-auto"
                onClick={openCreate}
                disabled={branches.length === 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-3 sm:p-4">
            {filteredTeams.length === 0 ? (
              <div className="py-16 text-center">
                <User className="mx-auto h-10 w-10 text-emerald-300" />
                <p className="mt-2 font-medium text-slate-600">
                  No team members found
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTeams.map((team) => (
                  <div
                    key={team.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 hover:border-emerald-200 transition"
                  >
                    <div className="flex items-center gap-3 sm:contents">
                      <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden bg-emerald-50">
                        {team.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={team.image}
                            alt={team.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-6 h-6 text-emerald-200" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 truncate">
                          {team.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {team.position || "—"}
                        </p>
                        <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                          {team.branchName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1 border-t sm:border-t-0 pt-2 sm:pt-0 mt-1 sm:mt-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Edit"
                        onClick={() => openEdit(team)}
                      >
                        <Edit className="h-4 w-4 text-slate-500" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        title="Delete"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => setDeleteTeamId(team.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Team Member Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="w-[95vw] sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl border-0 shadow-2xl p-0 text-gray-950">
            <div className="sticky top-0 z-10 bg-emerald-900 px-4 sm:px-6 py-4 sm:py-5 rounded-t-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
                  {editingTeam ? "Edit Team Member" : "Add Team Member"}
                </DialogTitle>
                <DialogDescription className="text-white/70 text-xs sm:text-sm mt-0.5">
                  Photo, name, position, and branch
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-4 sm:p-5 space-y-4 bg-[#f0f4ea]">
              <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-4 sm:p-5 bg-white space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 shrink-0 rounded-full overflow-hidden bg-emerald-50 border border-gray-200">
                      {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-8 h-8 text-emerald-200" />
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 rounded-lg border-2 border-dashed border-emerald-200 bg-emerald-50/50 text-emerald-600 hover:bg-emerald-50 transition text-sm font-medium px-4 py-2"
                    >
                      <UploadCloud className="w-4 h-4" />
                      {previewUrl ? "Change photo" : "Upload photo"}
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-gray-900 font-semibold">
                      Name *
                    </Label>
                    <Input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Juan Dela Cruz"
                      className="border-gray-300 focus:border-emerald-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-gray-900 font-semibold">
                      Position
                    </Label>
                    <Input
                      value={form.position}
                      onChange={(e) =>
                        setForm({ ...form, position: e.target.value })
                      }
                      placeholder="Branch Manager"
                      className="border-gray-300 focus:border-emerald-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-gray-900 font-semibold">
                      Branch *
                    </Label>
                    <Select
                      value={form.branchId}
                      onValueChange={(value) =>
                        setForm({ ...form, branchId: value })
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:border-emerald-900">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem
                            key={branch.branch_id}
                            value={branch.branch_id}
                          >
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pb-2">
                <Button
                  variant="outline"
                  className="flex-1 h-10 text-gray-600 border-gray-300 bg-white order-2 sm:order-1"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button
                  className="flex-1 h-10 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-md order-1 sm:order-2"
                  onClick={saveTeam}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingTeam ? (
                    "Save Changes"
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog
          open={deleteTeamId !== null}
          onOpenChange={(open) => {
            if (!open && !deleting) setDeleteTeamId(null)
          }}
        >
          <DialogContent className="w-[95vw] sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-black">
                Delete Team Member
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this team member? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex flex-col-reverse sm:flex-row justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteTeamId(null)}
                disabled={deleting}
                className="bg-transparent text-black"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteTeam}
                disabled={deleting}
              >
                {deleting ? (
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