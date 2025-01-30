import { useState, useEffect } from "react";
import api from "../services/api";
import { Container, TextField, Button, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Produto } from "../types/types";


function ItemForm() {
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidadeMedida, setUnidadeMedida] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/produto").then((response) => {
      setProdutos(response.data);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api.post("/item", { produtoId: Number(produtoId), quantidade: Number(quantidade), unidadeMedida })
      .then(() => navigate("/itens"))
      .catch((error) => console.error("Erro ao criar o item!", error));
  };

  return (
    <Container>
      <h2>Novo Item</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Produto"
          fullWidth
          value={produtoId}
          onChange={(e) => setProdutoId(e.target.value)}
          required
          margin="normal"
        >
          {produtos.map((produto) => (
            <MenuItem key={produto.id} value={produto.id}>
              {produto.nome}
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
          Criar Item
        </Button>
      </form>
    </Container>
  );
}

export default ItemForm;