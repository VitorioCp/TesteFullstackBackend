import { useEffect, useState } from "react";
import api from "../services/api";
import { Container, TextField, Button } from "@mui/material";
import { Produto } from "../types/types";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch";
import ProdutoTable from "../components/ProdutoTable";
import EditProdutoModal from "../components/EditProdutoModal";

function ProdutoList() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filteredProdutos, setFilteredProdutos] = useState<Produto[]>([]);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.get("/produto").then((response) => {
      setProdutos(response.data);
      setFilteredProdutos(response.data);
    });
  }, []);

  useDebouncedSearch(searchTerm, 500, (term) => {
    if (term === "") {
      setFilteredProdutos(produtos);
    } else {
      api.get(`/produto/filtrar`, { params: { nome: term } }).then((response) => {
        setFilteredProdutos(response.data);
      }).catch((error) => {
        console.error("Erro ao buscar produtos filtrados", error);
      });
    }
  });

  const handleDelete = (id: number) => {
    api.delete(`/produto/${id}`)
      .then(() => {
        setProdutos(produtos.filter(produto => produto.id !== id));
        setFilteredProdutos(filteredProdutos.filter(produto => produto.id !== id));
      })
      .catch((error) => console.error("Erro ao deletar o produto!", error));
  };

  const handleEdit = (produto: Produto) => {
    setSelectedProduto(produto);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduto(null);
  };

  const handleSave = () => {
    if (selectedProduto) {
      api.put(`/produto/${selectedProduto.id}`, selectedProduto)
        .then(() => {
          setProdutos(produtos.map(p => p.id === selectedProduto.id ? selectedProduto : p));
          setFilteredProdutos(filteredProdutos.map(p => p.id === selectedProduto.id ? selectedProduto : p));
          handleClose();
        })
        .catch((error) => console.error("Erro ao atualizar o produto!", error));
    }
  };

  return (
    <Container>
      <h2>Lista de Produtos</h2>
      <TextField
        label="Pesquisar"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button variant="contained" href="/produtos/novo" sx={{ mb: 2 }}>
        Novo Produto
      </Button>
      <ProdutoTable
        produtos={filteredProdutos}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EditProdutoModal
        open={open}
        produto={selectedProduto}
        onClose={handleClose}
        onSave={handleSave}
        setProduto={setSelectedProduto}
      />
    </Container>
  );
}

export default ProdutoList;