import { Table, TableBody, TableCell, TableHead, TableRow, Button } from "@mui/material";
import { ProdutoTableProps } from "../types/types";



const ProdutoTable: React.FC<ProdutoTableProps> = ({ produtos, onEdit, onDelete }) => {
  return (
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
                onClick={() => onEdit(produto)}
                style={{ marginRight: '8px' }}
              >
                Editar
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => onDelete(produto.id)}
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

export default ProdutoTable;