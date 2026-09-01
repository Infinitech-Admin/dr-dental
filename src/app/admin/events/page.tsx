"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Trash2,
  Search,
  Plus,
  Eye,
  Edit,
  Loader2,
  ImageIcon,
  X,
  UploadCloud,
  CalendarDays,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useAdminRoute } from "@/hooks/use-protected-route"
import ProtectedNav from "@/components/layout/ProtectedNavbar"

interface EventImage {
  url: string
  alt: string
}

interface Event {
  id: number
  event_id: string
  event_name: string
  description: string | null
  images: EventImage[]
}

export default function EventsAdmin() {
  useAdminRoute()

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null)

  const [deleteImageOpen, setDeleteImageOpen] = useState(false)
  const [deleteImageTarget, setDeleteImageTarget] = useState<{
    eventId: string
    index: number
  } | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)

  const [viewEvent, setViewEvent] = useState<Event | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeletingImage, setIsDeletingImage] = useState(false)

  const [formData, setFormData] = useState({
    event_name: "",
    description: "",
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [searchTerm, setSearchTerm] = useState("")

  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/events")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setEvents(Array.isArray(data) ? data : data.events || [])
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  async function handleDelete(eventId: string) {
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete event")
      }

      toast({
        title: "Deleted",
        description: "Event deleted successfully.",
      })

      setDeleteOpen(false)
      setDeleteEventId(null)

      fetchEvents()
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete event",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleDeleteImage() {
    if (!deleteImageTarget) return

    const { eventId, index } = deleteImageTarget

    setIsDeletingImage(true)

    try {
      const res = await fetch(
        `/api/events/${encodeURIComponent(eventId)}/images/${index}`,
        {
          method: "DELETE",
        },
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete image")
      }

      if (data.event) {
        setViewEvent(data.event)
      }

      if (data.event) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.event_id === data.event.event_id ? data.event : event,
          ),
        )
      }

      setDeleteImageOpen(false)
      setDeleteImageTarget(null)

      toast({
        title: "Image deleted",
        description: "The image has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete image",
        variant: "destructive",
      })
    } finally {
      setIsDeletingImage(false)
    }
  }

  function openViewModal(event: Event) {
    setViewEvent(event)
    setViewOpen(true)
  }

  function openCreateModal() {
    setEditingEvent(null)
    setFormData({ event_name: "", description: "" })
    setSelectedFiles([])
    setFormOpen(true)
  }

  function openEditModal(event: Event) {
    setEditingEvent(event)
    setFormData({
      event_name: event.event_name,
      description: event.description ?? "",
    })
    setSelectedFiles([])
    setFormOpen(true)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : []
    setSelectedFiles((prev) => [...prev, ...files])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function removeSelectedFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSave() {
    if (!formData.event_name.trim()) {
      toast({
        title: "Name required",
        description: "Enter an event name",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const url = editingEvent
        ? `/api/events/${encodeURIComponent(editingEvent.event_id)}`
        : "/api/events"

      const body = new FormData()

      body.append("event_name", formData.event_name.trim())
      body.append("description", formData.description)

      selectedFiles.forEach((file) => {
        body.append("images[]", file)
      })

      const res = await fetch(url, {
        method: "POST",
        body,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.message ||
            data.error ||
            JSON.stringify(data) ||
            "Failed to save event",
        )
      }

      toast({
        title: "Success",
        description: editingEvent
          ? "Event updated successfully."
          : "Event created successfully.",
      })

      setFormOpen(false)
      setEditingEvent(null)
      setSelectedFiles([])

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      await fetchEvents()
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "An error occurred while saving the event.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filtered = events.filter(
    (e) =>
      e.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.description ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-400 border-t-transparent" />
          <span className="text-sm font-medium tracking-wide text-green-700">
            Loading...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-gradient-to-br from-slate-50 via-emerald-50 to-white">
      <ProtectedNav userRole="admin" />

      <div className="flex-1 min-w-0 w-full overflow-x-hidden">
        <main className="min-h-screen bg-[#f4f8ff] pt-4 pb-12 px-3 sm:px-6">
          <div className="pb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Events Management
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Manage events and their photo galleries
            </p>
          </div>

          <Card className="gap-0 p-0 border border-emerald-100 shadow-lg rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-200" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-white text-slate-900 placeholder:text-slate-400 border-0 focus-visible:ring-2 focus-visible:ring-emerald-300"
                  />
                </div>
                <Button
                  onClick={openCreateModal}
                  className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-md w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Event
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-3 sm:p-4">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                  <CalendarDays className="w-10 h-10 text-emerald-300" />
                  <p className="text-slate-600 font-medium">No events yet</p>
                  <p className="text-slate-400 text-sm">
                    Create an event and add photos to get started
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {filtered.map((event) => (
                    <div
                      key={event.event_id}
                      className="group rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-emerald-300 hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div>
                        {/* Thumbnail */}
                        <button
                          type="button"
                          onClick={() => openViewModal(event)}
                          className="relative block w-full aspect-[4/3] bg-emerald-50 overflow-hidden"
                        >
                          {event.images.length > 0 ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={event.images[0].url}
                              alt={event.images[0].alt}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-7 h-7 text-emerald-200" />
                            </div>
                          )}

                          {/* Photo count */}
                          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/65 text-white text-[10px]">
                            {event.images.length} photo
                            {event.images.length !== 1 ? "s" : ""}
                          </span>
                        </button>

                        {/* Info */}
                        <div className="px-3 pt-2.5">
                          <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                            {event.event_name}
                          </p>

                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {event.description || "No description"}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-1 px-2.5 py-2 mt-2 border-t border-slate-100 bg-slate-50/50">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-slate-400 hover:text-emerald-600"
                          onClick={() => openViewModal(event)}
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-slate-400 hover:text-emerald-600"
                          onClick={() => openEditModal(event)}
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setDeleteEventId(event.event_id)
                            setDeleteOpen(true)
                          }}
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        {/* View Modal */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-0 shadow-2xl p-0 text-gray-950">
            <div className="sticky top-0 z-10 bg-emerald-900 px-6 py-5 rounded-t-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
                  {viewEvent?.event_name}
                </DialogTitle>
                <DialogDescription className="text-white/70 text-xs sm:text-sm mt-0.5">
                  Event details and photo gallery
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="p-4 sm:p-6 space-y-4 bg-[#f0f4ea]">
              {viewEvent && (
                <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="p-4 sm:p-5 bg-white space-y-4 text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">Description</p>
                      <p className="text-gray-700 whitespace-pre-wrap mt-1 text-xs sm:text-sm">
                        {viewEvent.description || "No description"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">
                        Images ({viewEvent.images.length})
                      </p>
                      {viewEvent.images.length === 0 ? (
                        <p className="text-gray-400 text-sm">
                          No images uploaded yet
                        </p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {viewEvent.images.map((img, index) => (
                            <div
                              key={`${img.url}-${index}`}
                              className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img.url}
                                alt={img.alt}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteImageTarget({
                                    eventId: viewEvent.event_id,
                                    index,
                                  })

                                  setDeleteImageOpen(true)
                                }}
                                disabled={isDeletingImage}
                                aria-label={`Delete image ${index + 1}`}
                                className="absolute right-1 top-1 rounded-full bg-red-500/90 p-1.5 text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex gap-3 pb-2">
                <Button
                  variant="outline"
                  className="flex-1 h-10 text-gray-600 border-gray-300 bg-white"
                  onClick={() => setViewOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Modal */}
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-0 shadow-2xl p-0 text-gray-950">
            <div className="sticky top-0 z-10 bg-emerald-900 px-6 py-5 rounded-t-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
                  {editingEvent ? "Update Event" : "New Event"}
                </DialogTitle>
                <DialogDescription className="text-white/70 text-xs sm:text-sm mt-0.5">
                  {editingEvent
                    ? "Update event details or add more photos"
                    : "Create an event and upload photos"}
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="p-4 sm:p-6 space-y-4 bg-[#f0f4ea]">
              <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-4 sm:p-5 bg-white space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="event_name"
                      className="text-gray-900 font-semibold"
                    >
                      Event Name
                    </Label>
                    <Input
                      id="event_name"
                      value={formData.event_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          event_name: e.target.value,
                        })
                      }
                      className="border-gray-300 focus-visible:ring-emerald-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-gray-900 font-semibold"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="border-gray-300 focus-visible:ring-emerald-900 resize-y"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-900 font-semibold">
                      {editingEvent ? "Add Images" : "Images"}
                    </Label>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 py-6 sm:py-8 px-4 text-emerald-600 hover:bg-emerald-50 transition text-center"
                    >
                      <UploadCloud className="w-6 h-6" />
                      <span className="text-sm font-medium">
                        Click to select images
                      </span>
                      <span className="text-xs text-slate-400">
                        JPG, PNG or WEBP, up to 5MB each — multiple allowed
                      </span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-500">
                        {selectedFiles.length} image
                        {selectedFiles.length > 1 ? "s" : ""} selected
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {editingEvent && editingEvent.images.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-gray-900 font-semibold">
                        Existing Images
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {editingEvent.images.map((img, index) => (
                          <div
                            key={`${img.url}-${index}`}
                            className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.url}
                              alt={img.alt}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-400">
                        Manage or remove existing images from the view screen.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pb-2">
                <Button
                  variant="outline"
                  className="flex-1 h-10 text-gray-600 border-gray-300 bg-white order-2 sm:order-1"
                  onClick={() => setFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-10 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-md order-1 sm:order-2"
                  onClick={handleSave}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingEvent ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Event Confirmation Modal */}
        <Dialog
          open={deleteOpen}
          onOpenChange={(open) => {
            if (isDeleting) return

            setDeleteOpen(open)

            if (!open) {
              setDeleteEventId(null)
            }
          }}
        >
          <DialogContent className="w-[95vw] sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-black">Delete Event</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this event? All of its images
                will be removed too. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
              <Button
                variant="outline"
                disabled={isDeleting}
                onClick={() => {
                  setDeleteOpen(false)
                  setDeleteEventId(null)
                }}
                className="bg-transparent text-black"
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                disabled={isDeleting}
                onClick={() => deleteEventId && handleDelete(deleteEventId)}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Image Confirmation Modal */}
        <Dialog
          open={deleteImageOpen}
          onOpenChange={(open) => {
            if (isDeletingImage) return

            setDeleteImageOpen(open)

            if (!open) {
              setDeleteImageTarget(null)
            }
          }}
        >
          <DialogContent className="w-[95vw] sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-black">Delete Image</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this image? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
              <Button
                variant="outline"
                disabled={isDeletingImage}
                onClick={() => {
                  setDeleteImageOpen(false)
                  setDeleteImageTarget(null)
                }}
                className="bg-transparent text-black"
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                disabled={isDeletingImage}
                onClick={handleDeleteImage}
              >
                {isDeletingImage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
