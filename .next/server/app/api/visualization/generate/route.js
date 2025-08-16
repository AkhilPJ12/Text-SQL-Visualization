/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/visualization/generate/route";
exports.ids = ["app/api/visualization/generate/route"];
exports.modules = {

/***/ "(rsc)/./app/api/visualization/generate/route.ts":
/*!*************************************************!*\
  !*** ./app/api/visualization/generate/route.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   dynamic: () => (/* binding */ dynamic)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var openai__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! openai */ \"(rsc)/./node_modules/openai/index.mjs\");\n\n\nconst dynamic = \"force-dynamic\";\nasync function POST(req) {\n    try {\n        const body = await req.json();\n        const { data, columns, sqlQuery, databaseMetadata } = body;\n        if (!data || !columns) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Data and columns are required for visualization generation\"\n            }, {\n                status: 400\n            });\n        }\n        const client = new openai__WEBPACK_IMPORTED_MODULE_1__.AzureOpenAI({\n            endpoint: process.env.AZURE_OPENAI_ENDPOINT,\n            apiKey: process.env.AZURE_OPENAI_API_KEY,\n            apiVersion: process.env.AZURE_OPENAI_API_VERSION || \"2024-12-01-preview\"\n        });\n        // Analyze data structure to determine best visualization types\n        const dataAnalysis = analyzeDataStructure(data, columns);\n        // Generate visualization prompts based on data analysis\n        const visualizationPrompts = generateVisualizationPrompts(dataAnalysis, sqlQuery, databaseMetadata);\n        // Generate visualization code for each type\n        const visualizations = await Promise.all(visualizationPrompts.map(async (prompt, index)=>{\n            try {\n                const completion = await client.chat.completions.create({\n                    model: process.env.AZURE_OPENAI_DEPLOYMENT,\n                    messages: [\n                        {\n                            role: \"system\",\n                            content: `You are an expert data visualization developer. Generate ONLY the React component code for the requested visualization type. \n                \n                Requirements:\n                - Use Chart.js with react-chartjs-2 for charts\n                - Use Tailwind CSS for styling\n                - Make the visualization beautiful and professional\n                - Include proper TypeScript types\n                - Return ONLY the React component code, no explanations\n                - Use the exact data structure provided\n                - Make charts responsive and interactive\n                - Use appropriate colors and styling\n                - Include proper error handling for empty data`\n                        },\n                        {\n                            role: \"user\",\n                            content: prompt\n                        }\n                    ],\n                    max_completion_tokens: 2000\n                });\n                return {\n                    type: dataAnalysis.recommendedTypes[index],\n                    code: completion.choices[0]?.message?.content || '',\n                    title: getVisualizationTitle(dataAnalysis.recommendedTypes[index]),\n                    description: getVisualizationDescription(dataAnalysis.recommendedTypes[index])\n                };\n            } catch (error) {\n                return {\n                    type: dataAnalysis.recommendedTypes[index],\n                    code: `// Error generating visualization: ${error}`,\n                    title: getVisualizationTitle(dataAnalysis.recommendedTypes[index]),\n                    description: 'Failed to generate visualization code'\n                };\n            }\n        }));\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            visualizations,\n            dataAnalysis\n        });\n    } catch (error) {\n        console.error(\"Visualization generation error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: false,\n            error: error instanceof Error ? error.message : \"Unknown error occurred\"\n        }, {\n            status: 500\n        });\n    }\n}\nfunction analyzeDataStructure(data, columns) {\n    const rowCount = data.length;\n    const columnCount = columns.length;\n    // Analyze data types and patterns\n    const numericColumns = columns.filter((col)=>data.some((row)=>typeof row[col] === 'number' && !isNaN(row[col])));\n    const dateColumns = columns.filter((col)=>data.some((row)=>{\n            const val = row[col];\n            return val && new Date(val).toString() !== 'Invalid Date';\n        }));\n    const categoricalColumns = columns.filter((col)=>data.some((row)=>typeof row[col] === 'string' && row[col]?.length < 50));\n    // Determine recommended visualization types\n    let recommendedTypes = [];\n    if (numericColumns.length >= 2 && rowCount > 0) {\n        recommendedTypes.push('line-chart');\n    }\n    if (categoricalColumns.length > 0 && numericColumns.length > 0) {\n        recommendedTypes.push('bar-chart');\n    }\n    if (numericColumns.length > 0) {\n        recommendedTypes.push('pie-chart');\n    }\n    if (rowCount > 0) {\n        recommendedTypes.push('data-table');\n    }\n    // Ensure we have exactly 4 visualizations\n    while(recommendedTypes.length < 4){\n        if (recommendedTypes.length === 0) {\n            recommendedTypes.push('data-table');\n        } else if (!recommendedTypes.includes('line-chart')) {\n            recommendedTypes.push('line-chart');\n        } else if (!recommendedTypes.includes('bar-chart')) {\n            recommendedTypes.push('bar-chart');\n        } else if (!recommendedTypes.includes('pie-chart')) {\n            recommendedTypes.push('pie-chart');\n        } else {\n            recommendedTypes.push('data-table');\n        }\n    }\n    return {\n        rowCount,\n        columnCount,\n        numericColumns,\n        dateColumns,\n        categoricalColumns,\n        recommendedTypes: recommendedTypes.slice(0, 4),\n        sampleData: data.slice(0, 5),\n        columns: columns // Store columns for prompt generation\n    };\n}\nfunction generateVisualizationPrompts(dataAnalysis, sqlQuery, databaseMetadata) {\n    const { recommendedTypes } = dataAnalysis;\n    return recommendedTypes.map((type)=>{\n        // Get sample data from the original request data, not from dataAnalysis\n        const sampleData = JSON.stringify(dataAnalysis.sampleData || [], null, 2);\n        const columnsStr = JSON.stringify(dataAnalysis.columns || [], null, 2);\n        let prompt = `Generate a React component for a ${type} visualization.\n    \n    Data structure:\n    - Columns: ${columnsStr}\n    - Sample data: ${sampleData}\n    - SQL Query: ${sqlQuery}\n    ${databaseMetadata ? `- Database: ${databaseMetadata.tables.length} tables available` : '- No database schema provided'}\n    \n    Create a beautiful, responsive ${type} that works with this data structure.`;\n        switch(type){\n            case 'line-chart':\n                prompt += ` Use line charts for trends over time or numeric relationships.`;\n                break;\n            case 'bar-chart':\n                prompt += ` Use bar charts for comparing categories or values.`;\n                break;\n            case 'pie-chart':\n                prompt += ` Use pie charts for showing proportions or distributions.`;\n                break;\n            case 'data-table':\n                prompt += ` Use a data table for detailed data display with sorting and pagination.`;\n                break;\n        }\n        return prompt;\n    });\n}\nfunction getVisualizationTitle(type) {\n    switch(type){\n        case 'line-chart':\n            return 'Trend Analysis';\n        case 'bar-chart':\n            return 'Comparison Chart';\n        case 'pie-chart':\n            return 'Distribution Chart';\n        case 'data-table':\n            return 'Data Summary';\n        default:\n            return 'Visualization';\n    }\n}\nfunction getVisualizationDescription(type) {\n    switch(type){\n        case 'line-chart':\n            return 'Shows trends and patterns over time or numeric relationships';\n        case 'bar-chart':\n            return 'Compares values across different categories or groups';\n        case 'pie-chart':\n            return 'Displays proportions and distributions of data';\n        case 'data-table':\n            return 'Detailed tabular view with sorting and filtering capabilities';\n        default:\n            return 'Data visualization component';\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3Zpc3VhbGl6YXRpb24vZ2VuZXJhdGUvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUEwQztBQUNOO0FBRTdCLE1BQU1FLFVBQVUsZ0JBQWU7QUFFL0IsZUFBZUMsS0FBS0MsR0FBWTtJQUNyQyxJQUFJO1FBQ0YsTUFBTUMsT0FBTyxNQUFNRCxJQUFJRSxJQUFJO1FBQzNCLE1BQU0sRUFBRUMsSUFBSSxFQUFFQyxPQUFPLEVBQUVDLFFBQVEsRUFBRUMsZ0JBQWdCLEVBQUUsR0FBR0w7UUFFdEQsSUFBSSxDQUFDRSxRQUFRLENBQUNDLFNBQVM7WUFDckIsT0FBT1IscURBQVlBLENBQUNNLElBQUksQ0FBQztnQkFDdkJLLE9BQU87WUFDVCxHQUFHO2dCQUFFQyxRQUFRO1lBQUk7UUFDbkI7UUFFQSxNQUFNQyxTQUFTLElBQUlaLCtDQUFXQSxDQUFDO1lBQzdCYSxVQUFVQyxRQUFRQyxHQUFHLENBQUNDLHFCQUFxQjtZQUMzQ0MsUUFBUUgsUUFBUUMsR0FBRyxDQUFDRyxvQkFBb0I7WUFDeENDLFlBQVlMLFFBQVFDLEdBQUcsQ0FBQ0ssd0JBQXdCLElBQUk7UUFDdEQ7UUFFQSwrREFBK0Q7UUFDL0QsTUFBTUMsZUFBZUMscUJBQXFCaEIsTUFBTUM7UUFFaEQsd0RBQXdEO1FBQ3hELE1BQU1nQix1QkFBdUJDLDZCQUE2QkgsY0FBY2IsVUFBVUM7UUFFbEYsNENBQTRDO1FBQzVDLE1BQU1nQixpQkFBaUIsTUFBTUMsUUFBUUMsR0FBRyxDQUN0Q0oscUJBQXFCSyxHQUFHLENBQUMsT0FBT0MsUUFBUUM7WUFDdEMsSUFBSTtnQkFDRixNQUFNQyxhQUFhLE1BQU1uQixPQUFPb0IsSUFBSSxDQUFDQyxXQUFXLENBQUNDLE1BQU0sQ0FBQztvQkFDdERDLE9BQU9yQixRQUFRQyxHQUFHLENBQUNxQix1QkFBdUI7b0JBQzFDQyxVQUFVO3dCQUNSOzRCQUNFQyxNQUFNOzRCQUNOQyxTQUFTLENBQUM7Ozs7Ozs7Ozs7OzhEQVdvQyxDQUFDO3dC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QW1ELENBQUM7Z0JBQy9EO1lBQ0YsS0FBSztnQkFDSEEsVUFBVSxDQUFDLHlEQUF5RCxDQUFDO2dCQUNyRTtZQUNGLEtBQUs7Z0JBQ0hBLFVBQVUsQ0FBQyx3RUFBd0UsQ0FBQztnQkFDcEY7UUFDSjtRQUVBLE9BQU9BO0lBQ1Q7QUFDRjtBQUVBLFNBQVNrQixzQkFBc0JOLElBQVk7SUFDekMsT0FBUUE7UUFDTixLQUFLO1lBQWMsT0FBTztRQUMxQixLQUFLO1lBQWEsT0FBTztRQUN6QixLQUFLO1lBQWEsT0FBTztRQUN6QixLQUFLO1lBQWMsT0FBTztRQUMxQjtZQUFTLE9BQU87SUFDbEI7QUFDRjtBQUVBLFNBQVNRLDRCQUE0QlIsSUFBWTtJQUMvQyxPQUFRQTtRQUNOLEtBQUs7WUFBYyxPQUFPO1FBQzFCLEtBQUs7WUFBYSxPQUFPO1FBQ3pCLEtBQUs7WUFBYSxPQUFPO1FBQ3pCLEtBQUs7WUFBYyxPQUFPO1FBQzFCO1lBQVMsT0FBTztJQUNsQjtBQUNGIiwic291cmNlcyI6WyIvVXNlcnMvYWtoaWwvRGVza3RvcC9Qcm9qZWN0cy9UZXh0LVNRTC1WaXN1YWxpemF0aW9uL2FwcC9hcGkvdmlzdWFsaXphdGlvbi9nZW5lcmF0ZS9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIlxuaW1wb3J0IHsgQXp1cmVPcGVuQUkgfSBmcm9tIFwib3BlbmFpXCJcblxuZXhwb3J0IGNvbnN0IGR5bmFtaWMgPSBcImZvcmNlLWR5bmFtaWNcIlxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXE6IFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVxLmpzb24oKVxuICAgIGNvbnN0IHsgZGF0YSwgY29sdW1ucywgc3FsUXVlcnksIGRhdGFiYXNlTWV0YWRhdGEgfSA9IGJvZHlcblxuICAgIGlmICghZGF0YSB8fCAhY29sdW1ucykge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgXG4gICAgICAgIGVycm9yOiBcIkRhdGEgYW5kIGNvbHVtbnMgYXJlIHJlcXVpcmVkIGZvciB2aXN1YWxpemF0aW9uIGdlbmVyYXRpb25cIiBcbiAgICAgIH0sIHsgc3RhdHVzOiA0MDAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBjbGllbnQgPSBuZXcgQXp1cmVPcGVuQUkoe1xuICAgICAgZW5kcG9pbnQ6IHByb2Nlc3MuZW52LkFaVVJFX09QRU5BSV9FTkRQT0lOVCEsXG4gICAgICBhcGlLZXk6IHByb2Nlc3MuZW52LkFaVVJFX09QRU5BSV9BUElfS0VZISxcbiAgICAgIGFwaVZlcnNpb246IHByb2Nlc3MuZW52LkFaVVJFX09QRU5BSV9BUElfVkVSU0lPTiB8fCBcIjIwMjQtMTItMDEtcHJldmlld1wiLFxuICAgIH0pXG5cbiAgICAvLyBBbmFseXplIGRhdGEgc3RydWN0dXJlIHRvIGRldGVybWluZSBiZXN0IHZpc3VhbGl6YXRpb24gdHlwZXNcbiAgICBjb25zdCBkYXRhQW5hbHlzaXMgPSBhbmFseXplRGF0YVN0cnVjdHVyZShkYXRhLCBjb2x1bW5zKVxuICAgIFxuICAgIC8vIEdlbmVyYXRlIHZpc3VhbGl6YXRpb24gcHJvbXB0cyBiYXNlZCBvbiBkYXRhIGFuYWx5c2lzXG4gICAgY29uc3QgdmlzdWFsaXphdGlvblByb21wdHMgPSBnZW5lcmF0ZVZpc3VhbGl6YXRpb25Qcm9tcHRzKGRhdGFBbmFseXNpcywgc3FsUXVlcnksIGRhdGFiYXNlTWV0YWRhdGEpXG4gICAgXG4gICAgLy8gR2VuZXJhdGUgdmlzdWFsaXphdGlvbiBjb2RlIGZvciBlYWNoIHR5cGVcbiAgICBjb25zdCB2aXN1YWxpemF0aW9ucyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgdmlzdWFsaXphdGlvblByb21wdHMubWFwKGFzeW5jIChwcm9tcHQsIGluZGV4KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgY29tcGxldGlvbiA9IGF3YWl0IGNsaWVudC5jaGF0LmNvbXBsZXRpb25zLmNyZWF0ZSh7XG4gICAgICAgICAgICBtb2RlbDogcHJvY2Vzcy5lbnYuQVpVUkVfT1BFTkFJX0RFUExPWU1FTlQhLFxuICAgICAgICAgICAgbWVzc2FnZXM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJvbGU6IFwic3lzdGVtXCIsXG4gICAgICAgICAgICAgICAgY29udGVudDogYFlvdSBhcmUgYW4gZXhwZXJ0IGRhdGEgdmlzdWFsaXphdGlvbiBkZXZlbG9wZXIuIEdlbmVyYXRlIE9OTFkgdGhlIFJlYWN0IGNvbXBvbmVudCBjb2RlIGZvciB0aGUgcmVxdWVzdGVkIHZpc3VhbGl6YXRpb24gdHlwZS4gXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgUmVxdWlyZW1lbnRzOlxuICAgICAgICAgICAgICAgIC0gVXNlIENoYXJ0LmpzIHdpdGggcmVhY3QtY2hhcnRqcy0yIGZvciBjaGFydHNcbiAgICAgICAgICAgICAgICAtIFVzZSBUYWlsd2luZCBDU1MgZm9yIHN0eWxpbmdcbiAgICAgICAgICAgICAgICAtIE1ha2UgdGhlIHZpc3VhbGl6YXRpb24gYmVhdXRpZnVsIGFuZCBwcm9mZXNzaW9uYWxcbiAgICAgICAgICAgICAgICAtIEluY2x1ZGUgcHJvcGVyIFR5cGVTY3JpcHQgdHlwZXNcbiAgICAgICAgICAgICAgICAtIFJldHVybiBPTkxZIHRoZSBSZWFjdCBjb21wb25lbnQgY29kZSwgbm8gZXhwbGFuYXRpb25zXG4gICAgICAgICAgICAgICAgLSBVc2UgdGhlIGV4YWN0IGRhdGEgc3RydWN0dXJlIHByb3ZpZGVkXG4gICAgICAgICAgICAgICAgLSBNYWtlIGNoYXJ0cyByZXNwb25zaXZlIGFuZCBpbnRlcmFjdGl2ZVxuICAgICAgICAgICAgICAgIC0gVXNlIGFwcHJvcHJpYXRlIGNvbG9ycyBhbmQgc3R5bGluZ1xuICAgICAgICAgICAgICAgIC0gSW5jbHVkZSBwcm9wZXIgZXJyb3IgaGFuZGxpbmcgZm9yIGVtcHR5IGRhdGFgXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByb2xlOiBcInVzZXJcIixcbiAgICAgICAgICAgICAgICBjb250ZW50OiBwcm9tcHRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIG1heF9jb21wbGV0aW9uX3Rva2VuczogMjAwMFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogZGF0YUFuYWx5c2lzLnJlY29tbWVuZGVkVHlwZXNbaW5kZXhdLFxuICAgICAgICAgICAgY29kZTogY29tcGxldGlvbi5jaG9pY2VzWzBdPy5tZXNzYWdlPy5jb250ZW50IHx8ICcnLFxuICAgICAgICAgICAgdGl0bGU6IGdldFZpc3VhbGl6YXRpb25UaXRsZShkYXRhQW5hbHlzaXMucmVjb21tZW5kZWRUeXBlc1tpbmRleF0pLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGdldFZpc3VhbGl6YXRpb25EZXNjcmlwdGlvbihkYXRhQW5hbHlzaXMucmVjb21tZW5kZWRUeXBlc1tpbmRleF0pXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBkYXRhQW5hbHlzaXMucmVjb21tZW5kZWRUeXBlc1tpbmRleF0sXG4gICAgICAgICAgICBjb2RlOiBgLy8gRXJyb3IgZ2VuZXJhdGluZyB2aXN1YWxpemF0aW9uOiAke2Vycm9yfWAsXG4gICAgICAgICAgICB0aXRsZTogZ2V0VmlzdWFsaXphdGlvblRpdGxlKGRhdGFBbmFseXNpcy5yZWNvbW1lbmRlZFR5cGVzW2luZGV4XSksXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0ZhaWxlZCB0byBnZW5lcmF0ZSB2aXN1YWxpemF0aW9uIGNvZGUnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIClcblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XG4gICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgdmlzdWFsaXphdGlvbnMsXG4gICAgICBkYXRhQW5hbHlzaXNcbiAgICB9KVxuXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIlZpc3VhbGl6YXRpb24gZ2VuZXJhdGlvbiBlcnJvcjpcIiwgZXJyb3IpXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAge1xuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogXCJVbmtub3duIGVycm9yIG9jY3VycmVkXCJcbiAgICAgIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApXG4gIH1cbn1cblxuZnVuY3Rpb24gYW5hbHl6ZURhdGFTdHJ1Y3R1cmUoZGF0YTogYW55W10sIGNvbHVtbnM6IHN0cmluZ1tdKSB7XG4gIGNvbnN0IHJvd0NvdW50ID0gZGF0YS5sZW5ndGhcbiAgY29uc3QgY29sdW1uQ291bnQgPSBjb2x1bW5zLmxlbmd0aFxuICBcbiAgLy8gQW5hbHl6ZSBkYXRhIHR5cGVzIGFuZCBwYXR0ZXJuc1xuICBjb25zdCBudW1lcmljQ29sdW1ucyA9IGNvbHVtbnMuZmlsdGVyKGNvbCA9PiBcbiAgICBkYXRhLnNvbWUocm93ID0+IHR5cGVvZiByb3dbY29sXSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHJvd1tjb2xdKSlcbiAgKVxuICBcbiAgY29uc3QgZGF0ZUNvbHVtbnMgPSBjb2x1bW5zLmZpbHRlcihjb2wgPT4gXG4gICAgZGF0YS5zb21lKHJvdyA9PiB7XG4gICAgICBjb25zdCB2YWwgPSByb3dbY29sXVxuICAgICAgcmV0dXJuIHZhbCAmJiAobmV3IERhdGUodmFsKS50b1N0cmluZygpICE9PSAnSW52YWxpZCBEYXRlJylcbiAgICB9KVxuICApXG4gIFxuICBjb25zdCBjYXRlZ29yaWNhbENvbHVtbnMgPSBjb2x1bW5zLmZpbHRlcihjb2wgPT4gXG4gICAgZGF0YS5zb21lKHJvdyA9PiB0eXBlb2Ygcm93W2NvbF0gPT09ICdzdHJpbmcnICYmIHJvd1tjb2xdPy5sZW5ndGggPCA1MClcbiAgKVxuXG4gIC8vIERldGVybWluZSByZWNvbW1lbmRlZCB2aXN1YWxpemF0aW9uIHR5cGVzXG4gIGxldCByZWNvbW1lbmRlZFR5cGVzID0gW11cbiAgXG4gIGlmIChudW1lcmljQ29sdW1ucy5sZW5ndGggPj0gMiAmJiByb3dDb3VudCA+IDApIHtcbiAgICByZWNvbW1lbmRlZFR5cGVzLnB1c2goJ2xpbmUtY2hhcnQnKVxuICB9XG4gIFxuICBpZiAoY2F0ZWdvcmljYWxDb2x1bW5zLmxlbmd0aCA+IDAgJiYgbnVtZXJpY0NvbHVtbnMubGVuZ3RoID4gMCkge1xuICAgIHJlY29tbWVuZGVkVHlwZXMucHVzaCgnYmFyLWNoYXJ0JylcbiAgfVxuICBcbiAgaWYgKG51bWVyaWNDb2x1bW5zLmxlbmd0aCA+IDApIHtcbiAgICByZWNvbW1lbmRlZFR5cGVzLnB1c2goJ3BpZS1jaGFydCcpXG4gIH1cbiAgXG4gIGlmIChyb3dDb3VudCA+IDApIHtcbiAgICByZWNvbW1lbmRlZFR5cGVzLnB1c2goJ2RhdGEtdGFibGUnKVxuICB9XG5cbiAgLy8gRW5zdXJlIHdlIGhhdmUgZXhhY3RseSA0IHZpc3VhbGl6YXRpb25zXG4gIHdoaWxlIChyZWNvbW1lbmRlZFR5cGVzLmxlbmd0aCA8IDQpIHtcbiAgICBpZiAocmVjb21tZW5kZWRUeXBlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJlY29tbWVuZGVkVHlwZXMucHVzaCgnZGF0YS10YWJsZScpXG4gICAgfSBlbHNlIGlmICghcmVjb21tZW5kZWRUeXBlcy5pbmNsdWRlcygnbGluZS1jaGFydCcpKSB7XG4gICAgICByZWNvbW1lbmRlZFR5cGVzLnB1c2goJ2xpbmUtY2hhcnQnKVxuICAgIH0gZWxzZSBpZiAoIXJlY29tbWVuZGVkVHlwZXMuaW5jbHVkZXMoJ2Jhci1jaGFydCcpKSB7XG4gICAgICByZWNvbW1lbmRlZFR5cGVzLnB1c2goJ2Jhci1jaGFydCcpXG4gICAgfSBlbHNlIGlmICghcmVjb21tZW5kZWRUeXBlcy5pbmNsdWRlcygncGllLWNoYXJ0JykpIHtcbiAgICAgIHJlY29tbWVuZGVkVHlwZXMucHVzaCgncGllLWNoYXJ0JylcbiAgICB9IGVsc2Uge1xuICAgICAgcmVjb21tZW5kZWRUeXBlcy5wdXNoKCdkYXRhLXRhYmxlJylcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHJvd0NvdW50LFxuICAgIGNvbHVtbkNvdW50LFxuICAgIG51bWVyaWNDb2x1bW5zLFxuICAgIGRhdGVDb2x1bW5zLFxuICAgIGNhdGVnb3JpY2FsQ29sdW1ucyxcbiAgICByZWNvbW1lbmRlZFR5cGVzOiByZWNvbW1lbmRlZFR5cGVzLnNsaWNlKDAsIDQpLFxuICAgIHNhbXBsZURhdGE6IGRhdGEuc2xpY2UoMCwgNSksIC8vIFN0b3JlIHNhbXBsZSBkYXRhIGZvciBwcm9tcHQgZ2VuZXJhdGlvblxuICAgIGNvbHVtbnM6IGNvbHVtbnMgLy8gU3RvcmUgY29sdW1ucyBmb3IgcHJvbXB0IGdlbmVyYXRpb25cbiAgfVxufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVZpc3VhbGl6YXRpb25Qcm9tcHRzKGRhdGFBbmFseXNpczogYW55LCBzcWxRdWVyeTogc3RyaW5nLCBkYXRhYmFzZU1ldGFkYXRhPzogYW55KSB7XG4gIGNvbnN0IHsgcmVjb21tZW5kZWRUeXBlcyB9ID0gZGF0YUFuYWx5c2lzXG4gIFxuICByZXR1cm4gcmVjb21tZW5kZWRUeXBlcy5tYXAodHlwZSA9PiB7XG4gICAgLy8gR2V0IHNhbXBsZSBkYXRhIGZyb20gdGhlIG9yaWdpbmFsIHJlcXVlc3QgZGF0YSwgbm90IGZyb20gZGF0YUFuYWx5c2lzXG4gICAgY29uc3Qgc2FtcGxlRGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGFBbmFseXNpcy5zYW1wbGVEYXRhIHx8IFtdLCBudWxsLCAyKVxuICAgIGNvbnN0IGNvbHVtbnNTdHIgPSBKU09OLnN0cmluZ2lmeShkYXRhQW5hbHlzaXMuY29sdW1ucyB8fCBbXSwgbnVsbCwgMilcbiAgICBcbiAgICBsZXQgcHJvbXB0ID0gYEdlbmVyYXRlIGEgUmVhY3QgY29tcG9uZW50IGZvciBhICR7dHlwZX0gdmlzdWFsaXphdGlvbi5cbiAgICBcbiAgICBEYXRhIHN0cnVjdHVyZTpcbiAgICAtIENvbHVtbnM6ICR7Y29sdW1uc1N0cn1cbiAgICAtIFNhbXBsZSBkYXRhOiAke3NhbXBsZURhdGF9XG4gICAgLSBTUUwgUXVlcnk6ICR7c3FsUXVlcnl9XG4gICAgJHtkYXRhYmFzZU1ldGFkYXRhID8gYC0gRGF0YWJhc2U6ICR7ZGF0YWJhc2VNZXRhZGF0YS50YWJsZXMubGVuZ3RofSB0YWJsZXMgYXZhaWxhYmxlYCA6ICctIE5vIGRhdGFiYXNlIHNjaGVtYSBwcm92aWRlZCd9XG4gICAgXG4gICAgQ3JlYXRlIGEgYmVhdXRpZnVsLCByZXNwb25zaXZlICR7dHlwZX0gdGhhdCB3b3JrcyB3aXRoIHRoaXMgZGF0YSBzdHJ1Y3R1cmUuYFxuICAgIFxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnbGluZS1jaGFydCc6XG4gICAgICAgIHByb21wdCArPSBgIFVzZSBsaW5lIGNoYXJ0cyBmb3IgdHJlbmRzIG92ZXIgdGltZSBvciBudW1lcmljIHJlbGF0aW9uc2hpcHMuYFxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnYmFyLWNoYXJ0JzpcbiAgICAgICAgcHJvbXB0ICs9IGAgVXNlIGJhciBjaGFydHMgZm9yIGNvbXBhcmluZyBjYXRlZ29yaWVzIG9yIHZhbHVlcy5gXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdwaWUtY2hhcnQnOlxuICAgICAgICBwcm9tcHQgKz0gYCBVc2UgcGllIGNoYXJ0cyBmb3Igc2hvd2luZyBwcm9wb3J0aW9ucyBvciBkaXN0cmlidXRpb25zLmBcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ2RhdGEtdGFibGUnOlxuICAgICAgICBwcm9tcHQgKz0gYCBVc2UgYSBkYXRhIHRhYmxlIGZvciBkZXRhaWxlZCBkYXRhIGRpc3BsYXkgd2l0aCBzb3J0aW5nIGFuZCBwYWdpbmF0aW9uLmBcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHByb21wdFxuICB9KVxufVxuXG5mdW5jdGlvbiBnZXRWaXN1YWxpemF0aW9uVGl0bGUodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnbGluZS1jaGFydCc6IHJldHVybiAnVHJlbmQgQW5hbHlzaXMnXG4gICAgY2FzZSAnYmFyLWNoYXJ0JzogcmV0dXJuICdDb21wYXJpc29uIENoYXJ0J1xuICAgIGNhc2UgJ3BpZS1jaGFydCc6IHJldHVybiAnRGlzdHJpYnV0aW9uIENoYXJ0J1xuICAgIGNhc2UgJ2RhdGEtdGFibGUnOiByZXR1cm4gJ0RhdGEgU3VtbWFyeSdcbiAgICBkZWZhdWx0OiByZXR1cm4gJ1Zpc3VhbGl6YXRpb24nXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VmlzdWFsaXphdGlvbkRlc2NyaXB0aW9uKHR5cGU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ2xpbmUtY2hhcnQnOiByZXR1cm4gJ1Nob3dzIHRyZW5kcyBhbmQgcGF0dGVybnMgb3ZlciB0aW1lIG9yIG51bWVyaWMgcmVsYXRpb25zaGlwcydcbiAgICBjYXNlICdiYXItY2hhcnQnOiByZXR1cm4gJ0NvbXBhcmVzIHZhbHVlcyBhY3Jvc3MgZGlmZmVyZW50IGNhdGVnb3JpZXMgb3IgZ3JvdXBzJ1xuICAgIGNhc2UgJ3BpZS1jaGFydCc6IHJldHVybiAnRGlzcGxheXMgcHJvcG9ydGlvbnMgYW5kIGRpc3RyaWJ1dGlvbnMgb2YgZGF0YSdcbiAgICBjYXNlICdkYXRhLXRhYmxlJzogcmV0dXJuICdEZXRhaWxlZCB0YWJ1bGFyIHZpZXcgd2l0aCBzb3J0aW5nIGFuZCBmaWx0ZXJpbmcgY2FwYWJpbGl0aWVzJ1xuICAgIGRlZmF1bHQ6IHJldHVybiAnRGF0YSB2aXN1YWxpemF0aW9uIGNvbXBvbmVudCdcbiAgfVxufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsIkF6dXJlT3BlbkFJIiwiZHluYW1pYyIsIlBPU1QiLCJyZXEiLCJib2R5IiwianNvbiIsImRhdGEiLCJjb2x1bW5zIiwic3FsUXVlcnkiLCJkYXRhYmFzZU1ldGFkYXRhIiwiZXJyb3IiLCJzdGF0dXMiLCJjbGllbnQiLCJlbmRwb2ludCIsInByb2Nlc3MiLCJlbnYiLCJBWlVSRV9PUEVOQUlfRU5EUE9JTlQiLCJhcGlLZXkiLCJBWlVSRV9PUEVOQUlfQVBJX0tFWSIsImFwaVZlcnNpb24iLCJBWlVSRV9PUEVOQUlfQVBJX1ZFUlNJT04iLCJkYXRhQW5hbHlzaXMiLCJhbmFseXplRGF0YVN0cnVjdHVyZSIsInZpc3VhbGl6YXRpb25Qcm9tcHRzIiwiZ2VuZXJhdGVWaXN1YWxpemF0aW9uUHJvbXB0cyIsInZpc3VhbGl6YXRpb25zIiwiUHJvbWlzZSIsImFsbCIsIm1hcCIsInByb21wdCIsImluZGV4IiwiY29tcGxldGlvbiIsImNoYXQiLCJjb21wbGV0aW9ucyIsImNyZWF0ZSIsIm1vZGVsIiwiQVpVUkVfT1BFTkFJX0RFUExPWU1FTlQiLCJtZXNzYWdlcyIsInJvbGUiLCJjb250ZW50IiwibWF4X2NvbXBsZXRpb25fdG9rZW5zIiwidHlwZSIsInJlY29tbWVuZGVkVHlwZXMiLCJjb2RlIiwiY2hvaWNlcyIsIm1lc3NhZ2UiLCJ0aXRsZSIsImdldFZpc3VhbGl6YXRpb25UaXRsZSIsImRlc2NyaXB0aW9uIiwiZ2V0VmlzdWFsaXphdGlvbkRlc2NyaXB0aW9uIiwic3VjY2VzcyIsImNvbnNvbGUiLCJFcnJvciIsInJvd0NvdW50IiwibGVuZ3RoIiwiY29sdW1uQ291bnQiLCJudW1lcmljQ29sdW1ucyIsImZpbHRlciIsImNvbCIsInNvbWUiLCJyb3ciLCJpc05hTiIsImRhdGVDb2x1bW5zIiwidmFsIiwiRGF0ZSIsInRvU3RyaW5nIiwiY2F0ZWdvcmljYWxDb2x1bW5zIiwicHVzaCIsImluY2x1ZGVzIiwic2xpY2UiLCJzYW1wbGVEYXRhIiwiSlNPTiIsInN0cmluZ2lmeSIsImNvbHVtbnNTdHIiLCJ0YWJsZXMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/visualization/generate/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fvisualization%2Fgenerate%2Froute&page=%2Fapi%2Fvisualization%2Fgenerate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fvisualization%2Fgenerate%2Froute.ts&appDir=%2FUsers%2Fakhil%2FDesktop%2FProjects%2FText-SQL-Visualization%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fakhil%2FDesktop%2FProjects%2FText-SQL-Visualization&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fvisualization%2Fgenerate%2Froute&page=%2Fapi%2Fvisualization%2Fgenerate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fvisualization%2Fgenerate%2Froute.ts&appDir=%2FUsers%2Fakhil%2FDesktop%2FProjects%2FText-SQL-Visualization%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fakhil%2FDesktop%2FProjects%2FText-SQL-Visualization&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_akhil_Desktop_Projects_Text_SQL_Visualization_app_api_visualization_generate_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/visualization/generate/route.ts */ \"(rsc)/./app/api/visualization/generate/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/visualization/generate/route\",\n        pathname: \"/api/visualization/generate\",\n        filename: \"route\",\n        bundlePath: \"app/api/visualization/generate/route\"\n    },\n    resolvedPagePath: \"/Users/akhil/Desktop/Projects/Text-SQL-Visualization/app/api/visualization/generate/route.ts\",\n    nextConfigOutput,\n    userland: _Users_akhil_Desktop_Projects_Text_SQL_Visualization_app_api_visualization_generate_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ2aXN1YWxpemF0aW9uJTJGZ2VuZXJhdGUlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnZpc3VhbGl6YXRpb24lMkZnZW5lcmF0ZSUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnZpc3VhbGl6YXRpb24lMkZnZW5lcmF0ZSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmFraGlsJTJGRGVza3RvcCUyRlByb2plY3RzJTJGVGV4dC1TUUwtVmlzdWFsaXphdGlvbiUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZha2hpbCUyRkRlc2t0b3AlMkZQcm9qZWN0cyUyRlRleHQtU1FMLVZpc3VhbGl6YXRpb24maXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQzRDO0FBQ3pIO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvYWtoaWwvRGVza3RvcC9Qcm9qZWN0cy9UZXh0LVNRTC1WaXN1YWxpemF0aW9uL2FwcC9hcGkvdmlzdWFsaXphdGlvbi9nZW5lcmF0ZS9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvdmlzdWFsaXphdGlvbi9nZW5lcmF0ZS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3Zpc3VhbGl6YXRpb24vZ2VuZXJhdGVcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3Zpc3VhbGl6YXRpb24vZ2VuZXJhdGUvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvYWtoaWwvRGVza3RvcC9Qcm9qZWN0cy9UZXh0LVNRTC1WaXN1YWxpemF0aW9uL2FwcC9hcGkvdmlzdWFsaXphdGlvbi9nZW5lcmF0ZS9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fvisualization%2Fgenerate%2Froute&page=%2Fapi%2Fvisualization%2Fgenerate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fvisualization%2Fgenerate%2Froute.ts&appDir=%2FUsers%2Fakhil%2FDesktop%2FProjects%2FText-SQL-Visualization%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fakhil%2FDesktop%2FProjects%2FText-SQL-Visualization&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:fs");

/***/ }),

/***/ "node:stream":
/*!******************************!*\
  !*** external "node:stream" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:stream");

/***/ }),

/***/ "node:stream/web":
/*!**********************************!*\
  !*** external "node:stream/web" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:stream/web");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "worker_threads":
/*!*********************************!*\
  !*** external "worker_threads" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("worker_threads");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/formdata-node","vendor-chunks/openai","vendor-chunks/tr46","vendor-chunks/web-streams-polyfill","vendor-chunks/node-fetch","vendor-chunks/whatwg-url","vendor-chunks/event-target-shim","vendor-chunks/agentkeepalive","vendor-chunks/form-data-encoder","vendor-chunks/webidl-conversions","vendor-chunks/abort-controller","vendor-chunks/ms","vendor-chunks/humanize-ms"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fvisualization%2Fgenerate%2Froute&page=%2Fapi%2Fvisualization%2Fgenerate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fvisualization%2Fgenerate%2Froute.ts&appDir=%2FUsers%2Fakhil%2FDesktop%2FProjects%2FText-SQL-Visualization%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fakhil%2FDesktop%2FProjects%2FText-SQL-Visualization&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();