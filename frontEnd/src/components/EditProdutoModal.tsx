import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { EditProdutoModalProps } from "../types/types";



const EditProdutoModal: React.FC<EditProdutoModalProps> = ({ open, produto, onClose, onSave, setProduto }) => {
  if (!produto) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Produto</DialogTitle>
      <DialogContent>
        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          value={produto.nome}
          onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
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

export default EditProdutoModal;