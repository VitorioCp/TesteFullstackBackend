import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

function Header() {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Meu App
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/produtos">
            Produtos
          </Button>
          <Button color="inherit" component={Link} to="/itens">
            Itens
          </Button>
          <Button color="inherit" component={Link} to="/cartlist">
            Carrinho
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;