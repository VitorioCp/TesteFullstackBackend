import { useEffect, useState } from "react";
import api from "../services/api";
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Item {
  id: number;
  produto: { nome: string };
  quantidade: number;
  unidadeMedida: string;
}

function Itens() {
  const [itens, setItens] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/item").then((response) => {
      setItens(response.data);
    });
  }, []);

  const handleDelete = (id: number) => {
    api.delete(`/item/${id}`)
      .then(() => {
        setItens(itens.filter(item => item.id !== id));
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
          handleClose();
        })
        .catch((error) => console.error("Erro ao atualizar o item!", error));
    }
  };

  return (
    <Container>
      <h2>Lista de Itens</h2>
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
          {itens.map((item) => (
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