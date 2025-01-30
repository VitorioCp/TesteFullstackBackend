import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Container, TextField, Button, MenuItem } from "@mui/material";
import { Item } from "../types/types";



function AddItemToCart() {
  const { id } = useParams();
  const [itemId, setItemId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidadeMedida, setUnidadeMedida] = useState("");
  const [itens, setItens] = useState<Item[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/item").then((response) => {
      setItens(response.data);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api.post(`/carrinho/${id}/item`, { ProdutoId: Number(itemId), quantidade: Number(quantidade), unidadeMedida })
      .then(() => navigate("/cartlist"))
      .catch((error) => console.error("Erro ao adicionar item ao carrinho!", error, console.log(itemId)));
  };

  return (
    <Container>
      <h2>Adicionar Item ao Carrinho</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Item"
          fullWidth
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          required
          margin="normal"
        >
          {itens.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.produto.nome}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Quantidade"
          fullWidth
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          required
          margin="normal"
          type="number"
        />
        <TextField
          select
          label="Unidade de Medida"
          fullWidth
          value={unidadeMedida}
          onChange={(e) => setUnidadeMedida(e.target.value)}
          required
          margin="normal"
        >
          <MenuItem value="kg">Kg</MenuItem>
          <MenuItem value="litro">Litro</MenuItem>
          <MenuItem value="unidade">Unidade</MenuItem>
        </TextField>
        <Button type="submit" variant="contained">
          Adicionar Item
        </Button>
      </form>
    </Container>
  );
}

export default AddItemToCart;