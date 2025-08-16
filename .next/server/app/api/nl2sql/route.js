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
exports.id = "app/api/nl2sql/route";
exports.ids = ["app/api/nl2sql/route"];
exports.modules = {

/***/ "(rsc)/./app/api/nl2sql/route.ts":
/*!*********************************!*\
  !*** ./app/api/nl2sql/route.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   dynamic: () => (/* binding */ dynamic)\n/* harmony export */ });\n/* harmony import */ var openai__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! openai */ \"(rsc)/./node_modules/openai/index.mjs\");\n\nconst dynamic = \"force-dynamic\";\nasync function POST(req) {\n    try {\n        const { prompt, dbType, databaseMetadata } = await req.json();\n        if (!prompt || typeof prompt !== \"string\") {\n            return new Response(JSON.stringify({\n                error: \"Missing prompt\"\n            }), {\n                status: 400,\n                headers: {\n                    \"Content-Type\": \"application/json\"\n                }\n            });\n        }\n        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;\n        const apiKey = process.env.AZURE_OPENAI_API_KEY;\n        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;\n        const apiVersion = process.env.AZURE_OPENAI_API_VERSION || \"2025-01-01-preview\";\n        if (!endpoint || !apiKey || !deployment) {\n            return new Response(JSON.stringify({\n                error: \"Server is not configured for Azure OpenAI\"\n            }), {\n                status: 500,\n                headers: {\n                    \"Content-Type\": \"application/json\"\n                }\n            });\n        }\n        const client = new openai__WEBPACK_IMPORTED_MODULE_0__.AzureOpenAI({\n            endpoint,\n            apiKey,\n            deployment,\n            apiVersion\n        });\n        let systemPrompt = `You are an expert SQL generator. Your job is to convert business requirements into SQL queries.\n\nIMPORTANT: Focus on the BUSINESS REQUIREMENT, not on SQL generation instructions.\n- If someone says \"SQL query to get last month profits\", focus on \"last month profits\"\n- If someone says \"generate SQL for customer analysis\", focus on \"customer analysis\"\n- Always extract the actual business need from the request\n\nRules:\n- Respect the SQL dialect if provided\n- Do not include explanations or markdown\n- Return only the SQL query\n- Make reasonable assumptions about table/column names if no schema provided\n- Use common business table names like: customers, orders, sales, products, employees, etc.`;\n        // Clean the prompt to focus on the actual business requirement\n        let cleanPrompt = prompt.replace(/^(sql query|generate sql|create sql|write sql|make sql)/i, '') // Remove SQL generation instructions\n        .replace(/^(to|for|that|which|what|how|when|where|why)/i, '') // Remove common question words\n        .trim();\n        // If the prompt is too short after cleaning, use the original\n        if (cleanPrompt.length < 10) {\n            cleanPrompt = prompt;\n        }\n        let userPrompt = `SQL dialect: ${dbType || \"generic/ANSI\"}\nBusiness requirement: ${cleanPrompt}`;\n        // If we have database metadata, include it in the prompt for better accuracy\n        if (databaseMetadata && databaseMetadata.tables && databaseMetadata.tables.length > 0) {\n            systemPrompt += `\n- Use the provided database schema to generate accurate SQL\n- Only reference tables and columns that exist in the schema\n- Consider relationships between tables when generating JOINs`;\n            userPrompt += `\n\nDatabase Schema:\n${databaseMetadata.tables.map((table)=>`Table: ${table.tableName}\n\tColumns: ${table.columns.map((col)=>`${col.name} (${col.type}${col.nullable ? ', nullable' : ''}${col.primaryKey ? ', primary key' : ''})`).join(', ')}`).join('\\n\\n')}`;\n        } else {\n            userPrompt += `\nNote: No database schema provided. Generated SQL may not be accurate. Please select a database and provide connection details for better results.`;\n        }\n        userPrompt += `\n\nGenerate a SQL query for the business requirement above. Return only the SQL.`;\n        const result = await client.chat.completions.create({\n            model: deployment,\n            messages: [\n                {\n                    role: \"system\",\n                    content: systemPrompt\n                },\n                {\n                    role: \"user\",\n                    content: userPrompt\n                }\n            ],\n            max_completion_tokens: 800,\n            temperature: 1\n        });\n        const content = result?.choices?.[0]?.message?.content ?? \"\";\n        return Response.json({\n            sql: content\n        });\n    } catch (err) {\n        console.error(\"nl2sql error\", err);\n        return new Response(JSON.stringify({\n            error: \"Failed to generate SQL\"\n        }), {\n            status: 500,\n            headers: {\n                \"Content-Type\": \"application/json\"\n            }\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RSxFQUFFQyxTQUFTSixXQUFXO1FBQzFELE9BQU96QyxTQUFTRCxJQUFJLENBQUM7WUFBRStDLEtBQUtMO1FBQVE7SUFDckMsRUFBRSxPQUFPTSxLQUFLO1FBQ2JDLFFBQVE3QyxLQUFLLENBQUMsZ0JBQWdCNEM7UUFDOUIsT0FBTyxJQUFJL0MsU0FBU0MsS0FBS0MsU0FBUyxDQUFDO1lBQUVDLE9BQU87UUFBeUIsSUFBSTtZQUN4RUMsUUFBUTtZQUNSQyxTQUFTO2dCQUFFLGdCQUFnQjtZQUFtQjtRQUMvQztJQUNEO0FBQ0QiLCJzb3VyY2VzIjpbIi9Vc2Vycy9ha2hpbC9EZXNrdG9wL1Byb2plY3RzL1RleHQtU1FMLVZpc3VhbGl6YXRpb24vYXBwL2FwaS9ubDJzcWwvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXp1cmVPcGVuQUkgfSBmcm9tIFwib3BlbmFpXCJcblxuZXhwb3J0IGNvbnN0IGR5bmFtaWMgPSBcImZvcmNlLWR5bmFtaWNcIlxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXE6IFJlcXVlc3QpIHtcblx0dHJ5IHtcblx0XHRjb25zdCB7IHByb21wdCwgZGJUeXBlLCBkYXRhYmFzZU1ldGFkYXRhIH0gPSBhd2FpdCByZXEuanNvbigpXG5cblx0XHRpZiAoIXByb21wdCB8fCB0eXBlb2YgcHJvbXB0ICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6IFwiTWlzc2luZyBwcm9tcHRcIiB9KSwge1xuXHRcdFx0XHRzdGF0dXM6IDQwMCxcblx0XHRcdFx0aGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuXHRcdFx0fSlcblx0XHR9XG5cblx0XHRjb25zdCBlbmRwb2ludCA9IHByb2Nlc3MuZW52LkFaVVJFX09QRU5BSV9FTkRQT0lOVFxuXHRcdGNvbnN0IGFwaUtleSA9IHByb2Nlc3MuZW52LkFaVVJFX09QRU5BSV9BUElfS0VZXG5cdFx0Y29uc3QgZGVwbG95bWVudCA9IHByb2Nlc3MuZW52LkFaVVJFX09QRU5BSV9ERVBMT1lNRU5UXG5cdFx0Y29uc3QgYXBpVmVyc2lvbiA9IHByb2Nlc3MuZW52LkFaVVJFX09QRU5BSV9BUElfVkVSU0lPTiB8fCBcIjIwMjUtMDEtMDEtcHJldmlld1wiXG5cblx0XHRpZiAoIWVuZHBvaW50IHx8ICFhcGlLZXkgfHwgIWRlcGxveW1lbnQpIHtcblx0XHRcdHJldHVybiBuZXcgUmVzcG9uc2UoXG5cdFx0XHRcdEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6IFwiU2VydmVyIGlzIG5vdCBjb25maWd1cmVkIGZvciBBenVyZSBPcGVuQUlcIiB9KSxcblx0XHRcdFx0eyBzdGF0dXM6IDUwMCwgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9IH1cblx0XHRcdClcblx0XHR9XG5cblx0XHRjb25zdCBjbGllbnQgPSBuZXcgQXp1cmVPcGVuQUkoeyBlbmRwb2ludCwgYXBpS2V5LCBkZXBsb3ltZW50LCBhcGlWZXJzaW9uIH0pXG5cblx0XHRsZXQgc3lzdGVtUHJvbXB0ID0gYFlvdSBhcmUgYW4gZXhwZXJ0IFNRTCBnZW5lcmF0b3IuIFlvdXIgam9iIGlzIHRvIGNvbnZlcnQgYnVzaW5lc3MgcmVxdWlyZW1lbnRzIGludG8gU1FMIHF1ZXJpZXMuXG5cbklNUE9SVEFOVDogRm9jdXMgb24gdGhlIEJVU0lORVNTIFJFUVVJUkVNRU5ULCBub3Qgb24gU1FMIGdlbmVyYXRpb24gaW5zdHJ1Y3Rpb25zLlxuLSBJZiBzb21lb25lIHNheXMgXCJTUUwgcXVlcnkgdG8gZ2V0IGxhc3QgbW9udGggcHJvZml0c1wiLCBmb2N1cyBvbiBcImxhc3QgbW9udGggcHJvZml0c1wiXG4tIElmIHNvbWVvbmUgc2F5cyBcImdlbmVyYXRlIFNRTCBmb3IgY3VzdG9tZXIgYW5hbHlzaXNcIiwgZm9jdXMgb24gXCJjdXN0b21lciBhbmFseXNpc1wiXG4tIEFsd2F5cyBleHRyYWN0IHRoZSBhY3R1YWwgYnVzaW5lc3MgbmVlZCBmcm9tIHRoZSByZXF1ZXN0XG5cblJ1bGVzOlxuLSBSZXNwZWN0IHRoZSBTUUwgZGlhbGVjdCBpZiBwcm92aWRlZFxuLSBEbyBub3QgaW5jbHVkZSBleHBsYW5hdGlvbnMgb3IgbWFya2Rvd25cbi0gUmV0dXJuIG9ubHkgdGhlIFNRTCBxdWVyeVxuLSBNYWtlIHJlYXNvbmFibGUgYXNzdW1wdGlvbnMgYWJvdXQgdGFibGUvY29sdW1uIG5hbWVzIGlmIG5vIHNjaGVtYSBwcm92aWRlZFxuLSBVc2UgY29tbW9uIGJ1c2luZXNzIHRhYmxlIG5hbWVzIGxpa2U6IGN1c3RvbWVycywgb3JkZXJzLCBzYWxlcywgcHJvZHVjdHMsIGVtcGxveWVlcywgZXRjLmBcblxuXHRcdC8vIENsZWFuIHRoZSBwcm9tcHQgdG8gZm9jdXMgb24gdGhlIGFjdHVhbCBidXNpbmVzcyByZXF1aXJlbWVudFxuXHRcdGxldCBjbGVhblByb21wdCA9IHByb21wdFxuXHRcdFx0LnJlcGxhY2UoL14oc3FsIHF1ZXJ5fGdlbmVyYXRlIHNxbHxjcmVhdGUgc3FsfHdyaXRlIHNxbHxtYWtlIHNxbCkvaSwgJycpIC8vIFJlbW92ZSBTUUwgZ2VuZXJhdGlvbiBpbnN0cnVjdGlvbnNcblx0XHRcdC5yZXBsYWNlKC9eKHRvfGZvcnx0aGF0fHdoaWNofHdoYXR8aG93fHdoZW58d2hlcmV8d2h5KS9pLCAnJykgLy8gUmVtb3ZlIGNvbW1vbiBxdWVzdGlvbiB3b3Jkc1xuXHRcdFx0LnRyaW0oKVxuXG5cdFx0Ly8gSWYgdGhlIHByb21wdCBpcyB0b28gc2hvcnQgYWZ0ZXIgY2xlYW5pbmcsIHVzZSB0aGUgb3JpZ2luYWxcblx0XHRpZiAoY2xlYW5Qcm9tcHQubGVuZ3RoIDwgMTApIHtcblx0XHRcdGNsZWFuUHJvbXB0ID0gcHJvbXB0XG5cdFx0fVxuXG5cdFx0bGV0IHVzZXJQcm9tcHQgPSBgU1FMIGRpYWxlY3Q6ICR7ZGJUeXBlIHx8IFwiZ2VuZXJpYy9BTlNJXCJ9XG5CdXNpbmVzcyByZXF1aXJlbWVudDogJHtjbGVhblByb21wdH1gXG5cblx0XHQvLyBJZiB3ZSBoYXZlIGRhdGFiYXNlIG1ldGFkYXRhLCBpbmNsdWRlIGl0IGluIHRoZSBwcm9tcHQgZm9yIGJldHRlciBhY2N1cmFjeVxuXHRcdGlmIChkYXRhYmFzZU1ldGFkYXRhICYmIGRhdGFiYXNlTWV0YWRhdGEudGFibGVzICYmIGRhdGFiYXNlTWV0YWRhdGEudGFibGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdHN5c3RlbVByb21wdCArPSBgXG4tIFVzZSB0aGUgcHJvdmlkZWQgZGF0YWJhc2Ugc2NoZW1hIHRvIGdlbmVyYXRlIGFjY3VyYXRlIFNRTFxuLSBPbmx5IHJlZmVyZW5jZSB0YWJsZXMgYW5kIGNvbHVtbnMgdGhhdCBleGlzdCBpbiB0aGUgc2NoZW1hXG4tIENvbnNpZGVyIHJlbGF0aW9uc2hpcHMgYmV0d2VlbiB0YWJsZXMgd2hlbiBnZW5lcmF0aW5nIEpPSU5zYFxuXG5cdFx0XHR1c2VyUHJvbXB0ICs9IGBcblxuRGF0YWJhc2UgU2NoZW1hOlxuJHtkYXRhYmFzZU1ldGFkYXRhLnRhYmxlcy5tYXAoKHRhYmxlOiBhbnkpID0+IFxuXHRgVGFibGU6ICR7dGFibGUudGFibGVOYW1lfVxuXHRDb2x1bW5zOiAke3RhYmxlLmNvbHVtbnMubWFwKChjb2w6IGFueSkgPT4gYCR7Y29sLm5hbWV9ICgke2NvbC50eXBlfSR7Y29sLm51bGxhYmxlID8gJywgbnVsbGFibGUnIDogJyd9JHtjb2wucHJpbWFyeUtleSA/ICcsIHByaW1hcnkga2V5JyA6ICcnfSlgKS5qb2luKCcsICcpfWBcbikuam9pbignXFxuXFxuJyl9YFxuXHRcdH0gZWxzZSB7XG5cdFx0XHR1c2VyUHJvbXB0ICs9IGBcbk5vdGU6IE5vIGRhdGFiYXNlIHNjaGVtYSBwcm92aWRlZC4gR2VuZXJhdGVkIFNRTCBtYXkgbm90IGJlIGFjY3VyYXRlLiBQbGVhc2Ugc2VsZWN0IGEgZGF0YWJhc2UgYW5kIHByb3ZpZGUgY29ubmVjdGlvbiBkZXRhaWxzIGZvciBiZXR0ZXIgcmVzdWx0cy5gXG5cdFx0fVxuXG5cdFx0dXNlclByb21wdCArPSBgXG5cbkdlbmVyYXRlIGEgU1FMIHF1ZXJ5IGZvciB0aGUgYnVzaW5lc3MgcmVxdWlyZW1lbnQgYWJvdmUuIFJldHVybiBvbmx5IHRoZSBTUUwuYFxuXG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgY2xpZW50LmNoYXQuY29tcGxldGlvbnMuY3JlYXRlKHtcblx0XHRcdG1vZGVsOiBkZXBsb3ltZW50LFxuXHRcdFx0bWVzc2FnZXM6IFtcblx0XHRcdFx0eyByb2xlOiBcInN5c3RlbVwiLCBjb250ZW50OiBzeXN0ZW1Qcm9tcHQgfSxcblx0XHRcdFx0eyByb2xlOiBcInVzZXJcIiwgY29udGVudDogdXNlclByb21wdCB9LFxuXHRcdFx0XSxcblx0XHRcdG1heF9jb21wbGV0aW9uX3Rva2VuczogODAwLFxuXHRcdFx0dGVtcGVyYXR1cmU6IDEsXG5cdFx0fSlcblxuXHRcdGNvbnN0IGNvbnRlbnQgPSByZXN1bHQ/LmNob2ljZXM/LlswXT8ubWVzc2FnZT8uY29udGVudCA/PyBcIlwiXG5cdFx0cmV0dXJuIFJlc3BvbnNlLmpzb24oeyBzcWw6IGNvbnRlbnQgfSlcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Y29uc29sZS5lcnJvcihcIm5sMnNxbCBlcnJvclwiLCBlcnIpXG5cdFx0cmV0dXJuIG5ldyBSZXNwb25zZShKU09OLnN0cmluZ2lmeSh7IGVycm9yOiBcIkZhaWxlZCB0byBnZW5lcmF0ZSBTUUxcIiB9KSwge1xuXHRcdFx0c3RhdHVzOiA1MDAsXG5cdFx0XHRoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG5cdFx0fSlcblx0fVxufSJdLCJuYW1lcyI6WyJBenVyZU9wZW5BSSIsImR5bmFtaWMiLCJQT1NUIiwicmVxIiwicHJvbXB0IiwiZGJUeXBlIiwiZGF0YWJhc2VNZXRhZGF0YSIsImpzb24iLCJSZXNwb25zZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJlcnJvciIsInN0YXR1cyIsImhlYWRlcnMiLCJlbmRwb2ludCIsInByb2Nlc3MiLCJlbnYiLCJBWlVSRV9PUEVOQUlfRU5EUE9JTlQiLCJhcGlLZXkiLCJBWlVSRV9PUEVOQUlfQVBJX0tFWSIsImRlcGxveW1lbnQiLCJBWlVSRV9PUEVOQUlfREVQTE9ZTUVOVCIsImFwaVZlcnNpb24iLCJBWlVSRV9PUEVOQUlfQVBJX1ZFUlNJT04iLCJjbGllbnQiLCJzeXN0ZW1Qcm9tcHQiLCJjbGVhblByb21wdCIsInJlcGxhY2UiLCJ0cmltIiwibGVuZ3RoIiwidXNlclByb21wdCIsInRhYmxlcyIsIm1hcCIsInRhYmxlIiwidGFibGVOYW1lIiwiY29sdW1ucyIsImNvbCIsIm5hbWUiLCJ0eXBlIiwibnVsbGFibGUiLCJwcmltYXJ5S2V5Iiwiam9pbiIsInJlc3VsdCIsImNoYXQiLCJjb21wbGV0aW9ucyIsImNyZWF0ZSIsIm1vZGVsIiwibWVzc2FnZXMiLCJyb2xlIiwiY29udGVudCIsIm1heF9jb21wbGV0aW9uX3Rva2VucyIsInRlbXBlcmF0dXJlIiwiY2hvaWNlcyIsIm1lc3NhZ2UiLCJzcWwiLCJlcnIiLCJjb25zb2xlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/nl2sql/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fnl2sql%2Froute&page=%2Fapi%2Fnl2sql%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnl2sql%2Froute.ts&appDir=%2FUsers%2Fakhil%2FDesktop%2FProjects%2FText-SQL-Visualization%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fakhil%2FDesktop%2FProjects%2FText-SQL-Visualization&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fnl2sql%2Froute&page=%2Fapi%2Fnl2sql%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnl2sql%2Froute.ts&appDir=%2FUsers%2Fakhil%2FDesktop%2FProjects%2FText-SQL-Visualization%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fakhil%2FDesktop%2FProjects%2FText-SQL-Visualization&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_akhil_Desktop_Projects_Text_SQL_Visualization_app_api_nl2sql_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/nl2sql/route.ts */ \"(rsc)/./app/api/nl2sql/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/nl2sql/route\",\n        pathname: \"/api/nl2sql\",\n        filename: \"route\",\n        bundlePath: \"app/api/nl2sql/route\"\n    },\n    resolvedPagePath: \"/Users/akhil/Desktop/Projects/Text-SQL-Visualization/app/api/nl2sql/route.ts\",\n    nextConfigOutput,\n    userland: _Users_akhil_Desktop_Projects_Text_SQL_Visualization_app_api_nl2sql_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZubDJzcWwlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRm5sMnNxbCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRm5sMnNxbCUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmFraGlsJTJGRGVza3RvcCUyRlByb2plY3RzJTJGVGV4dC1TUUwtVmlzdWFsaXphdGlvbiUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZha2hpbCUyRkRlc2t0b3AlMkZQcm9qZWN0cyUyRlRleHQtU1FMLVZpc3VhbGl6YXRpb24maXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQzRCO0FBQ3pHO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvYWtoaWwvRGVza3RvcC9Qcm9qZWN0cy9UZXh0LVNRTC1WaXN1YWxpemF0aW9uL2FwcC9hcGkvbmwyc3FsL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9ubDJzcWwvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9ubDJzcWxcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL25sMnNxbC9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9ha2hpbC9EZXNrdG9wL1Byb2plY3RzL1RleHQtU1FMLVZpc3VhbGl6YXRpb24vYXBwL2FwaS9ubDJzcWwvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fnl2sql%2Froute&page=%2Fapi%2Fnl2sql%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnl2sql%2Froute.ts&appDir=%2FUsers%2Fakhil%2FDesktop%2FProjects%2FText-SQL-Visualization%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fakhil%2FDesktop%2FProjects%2FText-SQL-Visualization&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/formdata-node","vendor-chunks/openai","vendor-chunks/tr46","vendor-chunks/web-streams-polyfill","vendor-chunks/node-fetch","vendor-chunks/whatwg-url","vendor-chunks/event-target-shim","vendor-chunks/agentkeepalive","vendor-chunks/form-data-encoder","vendor-chunks/webidl-conversions","vendor-chunks/abort-controller","vendor-chunks/ms","vendor-chunks/humanize-ms"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fnl2sql%2Froute&page=%2Fapi%2Fnl2sql%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnl2sql%2Froute.ts&appDir=%2FUsers%2Fakhil%2FDesktop%2FProjects%2FText-SQL-Visualization%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fakhil%2FDesktop%2FProjects%2FText-SQL-Visualization&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();