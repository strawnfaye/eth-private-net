#!/bin/bash

#blockchain address of sender and contract. $1 means first command line argument.
contractAddress=$1

bobAddress=0x8691bf25ce4a56b15c1f99c944dc948269031801
aliceAddress=0xdda6ef2ff259928c561b2d30f0cad2c2736ce8b6
lilyAddress=0xb1b6a66a410edc72473d92decb3772bad863e243

# Function signatures
getFuncSig=0x6d4ce63c
setFuncSig=0xb8e010de

# Initialize arguments