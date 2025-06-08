set -e

npx cpp-merge src/core.S --output dist/core.i

cp dist/core.i dist/z.S
mkdir dist/platform -p
cp src/platform dist/platform -r

bash run.sh
echo "export default $(jq -Rs '.' dist/z.S);" > dist/z_S.ts
