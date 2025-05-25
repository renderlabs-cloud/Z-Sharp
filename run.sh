set -e
zs build --input test/test.zs --output test/test.iz
zs emit --input test/test.iz --output test/test
cp test/test.iz test/test.txt
