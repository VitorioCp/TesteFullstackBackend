namespace FullstackTestAPI.Models
{
    public class Item
    {
        public int Id { get; set; }
        public int ProdutoId { get; set; }
        public Produto? Produto { get; set; }
        public int Quantidade { get; set; }
        public string UnidadeMedida { get; set; }
    }
}
