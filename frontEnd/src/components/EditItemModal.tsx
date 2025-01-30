import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { EditItemModalProps } from "../types/types";


const EditItemModal: React.FC<EditItemModalProps> = ({ open, item, onClose, onSave, setItem }) => {
  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Item</DialogTitle>
      <DialogContent>
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
          onChange={(e) => setItem({ ...item, quantidade: Number(e.target.value) })}
        />
        <TextField
          label="Unidade de Medida"
          fullWidth
          margin="normal"
          value={item.unidadeMedida}
          onChange={(e) => setItem({ ...item, unidadeMedida: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={onSave} color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditItemModal;