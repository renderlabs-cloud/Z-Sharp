set -e
cd test
node ../dist/cmd.js build --input test.zs --output test.asm --mode group
cd ..
