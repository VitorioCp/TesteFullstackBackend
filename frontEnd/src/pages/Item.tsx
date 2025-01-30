import { useEffect, useState } from "react";
import api from "../services/api";
import { Container, TextField, Button } from "@mui/material";
import { Item } from "../types/types";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch";
import ItemTable from "../components/ItemTable";
import EditItemModal from "../components/EditItemModal";

function Itens() {
  const [itens, setItens] = useState<Item[]>([]);
  const [filteredItens, setFilteredItens] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.get("/item").then((response) => {
      setItens(response.data);
      setFilteredItens(response.data);
    });
  }, []);

  useDebouncedSearch(searchTerm, 500, (term) => {
    if (term === "") {
      setFilteredItens(itens);
    } else {
      api.get(`/item/filtrar`, { params: { nome: term } }).then((response) => {
        setFilteredItens(response.data);
      }).catch((error) => {
        console.error("Erro ao buscar itens filtrados", error);
      });
    }
  });

  const handleDelete = (id: number) => {
    api.delete(`/item/${id}`)
      .then(() => {
        setItens(itens.filter(item => item.id !== id));
        setFilteredItens(filteredItens.filter(item => item.id !== id));
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
          setFilteredItens(filteredItens.map(i => i.id === selectedItem.id ? selectedItem : i));
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
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button variant="contained" href="/itens/novo">
        Novo Item
      </Button>
      <ItemTable
        itens={filteredItens}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EditItemModal
        open={open}
        item={selectedItem}
        onClose={handleClose}
        onSave={handleSave}
        setItem={setSelectedItem}
      />
    </Container>
  );
}

export default Itens;