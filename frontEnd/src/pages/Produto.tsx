import { useEffect, useState } from "react";
import api from "../services/api";
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Produto {
  id: number;
  nome: string;
}

function ProdutoList() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get<Produto[]>("/produto").then((response) => {
      setProdutos(response.data);
    });
  }, []);

  const handleDelete = (id: number) => {
    api.delete(`/produto/${id}`)
      .then(() => {
        setProdutos(produtos.filter(produto => produto.id !== id));
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
          handleClose();
        })
        .catch((error) => console.error("Erro ao atualizar o produto!", error));
    }
  };

  return (
    <Container>
      <h2>Lista de Produtos</h2>
      <Button variant="contained" href="/produtos/novo">Novo Produto</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {produtos.map((produto) => (
            <TableRow key={produto.id}>
              <TableCell>{produto.id}</TableCell>
              <TableCell>{produto.nome}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEdit(produto)}
                  style={{ marginRight: '8px' }}
                >
                  Editar
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDelete(produto.id)}
                >
                  Deletar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Produto</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={selectedProduto?.nome || ''}
            onChange={(e) => setSelectedProduto({ ...selectedProduto!, nome: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ProdutoList;