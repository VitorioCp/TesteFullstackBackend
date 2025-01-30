using FullstackTestAPI.Data;
using FullstackTestAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace FullstackTestAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProdutoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProdutoController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Filtrar produtos por nome
        [HttpGet("filtrar")]
        public IActionResult GetProdutosFiltrados([FromQuery] string nome)
        {
            if (string.IsNullOrEmpty(nome))
            {
                return BadRequest("O parâmetro de nome é obrigatório.");
            }

            // Filtrando de forma insensível a maiúsculas/minúsculas
            var produtos = _context.Produtos
                .Where(p => p.Nome.ToLower().Contains(nome.ToLower()))
                .ToList();

            if (produtos.Count == 0)
            {
                return NotFound("Nenhum produto encontrado com esse nome.");
            }

            return Ok(produtos);
        }
        [HttpGet]
        public IActionResult GetProdutos([FromQuery] string? nome)
        {
            var produtos = _context.Produtos.AsQueryable();

            if (!string.IsNullOrEmpty(nome))
            {
                produtos = produtos.Where(p => p.Nome.ToLower().Contains(nome.ToLower()));
            }

            return Ok(produtos.ToList());
        }

        [HttpPost]
        public IActionResult AddProduto(Produto produto)
        {
            _context.Produtos.Add(produto);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetProdutos), new { id = produto.Id }, produto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateProduto(int id, Produto produto)
        {
            if (id != produto.Id)
            {
                return BadRequest();
            }

            _context.Entry(produto).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProduto(int id)
        {
            var produto = _context.Produtos.Find(id);
            if (produto == null)
            {
                return NotFound();
            }

            _context.Produtos.Remove(produto);
            _context.SaveChanges();
            return NoContent();
        }

    }
}
