import { useEffect, useState } from "react";
import api from "../services/api";
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

interface Item {
  id: number;
  produto: { nome: string };
  quantidade: number;
  unidadeMedida: string;
}

interface Carrinho {
  id: number;
  identificador: string;
  itensCarrinho: Item[];
}

function CarrinhoList() {
  const [carrinhos, setCarrinhos] = useState<Carrinho[]>([]);
  const [filteredCarrinhos, setFilteredCarrinhos] = useState<Carrinho[]>([]);
  const [selectedCarrinho, setSelectedCarrinho] = useState<Carrinho | null>(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/carrinho").then((response) => {
      setCarrinhos(response.data);
      setFilteredCarrinhos(response.data);
    });
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm === "") {
        setFilteredCarrinhos(carrinhos); // Se não houver filtro, mostra todos os carrinhos
      } else {
        api.get(`/carrinho/filtrar?nome=${searchTerm}`).then((response) => {
          setFilteredCarrinhos(response.data);
        }).catch((error) => {
          console.error("Erro ao buscar carrinhos filtrados", error);
        });
      }
    }, 500); // Debounce de 500ms para evitar muitas requisições

    return () => clearTimeout(delayDebounceFn); // Limpa o timeout ao sair do componente
  }, [searchTerm, carrinhos]);

  const handleDelete = (id: number) => {
    api.delete(`/carrinho/${id}`)
      .then(() => {
        setCarrinhos(carrinhos.filter(carrinho => carrinho.id !== id));
        setFilteredCarrinhos(filteredCarrinhos.filter(carrinho => carrinho.id !== id)); // Atualiza a lista filtrada
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

  const handleSave = () => {
    if (selectedCarrinho) {
      api.put(`/carrinho/${selectedCarrinho.id}`, selectedCarrinho)
        .then(() => {
          setCarrinhos(carrinhos.map(c => c.id === selectedCarrinho.id ? selectedCarrinho : c));
          setFilteredCarrinhos(filteredCarrinhos.map(c => c.id === selectedCarrinho.id ? selectedCarrinho : c)); // Atualiza a lista filtrada
          handleClose();
        })
        .catch((error) => console.error("Erro ao atualizar o carrinho!", error));
    }
  };

  return (
    <>
      <Header />
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Identificador</TableCell>
              <TableCell>Itens</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCarrinhos.map((carrinho) => (
              <TableRow key={carrinho.id}>
                <TableCell>{carrinho.id}</TableCell>
                <TableCell>{carrinho.identificador}</TableCell>
                <TableCell>
                  {carrinho.itensCarrinho.length > 0 ? (
                    carrinho.itensCarrinho.map((item) => (
                      <div key={item.id}>
                        {item.produto.nome} - {item.quantidade} {item.unidadeMedida}
                      </div>
                    ))
                  ) : (
                    <span>Sem itens</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/carrinhos/${carrinho.id}/adicionar-item`)}
                  >
                    Adicionar Itens
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(carrinho)}
                    style={{ marginRight: '8px', marginLeft: '8px' }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(carrinho.id)}
                    style={{ marginRight: '8px' }}
                  >
                    Deletar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Carrinho</DialogTitle>
        <DialogContent>
          <TextField
            label="Identificador"
            fullWidth
            margin="normal"
            value={selectedCarrinho?.identificador || ''}
            onChange={(e) => setSelectedCarrinho({ ...selectedCarrinho!, identificador: e.target.value })}
          />
          {selectedCarrinho?.itensCarrinho.map((item, index) => (
            <div key={item.id}>
              <TextField
                label="Produto"
                fullWidth
                margin="normal"
                value={item.produto.nome}
                disabled
              />
              <TextField
                label="Quantidade"
                fullWidth
                margin="normal"
                type="number"
                value={item.quantidade}
                onChange={(e) => {
                  const updatedItems = [...selectedCarrinho.itensCarrinho];
                  updatedItems[index] = { ...updatedItems[index], quantidade: Number(e.target.value) };
                  setSelectedCarrinho({ ...selectedCarrinho, itensCarrinho: updatedItems });
                }}
              />
              <TextField
                label="Unidade de Medida"
                fullWidth
                margin="normal"
                value={item.unidadeMedida}
                onChange={(e) => {
                  const updatedItems = [...selectedCarrinho.itensCarrinho];
                  updatedItems[index] = { ...updatedItems[index], unidadeMedida: e.target.value };
                  setSelectedCarrinho({ ...selectedCarrinho, itensCarrinho: updatedItems });
                }}
              />
            </div>
          ))}
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
    </>
  );
}

export default CarrinhoList;