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

## Issues

```https://github.com/nexe/nexe/releases/download/v3.3.3/windows-x64-12.18.3 is not available, create it using the --build flag```

If an error like this occurs, it is probably because the target tools for your machine have not yet been created.

A solution is to add the target to the `build` script inside the `package.json`

`nexe -o ./dist/btc-balance -t windows-x64-10.16.0 ./index.js`

Available targets are listed here: https://github.com/nexe/nexe/releases