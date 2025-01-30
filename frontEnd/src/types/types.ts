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