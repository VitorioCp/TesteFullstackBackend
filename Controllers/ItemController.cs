using FullstackTestAPI.Data;
using FullstackTestAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace FullstackTestAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ItemController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Listar todos os itens
        [HttpGet]
        public IActionResult GetItens()
        {
            var itens = _context.Itens.Include(i => i.Produto).ToList();
            return Ok(itens);
        }

        // Obter item por ID
        [HttpGet("{id}")]
        public IActionResult GetItem(int id)
        {
            var item = _context.Itens.Include(i => i.Produto).FirstOrDefault(i => i.Id == id);

            if (item == null)
                return NotFound();

            return Ok(item);
        }

        // Criar um novo item
        [HttpPost]
        public IActionResult AddItem(Item item)
        {
            // Verificar se o ProdutoId fornecido é válido
            var produto = _context.Produtos.FirstOrDefault(p => p.Id == item.ProdutoId);
            if (produto == null)
            {
                return BadRequest("Produto não encontrado.");
            }

            // Associar o produto ao item
            item.Produto = produto;

            // Adicionar o item ao banco de dados
            _context.Itens.Add(item);
            _context.SaveChanges();

            // Retornar o item recém-criado com o produto associado
            return CreatedAtAction(nameof(GetItem), new { id = item.Id }, item);
        }

        // Atualizar um item
        [HttpPut("{id}")]
        public IActionResult UpdateItem(int id, Item updatedItem)
        {
            var item = _context.Itens.Find(id);
            if (item == null)
                return NotFound();

            // Atualizar as propriedades do item com os valores fornecidos
            item.ProdutoId = updatedItem.ProdutoId;
            item.Quantidade = updatedItem.Quantidade;
            item.UnidadeMedida = updatedItem.UnidadeMedida;

            _context.SaveChanges();

            return NoContent();
        }

        // Filtro de itens por nome de produto
        [HttpGet("filtrar")]
        public IActionResult GetItensFiltrados([FromQuery] string nome)
        {
            if (string.IsNullOrEmpty(nome))
            {
                return BadRequest("O parâmetro de nome é obrigatório.");
            }

            // Filtrando de forma insensível a maiúsculas/minúsculas
            var itens = _context.Itens
                .Include(i => i.Produto)
                .Where(i => EF.Functions.Like(i.Produto.Nome.ToLower(), $"%{nome.ToLower()}%"))
                .ToList();

            if (itens.Count == 0)
            {
                return NotFound("Nenhum item encontrado com esse nome.");
            }

            return Ok(itens);
        }

        // Deletar um item
        [HttpDelete("{id}")]
        public IActionResult DeleteItem(int id)
        {
            var item = _context.Itens.Find(id);
            if (item == null)
                return NotFound();

            _context.Itens.Remove(item);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
