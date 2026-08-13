"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User, ChevronDown } from "lucide-react"

interface Message {
  id: number
  role: "bot" | "user"
  text: string
}

const QUICK_REPLIES = [
  "Book an appointment",
  "Our services",
  "Our branches",
  "Do I need an appointment?",
  "Emergency care",
]

const BOT_RESPONSES: Record<string, string> = {
  default:
    "I'm not sure about that, but our team would be happy to help! Please contact your nearest Dr. Dental Care Center branch, or send us an inquiry through the website.",
  greet:
    "Hello! 👋 Welcome to Dr. Dental Care Center. How can I help you today?",
  book: "You can book an appointment by contacting your preferred Dr. Dental Care Center branch's official page, or by sending an inquiry through our website. When requesting an appointment, it helps to share your preferred branch, preferred date and time, and the service or concern you'd like checked. Walk-in patients may also be accommodated, depending on the branch's availability.",
  appointmentNeeded:
    "Appointments are recommended so we can help ensure your preferred dentist, specialist, or treatment schedule is available. You can contact your preferred branch for appointment assistance. Walk-in patients may also be accommodated depending on the branch's availability.",
  services:
    "We offer a comprehensive range of dental services, which may include:\n\n🦷 Preventive and General Dentistry\n✨ Cosmetic Dentistry\n🏗️ Restorative Dentistry\n🔧 Orthodontic Treatment\n🩹 Oral Surgery\n🦴 Prosthodontic Services\n👶 Pediatric Dental Care\n🌿 Periodontal Care\n🩺 Endodontic Treatment\n😮‍💨 TMJ and other specialized services\n\nAvailable treatments and specialists may vary by branch, so a consultation is recommended to find the best option for your needs. Would you like details on a specific service?",
  hours:
    "Office hours can vary by branch. The best way to get exact hours and dentist availability is to contact your preferred branch directly through its official page.",
  location:
    "Dr. Dental Care Center has branches across Mindanao, including:\n\n📍 Davao City\n📍 Tagum City\n📍 Bajada\n📍 Panabo City\n📍 General Santos City\n📍 Digos City\n📍 Toril\n\nMessage your preferred branch's official page for its exact address, operating hours, and dentist availability. 😊",
  payment:
    "Accepted payment methods can vary by branch. Please contact your preferred branch directly, and our team will be happy to let you know what's available there.",
  specialists:
    "Dr. Dental works with dental professionals across different areas of practice and expertise to help address a wide range of dental concerns. For treatments that need specialized care, contact your preferred branch to ask about the right specialist and available schedule.",
  consultation:
    "Yes! We encourage a proper dental consultation and assessment before deciding on any treatment. During the consultation, our dental professionals can evaluate your dental condition, explain the appropriate treatment options, and answer your questions so you can make an informed decision.",
  whitening:
    "Cosmetic dentistry, including teeth whitening, is one of our services — though the exact options and treatments available can vary by branch. Book a consultation with your preferred branch and our dental professionals can recommend the best option for you. 😁",
  braces:
    "Orthodontic treatment is part of our services. The best option for you depends on your case and what's available at your preferred branch — book a consultation and our dentist can recommend the right treatment.",
  implant:
    "Restorative and prosthodontic services, which can include options for missing teeth, are part of what we offer. Availability may vary by branch, so a consultation is the best way to find out if this is right for you.",
  pain: "We understand dental visits can feel intimidating for some patients. Our dental professionals are happy to walk you through your options and what to expect during a consultation, so you feel informed and comfortable before any treatment.",
  price:
    "The cost of dental treatment depends on your individual condition, treatment requirements, materials, complexity, and recommended procedure. Since every patient's needs are different, we encourage scheduling a consultation so our dental professionals can properly assess your condition and discuss suitable treatment options.",
  emergency:
    "For urgent dental concerns, please contact your nearest Dr. Dental Care Center branch for assistance. Availability will depend on the nature of the concern, the dentist on duty, and the branch schedule. For serious medical emergencies requiring immediate medical attention, please seek appropriate emergency medical care right away. 🚨",
  kids: "Pediatric Dental Care is part of our services, designed with children in mind. Availability of pediatric specialists can vary by branch, so it's best to contact your preferred branch to check schedules. 👶",
}

function getBotResponse(input: string): string {
  const msg = input.toLowerCase()
  if (msg.match(/^(hi|hello|hey|good\s?(morning|afternoon|evening)|kumusta)/))
    return BOT_RESPONSES.greet
  if (msg.match(/do i need an appointment|walk.?in/))
    return BOT_RESPONSES.appointmentNeeded
  if (msg.match(/book|appointment|schedule|reserve/)) return BOT_RESPONSES.book
  if (msg.match(/service|offer|treatment|procedure|what do you/))
    return BOT_RESPONSES.services
  if (msg.match(/hour|open|close|schedule|time|when/))
    return BOT_RESPONSES.hours
  if (msg.match(/location|address|where|directions|map|find you|branch/))
    return BOT_RESPONSES.location
  if (msg.match(/pay|payment|gcash|maya|credit|cash|philhealth|installment/))
    return BOT_RESPONSES.payment
  if (msg.match(/specialist|expert/)) return BOT_RESPONSES.specialists
  if (msg.match(/consult|assessment|before treatment|before deciding/))
    return BOT_RESPONSES.consultation
  if (msg.match(/whiten|bleach|bright/)) return BOT_RESPONSES.whitening
  if (msg.match(/brace|aligner|invisalign|orthodont|crooked|straight/))
    return BOT_RESPONSES.braces
  if (msg.match(/implant|missing tooth|missing teeth|prosthodont/))
    return BOT_RESPONSES.implant
  if (msg.match(/pain|hurt|scared|nervous|anxious|fear/))
    return BOT_RESPONSES.pain
  if (msg.match(/price|cost|how much|fee|rate|afford/))
    return BOT_RESPONSES.price
  if (msg.match(/emergency|urgent|swollen|knocked|broken|severe/))
    return BOT_RESPONSES.emergency
  if (msg.match(/kid|child|children|pediatric|baby|toddler/))
    return BOT_RESPONSES.kids
  return BOT_RESPONSES.default
}

export default function CustomerServiceChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "bot",
      text: "Hi there! 👋 I'm the Dr. Dental Care Center virtual assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: text.trim(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setTyping(true)

    setTimeout(
      () => {
        const reply = getBotResponse(text)
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: "bot", text: reply },
        ])
        setTyping(false)
      },
      800 + Math.random() * 400,
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div
          className="mb-4 w-[340px] sm:w-[380px] bg-[#1b3d1f] border border-[#4CAF50]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: "520px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#2a5a2f] border-b border-[#4CAF50]/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#4CAF50]/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#8BD98F]" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">
                  Dr. Dental Care Center
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8BD98F] animate-pulse" />
                  <span className="text-[#8BD98F] text-xs">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-[#a8d9ab] hover:text-white transition p-1 rounded-lg hover:bg-white/10"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-[#4CAF50]"
            style={{ minHeight: 0 }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs
                  ${msg.role === "bot" ? "bg-[#4CAF50]/20" : "bg-[#3d8b40]/40"}`}
                >
                  {msg.role === "bot" ? (
                    <Bot className="w-3.5 h-3.5 text-[#8BD98F]" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-[#c9ecc9]" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line
                    ${
                      msg.role === "bot"
                        ? "bg-[#2a5a2f] text-white rounded-bl-sm"
                        : "bg-[#4CAF50] text-[#0d2b0f] font-medium rounded-br-sm"
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-[#4CAF50]/20 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-[#8BD98F]" />
                </div>
                <div className="bg-[#2a5a2f] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-[#8BD98F] rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-3 py-2 flex flex-wrap gap-2 border-t border-[#4CAF50]/30">
            {QUICK_REPLIES.map((qr) => (
              <button
                key={qr}
                onClick={() => sendMessage(qr)}
                className="text-xs px-3 py-1.5 rounded-full border border-[#4CAF50]/50 text-[#8BD98F] hover:bg-[#4CAF50]/10 transition whitespace-nowrap"
              >
                {qr}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-2 flex gap-2 items-center border-t border-[#4CAF50]/30">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-[#2a5a2f] border border-[#4CAF50]/40 rounded-xl px-3.5 py-2 text-sm text-white placeholder-[#a8d9ab]/60 focus:outline-none focus:border-[#4CAF50] transition"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl bg-[#4CAF50] hover:bg-[#3d8b40] disabled:bg-[#4CAF50]/30 disabled:cursor-not-allowed flex items-center justify-center transition flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-[#0d2b0f]" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-[#4CAF50] hover:bg-[#3d8b40] shadow-lg hover:shadow-[#4CAF50]/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <ChevronDown className="w-6 h-6 text-[#0d2b0f]" />
        ) : (
          <MessageCircle className="w-6 h-6 text-[#0d2b0f]" />
        )}
      </button>
    </>
  )
}
