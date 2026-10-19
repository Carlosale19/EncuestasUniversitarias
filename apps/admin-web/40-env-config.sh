#!/bin/sh
set -e

if [ -n "$VITE_API_URL" ]; then
  cat <<EOF > /usr/share/nginx/html/env-config.js
window.__ENV__ = {
  VITE_API_URL: "${VITE_API_URL}"
};
EOF
fi
