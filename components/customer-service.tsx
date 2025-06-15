"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Users,
  Headphones,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react"
import Link from "next/link"

export default function CustomerService() {
  const [isOnline, setIsOnline] = useState(true)

  const supportChannels = [
    {
      id: "whatsapp",
      name: "WhatsApp Support",
      description: "Get instant help via WhatsApp",
      icon: MessageCircle,
      contact: "+2348061908715",
      link: "https://wa.me/2348061908715",
      status: "online",
      responseTime: "< 5 minutes",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
      borderColor: "border-emerald-400/30",
      textColor: "text-emerald-400",
      iconBg: "bg-emerald-500/20",
    },
    {
      id: "phone",
      name: "Phone Support",
      description: "Direct phone consultation",
      icon: Phone,
      contact: "+234 806 190 8715",
      link: "tel:+2348061908715",
      status: "online",
      responseTime: "Immediate",
      gradient: "from-cyan-500 to-blue-500",
      bgGradient: "from-cyan-500/10 to-blue-500/10",
      borderColor: "border-cyan-400/30",
      textColor: "text-cyan-400",
      iconBg: "bg-cyan-500/20",
    },
    {
      id: "email",
      name: "Email Support",
      description: "Detailed technical assistance",
      icon: Mail,
      contact: "elcoderssoftwares12@gmail.com",
      link: "mailto:elcoderssoftwares12@gmail.com",
      status: "online",
      responseTime: "< 2 hours",
      gradient: "from-violet-500 to-purple-500",
      bgGradient: "from-violet-500/10 to-purple-500/10",
      borderColor: "border-violet-400/30",
      textColor: "text-violet-400",
      iconBg: "bg-violet-500/20",
    },
  ]

  const faqItems = [
    {
      question: "How long does payment verification take?",
      answer:
        "Payment verification typically takes 2-5 minutes after you submit your transaction ID. You'll receive instant confirmation once verified.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept bank transfers (ACCESS BANK, SMARTCASH) and cryptocurrency payments (USDT via TRC20, ERC20, TON, BEP20 networks).",
    },
    {
      question: "Is my payment information secure?",
      answer:
        "Yes, we use enterprise-grade security measures to protect all payment information. Your data is encrypted and never stored on our servers.",
    },
    {
      question: "Can I get a refund?",
      answer:
        "Refunds are processed according to our refund policy. Contact our support team with your payment reference for assistance.",
    },
    {
      question: "What if my payment fails?",
      answer:
        "If your payment fails, you can retry the transaction or contact our support team for immediate assistance.",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-emerald-400"
      case "busy":
        return "bg-amber-400"
      case "offline":
        return "bg-red-400"
      default:
        return "bg-slate-400"
    }
  }

  return (
    <Card className="w-full animate-in bg-gradient-to-br from-slate-900/90 to-blue-950/90 border-2 border-cyan-400/30 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Headphones className="mr-3 h-6 w-6" />
              Customer Support
            </CardTitle>
            <CardDescription className="text-cyan-100">
              24/7 Professional assistance for all your payment needs
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor("online")} animate-pulse`}></div>
            <Badge variant="outline" className="bg-white/20 text-white border-white/30">
              <Users className="w-3 h-3 mr-1" />
              Online
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs defaultValue="contact" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-cyan-400/20">
            <TabsTrigger
              value="contact"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
            >
              Contact Us
            </TabsTrigger>
            <TabsTrigger
              value="faq"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              FAQ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contact" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {supportChannels.map((channel) => {
                const IconComponent = channel.icon
                return (
                  <div
                    key={channel.id}
                    className={`relative overflow-hidden rounded-lg border-2 ${channel.borderColor} bg-gradient-to-r ${channel.bgGradient} p-1 hover:scale-[1.02] transition-transform duration-300`}
                  >
                    <div className="bg-slate-900/80 backdrop-blur-sm rounded-md p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${channel.iconBg} border border-current/20`}>
                            <IconComponent className={`h-5 w-5 ${channel.textColor}`} />
                          </div>
                          <div>
                            <h3 className={`font-semibold ${channel.textColor}`}>{channel.name}</h3>
                            <p className={`text-sm ${channel.textColor}/80`}>{channel.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor(channel.status)} animate-pulse`}
                            ></div>
                            <span className="text-xs font-medium text-slate-300 capitalize">{channel.status}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span className="text-xs text-slate-400">{channel.responseTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className={`font-mono text-sm ${channel.textColor} font-medium`}>{channel.contact}</div>
                        <Button
                          asChild
                          size="sm"
                          className={`bg-gradient-to-r ${channel.gradient} hover:opacity-90 text-white shadow-lg`}
                        >
                          <Link href={channel.link} target="_blank" rel="noopener noreferrer">
                            Contact Now
                            <ExternalLink className="ml-2 h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg border-2 border-emerald-400/30">
              <h4 className="font-semibold text-emerald-400 mb-3 flex items-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                Quick Actions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-emerald-400/30 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300"
                >
                  <Link href="https://wa.me/2348061908715?text=Hi, I need help with my payment" target="_blank">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Payment Help
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-cyan-400/30 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300"
                >
                  <Link href="https://wa.me/2348061908715?text=Hi, I want to report a technical issue" target="_blank">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Report Issue
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4 mt-6">
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="border-2 border-violet-400/30 rounded-lg p-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10 hover:from-violet-500/20 hover:to-purple-500/20 transition-all duration-300"
                >
                  <h4 className="font-semibold text-violet-400 mb-2 flex items-start">
                    <Info className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                    {item.question}
                  </h4>
                  <p className="text-violet-300/90 text-sm leading-relaxed ml-6">{item.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-lg border-2 border-violet-400/30 text-center">
              <p className="text-violet-400 font-medium mb-3">Still have questions?</p>
              <Button
                asChild
                className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg"
              >
                <Link
                  href="https://wa.me/2348061908715?text=Hi, I have a question not covered in the FAQ"
                  target="_blank"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Ask Our Team
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
