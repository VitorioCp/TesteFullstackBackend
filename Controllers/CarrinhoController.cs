using FullstackTestAPI.Data;
using FullstackTestAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FullstackTestAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarrinhoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CarrinhoController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetCarrinhos()
        {
            var carrinhos = _context.Carrinhos.Include(c => c.ItensCarrinho).ThenInclude(i => i.Produto).ToList();
            return Ok(carrinhos);
        }

        [HttpPost("{id}/item")]
        public IActionResult AddItemToCarrinho(int id, [FromBody] Item item)
        {
            var carrinho = _context.Carrinhos.Include(c => c.ItensCarrinho).FirstOrDefault(c => c.Id == id);
            if (carrinho == null)
            {
                return NotFound("Carrinho não encontrado.");
            }

            var produto = _context.Produtos.Find(item.ProdutoId);
            if (produto == null)
            {
                return BadRequest("Produto não encontrado.");
            }

            item.Produto = produto; 
            carrinho.ItensCarrinho.Add(item); 

            _context.SaveChanges();

            return CreatedAtAction(nameof(GetCarrinho), new { id = carrinho.Id }, carrinho);
        }

        [HttpGet("filtrar")]
        public IActionResult GetCarrinhosFiltrados([FromQuery] string identificador)
        {
            if (string.IsNullOrEmpty(identificador))
            {
                return BadRequest("O parâmetro de identificador é obrigatório.");
            }

            var carrinhos = _context.Carrinhos
                .Include(c => c.ItensCarrinho)
                .ThenInclude(i => i.Produto)
                .Where(c => EF.Functions.Like(c.Identificador.ToLower(), $"%{identificador.ToLower()}%"))
                .ToList();

            if (carrinhos.Count == 0)
            {
                return NotFound("Nenhum carrinho encontrado com esse identificador.");
            }

            return Ok(carrinhos);
        }

        [HttpGet("{id}")]
        public IActionResult GetCarrinho(int id)
        {
            var carrinho = _context.Carrinhos.Include(c => c.ItensCarrinho).ThenInclude(i => i.Produto).FirstOrDefault(c => c.Id == id);

            if (carrinho == null)
                return NotFound();

            return Ok(carrinho);
        }

        [HttpPost]
        public IActionResult AddCarrinho(Carrinho carrinho)
        {
            _context.Carrinhos.Add(carrinho);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetCarrinho), new { id = carrinho.Id }, carrinho);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCarrinho(int id, Carrinho updatedCarrinho)
        {
            var carrinho = _context.Carrinhos.Include(c => c.ItensCarrinho).FirstOrDefault(c => c.Id == id);

            if (carrinho == null)
                return NotFound();

            carrinho.Identificador = updatedCarrinho.Identificador;
            carrinho.ItensCarrinho = updatedCarrinho.ItensCarrinho;

            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCarrinho(int id)
        {
            var carrinho = _context.Carrinhos.Include(c => c.ItensCarrinho).FirstOrDefault(c => c.Id == id);
            if (carrinho == null)
                return NotFound();

            if (carrinho.ItensCarrinho != null && carrinho.ItensCarrinho.Any())
            {
                _context.Itens.RemoveRange(carrinho.ItensCarrinho);
            }

            _context.Carrinhos.Remove(carrinho);
            _context.SaveChanges();

            return NoContent();
        }

    }
}