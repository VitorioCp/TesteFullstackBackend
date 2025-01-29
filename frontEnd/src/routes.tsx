import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProdutoList from "./pages/Produto";
import ProdutoForm from "./components/ProdutoForm";
import ItemForm from "./components/ItemForm";
import Itens from "./pages/Item";
import CartList from "./pages/Carrinho";
import CartForm from "./components/CartForm";
import AddItemToCart from "./components/AddItemToCart";
import Header from "./components/Header";


function AppRoutes() {
    return (
        <>
        <Router>
         <Header />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/produtos" element={<ProdutoList />} />
                <Route path="/produtos/novo" element={<ProdutoForm />} />

                <Route path="/cartlist" element={<CartList />} />
                <Route path="/carrinhos/novo" element={<CartForm />} />
                <Route path="/carrinhos/:id/adicionar-item" element={<AddItemToCart />} />


                <Route path="/itens" element={<Itens />} />
                <Route path="/itens/novo" element={<ItemForm />} />

                
            </Routes>
        </Router>
        </>
    );
}

export default AppRoutes;