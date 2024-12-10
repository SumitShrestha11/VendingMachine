import {
  Divider,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { forwardRef, useImperativeHandle, useState } from "react";

export interface IPaymentRef {
  getPayment: () => { coins: number; cash: number };
}

const Payment = forwardRef<
  IPaymentRef,
  {
    selectedProducts: {
      id: string;
      name: string;
      stock: number;
      selected: number;
      price: number;
    }[];
  }
>(({ selectedProducts }, ref) => {
  const [coinPayment, setCoinPayment] = useState(0);
  const [cashPayment, setCashPayment] = useState(0);

  useImperativeHandle(
    ref,
    () => ({ getPayment: () => ({ coins: coinPayment, cash: cashPayment }) }),
    [coinPayment, cashPayment]
  );
  return (
    <>
      {selectedProducts.length > 0 && (
        <>
          <Grid container sx={{ mt: 2 }}>
            <Grid size={{ xs: 4 }}>
              <Typography sx={{ fontWeight: 700 }}>Product</Typography>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Typography sx={{ fontWeight: 700, textAlign: "end" }}>
                Quantity
              </Typography>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Typography sx={{ fontWeight: 700, textAlign: "end" }}>
                Price
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Divider sx={{ mt: 1, mb: 1 }} />
            </Grid>
            {selectedProducts.map((product) => (
              <React.Fragment key={product.id}>
                <Grid size={{ xs: 4 }}>
                  <Typography>{product.name}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography sx={{ textAlign: "end" }}>
                    {product.selected}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography sx={{ textAlign: "end" }}>
                    {product.price * product.selected}
                  </Typography>
                </Grid>
              </React.Fragment>
            ))}
            <Grid size={{ xs: 12 }}>
              <Divider sx={{ mt: 1, mb: 1 }} />
            </Grid>
            <Grid size={{ xs: 8 }}>
              <Typography sx={{ fontWeight: 700, textAlign: "end" }}>
                Total
              </Typography>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Typography sx={{ fontWeight: 700, textAlign: "end" }}>
                {selectedProducts.reduce(
                  (acc, product) => acc + product.price * product.selected,
                  0
                )}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <InputLabel htmlFor="coin-payment">Coin Payment</InputLabel>
                <Input
                  type="number"
                  id="coin-payment"
                  value={coinPayment}
                  onChange={(e) => {
                    if (Number(e.target.value) >= 0)
                      setCoinPayment(parseInt(e.target.value, 10));
                  }}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <InputLabel htmlFor="coin-payment">Cash Payment</InputLabel>
                <Input
                  type="number"
                  id="coin-payment"
                  value={cashPayment}
                  onChange={(e) => {
                    if (Number(e.target.value) >= 0)
                      setCashPayment(parseInt(e.target.value, 10));
                  }}
                  startAdornment={
                    <InputAdornment position="start">Rs.</InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
});

export default Payment;
