using System.Net;
using System.Text.Json;

namespace TransactionHandlerApi.Middleware
{
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlerMiddleware> _logger;
        private readonly IHostEnvironment _environment;

        public ErrorHandlerMiddleware(
            RequestDelegate next,
            ILogger<ErrorHandlerMiddleware> logger,
            IHostEnvironment environment)
        {
            _next = next;
            _logger = logger;
            _environment = environment;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception error)
            {
                _logger.LogError(error, "An unhandled exception occurred.");
                
                var response = context.Response;
                response.ContentType = "application/json";
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                
                var errorResponse = new
                {
                    message = _environment.IsDevelopment() 
                        ? error.Message 
                        : "An unexpected error occurred.",
                    stackTrace = _environment.IsDevelopment() ? error.StackTrace : null
                };
                
                var json = JsonSerializer.Serialize(errorResponse);
                await response.WriteAsync(json);
            }
        }
    }
    
    // Extension method to add the middleware to the HTTP request pipeline.
    public static class ErrorHandlerMiddlewareExtensions
    {
        public static IApplicationBuilder UseErrorHandler(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ErrorHandlerMiddleware>();
        }
    }
}
