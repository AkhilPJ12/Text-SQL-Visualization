import { AzureOpenAI } from "openai"

export async function POST(req: Request) {
	try {
		const { prompt, dbType } = await req.json()

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

		const systemPrompt = `You are an expert SQL generator. Convert natural language requests into a single, correct, and optimized SQL query.
- Respect the SQL dialect if provided.
- Do not include explanations or markdown. Return only SQL.`

		const userPrompt = `SQL dialect: ${dbType || "generic/ANSI"}
Task: ${prompt}
Return only the SQL.`

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