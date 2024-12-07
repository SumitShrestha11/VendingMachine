import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useState } from "react";
import { PRODUCTS } from "../../constants/Products";
import Payment from "../Payment/Payment";

const VendingMachine = () => {
  // const products = PRODUCTS;
  const [products, setProduct] = useState([...PRODUCTS]);
  const [balances, setBalances] = useState({ coins: 100, cash: 200 });

  const productsQuantityObject = PRODUCTS.reduce((acc, product) => {
    acc[product.id] = { stock: product.stock, selected: 0 };
    return acc;
  }, {} as Record<number, { stock: number; selected: number }>);
  const [productsQuantity, setProductsQuantity] = useState<
    Record<number, { stock: number; selected: number }>
  >(productsQuantityObject);

  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const selectedProducts = products?.filter(
    (product) => productsQuantity?.[product.id]?.selected > 0
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Vending Machine
      </Typography>

      <Typography variant="subtitle1">
        Available Balance: Coins {balances.coins} | Cash {balances.cash}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {products.map((product) => (
          <Grid size={{ xs: 12, sm: 4 }} key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography>Price: Rs.{product.price}</Typography>
                <Typography>
                  Stock: {productsQuantity?.[product.id]?.stock ?? 0}
                </Typography>
                <Stack
                  direction="row"
                  gap={2}
                  sx={{ mt: 2 }}
                  alignItems="center"
                >
                  <Box alignItems="center" justifyContent="center">
                    <IconButton
                      color="error"
                      disabled={productsQuantity?.[product.id]?.selected === 0}
                      onClick={() => {
                        setProductsQuantity((prev) => ({
                          ...prev,
                          [product.id]: {
                            stock: prev[product.id].stock + 1,
                            selected: prev[product.id].selected - 1,
                          },
                        }));
                      }}
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </Box>

                  <Box alignItems="center" justifyContent="center">
                    <Typography>
                      {productsQuantity?.[product.id]?.selected || 0}
                    </Typography>
                  </Box>

                  <Box alignItems="center" justifyContent="center">
                    <IconButton
                      color="success"
                      disabled={productsQuantity?.[product.id]?.stock === 0}
                      onClick={() => {
                        setProductsQuantity((prev) => ({
                          ...prev,
                          [product.id]: {
                            stock: prev[product.id].stock - 1,
                            selected: prev[product.id].selected + 1,
                          },
                        }));
                      }}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedProducts.length > 0 && (
        <>
          <Paper sx={{ mt: 2, p: 2 }}>
            <Typography variant="h6">Your Basket</Typography>
            <Grid container spacing={1} sx={{ mt: 2 }}>
              {selectedProducts.map((product) => (
                <React.Fragment key={product.id}>
                  <Grid size={{ xs: 8 }}>
                    <Typography>
                      {product.name} x{" "}
                      {productsQuantity?.[product.id]?.selected}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }} sx={{ textAlign: "right" }}>
                    <Typography>
                      Rs.{" "}
                      {product.price * productsQuantity?.[product.id]?.selected}
                    </Typography>
                  </Grid>
                </React.Fragment>
              ))}
              <Grid size={{ xs: 8 }}>
                <Typography variant="h6">Total</Typography>
              </Grid>
              <Grid size={{ xs: 4 }} sx={{ textAlign: "right" }}>
                <Typography variant="h6">
                  Rs.{" "}
                  {selectedProducts.reduce(
                    (acc, product) =>
                      acc +
                      product.price * productsQuantity?.[product.id]?.selected,
                    0
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
          <Stack
            direction="row"
            gap={2}
            sx={{ mt: 2 }}
            alignItems="center"
            justifyContent="flex-end"
          >
            <Box alignItems="center" justifyContent="center">
              <Button variant="contained" color="warning" onClick={() => {}}>
                Refund
              </Button>
            </Box>
            <Box alignItems="center" justifyContent="center">
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  setIsPaymentDialogOpen(true);
                }}
              >
                Proceed to Payment
              </Button>
            </Box>
          </Stack>
        </>
      )}

      {/* Payment Dialog */}
      <Dialog
        open={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
      >
        <DialogTitle>Make Payment</DialogTitle>
        <DialogContent>
          <Payment
            selectedProducts={selectedProducts.map((product) => ({
              ...product,
              selected: productsQuantity?.[product.id]?.selected,
            }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPaymentDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setIsPaymentDialogOpen(false);
            }}
            color="primary"
            variant="contained"
          >
            Confirm Purchase
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VendingMachine;
