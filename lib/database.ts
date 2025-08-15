import { Client } from 'pg'
import mysql from 'mysql2/promise'
import sqlite3 from 'sqlite3'
import { promisify } from 'util'

export interface DatabaseConfig {
  type: string
  host?: string
  port?: string
  database?: string
  username?: string
  password?: string
  filePath?: string
  serviceName?: string
  serverName?: string
}

export interface TableSchema {
  tableName: string
  columns: ColumnSchema[]
}

export interface ColumnSchema {
  name: string
  type: string
  nullable: boolean
  primaryKey: boolean
  foreignKey?: string
}

export interface DatabaseMetadata {
  tables: TableSchema[]
  totalTables: number
  connectionStatus: 'connected' | 'failed' | 'no_tables'
  error?: string
}

export class DatabaseConnection {
  private config: DatabaseConfig

  constructor(config: DatabaseConfig) {
    this.config = config
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      switch (this.config.type) {
        case 'postgresql':
          return await this.testPostgreSQL()
        case 'mysql':
          return await this.testMySQL()
        case 'sqlite':
          return await this.testSQLite()
        case 'sqlserver':
          return await this.testSQLServer()
        case 'oracle':
          return await this.testOracle()
        default:
          return { success: false, error: 'Unsupported database type' }
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  async getMetadata(): Promise<DatabaseMetadata> {
    try {
      switch (this.config.type) {
        case 'postgresql':
          return await this.getPostgreSQLMetadata()
        case 'mysql':
          return await this.getMySQLMetadata()
        case 'sqlite':
          return await this.getSQLiteMetadata()
        case 'sqlserver':
          return await this.getSQLServerMetadata()
        case 'oracle':
          return await this.getOracleMetadata()
        default:
          return { tables: [], totalTables: 0, connectionStatus: 'failed', error: 'Unsupported database type' }
      }
    } catch (error) {
      return { 
        tables: [], 
        totalTables: 0, 
        connectionStatus: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  private async testPostgreSQL(): Promise<{ success: boolean; error?: string }> {
    const client = new Client({
      host: this.config.host,
      port: parseInt(this.config.port || '5432'),
      database: this.config.database,
      user: this.config.username,
      password: this.config.password,
    })

    try {
      await client.connect()
      await client.query('SELECT 1')
      await client.end()
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Connection failed' }
    }
  }

  private async testMySQL(): Promise<{ success: boolean; error?: string }> {
    try {
      const connection = await mysql.createConnection({
        host: this.config.host,
        port: parseInt(this.config.port || '3306'),
        database: this.config.database,
        user: this.config.username,
        password: this.config.password,
        connectTimeout: 10000, // 10 second timeout
      })
      await connection.query('SELECT 1')
      await connection.end()
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed'
      // Provide more specific error messages for common MySQL issues
      if (errorMessage.includes('ECONNREFUSED')) {
        return { success: false, error: 'Connection refused. Check if MySQL server is running and port is correct.' }
      } else if (errorMessage.includes('ER_ACCESS_DENIED_ERROR')) {
        return { success: false, error: 'Access denied. Check username and password.' }
      } else if (errorMessage.includes('ER_BAD_DB_ERROR')) {
        return { success: false, error: 'Database does not exist or access denied.' }
      }
      return { success: false, error: errorMessage }
    }
  }

  private async testSQLite(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.config.filePath) {
        return { success: false, error: 'SQLite file path is required' }
      }
      
      const db = new sqlite3.Database(this.config.filePath)
      const query = promisify(db.get).bind(db)
      await query('SELECT 1')
      db.close()
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed'
      // Provide more specific error messages for common SQLite issues
      if (errorMessage.includes('ENOENT')) {
        return { success: false, error: 'File not found. Check if the SQLite database file path is correct.' }
      } else if (errorMessage.includes('EACCES')) {
        return { success: false, error: 'Permission denied. Check file permissions.' }
      } else if (errorMessage.includes('SQLITE_CANTOPEN')) {
        return { success: false, error: 'Cannot open database. Check file path and permissions.' }
      }
      return { success: false, error: errorMessage }
    }
  }

  private async testSQLServer(): Promise<{ success: boolean; error?: string }> {
    // For SQL Server, we'll use a simple connection test
    // In production, you'd want to use mssql package
    try {
      // This is a placeholder - you'll need to implement actual SQL Server connection
      // For now, return a more helpful error message
      return { 
        success: false, 
        error: 'SQL Server connection requires mssql package. Please install: npm install mssql @types/mssql' 
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Connection failed' }
    }
  }

  private async testOracle(): Promise<{ success: boolean; error?: string }> {
    // For Oracle, we'll use a simple connection test
    // In production, you'd want to implement actual Oracle connection
    try {
      // This is a placeholder - you'll need to implement actual Oracle connection
      // For now, return a more helpful error message
      return { 
        success: false, 
        error: 'Oracle connection requires oracledb package. Please install: npm install oracledb' 
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Connection failed' }
    }
  }

  private async getPostgreSQLMetadata(): Promise<DatabaseMetadata> {
    console.log('PostgreSQL: Connecting with config:', {
      host: this.config.host,
      port: this.config.port || '5432',
      database: this.config.database,
      user: this.config.username,
      // password: '***' // masked for security
    })
    
    const client = new Client({
      host: this.config.host,
      port: parseInt(this.config.port || '5432'),
      database: this.config.database,
      user: this.config.username,
      password: this.config.password,
    })

    try {
      await client.connect()
      
      console.log('PostgreSQL: Connected successfully, fetching metadata...')
      
      // Debug: Check what database and user we're actually connected to
      try {
        const contextResult = await client.query(`
          SELECT current_user, current_database(), current_schema()
        `)
        console.log('PostgreSQL: Connection context:', contextResult.rows[0])
      } catch (contextError) {
        console.log('PostgreSQL: Could not get connection context:', contextError)
      }
      
      // Try multiple approaches to find tables
      let tablesResult
      
      // Approach 1: Try pg_tables with more debugging
      try {
        console.log('PostgreSQL: Trying pg_tables query...')
        const pgTablesTest = await client.query(`
          SELECT schemaname, tablename 
          FROM pg_tables 
          ORDER BY schemaname, tablename
        `)
        console.log('PostgreSQL: pg_tables raw result:', pgTablesTest.rows)
        
        // Look for user tables in ANY schema (not just public)
        tablesResult = await client.query(`
          SELECT schemaname, tablename 
          FROM pg_tables 
          WHERE schemaname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
          ORDER BY schemaname, tablename
        `)
        console.log('PostgreSQL: Found', tablesResult.rows.length, 'user tables via pg_tables (all schemas)')
        
        // If still no tables, try to find what schemas exist
        if (tablesResult.rows.length === 0) {
          const schemasResult = await client.query(`
            SELECT nspname as schema_name
            FROM pg_namespace
            WHERE nspname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
            ORDER BY nspname
          `)
          console.log('PostgreSQL: Available schemas:', schemasResult.rows)
          
          // Try to find your specific tables directly
          const specificTablesResult = await client.query(`
            SELECT schemaname, tablename 
            FROM pg_tables 
            WHERE tablename IN ('sales_data', 'user_prompts')
            ORDER BY schemaname, tablename
          `)
          console.log('PostgreSQL: Looking for specific tables (sales_data, user_prompts):', specificTablesResult.rows)
          
          // Try a direct query to see if we can access the tables
          try {
            const directQueryResult = await client.query(`
              SELECT COUNT(*) as table_count FROM pg_tables 
              WHERE schemaname = 'public' 
              AND tablename IN ('sales_data', 'user_prompts')
            `)
            console.log('PostgreSQL: Direct table count query result:', directQueryResult.rows[0])
          } catch (directError) {
            console.log('PostgreSQL: Direct query failed:', directError)
          }
        }
      } catch (pgError) {
        console.log('PostgreSQL: pg_tables failed:', pgError)
      }
      
      // Approach 2: If pg_tables didn't work or found 0 tables, try information_schema
      if (!tablesResult || tablesResult.rows.length === 0) {
        try {
          console.log('PostgreSQL: Trying information_schema query...')
          tablesResult = await client.query(`
            SELECT table_schema, table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
          `)
          console.log('PostgreSQL: Found', tablesResult.rows.length, 'tables via information_schema')
        } catch (infoError) {
          console.log('PostgreSQL: information_schema failed:', infoError)
        }
      }
      
      // Approach 3: Try a direct catalog query
      if (!tablesResult || tablesResult.rows.length === 0) {
        try {
          console.log('PostgreSQL: Trying direct catalog query...')
          tablesResult = await client.query(`
            SELECT n.nspname as schema_name, c.relname as table_name
            FROM pg_class c
            JOIN pg_namespace n ON c.relnamespace = n.oid
            WHERE c.relkind = 'r'
            AND n.nspname = 'public'
            ORDER BY c.relname
          `)
          console.log('PostgreSQL: Found', tablesResult.rows.length, 'tables via direct catalog query')
        } catch (catError) {
          console.log('PostgreSQL: Direct catalog query failed:', catError)
        }
      }
      
      // Approach 4: Try to find ANY tables in ANY schema
      if (!tablesResult || tablesResult.rows.length === 0) {
        try {
          console.log('PostgreSQL: Trying to find tables in ANY schema...')
          tablesResult = await client.query(`
            SELECT n.nspname as schema_name, c.relname as table_name
            FROM pg_class c
            JOIN pg_namespace n ON c.relnamespace = n.oid
            WHERE c.relkind = 'r'
            AND n.nspname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
            ORDER BY n.nspname, c.relname
          `)
          console.log('PostgreSQL: Found', tablesResult.rows.length, 'tables in ANY schema')
        } catch (anyError) {
          console.log('PostgreSQL: ANY schema query failed:', anyError)
        }
      }

      if (!tablesResult || !tablesResult.rows || tablesResult.rows.length === 0) {
        console.log('PostgreSQL: No tables found in any schema')
        await client.end()
        return { tables: [], totalTables: 0, connectionStatus: 'no_tables' }
      }

      const tables: TableSchema[] = []
      
      for (const tableRow of tablesResult.rows) {
        const tableName = tableRow.tablename || tableRow.table_name
        const schemaName = tableRow.schemaname || tableRow.table_schema || 'public'
        
        console.log('PostgreSQL: Processing table:', tableName, 'in schema:', schemaName)
        
        // Get columns for this table
        let columnsResult
        try {
          columnsResult = await client.query(`
            SELECT 
              column_name,
              data_type,
              is_nullable,
              column_default,
              ordinal_position
            FROM information_schema.columns 
            WHERE table_schema = $1 
            AND table_name = $2
            ORDER BY ordinal_position
          `, [schemaName, tableName])
        } catch (colError) {
          console.log('PostgreSQL: information_schema.columns failed for', tableName, 'trying pg_attribute...')
          // Fallback to pg_attribute
          columnsResult = await client.query(`
            SELECT 
              attname as column_name,
              format_type(atttypid, atttypmod) as data_type,
              attnotnull as is_not_null,
              attnum as ordinal_position
            FROM pg_attribute 
            WHERE attrelid = (SELECT oid FROM pg_class WHERE relname = $1 AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = $2))
            AND attnum > 0 
            AND NOT attisdropped
            ORDER BY attnum
          `, [tableName, schemaName])
        }

        if (columnsResult && columnsResult.rows && columnsResult.rows.length > 0) {
          const columns: ColumnSchema[] = (columnsResult.rows as any[]).map((col: any) => ({
            name: col.column_name,
            type: col.data_type,
            nullable: col.is_nullable === 'YES' || !col.is_not_null,
            primaryKey: false,
            foreignKey: undefined
          }))

          tables.push({ tableName: `${schemaName}.${tableName}`, columns })
          console.log('PostgreSQL: Added table', tableName, 'with', columns.length, 'columns')
        } else {
          console.log('PostgreSQL: No columns found for table', tableName)
        }
      }

      console.log('PostgreSQL: Total tables processed:', tables.length)
      await client.end()
      
      if (tables.length === 0) {
        return { tables: [], totalTables: 0, connectionStatus: 'no_tables' }
      }
      
      return { tables, totalTables: tables.length, connectionStatus: 'connected' }
    } catch (error) {
      console.error('PostgreSQL: Error in getPostgreSQLMetadata:', error)
      await client.end()
      return { 
        tables: [], 
        totalTables: 0, 
        connectionStatus: 'failed', 
        error: error instanceof Error ? error.message : 'Failed to fetch metadata' 
      }
    }
  }

  private async getMySQLMetadata(): Promise<DatabaseMetadata> {
    try {
      const connection = await mysql.createConnection({
        host: this.config.host,
        port: parseInt(this.config.port || '3306'),
        database: this.config.database,
        user: this.config.username,
        password: this.config.password,
      })

      // Get tables
      const [tablesResult] = await connection.execute(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = ? 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
        LIMIT 50
      `, [this.config.database])

      if (!Array.isArray(tablesResult) || tablesResult.length === 0) {
        await connection.end()
        return { tables: [], totalTables: 0, connectionStatus: 'no_tables' }
      }

      const tables: TableSchema[] = []
      
      for (const tableRow of tablesResult as any[]) {
        const tableName = tableRow.TABLE_NAME
        
        // Get columns for this table
        const [columnsResult] = await connection.execute(`
          SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default,
            ordinal_position
          FROM information_schema.columns 
          WHERE table_schema = ? 
          AND table_name = ?
          ORDER BY ordinal_position
          LIMIT 100
        `, [this.config.database, tableName])

        const columns: ColumnSchema[] = (columnsResult as any[]).map(col => ({
          name: col.COLUMN_NAME,
          type: col.DATA_TYPE,
          nullable: col.IS_NULLABLE === 'YES',
          primaryKey: false, // We'd need additional query for primary key info
          foreignKey: undefined
        }))

        tables.push({ tableName, columns })
      }

      await connection.end()
      return { tables, totalTables: tables.length, connectionStatus: 'connected' }
    } catch (error) {
      return { 
        tables: [], 
        totalTables: 0, 
        connectionStatus: 'failed', 
        error: error instanceof Error ? error.message : 'Failed to fetch metadata' 
      }
    }
  }

  private async getSQLiteMetadata(): Promise<DatabaseMetadata> {
    try {
      const db = new sqlite3.Database(this.config.filePath || '')
      const query = promisify(db.all).bind(db)
      
      // Get tables
      const tablesResult = await query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
      
      if (!Array.isArray(tablesResult) || tablesResult.length === 0) {
        db.close()
        return { tables: [], totalTables: 0, connectionStatus: 'no_tables' }
      }

      const tables: TableSchema[] = []
      
      for (const tableRow of tablesResult) {
        const tableName = tableRow.name
        
        // Get columns for this table
        const columnsResult = await query(`PRAGMA table_info(${tableName})`)
        
        const columns: ColumnSchema[] = columnsResult.map((col: any) => ({
          name: col.name,
          type: col.type,
          nullable: col.notnull === 0,
          primaryKey: col.pk === 1,
          foreignKey: undefined
        }))

        tables.push({ tableName, columns })
      }

      db.close()
      return { tables, totalTables: tables.length, connectionStatus: 'connected' }
    } catch (error) {
      return { 
        tables: [], 
        totalTables: 0, 
        connectionStatus: 'failed', 
        error: error instanceof Error ? error.message : 'Failed to fetch metadata' 
      }
    }
  }

  private async getSQLServerMetadata(): Promise<DatabaseMetadata> {
    // Placeholder for SQL Server metadata
    return { 
      tables: [], 
      totalTables: 0, 
      connectionStatus: 'failed', 
      error: 'SQL Server metadata not yet implemented' 
    }
  }

  private async getOracleMetadata(): Promise<DatabaseMetadata> {
    // Placeholder for Oracle metadata
    return { 
      tables: [], 
      totalTables: 0, 
        connectionStatus: 'failed', 
        error: 'Oracle metadata not yet implemented' 
    }
  }
}
