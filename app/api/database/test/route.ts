import { NextResponse } from "next/server"
import { DatabaseConnection, DatabaseConfig } from "@/lib/database"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, host, port, database, username, password, filePath, serviceName, serverName } = body

    if (!type) {
      return NextResponse.json({ error: "Database type is required" }, { status: 400 })
    }

    const config: DatabaseConfig = {
      type,
      host,
      port,
      database,
      username,
      password,
      filePath,
      serviceName,
      serverName,
    }

    const dbConnection = new DatabaseConnection(config)

    // Test connection first
    const connectionTest = await dbConnection.testConnection()
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        connectionStatus: 'failed',
        error: connectionTest.error,
        tables: [],
        totalTables: 0
      })
    }

    // If connection successful, get metadata
    const metadata = await dbConnection.getMetadata()
    
    return NextResponse.json({
      success: true,
      ...metadata
    })

  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json(
      { 
        success: false, 
        connectionStatus: 'failed',
        error: error instanceof Error ? error.message : "Unknown error occurred",
        tables: [],
        totalTables: 0
      }, 
      { status: 500 }
    )
  }
}
