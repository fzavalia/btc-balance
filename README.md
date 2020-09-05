# BTC Balance

Tool for knowing my balance in Argentinian pesos (ARS) and United State Dollars (USD) of my Bitcoin (BTC) investments

## Usage

Install dependencies

`npm i` 

Copy the `data.example.json` to `data.json` in the same directory and fill it with the current amount of BTC you posess and every transaction in ARS you made for buying BTC.

Run the program

`node .`

You can also run the program directly with the binary provided in the releases (The bundle size is enormous because of nexe, the tool used to create it, might find alternatives some other time in my life)

`./btc-balance`

Remember that the `data.json` file must always be in the same directory as the binary

## Build

To create the binary yourself

`npm run build`

It will be stored in the `dist` folder in the root level of the repo