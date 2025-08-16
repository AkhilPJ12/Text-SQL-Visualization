import { NextResponse } from "next/server"
import { AzureOpenAI } from "openai"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { data, columns, sqlQuery, databaseMetadata } = body

    if (!data || !columns) {
      return NextResponse.json({ 
        error: "Data and columns are required for visualization generation" 
      }, { status: 400 })
    }

    const client = new AzureOpenAI({
      endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
      apiKey: process.env.AZURE_OPENAI_API_KEY!,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-12-01-preview",
    })

    // Analyze data structure to determine best visualization types
    const dataAnalysis = analyzeDataStructure(data, columns)
    
    // Generate visualization prompts based on data analysis
    const visualizationPrompts = generateVisualizationPrompts(dataAnalysis, sqlQuery, databaseMetadata)
    
    // Generate visualization code for each type
    const visualizations = await Promise.all(
      visualizationPrompts.map(async (prompt, index) => {
        try {
          const completion = await client.chat.completions.create({
            model: process.env.AZURE_OPENAI_DEPLOYMENT!,
            messages: [
              {
                role: "system",
                content: `You are an expert data visualization developer. Generate ONLY the React component code for the requested visualization type. 
                
                Requirements:
                - Use Chart.js with react-chartjs-2 for charts
                - Use Tailwind CSS for styling
                - Make the visualization beautiful and professional
                - Include proper TypeScript types
                - Return ONLY the React component code, no explanations
                - Use the exact data structure provided
                - Make charts responsive and interactive
                - Use appropriate colors and styling
                - Include proper error handling for empty data`
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_completion_tokens: 2000
          })

          return {
            type: dataAnalysis.recommendedTypes[index],
            code: completion.choices[0]?.message?.content || '',
            title: getVisualizationTitle(dataAnalysis.recommendedTypes[index]),
            description: getVisualizationDescription(dataAnalysis.recommendedTypes[index])
          }
        } catch (error) {
          return {
            type: dataAnalysis.recommendedTypes[index],
            code: `// Error generating visualization: ${error}`,
            title: getVisualizationTitle(dataAnalysis.recommendedTypes[index]),
            description: 'Failed to generate visualization code'
          }
        }
      })
    )

    return NextResponse.json({
      success: true,
      visualizations,
      dataAnalysis
    })

  } catch (error) {
    console.error("Visualization generation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      },
      { status: 500 }
    )
  }
}

function analyzeDataStructure(data: any[], columns: string[]) {
  const rowCount = data.length
  const columnCount = columns.length
  
  // Analyze data types and patterns
  const numericColumns = columns.filter(col => 
    data.some(row => typeof row[col] === 'number' && !isNaN(row[col]))
  )
  
  const dateColumns = columns.filter(col => 
    data.some(row => {
      const val = row[col]
      return val && (new Date(val).toString() !== 'Invalid Date')
    })
  )
  
  const categoricalColumns = columns.filter(col => 
    data.some(row => typeof row[col] === 'string' && row[col]?.length < 50)
  )

  // Determine recommended visualization types
  let recommendedTypes = []
  
  if (numericColumns.length >= 2 && rowCount > 0) {
    recommendedTypes.push('line-chart')
  }
  
  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    recommendedTypes.push('bar-chart')
  }
  
  if (numericColumns.length > 0) {
    recommendedTypes.push('pie-chart')
  }
  
  if (rowCount > 0) {
    recommendedTypes.push('data-table')
  }

  // Ensure we have exactly 4 visualizations
  while (recommendedTypes.length < 4) {
    if (recommendedTypes.length === 0) {
      recommendedTypes.push('data-table')
    } else if (!recommendedTypes.includes('line-chart')) {
      recommendedTypes.push('line-chart')
    } else if (!recommendedTypes.includes('bar-chart')) {
      recommendedTypes.push('bar-chart')
    } else if (!recommendedTypes.includes('pie-chart')) {
      recommendedTypes.push('pie-chart')
    } else {
      recommendedTypes.push('data-table')
    }
  }

  return {
    rowCount,
    columnCount,
    numericColumns,
    dateColumns,
    categoricalColumns,
    recommendedTypes: recommendedTypes.slice(0, 4),
    sampleData: data.slice(0, 5), // Store sample data for prompt generation
    columns: columns // Store columns for prompt generation
  }
}

function generateVisualizationPrompts(dataAnalysis: any, sqlQuery: string, databaseMetadata?: any) {
  const { recommendedTypes } = dataAnalysis
  
  return recommendedTypes.map(type => {
    // Get sample data from the original request data, not from dataAnalysis
    const sampleData = JSON.stringify(dataAnalysis.sampleData || [], null, 2)
    const columnsStr = JSON.stringify(dataAnalysis.columns || [], null, 2)
    
    let prompt = `Generate a React component for a ${type} visualization.
    
    Data structure:
    - Columns: ${columnsStr}
    - Sample data: ${sampleData}
    - SQL Query: ${sqlQuery}
    ${databaseMetadata ? `- Database: ${databaseMetadata.tables.length} tables available` : '- No database schema provided'}
    
    Create a beautiful, responsive ${type} that works with this data structure.`
    
    switch (type) {
      case 'line-chart':
        prompt += ` Use line charts for trends over time or numeric relationships.`
        break
      case 'bar-chart':
        prompt += ` Use bar charts for comparing categories or values.`
        break
      case 'pie-chart':
        prompt += ` Use pie charts for showing proportions or distributions.`
        break
      case 'data-table':
        prompt += ` Use a data table for detailed data display with sorting and pagination.`
        break
    }
    
    return prompt
  })
}

function getVisualizationTitle(type: string): string {
  switch (type) {
    case 'line-chart': return 'Trend Analysis'
    case 'bar-chart': return 'Comparison Chart'
    case 'pie-chart': return 'Distribution Chart'
    case 'data-table': return 'Data Summary'
    default: return 'Visualization'
  }
}

function getVisualizationDescription(type: string): string {
  switch (type) {
    case 'line-chart': return 'Shows trends and patterns over time or numeric relationships'
    case 'bar-chart': return 'Compares values across different categories or groups'
    case 'pie-chart': return 'Displays proportions and distributions of data'
    case 'data-table': return 'Detailed tabular view with sorting and filtering capabilities'
    default: return 'Data visualization component'
  }
}
