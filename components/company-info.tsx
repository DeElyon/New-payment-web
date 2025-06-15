import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CompanyInfo() {
  return (
    <Card className="animate-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-2xl font-bold">ELCODERS</CardTitle>
          <CardDescription>SOFTWARE DEVELOPING COMPANY</CardDescription>
        </div>
        <div className="h-12 w-12 relative">
          <div className="absolute inset-0 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
            EC
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="about">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="space-y-4 pt-4">
            <p className="text-sm">
              ELCODERS is a leading software development company specializing in creating innovative solutions for
              businesses and individuals. With a focus on quality and customer satisfaction, we deliver cutting-edge
              technology solutions tailored to your needs.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-primary/10">
                Established 2018
              </Badge>
              <Badge variant="outline" className="bg-primary/10">
                Nigeria Based
              </Badge>
              <Badge variant="outline" className="bg-primary/10">
                Global Clients
              </Badge>
            </div>
          </TabsContent>
          <TabsContent value="services" className="pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded-md p-3">
                <h3 className="font-medium">Web Development</h3>
                <p className="text-xs text-muted-foreground mt-1">Custom websites and web applications</p>
              </div>
              <div className="border rounded-md p-3">
                <h3 className="font-medium">Mobile Apps</h3>
                <p className="text-xs text-muted-foreground mt-1">iOS and Android applications</p>
              </div>
              <div className="border rounded-md p-3">
                <h3 className="font-medium">UI/UX Design</h3>
                <p className="text-xs text-muted-foreground mt-1">User-centered design solutions</p>
              </div>
              <div className="border rounded-md p-3">
                <h3 className="font-medium">Consulting</h3>
                <p className="text-xs text-muted-foreground mt-1">Technical advice and strategy</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
