sed -i 's/__NL__/\\\n/g' dist/z.S
g++ -E -P -C dist/z.S -o dist/z.s # Testing
