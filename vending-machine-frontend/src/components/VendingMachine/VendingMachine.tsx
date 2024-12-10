import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "@toolpad/core";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  fetchAllProducts,
  getBalanceOfVendingMachine,
  purchaseProducts,
  refundProducts,
} from "../../api/vendingMachineAPI";
import { VendingMachineModes } from "../../enums/VendingMachineModes";
import Payment, { IPaymentRef } from "../Payment/Payment";

const VendingMachine = () => {
  const notifications = useNotifications();
  // const products = PRODUCTS;
  const queryClient = useQueryClient();
  const paymentRef = useRef<IPaymentRef | null>(null);
  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchAllProducts,
    refetchOnWindowFocus: false,
  });

  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useQuery({
    queryKey: ["balance"],
    queryFn: getBalanceOfVendingMachine,
  });

  const refundMutation = useMutation({
    mutationFn: refundProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
      notifications.show("Refund successful", {
        severity: "success",
        autoHideDuration: 3000,
      });
    },
    onError: () => {
      notifications.show("Refund failed", {
        severity: "error",
        autoHideDuration: 3000,
      });
    },
  });

  const purchaseMutaion = useMutation({
    mutationFn: purchaseProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
      notifications.show("Purchase successful", {
        severity: "success",
        autoHideDuration: 3000,
      });
    },
    onError: () => {
      notifications.show("Purchase failed", {
        severity: "error",
        autoHideDuration: 3000,
      });
    },
  });

  const [productsQuantity, setProductsQuantity] = useState<
    Record<string, { stock: number; selected: number }>
  >({});

  const [mode, setMode] = useState<VendingMachineModes>(
    VendingMachineModes.PURCHASE
  );

  const productsQuantityObject = useMemo(
    () =>
      productsData?.reduce(
        (acc, product) => {
          acc[product.id] = { stock: product.stock, selected: 0 };
          return acc;
        },
        {} as Record<string, { stock: number; selected: number }>
      ),
    [productsData]
  );

  useEffect(() => {
    // const productsQuantityObject = productsData?.reduce(
    //   (acc, product) => {
    //     acc[product.id] = { stock: product.stock, selected: 0 };
    //     return acc;
    //   },
    //   {} as Record<string, { stock: number; selected: number }>
    // );
    setProductsQuantity(productsQuantityObject ?? {});
  }, [productsQuantityObject]);

  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const selectedProducts = productsData?.filter(
    (product) => productsQuantity?.[product.id]?.selected > 0
  );

  const handleRefund = () => {
    if (selectedProducts) {
      refundMutation.mutate({
        items: selectedProducts.map((product) => ({
          productId: product.id,
          quantity: productsQuantity?.[product.id]?.selected ?? 0,
        })),
      });
    }
  };

  const handlePurchase = () => {
    if (selectedProducts && paymentRef.current) {
      const { coins, cash } = paymentRef.current.getPayment();
      purchaseMutaion.mutate({
        items: selectedProducts.map((product) => ({
          productId: product.id,
          quantity: productsQuantity?.[product.id]?.selected ?? 0,
        })),
        payment: {
          cash,
          coins,
        },
      });
    }
  };

  if (!productsData || productsError) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Vending Machine
      </Typography>

      <Typography variant="subtitle1">
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          Available Balance:{" "}
          {isBalanceLoading ? (
            <Skeleton width={100} />
          ) : (
            <span>
              Coins {balanceData?.coins ?? 0} | Cash {balanceData?.cash ?? 0}
            </span>
          )}
        </span>
      </Typography>

      <Tabs
        value={mode}
        onChange={(e, newValue) => {
          setProductsQuantity(productsQuantityObject ?? {});
          setMode(newValue);
        }}
        aria-label="switch between refund and purchase mode"
      >
        <Tab label="Purchase" value={VendingMachineModes.PURCHASE} />
        <Tab label="Refund" value={VendingMachineModes.REFUND} />
      </Tabs>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {isProductsLoading &&
          Array.from({ length: 3 })?.map((item) => (
            <Grid size={{ xs: 12, sm: 4 }} key={item}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    <Skeleton />
                  </Typography>
                  <Typography>
                    <Skeleton />
                  </Typography>
                  <Typography>
                    <Skeleton />
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        {productsData?.map((product) => (
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
                            stock:
                              mode === VendingMachineModes.PURCHASE
                                ? prev[product.id].stock - 1
                                : prev[product.id].stock,
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

      {(selectedProducts?.length ?? 0) > 0 && (
        <>
          <Paper sx={{ mt: 2, p: 2 }}>
            <Typography variant="h6">
              {mode === VendingMachineModes.PURCHASE
                ? "Your Order"
                : "Your Refund"}
            </Typography>
            <Grid container spacing={1} sx={{ mt: 2 }}>
              {selectedProducts?.map((product) => (
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
                  {selectedProducts?.reduce(
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
            {mode === VendingMachineModes.REFUND ? (
              <Box alignItems="center" justifyContent="center">
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => handleRefund()}
                  disabled={refundMutation.isPending}
                  startIcon={
                    refundMutation.isPending && <CircularProgress size={20} />
                  }
                >
                  Refund
                </Button>
              </Box>
            ) : (
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
            )}
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
            ref={paymentRef}
            selectedProducts={
              selectedProducts?.map((product) => ({
                ...product,
                selected: productsQuantity?.[product.id]?.selected,
              })) ?? []
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPaymentDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setIsPaymentDialogOpen(false);
              handlePurchase();
            }}
            color="primary"
            variant="contained"
            disabled={purchaseMutaion.isPending}
            startIcon={
              purchaseMutaion.isPending && <CircularProgress size={20} />
            }
          >
            Confirm Purchase
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VendingMachine;
