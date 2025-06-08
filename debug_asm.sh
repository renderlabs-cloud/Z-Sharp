#!/bin/bash
# smart-asm-clean.sh
# Usage: ./smart-asm-clean.sh input.iz output.s

set +e

input="$1"
output="$2"

if [ -z "$input" ] || [ -z "$output" ]; then
  echo "Usage: $0 <input.iz> <output.s>"
  exit 1
fi

tmp_output=".asm_tmp_output"
tmp_errors=".asm_errors.txt"
tmp_input=".asm_tmp_input.txt"

cat "$input" > "$tmp_input"

# Run assembler and capture errors
gcc -x assembler-with-cpp -E -c "$input" -o "$tmp_input" -I src/asm/dist # Preprocess
gcc -x assembler-with-cpp -c "$tmp_input" -o "$tmp_output" 2> "$tmp_errors"

# Extract line numbers with errors
error_lines=$(grep -Po "^$input:\K\d+(?=:)" "$tmp_errors" | sort -n | uniq)

# Read the file into array
mapfile -t lines < "$tmp_input"

# Write the output, commenting bad lines
{
  for i in "${!lines[@]}"; do
    line_no=$((i + 1))
    if echo "$error_lines" | grep -q "^$line_no$"; then
      echo ";// ! ${lines[$i]}"
    else
      echo "${lines[$i]}"
    fi
  done
} > "$output"

rm -f "$tmp_output" "$tmp_errors" "$tmp_input"

echo "✅ Cleaned output saved to: $output"
