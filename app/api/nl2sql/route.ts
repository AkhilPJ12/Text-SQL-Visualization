import { AzureOpenAI } from "openai"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
	try {
		const { prompt, dbType, databaseMetadata } = await req.json()

		if (!prompt || typeof prompt !== "string") {
			return new Response(JSON.stringify({ error: "Missing prompt" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			})
		}

		const endpoint = process.env.AZURE_OPENAI_ENDPOINT
		const apiKey = process.env.AZURE_OPENAI_API_KEY
		const deployment = process.env.AZURE_OPENAI_DEPLOYMENT
		const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2025-01-01-preview"

		if (!endpoint || !apiKey || !deployment) {
			return new Response(
				JSON.stringify({ error: "Server is not configured for Azure OpenAI" }),
				{ status: 500, headers: { "Content-Type": "application/json" } }
			)
		}

		const client = new AzureOpenAI({ endpoint, apiKey, deployment, apiVersion })

		let systemPrompt = `You are an expert SQL generator. Your job is to convert business requirements into SQL queries.

IMPORTANT: Focus on the BUSINESS REQUIREMENT, not on SQL generation instructions.
- If someone says "SQL query to get last month profits", focus on "last month profits"
- If someone says "generate SQL for customer analysis", focus on "customer analysis"
- Always extract the actual business need from the request

Rules:
- Respect the SQL dialect if provided
- Do not include explanations or markdown
- Return only the SQL query
- Make reasonable assumptions about table/column names if no schema provided
- Use common business table names like: customers, orders, sales, products, employees, etc.`

		// Clean the prompt to focus on the actual business requirement
		let cleanPrompt = prompt
			.replace(/^(sql query|generate sql|create sql|write sql|make sql)/i, '') // Remove SQL generation instructions
			.replace(/^(to|for|that|which|what|how|when|where|why)/i, '') // Remove common question words
			.trim()

		// If the prompt is too short after cleaning, use the original
		if (cleanPrompt.length < 10) {
			cleanPrompt = prompt
		}

		let userPrompt = `SQL dialect: ${dbType || "generic/ANSI"}
Business requirement: ${cleanPrompt}`

		// If we have database metadata, include it in the prompt for better accuracy
		if (databaseMetadata && databaseMetadata.tables && databaseMetadata.tables.length > 0) {
			systemPrompt += `
- Use the provided database schema to generate accurate SQL
- Only reference tables and columns that exist in the schema
- Consider relationships between tables when generating JOINs`

			userPrompt += `

Database Schema:
${databaseMetadata.tables.map((table: any) => 
	`Table: ${table.tableName}
	Columns: ${table.columns.map((col: any) => `${col.name} (${col.type}${col.nullable ? ', nullable' : ''}${col.primaryKey ? ', primary key' : ''})`).join(', ')}`
).join('\n\n')}`
		} else {
			userPrompt += `
Note: No database schema provided. Generated SQL may not be accurate. Please select a database and provide connection details for better results.`
		}

		userPrompt += `

Generate a SQL query for the business requirement above. Return only the SQL.`

		const result = await client.chat.completions.create({
			model: deployment,
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt },
			],
			max_completion_tokens: 800,
			temperature: 1,
		})

		const content = result?.choices?.[0]?.message?.content ?? ""
		return Response.json({ sql: content })
	} catch (err) {
		console.error("nl2sql error", err)
		return new Response(JSON.stringify({ error: "Failed to generate SQL" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		})
	}
}