"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Database, Search, BarChart3, TrendingUp, PieChart, Table } from "lucide-react"
import VisualizationRenderer from "@/components/VisualizationRenderer"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Component() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sqlQuery, setSqlQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDatabase, setSelectedDatabase] = useState("")
  const [selectedEngine, setSelectedEngine] = useState("")
  const [databaseMetadata, setDatabaseMetadata] = useState<any>(null)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'connected' | 'failed' | 'no_tables'>('idle')
  const [connectionError, setConnectionError] = useState("")
  const [queryResults, setQueryResults] = useState<any>(null)
  const [visualizations, setVisualizations] = useState<any[]>([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [isGeneratingVisualizations, setIsGeneratingVisualizations] = useState(false)
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

  // Use useEffect to ensure client-side only state updates
  useEffect(() => {
    setMounted(true)
  }, [])

  const testDatabaseConnection = async () => {
    if (!selectedDatabase || !connectionFields.host) return

    setConnectionStatus('testing')
    setConnectionError("")
    setDatabaseMetadata(null)

    try {
      const res = await fetch("/api/database/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedDatabase,
          host: connectionFields.host,
          port: connectionFields.port,
          database: connectionFields.databaseName, // Map databaseName to database
          username: connectionFields.username,
          password: connectionFields.password,
          filePath: connectionFields.filePath,
          serviceName: connectionFields.serviceName,
          serverName: connectionFields.serverName,
        }),
      })

      const data = await res.json()
      
      if (data.success) {
        setConnectionStatus(data.connectionStatus)
        if (data.connectionStatus === 'connected') {
          setDatabaseMetadata(data)
          setConnectionError("")
        } else if (data.connectionStatus === 'no_tables') {
          setConnectionError("Connection successful but no tables found. User may not have access to any tables.")
        }
      } else {
        setConnectionStatus('failed')
        setConnectionError(data.error || "Connection failed")
        setDatabaseMetadata(null)
      }
    } catch (error) {
      setConnectionStatus('failed')
      setConnectionError("Failed to test connection")
      setDatabaseMetadata(null)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setSqlQuery("")
    
    // Show appropriate message based on database connection status
    if (connectionStatus !== 'connected') {
      if (connectionStatus === 'idle') {
        // Generate SQL without database context but show warning
        try {
          const res = await fetch("/api/nl2sql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              prompt: searchQuery, 
              dbType: undefined,
              databaseMetadata: null
            }),
          })
          if (!res.ok) {
            throw new Error(`Request failed: ${res.status}`)
          }
          const data = await res.json()
          const content = (data?.sql || data?.content || "").toString()
          const warningMessage = "-- Note: No database selected. Generated SQL is based only on your prompt and may not be accurate.\n-- To get accurate SQL, please select a database and provide connection details.\n-- This will allow us to fetch table schemas for better query generation.\n\n-- SQL Query - Solely generated based on the user prompt:\n"
          setSqlQuery(warningMessage + content.trim())
        } catch (error) {
          console.error(error)
          setSqlQuery("-- Note: No database selected. Generated SQL is based only on your prompt and may not be accurate.\n-- To get accurate SQL, please select a database and provide connection details.\n-- This will allow us to fetch table schemas for better query generation.\n\n-- Error: Could not generate SQL. Please try again.")
        }
        setIsLoading(false)
        return
      } else if (connectionStatus === 'failed') {
        setSqlQuery(`-- Database connection failed: ${connectionError}\n-- Please check your connection details and try again.`)
        setIsLoading(false)
        return
      } else if (connectionStatus === 'no_tables') {
        setSqlQuery(`-- Database connected but no tables accessible: ${connectionError}\n-- Generated SQL may not be accurate without table schema information.`)
        setIsLoading(false)
        return
      }
    }

    try {
      const res = await fetch("/api/nl2sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: searchQuery, 
          dbType: selectedDatabase || undefined,
          databaseMetadata: databaseMetadata
        }),
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

  const executeQuery = async () => {
    if (!sqlQuery || connectionStatus !== 'connected') return
    
    setIsExecuting(true)
    setQueryResults(null)
    setVisualizations([])
    
    try {
      // Execute the SQL query
      const res = await fetch("/api/database/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sqlQuery: sqlQuery.replace(/^--.*$/gm, '').trim(), // Remove comments
          databaseConfig: {
            type: selectedDatabase,
            host: connectionFields.host,
            port: connectionFields.port,
            database: connectionFields.databaseName,
            username: connectionFields.username,
            password: connectionFields.password,
            filePath: connectionFields.filePath,
            serviceName: connectionFields.serviceName,
            serverName: connectionFields.serverName,
          }
        }),
      })
      
      const data = await res.json()
      
      if (data.success) {
        setQueryResults(data)
        // Automatically generate visualizations
        await generateVisualizations(data, sqlQuery)
      } else {
        setQueryResults({ error: data.error || 'Failed to execute query' })
      }
    } catch (error) {
      console.error(error)
      setQueryResults({ error: 'Failed to execute query' })
    } finally {
      setIsExecuting(false)
    }
  }

  const generateVisualizations = async (queryData: any, sqlQuery: string) => {
    if (!queryData.data || !queryData.columns) return
    
    setIsGeneratingVisualizations(true)
    console.log('Starting visualization generation with:', { queryData, sqlQuery, databaseMetadata })
    
    try {
      const res = await fetch("/api/visualization/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: queryData.data,
          columns: queryData.columns,
          sqlQuery: sqlQuery,
          databaseMetadata: databaseMetadata
        }),
      })
      
      const data = await res.json()
      console.log('Visualization generation response:', data)
      
      if (data.success) {
        setVisualizations(data.visualizations)
        console.log('Visualizations set:', data.visualizations)
      } else {
        console.error('Failed to generate visualizations:', data.error)
      }
    } catch (error) {
      console.error('Error generating visualizations:', error)
    } finally {
      setIsGeneratingVisualizations(false)
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

  // Check if component is mounted before rendering
  if (!mounted) {
    return null // Return null during SSR to prevent hydration mismatch
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
              
              {/* Test Connection Button and Status */}
              {selectedDatabase && connectionFields.host && (
                <div className="mt-6 space-y-4">
                  <Button 
                    onClick={testDatabaseConnection}
                    disabled={connectionStatus === 'testing'}
                    className="w-full"
                    variant={connectionStatus === 'connected' ? 'default' : 'outline'}
                  >
                    {connectionStatus === 'testing' ? 'Testing Connection...' : 
                     connectionStatus === 'connected' ? '✓ Connection Successful' : 
                     'Test Connection'}
                  </Button>
                  
                  {/* Test All Databases Button */}
                  <Button 
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/database/test-all")
                        const data = await res.json()
                        if (data.success) {
                          alert(`Database Status:\n\nReady: ${data.summary.ready}\nRequires Package: ${data.summary.requires_package}\n\nCheck console for details.`)
                          console.log('All Database Status:', data.results)
                        }
                      } catch (error) {
                        alert('Failed to check database status')
                      }
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    🔍 Check All Database Support
                  </Button>
                  
                  {/* Connection Status */}
                  {connectionStatus !== 'idle' && (
                    <div className={`p-3 rounded-lg text-sm ${
                      connectionStatus === 'connected' ? 'bg-green-50 text-green-800 border border-green-200' :
                      connectionStatus === 'failed' ? 'bg-red-50 text-red-800 border border-red-200' :
                      connectionStatus === 'no_tables' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                      'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}>
                      {connectionStatus === 'connected' && (
                        <div>
                          <strong>✓ Connected Successfully!</strong>
                          <br />
                          Found {databaseMetadata?.totalTables || 0} tables with schema information.
                          <br />
                          <span className="text-green-600">SQL queries will now be generated with accurate table and column information.</span>
                        </div>
                      )}
                      {connectionStatus === 'failed' && (
                        <div>
                          <strong>✗ Connection Failed</strong>
                          <br />
                          {connectionError}
                          <br />
                          <span className="text-red-600">Please check your connection details and try again.</span>
                        </div>
                      )}
                      {connectionStatus === 'no_tables' && (
                        <div>
                          <strong>⚠ Connection Successful but No Tables Found</strong>
                          <br />
                          {connectionError}
                          <br />
                          <span className="text-yellow-600">SQL queries may not be accurate without table schema information.</span>
                        </div>
                      )}
                      {connectionStatus === 'testing' && (
                        <div>
                          <strong>🔄 Testing Connection...</strong>
                          <br />
                          Please wait while we verify your database connection and fetch schema information.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
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
                      {connectionStatus === 'idle' && (
                        <p className="text-xs mt-2 text-slate-400">
                          Tip: Select a database and test connection for more accurate SQL generation
                        </p>
                      )}
                      {connectionStatus === 'failed' && (
                        <p className="text-xs mt-2 text-red-400">
                          Database connection failed. Please check your connection details.
                        </p>
                      )}
                      {connectionStatus === 'no_tables' && (
                        <p className="text-xs mt-2 text-amber-400">
                          Connected but no tables found. SQL may not be accurate.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Execute Query Button */}
          {sqlQuery && connectionStatus === 'connected' && (
            <div className="mt-4">
              <Button 
                onClick={executeQuery}
                disabled={isExecuting}
                className="w-full"
                variant="default"
                size="lg"
              >
                {isExecuting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Executing Query...
                  </>
                  ) : (
                  <>
                    🚀 Execute Query & Generate Visualizations
                  </>
                )}
              </Button>
            </div>
          )}
          
          {/* Query Results */}
          {queryResults && (
            <div className="mt-4">
              <Card className="shadow-lg border-2 border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Query Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                                    {queryResults.error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-red-700 dark:text-red-400">{queryResults.error}</p>
                    </div>
                  ) : (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <p className="text-green-700 dark:text-green-400">
                        ✅ Query executed successfully! 
                        {queryResults.rowCount !== undefined && ` Found ${queryResults.rowCount} rows.`}
                        {queryResults.executionTime && ` Execution time: ${queryResults.executionTime}ms`}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Visualizations Grid */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Data Visualizations</h2>
            <p className="text-slate-600 dark:text-slate-400">
              {connectionStatus === 'connected' 
                ? 'Interactive charts and graphs generated from your query results'
                : 'Connect to a database to generate visualizations from your SQL queries'
              }
            </p>
            {connectionStatus !== 'connected' && (
              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-amber-800 dark:text-amber-200 text-sm">
                  ⚠️ Database connection required to generate visualizations. Please connect to a database first.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visualization 1 - Chart Visualization */}
            <Card className="shadow-lg border-2 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {visualizations[0]?.title || 'Chart Visualization'}
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                  {visualizations[0]?.description || 'Data insights from your query'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {isGeneratingVisualizations ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Generating visualization...</p>
                    </div>
                  </div>
                ) : visualizations[0]?.code ? (
                  <VisualizationRenderer 
                    code={visualizations[0].code} 
                    data={queryResults?.data || []} 
                    columns={queryResults?.columns || []} 
                  />
                ) : connectionStatus === 'connected' ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <p>Execute a query to generate visualizations</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <p>Connect to a database to generate visualizations</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Visualization 2 - Trend Analysis */}
            <Card className="shadow-lg border-2 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {visualizations[1]?.title || 'Trend Analysis'}
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                  {visualizations[1]?.description || 'Time series and trend patterns'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {isGeneratingVisualizations ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Generating visualization...</p>
                    </div>
                  </div>
                ) : visualizations[1]?.code ? (
                  <VisualizationRenderer 
                    code={visualizations[1].code} 
                    data={queryResults?.data || []} 
                    columns={queryResults?.columns || []} 
                  />
                ) : connectionStatus === 'connected' ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <p>Execute a query to generate visualizations</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <p>Connect to a database to generate visualizations</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Visualization 3 - Distribution Chart */}
            <Card className="shadow-lg border-2 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {visualizations[2]?.title || 'Distribution Chart'}
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                  {visualizations[2]?.description || 'Proportional data breakdown'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {isGeneratingVisualizations ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Generating visualization...</p>
                    </div>
                  </div>
                ) : visualizations[2]?.code ? (
                  <VisualizationRenderer 
                    code={visualizations[2].code} 
                    data={queryResults?.data || []} 
                    columns={queryResults?.columns || []} 
                  />
                ) : connectionStatus === 'connected' ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <p>Execute a query to generate visualizations</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <p>Connect to a database to generate visualizations</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Visualization 4 - Data Summary */}
            <Card className="shadow-lg border-2 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {visualizations[3]?.title || 'Data Summary'}
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                  {visualizations[3]?.description || 'Query results overview'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {isGeneratingVisualizations ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Generating visualization...</p>
                    </div>
                  </div>
                ) : visualizations[3]?.code ? (
                  <VisualizationRenderer 
                    code={visualizations[3].code} 
                    data={queryResults?.data || []} 
                    columns={queryResults?.columns || []} 
                  />
                ) : connectionStatus === 'connected' ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <p>Execute a query to generate visualizations</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <p>Connect to a database to generate visualizations</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
