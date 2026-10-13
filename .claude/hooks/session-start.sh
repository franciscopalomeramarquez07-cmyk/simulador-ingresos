#!/bin/bash
# Prepara graphify en las sesiones de Claude Code en la nube.
# El contenedor es efímero: instala la CLI y regenera el grafo de código
# (solo análisis AST local, sin coste de tokens). En local no hace nada:
# allí graphify se instala una vez con `uv tool install graphifyy`.
set -uo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

GRAPHIFY_VERSION="0.9.89"
GRAPHIFY_SPEC="graphifyy[sql]==${GRAPHIFY_VERSION}"
export PATH="$HOME/.local/bin:$PATH"

if [ "$(graphify --version 2>/dev/null)" != "graphify ${GRAPHIFY_VERSION}" ]; then
  if command -v uv >/dev/null 2>&1; then
    uv tool install --force "$GRAPHIFY_SPEC" >&2
  else
    python3 -m pip install --user --quiet "$GRAPHIFY_SPEC" >&2
  fi
  if [ $? -ne 0 ]; then
    echo "graphify: no se pudo instalar ${GRAPHIFY_SPEC}; esta sesión no tendrá grafo."
    exit 0
  fi
fi

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
if graphify update . >&2; then
  echo "graphify: grafo listo (graphify affected / explain)."
else
  echo "graphify: no se pudo regenerar el grafo; ejecuta 'graphify update .' a mano."
fi
exit 0
