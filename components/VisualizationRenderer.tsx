import React, { useEffect, useRef } from 'react'

interface VisualizationRendererProps {
  code: string
  data: any[]
  columns: string[]
}

const VisualizationRenderer: React.FC<VisualizationRendererProps> = ({ code, data, columns }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!code || !containerRef.current) return

    try {
      // Create a safe environment for the visualization code
      const safeEval = (code: string, data: any[], columns: string[]) => {
        // Remove any potentially dangerous code
        const cleanCode = code
          .replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, '')
          .replace(/export\s+.*?;/g, '')
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .trim()

        // Create a simple chart using Chart.js
        if (code.includes('Chart.js') || code.includes('react-chartjs-2')) {
          return createSimpleChart(data, columns)
        }

        // Create a simple data table
        return createSimpleDataTable(data, columns)
      }

      const result = safeEval(code, data, columns)
      if (containerRef.current) {
        containerRef.current.innerHTML = result
      }
    } catch (error) {
      console.error('Error rendering visualization:', error)
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div class="p-4 text-center text-red-500">
            <p>Error rendering visualization</p>
            <p class="text-sm">${error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        `
      }
    }
  }, [code, data, columns])

  const createSimpleChart = (data: any[], columns: string[]) => {
    const numericColumns = columns.filter(col => 
      data.some(row => typeof row[col] === 'number' && !isNaN(row[col]))
    )
    
    const categoricalColumns = columns.filter(col => 
      data.some(row => typeof row[col] === 'string')
    )

    if (numericColumns.length > 0 && categoricalColumns.length > 0) {
      const labels = data.map(row => row[categoricalColumns[0]]).slice(0, 10)
      const values = data.map(row => parseFloat(row[numericColumns[0]]) || 0).slice(0, 10)
      
      return `
        <div class="w-full h-64 bg-white rounded-lg p-4">
          <canvas id="chart-${Date.now()}" width="400" height="200"></canvas>
          <script>
            const ctx = document.getElementById('chart-${Date.now()}').getContext('2d');
            new Chart(ctx, {
              type: 'bar',
              data: {
                labels: ${JSON.stringify(labels)},
                datasets: [{
                  label: '${numericColumns[0]}',
                  data: ${JSON.stringify(values)},
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  borderColor: 'rgba(59, 130, 246, 1)',
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            });
          </script>
        </div>
      `
    }

    return createSimpleDataTable(data, columns)
  }

  const createSimpleDataTable = (data: any[], columns: string[]) => {
    const limitedData = data.slice(0, 10) // Limit to first 10 rows
    
    return `
      <div class="w-full h-64 bg-white rounded-lg p-4 overflow-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              ${columns.map(col => `<th class="px-3 py-2 text-left font-medium text-gray-700">${col}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${limitedData.map(row => `
              <tr class="border-b border-gray-200 hover:bg-gray-50">
                ${columns.map(col => `<td class="px-3 py-2 text-gray-900">${row[col] || ''}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${data.length > 10 ? `<p class="text-xs text-gray-500 mt-2">Showing first 10 of ${data.length} rows</p>` : ''}
      </div>
    `
  }

  return (
    <div ref={containerRef} className="w-full h-64">
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Rendering visualization...</p>
        </div>
      </div>
    </div>
  )
}

export default VisualizationRenderer
