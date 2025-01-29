import { useState } from "react";
import api from "../services/api";
import { Container, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ProdutoForm() {
  const [nome, setNome] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api.post("/produto", { nome: nome })
      .then(() => navigate("/produtos"))
      .catch((error) => {
        console.error("There was an error creating the product!", error);
      });
  };

  return (
    <Container>
      <h2>Novo Produto</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome do Produto"
          fullWidth
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <Button type="submit" variant="contained">Salvar</Button>
      </form>
    </Container>
  );
}

export default ProdutoForm;