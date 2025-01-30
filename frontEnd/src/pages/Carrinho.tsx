import { useEffect, useState } from "react";
import api from "../services/api";
import { Container, TextField, Button } from "@mui/material";
import { Carrinho } from "../types/types";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch";
import CarrinhoTable from "../components/CarrinhoTable";
import EditCarrinhoModal from "../components/EditCarrinhoModal";

function CarrinhoList() {
  const [carrinhos, setCarrinhos] = useState<Carrinho[]>([]);
  const [filteredCarrinhos, setFilteredCarrinhos] = useState<Carrinho[]>([]);
  const [selectedCarrinho, setSelectedCarrinho] = useState<Carrinho | null>(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.get("/carrinho").then((response) => {
      setCarrinhos(response.data);
      setFilteredCarrinhos(response.data);
    });
  }, []);

  useDebouncedSearch(searchTerm, 500, (term) => {
    if (term === "") {
      setFilteredCarrinhos(carrinhos);
    } else {
      api.get(`/carrinho/filtrar`, { params: { identificador: term } }).then((response) => {
        setFilteredCarrinhos(response.data);
      }).catch((error) => {
        console.error("Erro ao buscar carrinhos filtrados", error);
      });
    }
  });

  const handleDelete = (id: number) => {
    api.delete(`/carrinho/${id}`)
      .then(() => {
        setCarrinhos(carrinhos.filter(carrinho => carrinho.id !== id));
        setFilteredCarrinhos(filteredCarrinhos.filter(carrinho => carrinho.id !== id));
      })
      .catch((error) => console.error("Erro ao deletar o carrinho!", error));
  };

  const handleEdit = (carrinho: Carrinho) => {
    setSelectedCarrinho(carrinho);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCarrinho(null);
  };

  const handleSave = (carrinho: Carrinho) => {
    api.put(`/carrinho/${carrinho.id}`, carrinho)
      .then(() => {
        setCarrinhos(carrinhos.map(c => c.id === carrinho.id ? carrinho : c));
        setFilteredCarrinhos(filteredCarrinhos.map(c => c.id === carrinho.id ? carrinho : c));
        handleClose();
      })
      .catch((error) => console.error("Erro ao atualizar o carrinho!", error));
  };

  return (
    <>
      <Container>
        <h2>Lista de Carrinhos</h2>
        <TextField
          label="Pesquisar"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" href="/carrinhos/novo">Novo Carrinho</Button>
        <CarrinhoTable
          carrinhos={filteredCarrinhos}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Container>

      <EditCarrinhoModal
        open={open}
        carrinho={selectedCarrinho}
        onClose={handleClose}
        onSave={handleSave}
        setCarrinho={setSelectedCarrinho}
      />
    </>
  );
}

export default CarrinhoList;