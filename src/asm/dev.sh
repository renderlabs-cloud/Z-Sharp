set -e

mkdir -p dist
mkdir -p dist/compiled

rm -rf dist/compiled/*

# for file in src/*.hpp; do
# 	PRE="dist/compiled/pre_$(basename "${file}")"
# 	OUT="dist/compiled/$(basename "${file%.hpp}").S"
# 	g++ -P -E "$file" \
# 		-D__C_E__="__C_E__" \
# 		-D__C_S__="__C_S__" \
# 		-D__HASH__="#" \
# 		| tee "$PRE"
# 	sed -i 's/__C_S__/\/\*\*/g' "$PRE"
# 	sed -i 's/__C_E__/\*\//g' "$PRE"
# 	sed -i 's/__NL__/\n/g' "$PRE"
# 	g++ -x c++ -S -C "$PRE" -o "$OUT"
# done

cp -r src/* dist/compiled/

npx cpp-merge src/lang/Z#.h --output dist/compiled/lang/Z#.h
sudo cp dist/compiled/lang/Z#.h /usr/include/

npx cpp-merge dist/compiled/core.i --output dist/core.i

cp dist/core.i dist/z.S

# rm -rf dist/compiled/*

bash run.sh
echo "export default $(jq -Rs '.' dist/z.S)" > dist/z_S.ts
