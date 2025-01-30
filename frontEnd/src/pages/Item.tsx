import { useEffect, useState } from "react";
import api from "../services/api";
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

interface Item {
  id: number;
  produto: { nome: string };
  quantidade: number;
  unidadeMedida: string;
}

function Itens() {
  const [itens, setItens] = useState<Item[]>([]);
  const [filteredItens, setFilteredItens] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Carregar itens no useEffect
  useEffect(() => {
    api.get("/item").then((response) => {
      setItens(response.data);
      setFilteredItens(response.data);
    });
  }, []);

  // Realizar a filtragem ao mudar o termo de pesquisa
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm === "") {
        setFilteredItens(itens); // Se não houver filtro, mostra todos os itens
      } else {
        api.get(`/item/filtrar?nome=${searchTerm}`).then((response) => {
          setFilteredItens(response.data);
        }).catch((error) => {
          console.error("Erro ao buscar itens filtrados", error);
        });
      }
    }, 500); // Debounce de 500ms para evitar muitas requisições

    return () => clearTimeout(delayDebounceFn); // Limpa o timeout ao sair do componente
  }, [searchTerm, itens]);

  const handleDelete = (id: number) => {
    api.delete(`/item/${id}`)
      .then(() => {
        setItens(itens.filter(item => item.id !== id));
        setFilteredItens(filteredItens.filter(item => item.id !== id)); // Atualiza a lista filtrada
      })
      .catch((error) => console.error("Erro ao deletar o item!", error));
  };

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const handleSave = () => {
    if (selectedItem) {
      api.put(`/item/${selectedItem.id}`, selectedItem)
        .then(() => {
          setItens(itens.map(i => i.id === selectedItem.id ? selectedItem : i));
          setFilteredItens(filteredItens.map(i => i.id === selectedItem.id ? selectedItem : i)); // Atualiza a lista filtrada
          handleClose();
        })
        .catch((error) => console.error("Erro ao atualizar o item!", error));
    }
  };

  return (
    <Container>
      <h2>Lista de Itens</h2>
      <TextField
        label="Pesquisar"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o searchTerm
      />
      <Button variant="contained" href="/itens/novo">Novo Item</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Produto</TableCell>
            <TableCell>Quantidade</TableCell>
            <TableCell>Unidade de Medida</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredItens.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.produto?.nome}</TableCell>
              <TableCell>{item.quantidade}</TableCell>
              <TableCell>{item.unidadeMedida}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEdit(item)}
                  style={{ marginRight: '8px' }}
                >
                  Editar
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDelete(item.id)}
                >
                  Deletar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Item</DialogTitle>
        <DialogContent>
          <TextField
            label="Produto"
            fullWidth
            margin="normal"
            value={selectedItem?.produto.nome || ''}
            disabled
          />
          <TextField
            label="Quantidade"
            fullWidth
            margin="normal"
            type="number"
            value={selectedItem?.quantidade || ''}
            onChange={(e) => setSelectedItem({ ...selectedItem!, quantidade: Number(e.target.value) })}
          />
          <TextField
            label="Unidade de Medida"
            fullWidth
            margin="normal"
            value={selectedItem?.unidadeMedida || ''}
            onChange={(e) => setSelectedItem({ ...selectedItem!, unidadeMedida: e.target.value })}
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

export default Itens;
