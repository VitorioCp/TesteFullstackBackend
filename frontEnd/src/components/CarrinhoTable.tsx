import { Table, TableBody, TableCell, TableHead, TableRow, Button } from "@mui/material";
import { CarrinhoTableProps } from "../types/types";
import { useNavigate } from "react-router-dom";



const CarrinhoTable: React.FC<CarrinhoTableProps> = ({ carrinhos, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
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
        {carrinhos.map((carrinho) => (
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
                onClick={() => onEdit(carrinho)}
                style={{ marginRight: '8px', marginLeft: '8px' }}
              >
                Editar
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => onDelete(carrinho.id)}
                style={{ marginRight: '8px' }}
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

export default CarrinhoTable;