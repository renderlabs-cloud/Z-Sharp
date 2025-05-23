set -e
tsc
npx esbuild dist/cmd.js --bundle --platform=node --outfile=dist/bin/cmd.js
sudo npm install -g .
bash run.sh
