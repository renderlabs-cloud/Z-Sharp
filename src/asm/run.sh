sed -i 's/__NL__/\\\n/g' dist/z.S
gcc -E -P -C dist/z.S -o dist/z.s # Testing
