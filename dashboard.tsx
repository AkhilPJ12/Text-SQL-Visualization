"use client"

import { useState } from "react"
import { Search, Database, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Component() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sqlQuery, setSqlQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDatabase, setSelectedDatabase] = useState("")
  const [selectedEngine, setSelectedEngine] = useState("")
  const [connectionFields, setConnectionFields] = useState({
    host: "",
    port: "",
    databaseName: "",
    username: "",
    password: "",
    filePath: "",
    serviceName: "",
    serverName: "",
  })

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setSqlQuery("")
    try {
      const res = await fetch("/api/nl2sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: searchQuery, dbType: selectedDatabase || undefined }),
      })
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`)
      }
      const data = await res.json()
      const content = (data?.sql || data?.content || "").toString()
      setSqlQuery(content.trim())
    } catch (error) {
      console.error(error)
      setSqlQuery("-- Error generating SQL. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDatabaseChange = (value: string) => {
    setSelectedDatabase(value)
    setSelectedEngine("")
    setConnectionFields({
      host: "",
      port: "",
      databaseName: "",
      username: "",
      password: "",
      filePath: "",
      serviceName: "",
      serverName: "",
    })
  }

  const getDefaultPort = (dbType: string, engine?: string) => {
    switch (dbType) {
      case "mysql":
        return "Default 3306"
      case "postgresql":
        return "Default 5432"
      case "sqlserver":
        return "Default 1433"
      case "oracle":
        return "Default 1521"
      case "aurora":
        return engine === "MySQL" ? "Default 3306" : engine === "Postgres" ? "Default 5432" : ""
      case "gcp":
        return engine === "MySQL"
          ? "Default 3306"
          : engine === "Postgres"
            ? "Default 5432"
            : engine === "SQL Server"
              ? "Default 1433"
              : ""
      default:
        return ""
    }
  }

  const renderConnectionFields = () => {
    if (!selectedDatabase) return null

    const commonFields = (showPort = true, showDatabase = true, portPlaceholder = "") => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="host" className="text-sm font-medium">
            Host*
          </Label>
          <Input
            id="host"
            value={connectionFields.host}
            onChange={(e) => setConnectionFields({ ...connectionFields, host: e.target.value })}
            className="mt-1"
            required
          />
        </div>
        {showPort && (
          <div>
            <Label htmlFor="port" className="text-sm font-medium flex justify-between">
              <span>Port</span>
              <span className="text-xs text-slate-500 font-normal">{portPlaceholder}</span>
            </Label>
            <Input
              id="port"
              value={connectionFields.port}
              onChange={(e) => setConnectionFields({ ...connectionFields, port: e.target.value })}
              className="mt-1"
            />
          </div>
        )}
        {showDatabase && (
          <div>
            <Label htmlFor="databaseName" className="text-sm font-medium">
              Database Name*
            </Label>
            <Input
              id="databaseName"
              value={connectionFields.databaseName}
              onChange={(e) => setConnectionFields({ ...connectionFields, databaseName: e.target.value })}
              className="mt-1"
              required
            />
          </div>
        )}
        <div>
          <Label htmlFor="username" className="text-sm font-medium">
            Username*
          </Label>
          <Input
            id="username"
            value={connectionFields.username}
            onChange={(e) => setConnectionFields({ ...connectionFields, username: e.target.value })}
            className="mt-1"
            required
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password*
          </Label>
          <Input
            id="password"
            type="password"
            value={connectionFields.password}
            onChange={(e) => setConnectionFields({ ...connectionFields, password: e.target.value })}
            className="mt-1"
            required
          />
        </div>
      </div>
    )

    switch (selectedDatabase) {
      case "mysql":
        return commonFields(true, true, getDefaultPort("mysql"))

      case "postgresql":
        return commonFields(true, true, getDefaultPort("postgresql"))

      case "sqlserver":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="host" className="text-sm font-medium">
                Host*
              </Label>
              <Input
                id="host"
                value={connectionFields.host}
                onChange={(e) => setConnectionFields({ ...connectionFields, host: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="port" className="text-sm font-medium flex justify-between">
                <span>Port</span>
                <span className="text-xs text-slate-500 font-normal">{getDefaultPort("sqlserver")}</span>
              </Label>
              <Input
                id="port"
                value={connectionFields.port}
                onChange={(e) => setConnectionFields({ ...connectionFields, port: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="databaseName" className="text-sm font-medium">
                Database Name
              </Label>
              <Input
                id="databaseName"
                value={connectionFields.databaseName}
                onChange={(e) => setConnectionFields({ ...connectionFields, databaseName: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="username" className="text-sm font-medium">
                Username*
              </Label>
              <Input
                id="username"
                value={connectionFields.username}
                onChange={(e) => setConnectionFields({ ...connectionFields, username: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password*
              </Label>
              <Input
                id="password"
                type="password"
                value={connectionFields.password}
                onChange={(e) => setConnectionFields({ ...connectionFields, password: e.target.value })}
                className="mt-1"
                required
              />
            </div>
          </div>
        )

      case "oracle":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="host" className="text-sm font-medium">
                Host*
              </Label>
              <Input
                id="host"
                value={connectionFields.host}
                onChange={(e) => setConnectionFields({ ...connectionFields, host: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="port" className="text-sm font-medium flex justify-between">
                <span>Port</span>
                <span className="text-xs text-slate-500 font-normal">{getDefaultPort("oracle")}</span>
              </Label>
              <Input
                id="port"
                value={connectionFields.port}
                onChange={(e) => setConnectionFields({ ...connectionFields, port: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="serviceName" className="text-sm font-medium">
                Service Name / SID*
              </Label>
              <Input
                id="serviceName"
                value={connectionFields.serviceName}
                onChange={(e) => setConnectionFields({ ...connectionFields, serviceName: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="username" className="text-sm font-medium">
                Username*
              </Label>
              <Input
                id="username"
                value={connectionFields.username}
                onChange={(e) => setConnectionFields({ ...connectionFields, username: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password*
              </Label>
              <Input
                id="password"
                type="password"
                value={connectionFields.password}
                onChange={(e) => setConnectionFields({ ...connectionFields, password: e.target.value })}
                className="mt-1"
                required
              />
            </div>
          </div>
        )

      case "sqlite":
        return (
          <div>
            <Label htmlFor="filePath" className="text-sm font-medium">
              File Path*
            </Label>
            <Input
              id="filePath"
              value={connectionFields.filePath}
              onChange={(e) => setConnectionFields({ ...connectionFields, filePath: e.target.value })}
              className="mt-1"
              placeholder="/path/to/database.db"
              required
            />
          </div>
        )

      case "aurora":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="engine" className="text-sm font-medium">
                Engine*
              </Label>
              <Select value={selectedEngine} onValueChange={setSelectedEngine}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select engine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MySQL">MySQL</SelectItem>
                  <SelectItem value="Postgres">Postgres</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedEngine && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="host" className="text-sm font-medium">
                    Host*
                  </Label>
                  <Input
                    id="host"
                    value={connectionFields.host}
                    onChange={(e) => setConnectionFields({ ...connectionFields, host: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="port" className="text-sm font-medium flex justify-between">
                    <span>Port</span>
                    <span className="text-xs text-slate-500 font-normal">
                      {getDefaultPort("aurora", selectedEngine)}
                    </span>
                  </Label>
                  <Input
                    id="port"
                    value={connectionFields.port}
                    onChange={(e) => setConnectionFields({ ...connectionFields, port: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="databaseName" className="text-sm font-medium">
                    Database Name*
                  </Label>
                  <Input
                    id="databaseName"
                    value={connectionFields.databaseName}
                    onChange={(e) => setConnectionFields({ ...connectionFields, databaseName: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username*
                  </Label>
                  <Input
                    id="username"
                    value={connectionFields.username}
                    onChange={(e) => setConnectionFields({ ...connectionFields, username: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password*
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={connectionFields.password}
                    onChange={(e) => setConnectionFields({ ...connectionFields, password: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
            )}
          </div>
        )

      case "gcp":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="engine" className="text-sm font-medium">
                Engine*
              </Label>
              <Select value={selectedEngine} onValueChange={setSelectedEngine}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select engine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MySQL">MySQL</SelectItem>
                  <SelectItem value="Postgres">Postgres</SelectItem>
                  <SelectItem value="SQL Server">SQL Server</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedEngine && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="host" className="text-sm font-medium">
                    Host/IP*
                  </Label>
                  <Input
                    id="host"
                    value={connectionFields.host}
                    onChange={(e) => setConnectionFields({ ...connectionFields, host: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="port" className="text-sm font-medium flex justify-between">
                    <span>Port</span>
                    <span className="text-xs text-slate-500 font-normal">{getDefaultPort("gcp", selectedEngine)}</span>
                  </Label>
                  <Input
                    id="port"
                    value={connectionFields.port}
                    onChange={(e) => setConnectionFields({ ...connectionFields, port: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="databaseName" className="text-sm font-medium">
                    Database Name*
                  </Label>
                  <Input
                    id="databaseName"
                    value={connectionFields.databaseName}
                    onChange={(e) => setConnectionFields({ ...connectionFields, databaseName: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username*
                  </Label>
                  <Input
                    id="username"
                    value={connectionFields.username}
                    onChange={(e) => setConnectionFields({ ...connectionFields, username: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password*
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={connectionFields.password}
                    onChange={(e) => setConnectionFields({ ...connectionFields, password: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
            )}
          </div>
        )

      case "azure":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serverName" className="text-sm font-medium">
                Server name / Host*
              </Label>
              <Input
                id="serverName"
                value={connectionFields.serverName}
                onChange={(e) => setConnectionFields({ ...connectionFields, serverName: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="databaseName" className="text-sm font-medium">
                Database Name*
              </Label>
              <Input
                id="databaseName"
                value={connectionFields.databaseName}
                onChange={(e) => setConnectionFields({ ...connectionFields, databaseName: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="username" className="text-sm font-medium">
                Username*
              </Label>
              <Input
                id="username"
                value={connectionFields.username}
                onChange={(e) => setConnectionFields({ ...connectionFields, username: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Password*
              </Label>
              <Input
                id="password"
                type="password"
                value={connectionFields.password}
                onChange={(e) => setConnectionFields({ ...connectionFields, password: e.target.value })}
                className="mt-1"
                required
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Transform Text into{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SQL Insights
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Convert your natural language queries into powerful SQL statements and stunning visualizations instantly
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Enter your query in plain English (e.g., 'Show me top customers by sales this year')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-24 py-6 text-lg border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 shadow-lg"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 rounded-lg"
            >
              {isLoading ? "Processing..." : "Generate"}
            </Button>
          </div>
        </div>

        {/* Database Selection */}
        <div className="mb-8">
          <Card className="shadow-lg border-2 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Database className="h-5 w-5 text-green-600" />
                Please select a database
              </CardTitle>
              <CardDescription>Choose your database type and configure connection settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <strong>Privacy & Security Assured:</strong> Your database credentials are processed securely and
                  never stored on our servers. We only access table metadata and schema information to generate
                  optimized SQL queries. Query results are processed in real-time for visualization and immediately
                  discarded after display - no query results or sensitive data are permanently stored. All connection
                  information is used exclusively for the current session and is automatically purged when you close the
                  application.
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="database-select" className="text-sm font-medium">
                  Database Type
                </Label>
                <Select value={selectedDatabase} onValueChange={handleDatabaseChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a database" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="sqlserver">Microsoft SQL Server</SelectItem>
                    <SelectItem value="oracle">Oracle Database</SelectItem>
                    <SelectItem value="sqlite">SQLite</SelectItem>
                    <SelectItem value="aurora">Amazon Aurora (MySQL/Postgres compatible)</SelectItem>
                    <SelectItem value="gcp">Google Cloud SQL (MySQL/Postgres/SQL Server)</SelectItem>
                    <SelectItem value="azure">Azure SQL Database</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {renderConnectionFields()}
            </CardContent>
          </Card>
        </div>

        {/* SQL Query Display */}
        <div className="mb-8">
          <Card className="shadow-lg border-2 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Database className="h-5 w-5 text-blue-600" />
                Generated SQL Query
              </CardTitle>
              <CardDescription>Auto-generated SQL based on your natural language input</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border">
                {sqlQuery ? (
                  <Textarea
                    value={sqlQuery}
                    readOnly
                    className="min-h-[120px] font-mono text-sm bg-transparent border-none resize-none focus:ring-0 text-slate-800 dark:text-slate-200"
                  />
                ) : (
                  <div className="min-h-[120px] flex items-center justify-center text-slate-500 dark:text-slate-400">
                    <div className="text-center">
                      <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Your SQL query will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visualizations Grid */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Data Visualizations</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Interactive charts and graphs generated from your query results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <Card className="shadow-lg border-2 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Chart Visualization
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                  Data insights from your query
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-64 flex items-end justify-between gap-2 bg-gradient-to-t from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-lg p-4">
                  {sqlQuery ? (
                    <>
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-12 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                          style={{ height: "120px" }}
                        ></div>
                        <span className="text-xs text-slate-600 dark:text-slate-400">North</span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">$45K</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-12 bg-gradient-to-t from-green-600 to-green-400 rounded-t"
                          style={{ height: "180px" }}
                        ></div>
                        <span className="text-xs text-slate-600 dark:text-slate-400">South</span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">$67K</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-12 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                          style={{ height: "90px" }}
                        ></div>
                        <span className="text-xs text-slate-600 dark:text-slate-400">East</span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">$34K</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-12 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t"
                          style={{ height: "150px" }}
                        ></div>
                        <span className="text-xs text-slate-600 dark:text-slate-400">West</span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">$56K</span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-slate-400 opacity-50">
                        <div className="w-16 h-16 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg"></div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Line Chart */}
            <Card className="shadow-lg border-2 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Trend Analysis
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                  Pattern visualization
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-64 bg-gradient-to-t from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-lg p-4 relative">
                  {sqlQuery ? (
                    <div className="w-full h-full relative">
                      {/* Grid lines */}
                      <div className="absolute inset-0 grid grid-rows-4 opacity-20">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="border-b border-slate-300 dark:border-slate-600"></div>
                        ))}
                      </div>
                      {/* Line chart path */}
                      <svg className="w-full h-full" viewBox="0 0 300 200">
                        <path
                          d="M 20 160 Q 70 140 100 120 T 180 80 T 280 60"
                          stroke="url(#gradient)"
                          strokeWidth="3"
                          fill="none"
                          className="drop-shadow-sm"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="50%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#06B6D4" />
                          </linearGradient>
                        </defs>
                        {/* Data points */}
                        <circle cx="20" cy="160" r="4" fill="#3B82F6" />
                        <circle cx="100" cy="120" r="4" fill="#8B5CF6" />
                        <circle cx="180" cy="80" r="4" fill="#06B6D4" />
                        <circle cx="280" cy="60" r="4" fill="#10B981" />
                      </svg>
                      {/* Labels */}
                      <div className="absolute bottom-2 left-4 text-xs text-slate-600 dark:text-slate-400">Jan</div>
                      <div className="absolute bottom-2 right-4 text-xs text-slate-600 dark:text-slate-400">Jun</div>
                      <div className="absolute top-2 right-4 text-xs font-semibold text-green-600">↗ +23%</div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-slate-400 opacity-50">
                        <div className="w-16 h-16 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg"></div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="shadow-lg border-2 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Distribution Chart
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                  Proportional data breakdown
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-64 bg-gradient-to-t from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-lg p-4 flex items-center justify-center">
                  {sqlQuery ? (
                    <div className="flex items-center gap-6">
                      {/* Pie Chart */}
                      <div className="relative">
                        <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                          <circle cx="60" cy="60" r="50" fill="transparent" stroke="#E5E7EB" strokeWidth="20" />
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="transparent"
                            stroke="#3B82F6"
                            strokeWidth="20"
                            strokeDasharray="94.2 314"
                            strokeDashoffset="0"
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="transparent"
                            stroke="#10B981"
                            strokeWidth="20"
                            strokeDasharray="62.8 314"
                            strokeDashoffset="-94.2"
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="transparent"
                            stroke="#F59E0B"
                            strokeWidth="20"
                            strokeDasharray="47.1 314"
                            strokeDashoffset="-157"
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="transparent"
                            stroke="#EF4444"
                            strokeWidth="20"
                            strokeDasharray="110.9 314"
                            strokeDashoffset="-204.1"
                          />
                        </svg>
                      </div>
                      {/* Legend */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-slate-700 dark:text-slate-300">Enterprise (30%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-slate-700 dark:text-slate-300">SMB (20%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm text-slate-700 dark:text-slate-300">Startup (15%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-slate-700 dark:text-slate-300">Individual (35%)</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 opacity-50">
                      <div className="w-16 h-16 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg"></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Data Table */}
            <Card className="shadow-lg border-2 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Data Summary</CardTitle>
                <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                  Query results overview
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-64 bg-gradient-to-t from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-lg p-4">
                  {sqlQuery ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400 border-b pb-2">
                        <span>Customer</span>
                        <span>Revenue</span>
                        <span>Growth</span>
                      </div>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-4 text-sm py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                          <span className="text-slate-800 dark:text-slate-200">Acme Corp</span>
                          <span className="font-semibold text-green-600">$125,400</span>
                          <span className="text-green-600 text-xs">↗ +12%</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                          <span className="text-slate-800 dark:text-slate-200">TechStart Inc</span>
                          <span className="font-semibold text-green-600">$98,750</span>
                          <span className="text-green-600 text-xs">↗ +8%</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                          <span className="text-slate-800 dark:text-slate-200">Global Systems</span>
                          <span className="font-semibold text-green-600">$87,200</span>
                          <span className="text-red-600 text-xs">↘ -3%</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                          <span className="text-slate-800 dark:text-slate-200">Innovation Labs</span>
                          <span className="font-semibold text-green-600">$76,900</span>
                          <span className="text-green-600 text-xs">↗ +15%</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                          <span className="text-slate-800 dark:text-slate-200">Digital Solutions</span>
                          <span className="font-semibold text-green-600">$65,300</span>
                          <span className="text-green-600 text-xs">↗ +6%</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-slate-400 opacity-50">
                        <div className="w-16 h-16 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg"></div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
