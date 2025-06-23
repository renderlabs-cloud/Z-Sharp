set -e
zs build --input test/test.zs --output test/test.iz
zs emit -A --input test/test.iz --output test/test.elf
cp test/test.iz test/test.S
