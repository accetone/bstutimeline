using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Data.Entity;
using site.Data;
using site.Data.Abscract;
using site.Options;

namespace site
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddJsonFile("privatesettings.json");

            if (env.IsEnvironment("Development"))
            {
                builder.AddApplicationInsightsSettings(developerMode: true);
            }

            builder.AddEnvironmentVariables();
            Configuration = builder.Build()
                .ReloadOnChanged("appsettings.json")
                .ReloadOnChanged("privatesettings.json");
        }

        public IConfigurationRoot Configuration { get; set; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddApplicationInsightsTelemetry(Configuration);

            services.AddMvc();

            var connectionString = Configuration["db:bstu-mssql"];

            services.AddEntityFramework()
                .AddSqlServer()
                .AddDbContext<DataContext>(options => options.UseSqlServer(connectionString));

            services.AddScoped<IDataContext>(provider => provider.GetService<DataContext>());
            services.AddScoped<INewsRepository, NewsRepository>();
            services.AddScoped<INewsService, NewsService>();

            services.Configure<FileSystem>(options =>
            {
                options.ThumbsPath = Configuration["fs:thumbs-path"];
                options.ThumbsDesktopFilename = Configuration["fs:thumbs-desktop-filename"];
                options.ThumbsMobileFilename = Configuration["fs:thumbs-mobile-filename"];
            });
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseIISPlatformHandler();

            app.UseApplicationInsightsRequestTelemetry();

            app.UseApplicationInsightsExceptionTelemetry();
            app.UseDefaultFiles(new Microsoft.AspNet.StaticFiles.DefaultFilesOptions { DefaultFileNames = new[] { "index.html" } });
            app.UseStaticFiles();
            
            app.UseMvc();
        }

        public static void Main(string[] args) => WebApplication.Run<Startup>(args);
    }
}
