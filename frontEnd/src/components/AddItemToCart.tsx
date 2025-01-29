import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Container, TextField, Button, MenuItem } from "@mui/material";

interface Item {
  id: number;
  produto: { nome: string };
  quantidade: number;
  unidadeMedida: string;
}

function AddItemToCart() {
  const { id, itemId: editItemId } = useParams(); // ID do carrinho e ID do item para edição
  const [itemId, setItemId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidadeMedida, setUnidadeMedida] = useState("");
  const [itens, setItens] = useState<Item[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/item").then((response) => {
      setItens(response.data);
    });

    if (editItemId) {
      // Carregar dados do item para edição
      api.get(`/item/${editItemId}`).then((response) => {
        const item = response.data;
        setItemId(item.produto.id);
        setQuantidade(item.quantidade);
        setUnidadeMedida(item.unidadeMedida);
      });
    }
  }, [editItemId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { produtoId: Number(itemId), quantidade: Number(quantidade), unidadeMedida };

    if (editItemId) {
      // Atualizar item existente
      api.put(`/carrinho/${id}/item/${editItemId}`, data)
        .then(() => navigate("/cartlist"))
        .catch((error) => console.error("Erro ao atualizar item no carrinho!", error));
    } else {
      // Adicionar novo item
      api.post(`/carrinho/${id}/item`, data)
        .then(() => navigate("/cartlist"))
        .catch((error) => console.error("Erro ao adicionar item ao carrinho!", error));
    }
  };

  return (
    <Container>
      <h2>{editItemId ? "Editar Item do Carrinho" : "Adicionar Item ao Carrinho"}</h2>
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
          {editItemId ? "Atualizar Item" : "Adicionar Item"}
        </Button>
      </form>
    </Container>
  );
}

export default AddItemToCart;