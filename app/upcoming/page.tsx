import { Construction, Rocket, Zap, Brain } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function UpcomingPage() {
  const upcomingFeatures = [
    {
      title: "AI-Powered Query Optimization",
      description: "Automatically optimize your SQL queries for better performance using machine learning algorithms.",
      status: "In Development",
      icon: Brain,
      timeline: "Q2 2024",
    },
    {
      title: "Real-time Collaboration",
      description: "Share dashboards and collaborate with team members in real-time with live updates.",
      status: "Planning",
      icon: Zap,
      timeline: "Q3 2024",
    },
    {
      title: "Advanced Chart Types",
      description: "Support for more visualization types including heatmaps, scatter plots, and geographic maps.",
      status: "Coming Soon",
      icon: Rocket,
      timeline: "Q2 2024",
    },
    {
      title: "API Integration",
      description: "RESTful API for integrating SQLInsights into your existing applications and workflows.",
      status: "Planning",
      icon: Construction,
      timeline: "Q4 2024",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Upcoming{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Developments
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Exciting new features and improvements coming to SQLInsights. Stay tuned for these amazing updates!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingFeatures.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card
                key={index}
                className="shadow-lg border-2 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-slate-900 dark:text-slate-100">{feature.title}</CardTitle>
                    </div>
                    <Badge variant={feature.status === "In Development" ? "default" : "secondary"}>
                      {feature.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Expected Timeline:</span>
                    <Badge variant="outline">{feature.timeline}</Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="shadow-lg border-2 border-slate-200 dark:border-slate-700">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Have a Feature Request?</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                We'd love to hear your ideas! Help us shape the future of SQLInsights by sharing your suggestions.
              </p>
              <div className="text-blue-600 dark:text-blue-400 font-medium">
                Contact us through our Support page to share your ideas!
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
