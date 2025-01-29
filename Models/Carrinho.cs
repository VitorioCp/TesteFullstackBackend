namespace FullstackTestAPI.Models
{
    public class Carrinho
    {
        public int Id { get; set; }
        public string Identificador { get; set; }
        public List<Item>? ItensCarrinho { get; set; }
    }
}
