# Crypto Balance

Tool I use to check my investment balance in cryptocurrencies. It will render the profits or loses in ARS of my investment and information about the coins I own.

## Usage

Install dependencies

`npm i`

Copy the `data.example.json` to `data.json` in the same directory and fill it with the coins you own and each expense in ARS you make purrchasing coins (or selling).

## Run the program

`node .`

I created a function in my `.zshrc` file so I can run the program anywhere.

```
crypto-balance() {
  node path/to/this/project
}

crypto-balance-watch() {
  while true; 
  do 
    clear 
    crypto-balance
    sleep 30
  done
}
```