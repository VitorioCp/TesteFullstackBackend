import { useState } from "react";
import api from "../services/api";
import { Container, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function CartForm() {
  const navigate = useNavigate();
  const [descricao, setDescricao] = useState("");

  const handleCreateCart = () => {
    api.post("/carrinho", { identificador : descricao })
      .then(() => navigate("/cartlist"))
      .catch((error) => console.error("Erro ao criar o carrinho!", error));
  };

  return (
    <Container>
      <h2>Novo Carrinho</h2>
      <TextField
        label="Descrição do Carrinho"
        fullWidth
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        required
        margin="normal"
      />
      <Button variant="contained" onClick={handleCreateCart}>
        Criar Carrinho
      </Button>
    </Container>
  );
}

export default CartForm;
