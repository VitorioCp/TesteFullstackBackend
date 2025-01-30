export interface Item {
    id: number;
    produto: { nome: string };
    quantidade: number;
    unidadeMedida: string;
}

export interface Carrinho {
    id: number;
    identificador: string;
    itensCarrinho: Item[];
}

export interface Produto {
    id: number;
    nome: string;
}

export interface EditItemModalProps {
    open: boolean;
    item: Item | null;
    onClose: () => void;
    onSave: () => void;
    setItem: (item: Item) => void;
}


export interface EditProdutoModalProps {
    open: boolean;
    produto: Produto | null;
    onClose: () => void;
    onSave: () => void;
    setProduto: (produto: Produto) => void;
}


export interface EditCarrinhoModalProps {
    open: boolean;
    carrinho: Carrinho | null;
    onClose: () => void;
    onSave: (carrinho: Carrinho) => void;
    setCarrinho: (carrinho: Carrinho) => void;
}


export interface CarrinhoTableProps {
    carrinhos: Carrinho[];
    onEdit: (carrinho: Carrinho) => void;
    onDelete: (id: number) => void;
}


export interface ItemTableProps {
    itens: Item[];
    onEdit: (item: Item) => void;
    onDelete: (id: number) => void;
}


export interface ProdutoTableProps {
    produtos: Produto[];
    onEdit: (produto: Produto) => void;
    onDelete: (id: number) => void;
  }