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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var openai__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! openai */ \"(rsc)/./node_modules/openai/index.mjs\");\n\nasync function POST(req) {\n    try {\n        const { prompt, dbType } = await req.json();\n        if (!prompt || typeof prompt !== \"string\") {\n            return new Response(JSON.stringify({\n                error: \"Missing prompt\"\n            }), {\n                status: 400,\n                headers: {\n                    \"Content-Type\": \"application/json\"\n                }\n            });\n        }\n        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;\n        const apiKey = process.env.AZURE_OPENAI_API_KEY;\n        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;\n        const apiVersion = process.env.AZURE_OPENAI_API_VERSION || \"2025-01-01-preview\";\n        if (!endpoint || !apiKey || !deployment) {\n            return new Response(JSON.stringify({\n                error: \"Server is not configured for Azure OpenAI\"\n            }), {\n                status: 500,\n                headers: {\n                    \"Content-Type\": \"application/json\"\n                }\n            });\n        }\n        const client = new openai__WEBPACK_IMPORTED_MODULE_0__.AzureOpenAI({\n            endpoint,\n            apiKey,\n            deployment,\n            apiVersion\n        });\n        const systemPrompt = `You are an expert SQL generator. Convert natural language requests into a single, correct, and optimized SQL query.\n- Respect the SQL dialect if provided.\n- Do not include explanations or markdown. Return only SQL.`;\n        const userPrompt = `SQL dialect: ${dbType || \"generic/ANSI\"}\nTask: ${prompt}\nReturn only the SQL.`;\n        const result = await client.chat.completions.create({\n            model: deployment,\n            messages: [\n                {\n                    role: \"system\",\n                    content: systemPrompt\n                },\n                {\n                    role: \"user\",\n                    content: userPrompt\n                }\n            ],\n            max_completion_tokens: 800,\n            temperature: 1\n        });\n        const content = result?.choices?.[0]?.message?.content ?? \"\";\n        return Response.json({\n            sql: content\n        });\n    } catch (err) {\n        console.error(\"nl2sql error\", err);\n        return new Response(JSON.stringify({\n            error: \"Failed to generate SQL\"\n        }), {\n            status: 500,\n            headers: {\n                \"Content-Type\": \"application/json\"\n            }\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL25sMnNxbC9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7OztBQUFvQztBQUU3QixlQUFlQyxLQUFLQyxHQUFZO0lBQ3RDLElBQUk7UUFDSCxNQUFNLEVBQUVDLE1BQU0sRUFBRUMsTUFBTSxFQUFFLEdBQUcsTUFBTUYsSUFBSUcsSUFBSTtRQUV6QyxJQUFJLENBQUNGLFVBQVUsT0FBT0EsV0FBVyxVQUFVO1lBQzFDLE9BQU8sSUFBSUcsU0FBU0MsS0FBS0MsU0FBUyxDQUFDO2dCQUFFQyxPQUFPO1lBQWlCLElBQUk7Z0JBQ2hFQyxRQUFRO2dCQUNSQyxTQUFTO29CQUFFLGdCQUFnQjtnQkFBbUI7WUFDL0M7UUFDRDtRQUVBLE1BQU1DLFdBQVdDLFFBQVFDLEdBQUcsQ0FBQ0MscUJBQXFCO1FBQ2xELE1BQU1DLFNBQVNILFFBQVFDLEdBQUcsQ0FBQ0csb0JBQW9CO1FBQy9DLE1BQU1DLGFBQWFMLFFBQVFDLEdBQUcsQ0FBQ0ssdUJBQXVCO1FBQ3RELE1BQU1DLGFBQWFQLFFBQVFDLEdBQUcsQ0FBQ08sd0JBQXdCLElBQUk7UUFFM0QsSUFBSSxDQUFDVCxZQUFZLENBQUNJLFVBQVUsQ0FBQ0UsWUFBWTtZQUN4QyxPQUFPLElBQUlaLFNBQ1ZDLEtBQUtDLFNBQVMsQ0FBQztnQkFBRUMsT0FBTztZQUE0QyxJQUNwRTtnQkFBRUMsUUFBUTtnQkFBS0MsU0FBUztvQkFBRSxnQkFBZ0I7Z0JBQW1CO1lBQUU7UUFFakU7UUFFQSxNQUFNVyxTQUFTLElBQUl0QiwrQ0FBV0EsQ0FBQztZQUFFWTtZQUFVSTtZQUFRRTtZQUFZRTtRQUFXO1FBRTFFLE1BQU1HLGVBQWUsQ0FBQzs7MkRBRW1DLENBQUM7UUFFMUQsTUFBTUMsYUFBYSxDQUFDLGFBQWEsRUFBRXBCLFVBQVUsZUFBZTtNQUN4RCxFQUFFRCxPQUFPO29CQUNLLENBQUM7UUFFbkIsTUFBTXNCLFNBQVMsTUFBTUgsT0FBT0ksSUFBSSxDQUFDQyxXQUFXLENBQUNDLE1BQU0sQ0FBQztZQUNuREMsT0FBT1g7WUFDUFksVUFBVTtnQkFDVDtvQkFBRUMsTUFBTTtvQkFBVUMsU0FBU1Q7Z0JBQWE7Z0JBQ3hDO29CQUFFUSxNQUFNO29CQUFRQyxTQUFTUjtnQkFBVzthQUNwQztZQUNEUyx1QkFBdUI7WUFDdkJDLGFBQWE7UUFDZDtRQUVBLE1BQU1GLFVBQVVQLFFBQVFVLFNBQVMsQ0FBQyxFQUFFLEVBQUVDLFNBQVNKLFdBQVc7UUFDMUQsT0FBTzFCLFNBQVNELElBQUksQ0FBQztZQUFFZ0MsS0FBS0w7UUFBUTtJQUNyQyxFQUFFLE9BQU9NLEtBQUs7UUFDYkMsUUFBUTlCLEtBQUssQ0FBQyxnQkFBZ0I2QjtRQUM5QixPQUFPLElBQUloQyxTQUFTQyxLQUFLQyxTQUFTLENBQUM7WUFBRUMsT0FBTztRQUF5QixJQUFJO1lBQ3hFQyxRQUFRO1lBQ1JDLFNBQVM7Z0JBQUUsZ0JBQWdCO1lBQW1CO1FBQy9DO0lBQ0Q7QUFDRCIsInNvdXJjZXMiOlsiL1VzZXJzL2FraGlsL0Rlc2t0b3AvUHJvamVjdHMvVGV4dC1TUUwtVmlzdWFsaXphdGlvbi9hcHAvYXBpL25sMnNxbC9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBenVyZU9wZW5BSSB9IGZyb20gXCJvcGVuYWlcIlxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXE6IFJlcXVlc3QpIHtcblx0dHJ5IHtcblx0XHRjb25zdCB7IHByb21wdCwgZGJUeXBlIH0gPSBhd2FpdCByZXEuanNvbigpXG5cblx0XHRpZiAoIXByb21wdCB8fCB0eXBlb2YgcHJvbXB0ICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6IFwiTWlzc2luZyBwcm9tcHRcIiB9KSwge1xuXHRcdFx0XHRzdGF0dXM6IDQwMCxcblx0XHRcdFx0aGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuXHRcdFx0fSlcblx0XHR9XG5cblx0XHRjb25zdCBlbmRwb2ludCA9IHByb2Nlc3MuZW52LkFaVVJFX09QRU5BSV9FTkRQT0lOVFxuXHRcdGNvbnN0IGFwaUtleSA9IHByb2Nlc3MuZW52LkFaVVJFX09QRU5BSV9BUElfS0VZXG5cdFx0Y29uc3QgZGVwbG95bWVudCA9IHByb2Nlc3MuZW52LkFaVVJFX09QRU5BSV9ERVBMT1lNRU5UXG5cdFx0Y29uc3QgYXBpVmVyc2lvbiA9IHByb2Nlc3MuZW52LkFaVVJFX09QRU5BSV9BUElfVkVSU0lPTiB8fCBcIjIwMjUtMDEtMDEtcHJldmlld1wiXG5cblx0XHRpZiAoIWVuZHBvaW50IHx8ICFhcGlLZXkgfHwgIWRlcGxveW1lbnQpIHtcblx0XHRcdHJldHVybiBuZXcgUmVzcG9uc2UoXG5cdFx0XHRcdEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6IFwiU2VydmVyIGlzIG5vdCBjb25maWd1cmVkIGZvciBBenVyZSBPcGVuQUlcIiB9KSxcblx0XHRcdFx0eyBzdGF0dXM6IDUwMCwgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9IH1cblx0XHRcdClcblx0XHR9XG5cblx0XHRjb25zdCBjbGllbnQgPSBuZXcgQXp1cmVPcGVuQUkoeyBlbmRwb2ludCwgYXBpS2V5LCBkZXBsb3ltZW50LCBhcGlWZXJzaW9uIH0pXG5cblx0XHRjb25zdCBzeXN0ZW1Qcm9tcHQgPSBgWW91IGFyZSBhbiBleHBlcnQgU1FMIGdlbmVyYXRvci4gQ29udmVydCBuYXR1cmFsIGxhbmd1YWdlIHJlcXVlc3RzIGludG8gYSBzaW5nbGUsIGNvcnJlY3QsIGFuZCBvcHRpbWl6ZWQgU1FMIHF1ZXJ5LlxuLSBSZXNwZWN0IHRoZSBTUUwgZGlhbGVjdCBpZiBwcm92aWRlZC5cbi0gRG8gbm90IGluY2x1ZGUgZXhwbGFuYXRpb25zIG9yIG1hcmtkb3duLiBSZXR1cm4gb25seSBTUUwuYFxuXG5cdFx0Y29uc3QgdXNlclByb21wdCA9IGBTUUwgZGlhbGVjdDogJHtkYlR5cGUgfHwgXCJnZW5lcmljL0FOU0lcIn1cblRhc2s6ICR7cHJvbXB0fVxuUmV0dXJuIG9ubHkgdGhlIFNRTC5gXG5cblx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBjbGllbnQuY2hhdC5jb21wbGV0aW9ucy5jcmVhdGUoe1xuXHRcdFx0bW9kZWw6IGRlcGxveW1lbnQsXG5cdFx0XHRtZXNzYWdlczogW1xuXHRcdFx0XHR7IHJvbGU6IFwic3lzdGVtXCIsIGNvbnRlbnQ6IHN5c3RlbVByb21wdCB9LFxuXHRcdFx0XHR7IHJvbGU6IFwidXNlclwiLCBjb250ZW50OiB1c2VyUHJvbXB0IH0sXG5cdFx0XHRdLFxuXHRcdFx0bWF4X2NvbXBsZXRpb25fdG9rZW5zOiA4MDAsXG5cdFx0XHR0ZW1wZXJhdHVyZTogMSxcblx0XHR9KVxuXG5cdFx0Y29uc3QgY29udGVudCA9IHJlc3VsdD8uY2hvaWNlcz8uWzBdPy5tZXNzYWdlPy5jb250ZW50ID8/IFwiXCJcblx0XHRyZXR1cm4gUmVzcG9uc2UuanNvbih7IHNxbDogY29udGVudCB9KVxuXHR9IGNhdGNoIChlcnIpIHtcblx0XHRjb25zb2xlLmVycm9yKFwibmwyc3FsIGVycm9yXCIsIGVycilcblx0XHRyZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6IFwiRmFpbGVkIHRvIGdlbmVyYXRlIFNRTFwiIH0pLCB7XG5cdFx0XHRzdGF0dXM6IDUwMCxcblx0XHRcdGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcblx0XHR9KVxuXHR9XG59Il0sIm5hbWVzIjpbIkF6dXJlT3BlbkFJIiwiUE9TVCIsInJlcSIsInByb21wdCIsImRiVHlwZSIsImpzb24iLCJSZXNwb25zZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJlcnJvciIsInN0YXR1cyIsImhlYWRlcnMiLCJlbmRwb2ludCIsInByb2Nlc3MiLCJlbnYiLCJBWlVSRV9PUEVOQUlfRU5EUE9JTlQiLCJhcGlLZXkiLCJBWlVSRV9PUEVOQUlfQVBJX0tFWSIsImRlcGxveW1lbnQiLCJBWlVSRV9PUEVOQUlfREVQTE9ZTUVOVCIsImFwaVZlcnNpb24iLCJBWlVSRV9PUEVOQUlfQVBJX1ZFUlNJT04iLCJjbGllbnQiLCJzeXN0ZW1Qcm9tcHQiLCJ1c2VyUHJvbXB0IiwicmVzdWx0IiwiY2hhdCIsImNvbXBsZXRpb25zIiwiY3JlYXRlIiwibW9kZWwiLCJtZXNzYWdlcyIsInJvbGUiLCJjb250ZW50IiwibWF4X2NvbXBsZXRpb25fdG9rZW5zIiwidGVtcGVyYXR1cmUiLCJjaG9pY2VzIiwibWVzc2FnZSIsInNxbCIsImVyciIsImNvbnNvbGUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/nl2sql/route.ts\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/formdata-node","vendor-chunks/openai","vendor-chunks/form-data-encoder","vendor-chunks/whatwg-url","vendor-chunks/agentkeepalive","vendor-chunks/tr46","vendor-chunks/web-streams-polyfill","vendor-chunks/node-fetch","vendor-chunks/webidl-conversions","vendor-chunks/ms","vendor-chunks/humanize-ms","vendor-chunks/event-target-shim","vendor-chunks/abort-controller"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fnl2sql%2Froute&page=%2Fapi%2Fnl2sql%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnl2sql%2Froute.ts&appDir=%2FUsers%2Fakhil%2FDesktop%2FProjects%2FText-SQL-Visualization%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fakhil%2FDesktop%2FProjects%2FText-SQL-Visualization&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();