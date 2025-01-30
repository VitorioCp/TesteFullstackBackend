using FullstackTestAPI.Extensions;


var builder = WebApplication.CreateBuilder(args);
var corsPolicy = "_myAllowSpecificOrigins";


builder.Services.ConfigureDbContext(builder.Configuration);
builder.Services.ConfigureCors(corsPolicy);
builder.Services.AddControllers();

var app = builder.Build();

app.UseCors(corsPolicy);
app.MapControllers();

app.Run();

