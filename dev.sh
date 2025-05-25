set -e
cd src/asm
bash dev.sh
cd ../../
tsc
npx esbuild dist/cmd.js --bundle --platform=node --outfile=dist/bin/cmd.js
sudo npm install -g .
bash run.sh
