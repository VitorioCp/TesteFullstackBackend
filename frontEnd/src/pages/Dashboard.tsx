import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Container, Card, CardContent, Typography, Grid, Button } from "@mui/material";

function Dashboard() {
  const [counts, setCounts] = useState({ produtos: 0, itens: 0, carrinhos: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get("/produto").then((res) => res.data.length),
      api.get("/item").then((res) => res.data.length),
      api.get("/carrinho").then((res) => res.data.length),
    ]).then(([produtos, itens, carrinhos]) => {
      setCounts({ produtos, itens, carrinhos });
    });
  }, []);

  return (
    <Container>
      <h2>Dashboard</h2>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card> 
            <CardContent>
              <Typography variant="h5">Produtos</Typography>
              <Typography variant="h6">{counts.produtos}</Typography>
              <Button variant="contained" onClick={() => navigate("/produtos")}>
                Ver Produtos
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Itens</Typography>
              <Typography variant="h6">{counts.itens}</Typography>
              <Button variant="contained" onClick={() => navigate("/itens")}>
                Ver Itens
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Carrinhos</Typography>
              <Typography variant="h6">{counts.carrinhos}</Typography>
              <Button variant="contained" onClick={() => navigate("/cartlist")}>
                Ver Carrinhos
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;