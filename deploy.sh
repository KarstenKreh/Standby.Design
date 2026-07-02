#!/bin/bash
set -e

SERVER="root@46.225.131.97"
REMOTE_DIR="/opt/oklch-palette"

# Auth comes from the SSH agent (key lives in 1Password, item
# "Personal - SSH Hetzner CPX42"). On Windows the agent is only reachable
# via the native OpenSSH client, not Git Bash's bundled ssh.
if [ -d "/c/Windows/System32/OpenSSH" ]; then
  export PATH="/c/Windows/System32/OpenSSH:$PATH"
fi

# Ensure Traefik network exists
echo "==> Checking Traefik..."
ssh "$SERVER" 'docker network inspect traefik_web >/dev/null 2>&1 || { echo "ERROR: Traefik network not found. Run setup-traefik.sh first."; exit 1; }'

echo "==> Deploying Color Palette Generator..."
ssh "$SERVER" "mkdir -p $REMOTE_DIR/color-react $REMOTE_DIR/type-react $REMOTE_DIR/system-react $REMOTE_DIR/shape-react $REMOTE_DIR/symbol-react $REMOTE_DIR/space-react $REMOTE_DIR/qa-gallery $REMOTE_DIR/packages/core $REMOTE_DIR/public"
scp index.html docker-compose.yml Dockerfile nginx.conf og-server.js shared.css "$SERVER:$REMOTE_DIR/"
scp public/* "$SERVER:$REMOTE_DIR/public/"

# OG-image assets (Satoshi fonts baked into the image for SVG text rendering)
echo "==> Uploading og-assets..."
tar cf - og-assets/ | ssh "$SERVER" "cd $REMOTE_DIR && rm -rf og-assets && tar xf -"

# Upload packages/core (shared utilities)
echo "==> Uploading packages/core..."
tar cf - packages/core/ | ssh "$SERVER" "cd $REMOTE_DIR && rm -rf packages/core && tar xf -"

# Upload packages/mcp-server source (remote MCP server for mcp.standby.design)
echo "==> Uploading packages/mcp-server source..."
tar cf - --exclude='node_modules' --exclude='dist' packages/mcp-server/ | ssh "$SERVER" "cd $REMOTE_DIR && rm -rf packages/mcp-server && tar xf -"

# Upload color-react source (tar to exclude node_modules/dist, unpack on server)
echo "==> Uploading color-react source..."
tar cf - --exclude='node_modules' --exclude='dist' --exclude='.git' color-react/ | ssh "$SERVER" "cd $REMOTE_DIR && rm -rf color-react && tar xf -"

# Upload type-react source (tar to exclude node_modules/dist, unpack on server)
echo "==> Uploading type-react source..."
tar cf - --exclude='node_modules' --exclude='dist' --exclude='.git' type-react/ | ssh "$SERVER" "cd $REMOTE_DIR && rm -rf type-react && tar xf -"

# Upload system-react source (tar to exclude node_modules/dist, unpack on server)
echo "==> Uploading system-react source..."
tar cf - --exclude='node_modules' --exclude='dist' --exclude='.git' system-react/ | ssh "$SERVER" "cd $REMOTE_DIR && rm -rf system-react && tar xf -"

# Upload shape-react source (tar to exclude node_modules/dist, unpack on server)
echo "==> Uploading shape-react source..."
tar cf - --exclude='node_modules' --exclude='dist' --exclude='.git' shape-react/ | ssh "$SERVER" "cd $REMOTE_DIR && rm -rf shape-react && tar xf -"

# Upload symbol-react source (tar to exclude node_modules/dist, unpack on server)
echo "==> Uploading symbol-react source..."
tar cf - --exclude='node_modules' --exclude='dist' --exclude='.git' symbol-react/ | ssh "$SERVER" "cd $REMOTE_DIR && rm -rf symbol-react && tar xf -"

# Upload space-react source (tar to exclude node_modules/dist, unpack on server)
echo "==> Uploading space-react source..."
tar cf - --exclude='node_modules' --exclude='dist' --exclude='.git' space-react/ | ssh "$SERVER" "cd $REMOTE_DIR && rm -rf space-react && tar xf -"

# Upload qa-gallery source (hidden internal QA gallery)
echo "==> Uploading qa-gallery source..."
tar cf - --exclude='node_modules' --exclude='dist' --exclude='.git' qa-gallery/ | ssh "$SERVER" "cd $REMOTE_DIR && rm -rf qa-gallery && tar xf -"

echo "==> Docker-Container bauen und starten..."
ssh "$SERVER" "cd $REMOTE_DIR && docker compose up -d --build"

echo "==> Fertig! Erreichbar unter: https://standby.design"
