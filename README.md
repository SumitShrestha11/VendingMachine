# Vending Machine

Just a simple vending machine where one can just insert the coin and get back the desired
drinks. The drinks at the vending machine can be purchased and refunded. The clear specs have
been listed below -:

## Specs

1. There are only three products available at the moment Coke cost (Rs 20), Pepsi cost (Rs
   25), and Dew cost (Rs 30)
2. If the amount entered is less than the actual cost the vending machine should not process
   further.
3. If the amount entered is higher than the actual cost the vending machine should calculate
   the cost and return the change
4. When purchased the stock of item should be decreased and the amount of Coins or Cash
   should increase
5. The items can be refunded which will increase the item stock and decrease the amount of
   Coin or Cash
6. Initial stock for items Coke 10, Pepsi 10, Dew 10 and the initial balance of Coins 100 (1 coin =
   1 Rs) and Cash Rs 200
7. There will be two types of payment method one is cash and another is coin both will have
   separate stock.
8. Consider the cases when the vending machine is out of coins or cash or out of the
   products
9. People can enter any number of Coins and Cash so there are no restrictions.
10. Consider the scenario when the Vending Machine should accept both coins and cash
    during purchase. User can use Rs 10 cash and 10 coins to purchase Coke and the stock for
    Cash , Coins and Products should be reflected accordingly

## How to run the application

1. First install necessary dependencies using `npm install` on both vending-machine-backend and vending-machine-frontend
2. Then change the name of .env.example to .env for both backend and frontend (You can also modify these files as per your need)
3. Then start the backend server using `npm run start:dev`
4. Then start the frontend project using `npm run dev`

## Backend specs

- Currently, uses in memory state for storing data

## Frontend specs

- Uses Tanstack Query for asynchronous state management
- Uses MUI as component library
