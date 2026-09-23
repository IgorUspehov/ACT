#!/usr/bin/env bash
# Build the unified ACT service from the repository root.
# Render Root Directory must be the repository root, not backend/.
set -euo pipefail

cd "$(dirname "$0")"

if ! command -v npm >/dev/null 2>&1; then
  NODE_VERSION="${NODE_VERSION:-22.21.0}"
  PREFIX="${HOME}/.local/node"
  ARCHIVE="node-v${NODE_VERSION}-linux-x64.tar.xz"
  mkdir -p "${PREFIX}"
  curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/${ARCHIVE}" -o "/tmp/${ARCHIVE}"
  tar -xJf "/tmp/${ARCHIVE}" -C "${PREFIX}" --strip-components=1
  export PATH="${PREFIX}/bin:${PATH}"
fi

npm ci --prefix frontend
npm run build --prefix frontend
rm -rf backend/static
mkdir -p backend/static
cp -a frontend/dist/. backend/static/
python -m pip install -r backend/requirements.txt
