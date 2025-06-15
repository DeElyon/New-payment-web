import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ExternalLink, Globe, Code, Smartphone, Palette, Users } from "lucide-react"
import Link from "next/link"

export default function CompanyInfo() {
  return (
    <Card className="animate-in bg-gradient-to-br from-slate-900/90 to-violet-950/90 border-2 border-violet-400/30 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 text-white rounded-t-lg">
        <div>
          <CardTitle className="text-2xl font-bold">ELCODERS</CardTitle>
          <CardDescription className="text-violet-100">SOFTWARE DEVELOPING COMPANY</CardDescription>
        </div>
        <div className="h-12 w-12 relative">
          <div className="absolute inset-0 bg-white rounded-full flex items-center justify-center text-violet-600 font-bold text-lg shadow-lg">
            EC
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-bold shadow-lg"
          >
            <Link href="https://elcoders-portfolio-web.vercel.app/" target="_blank" rel="noopener noreferrer">
              <Globe className="mr-2 h-4 w-4" />
              Visit Our Portfolio Website
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="about">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-violet-400/20">
            <TabsTrigger
              value="about"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
            >
              Services
            </TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="space-y-4 pt-4">
            <p className="text-sm leading-relaxed text-slate-300">
              ELCODERS is a leading software development company specializing in creating innovative solutions for
              businesses and individuals. With a focus on quality and customer satisfaction, we deliver cutting-edge
              technology solutions tailored to your needs.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-violet-500/20 text-violet-400 border-violet-400/30">
                <Users className="w-3 h-3 mr-1" />
                Established 2018
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-400/30">
                <Globe className="w-3 h-3 mr-1" />
                Nigeria Based
              </Badge>
              <Badge variant="outline" className="bg-cyan-500/20 text-cyan-400 border-cyan-400/30">
                <ExternalLink className="w-3 h-3 mr-1" />
                Global Clients
              </Badge>
            </div>
            <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 p-3 rounded-lg border border-violet-400/20">
              <p className="text-xs text-center font-medium text-violet-400">
                🚀 Building the future, one line of code at a time
              </p>
            </div>
          </TabsContent>
          <TabsContent value="services" className="pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="border-2 border-cyan-400/30 rounded-md p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 transition-all duration-300">
                <div className="flex items-center mb-2">
                  <Code className="h-4 w-4 text-cyan-400 mr-2" />
                  <h3 className="font-medium text-cyan-400">Web Development</h3>
                </div>
                <p className="text-xs text-cyan-300">Custom websites and web applications</p>
              </div>
              <div className="border-2 border-emerald-400/30 rounded-md p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 transition-all duration-300">
                <div className="flex items-center mb-2">
                  <Smartphone className="h-4 w-4 text-emerald-400 mr-2" />
                  <h3 className="font-medium text-emerald-400">Mobile Apps</h3>
                </div>
                <p className="text-xs text-emerald-300">iOS and Android applications</p>
              </div>
              <div className="border-2 border-violet-400/30 rounded-md p-3 bg-gradient-to-r from-violet-500/10 to-purple-500/10 hover:from-violet-500/20 hover:to-purple-500/20 transition-all duration-300">
                <div className="flex items-center mb-2">
                  <Palette className="h-4 w-4 text-violet-400 mr-2" />
                  <h3 className="font-medium text-violet-400">UI/UX Design</h3>
                </div>
                <p className="text-xs text-violet-300">User-centered design solutions</p>
              </div>
              <div className="border-2 border-amber-400/30 rounded-md p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-300">
                <div className="flex items-center mb-2">
                  <Users className="h-4 w-4 text-amber-400 mr-2" />
                  <h3 className="font-medium text-amber-400">Consulting</h3>
                </div>
                <p className="text-xs text-amber-300">Technical advice and strategy</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
