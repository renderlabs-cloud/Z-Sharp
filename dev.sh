set -e
cd src/asm
bash dev.sh
cd ../../
npx tsc
npx esbuild dist/cmd.js --bundle --platform=node --outfile=dist/bin/cmd.js
npm link
bash run.sh || true
cp src/asm/dist/z.S test/include/z.S
# ./debug_asm.sh test/test.iz test/test.preprocessed.s
# gcc -x assembler-with-cpp -c test/test.preprocessed.s -o test/test.o
# ld -o test/test ./test/test.o
# chmod +x test/test
# ./test/test
