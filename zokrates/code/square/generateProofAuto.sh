#/bin/bash

zokrates compile -i square.code
zokrates setup
zokrates compute-witness -a 3 9
zokrates generate-proof
zokrates export-verifier