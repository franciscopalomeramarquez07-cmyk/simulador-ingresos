## graphify (grafo del código)

Estas reglas mandan sobre cualquier otra de graphify. Aplícalas solo si existen `graphify-out/graph.json` y el comando `graphify` (el grafo no se versiona; se crea con `graphify update . > /dev/null`, ~1 s y sin tokens):
- Antes de cambiar una función, componente o constante, mira qué depende de ella con `graphify affected "<símbolo>"`.
- Para ubicar un símbolo y quién lo usa, `graphify explain "<símbolo>"`. Para todo lo demás usa grep: `graphify query` suele devolver más texto.
- Si has cambiado código desde que se creó el grafo, actualízalo antes de consultarlo.

No instales graphify si el usuario no lo pide; si lo pide, `uv tool install "graphifyy[sql]==0.9.89"`. `graphify extract` solo con `--code-only` (sin eso envía documentos a un proveedor de IA externo).
