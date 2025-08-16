import { NextResponse } from "next/server"
import { DatabaseConnection, DatabaseConfig } from "@/lib/database"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { sqlQuery, databaseConfig } = body

    if (!sqlQuery) {
      return NextResponse.json({ error: "SQL query is required" }, { status: 400 })
    }

    if (!databaseConfig) {
      return NextResponse.json({ 
        error: "Database connection required for query execution",
        message: "Please connect to a database first to execute SQL queries"
      }, { status: 400 })
    }

    const dbConnection = new DatabaseConnection(databaseConfig)

    // Test connection first
    const connectionTest = await dbConnection.testConnection()
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: connectionTest.error
      }, { status: 400 })
    }

    // Execute the SQL query
    const result = await dbConnection.executeQuery(sqlQuery)

    return NextResponse.json({
      success: true,
      data: result.data,
      rowCount: result.rowCount,
      columns: result.columns,
      executionTime: result.executionTime
    })

  } catch (error) {
    console.error("SQL execution error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        message: "Failed to execute SQL query"
      },
      { status: 500 }
    )
  }
}
