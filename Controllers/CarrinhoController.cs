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

        // Listar todos os carrinhos
        [HttpGet]
        public IActionResult GetCarrinhos()
        {
            var carrinhos = _context.Carrinhos.Include(c => c.ItensCarrinho).ThenInclude(i => i.Produto).ToList();
            return Ok(carrinhos);
        }

        // Adicionar um item ao carrinho
        [HttpPost("{id}/item")]
        public IActionResult AddItemToCarrinho(int id, [FromBody] Item item)
        {
            var carrinho = _context.Carrinhos.Include(c => c.ItensCarrinho).FirstOrDefault(c => c.Id == id);
            if (carrinho == null)
            {
                return NotFound("Carrinho não encontrado.");
            }

            // Associa o ProdutoId ao Item
            var produto = _context.Produtos.Find(item.ProdutoId);
            if (produto == null)
            {
                return BadRequest("Produto não encontrado.");
            }

            item.Produto = produto; // Associando o produto ao item
            carrinho.ItensCarrinho.Add(item); // Adiciona o item ao carrinho

            _context.SaveChanges();

            return CreatedAtAction(nameof(GetCarrinho), new { id = carrinho.Id }, carrinho);
        }

        // Filtro de carrinhos por identificador
        [HttpGet("filtrar")]
        public IActionResult GetCarrinhosFiltrados([FromQuery] string identificador)
        {
            if (string.IsNullOrEmpty(identificador))
            {
                return BadRequest("O parâmetro de identificador é obrigatório.");
            }

            // Filtrando de forma insensível a maiúsculas/minúsculas
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

        // Obter carrinho por ID
        [HttpGet("{id}")]
        public IActionResult GetCarrinho(int id)
        {
            var carrinho = _context.Carrinhos.Include(c => c.ItensCarrinho).ThenInclude(i => i.Produto).FirstOrDefault(c => c.Id == id);

            if (carrinho == null)
                return NotFound();

            return Ok(carrinho);
        }

        // Criar um novo carrinho
        [HttpPost]
        public IActionResult AddCarrinho(Carrinho carrinho)
        {
            _context.Carrinhos.Add(carrinho);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetCarrinho), new { id = carrinho.Id }, carrinho);
        }

        // Atualizar um carrinho
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

        // Deletar um carrinho
        [HttpDelete("{id}")]
        public IActionResult DeleteCarrinho(int id)
        {
            var carrinho = _context.Carrinhos.Include(c => c.ItensCarrinho).FirstOrDefault(c => c.Id == id);
            if (carrinho == null)
                return NotFound();

            // Remover os itens relacionados
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