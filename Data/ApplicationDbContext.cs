using Microsoft.EntityFrameworkCore;
using FullstackTestAPI.Models;

namespace FullstackTestAPI.Data{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Item> Itens { get; set; }
        public DbSet<Carrinho> Carrinhos { get; set; }
    }
}