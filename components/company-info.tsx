import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ExternalLink, Globe, Code, Smartphone, Palette, Users } from "lucide-react"
import Link from "next/link"

export default function CompanyInfo() {
  return (
    <Card className="animate-in bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-2 border-purple-200 dark:border-purple-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
        <div>
          <CardTitle className="text-2xl font-bold">ELCODERS</CardTitle>
          <CardDescription className="text-purple-100">SOFTWARE DEVELOPING COMPANY</CardDescription>
        </div>
        <div className="h-12 w-12 relative">
          <div className="absolute inset-0 bg-white rounded-full flex items-center justify-center text-purple-600 font-bold text-lg shadow-lg">
            EC
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold"
          >
            <Link href="https://elcoders-portfolio-web.vercel.app/" target="_blank" rel="noopener noreferrer">
              <Globe className="mr-2 h-4 w-4" />
              Visit Our Portfolio Website
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="about">
          <TabsList className="grid w-full grid-cols-2 bg-purple-100 dark:bg-purple-900">
            <TabsTrigger value="about" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              About
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Services
            </TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="space-y-4 pt-4">
            <p className="text-sm leading-relaxed">
              ELCODERS is a leading software development company specializing in creating innovative solutions for
              businesses and individuals. With a focus on quality and customer satisfaction, we deliver cutting-edge
              technology solutions tailored to your needs.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                <Users className="w-3 h-3 mr-1" />
                Established 2018
              </Badge>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                <Globe className="w-3 h-3 mr-1" />
                Nigeria Based
              </Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                <ExternalLink className="w-3 h-3 mr-1" />
                Global Clients
              </Badge>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-3 rounded-lg">
              <p className="text-xs text-center font-medium text-purple-700 dark:text-purple-300">
                🚀 Building the future, one line of code at a time
              </p>
            </div>
          </TabsContent>
          <TabsContent value="services" className="pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="border-2 border-blue-200 rounded-md p-3 bg-blue-50 dark:bg-blue-950/20 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <Code className="h-4 w-4 text-blue-600 mr-2" />
                  <h3 className="font-medium text-blue-700 dark:text-blue-300">Web Development</h3>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">Custom websites and web applications</p>
              </div>
              <div className="border-2 border-green-200 rounded-md p-3 bg-green-50 dark:bg-green-950/20 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <Smartphone className="h-4 w-4 text-green-600 mr-2" />
                  <h3 className="font-medium text-green-700 dark:text-green-300">Mobile Apps</h3>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">iOS and Android applications</p>
              </div>
              <div className="border-2 border-purple-200 rounded-md p-3 bg-purple-50 dark:bg-purple-950/20 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <Palette className="h-4 w-4 text-purple-600 mr-2" />
                  <h3 className="font-medium text-purple-700 dark:text-purple-300">UI/UX Design</h3>
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400">User-centered design solutions</p>
              </div>
              <div className="border-2 border-orange-200 rounded-md p-3 bg-orange-50 dark:bg-orange-950/20 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <Users className="h-4 w-4 text-orange-600 mr-2" />
                  <h3 className="font-medium text-orange-700 dark:text-orange-300">Consulting</h3>
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400">Technical advice and strategy</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
