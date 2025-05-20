set -e

npx cpp-merge src/core.S --output dist/core.i

cp dist/core.i dist/z.S

./run.sh
