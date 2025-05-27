App instructions
---------------
I want to create a .net core 8 app web api called TransactionHandlerApi
The architecture i ll use is Controller service repository.

✅ Project Structure
Keep it clean and organized: Use folders like Controllers, Models, Services, Repositories, etc.

Use separate classes for business logic (Service) and data access (Repository).

✅ Routing & Controllers
Use attribute routing (e.g., [HttpGet("{id}")]) for clarity.

Keep controllers thin — delegate logic to services.

✅ Dependency Injection
Register services in Startup.cs / Program.cs using AddScoped, AddTransient, or AddSingleton.

Never use new to create services directly in controllers.

✅ Model Validation
Use [Required], [StringLength], etc., on your model properties.

Check ModelState.IsValid in your controller actions if not using automatic validation middleware.

✅ Error Handling
Use global exception handling via Middleware or UseExceptionHandler().

Return consistent error formats (e.g., a custom error response object).

✅ Logging
Use ILogger<T> for structured logging.

Log useful events, warnings, and errors — not sensitive data.

✅ Security
Use HTTPS.

Apply authentication (e.g., JWT) and authorization via [Authorize].

Never trust user input — always validate and sanitize.

✅ Entity Framework (if used)
Use async/await with EF Core.

Use DTOs/ViewModels to avoid exposing DB entities directly.

✅ API Versioning
Add versioning early (e.g., via Microsoft.AspNetCore.Mvc.Versioning) to support future changes.

✅ Swagger / OpenAPI
Use Swashbuckle.AspNetCore for auto-generating API docs.

Enable Swagger in development for easy testing.

✅ Performance Tips
Use AsNoTracking() in EF Core when read-only.

Avoid large payloads — consider pagination and filtering.

