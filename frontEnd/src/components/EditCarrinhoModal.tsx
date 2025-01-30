import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { EditCarrinhoModalProps } from "../types/types";



const EditCarrinhoModal: React.FC<EditCarrinhoModalProps> = ({ open, carrinho, onClose, onSave, setCarrinho }) => {
  if (!carrinho) return null;

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...carrinho.itensCarrinho];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setCarrinho({ ...carrinho, itensCarrinho: updatedItems });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Carrinho</DialogTitle>
      <DialogContent>
        <TextField
          label="Identificador"
          fullWidth
          margin="normal"
          value={carrinho.identificador}
          onChange={(e) => setCarrinho({ ...carrinho, identificador: e.target.value })}
        />
        {carrinho.itensCarrinho.map((item, index) => (
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
              onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)}
            />
            <TextField
              label="Unidade de Medida"
              fullWidth
              margin="normal"
              value={item.unidadeMedida}
              onChange={(e) => handleItemChange(index, 'unidadeMedida', e.target.value)}
            />
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={() => onSave(carrinho)} color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCarrinhoModal;