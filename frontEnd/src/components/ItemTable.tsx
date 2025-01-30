import { Table, TableBody, TableCell, TableHead, TableRow, Button } from "@mui/material";
import { Item, ItemTableProps } from "../types/types";



const ItemTable: React.FC<ItemTableProps> = ({ itens, onEdit, onDelete }) => {
  return (
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
                onClick={() => onEdit(item)}
                style={{ marginRight: '8px' }}
              >
                Editar
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => onDelete(item.id)}
              >
                Deletar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ItemTable;