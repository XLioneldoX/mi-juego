# 🎮 Kanto Showdown

Juego de combate por turnos con multijugador online.

## ▶️ Jugar en local

Abre `index.html` directamente en el navegador. No necesita servidor para el modo single-player.

## 🌐 Multijugador — Despliegue en Railway

### Paso 1 — Subir a GitHub

1. Entra en [github.com](https://github.com) y crea un repositorio nuevo (llámalo como quieras, ej: `kanto-showdown`)
2. En tu PC, abre una terminal en la carpeta del proyecto y ejecuta:

```bash
git init
git add .
git commit -m "primer commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/kanto-showdown.git
git push -u origin main
```

> Sustituye `TU_USUARIO` por tu usuario de GitHub.

### Paso 2 — Conectar Railway

1. Entra en [railway.app](https://railway.app) y crea una cuenta gratuita (puedes entrar con GitHub directamente)
2. Haz clic en **"New Project"**
3. Elige **"Deploy from GitHub repo"**
4. Selecciona tu repositorio `kanto-showdown`
5. Railway detectará automáticamente el `package.json` y desplegará

### Paso 3 — Obtener tu URL

1. En Railway, entra al proyecto → pestaña **"Settings"** → **"Domains"**
2. Haz clic en **"Generate Domain"**
3. Te dará una URL tipo `https://kanto-showdown-production.up.railway.app`
4. **¡Esa es tu URL permanente!** Compártela con tus amigos

### Paso 4 — Jugar con amigos

1. Tú y tu amigo abrís la misma URL
2. Uno pulsa **"Crear sala"** → recibe un código de 4 letras (ej: `KXQR`)
3. El otro pone ese código en **"Unirse"**
4. Ambos seleccionan su equipo en el constructor y pulsan **"Batalla Online"**
5. ¡A jugar!

### Actualizar el juego

Cada vez que hagas cambios en el código:

```bash
git add .
git commit -m "descripción del cambio"
git push
```

Railway actualiza automáticamente en \~30 segundos.

---

## 📁 Estructura del proyecto

```
├── index.html              # Menú principal
├── battle.html             # Combate (single + multi)
├── team-builder.html       # Constructor de equipos
├── calculator.html         # Calculadora de daño
├── package.json            # Dependencias Node.js
├── railway.toml            # Configuración Railway
├── server/
│   └── server.js           # Servidor WebSocket
├── js/
│   ├── multiplayer.js      # Cliente WebSocket
│   ├── battle-main.js      # Inicialización de batalla
│   ├── battle-system.js    # Lógica de turnos
│   ├── battle-engine.js    # Fórmulas de daño
│   └── ui-battle.js        # Interfaz de batalla
└── data/
    ├── pokemon.js          # Base de datos de Pokémon
    ├── moves.js            # Movimientos
    ├── trainers.js         # Entrenadores
    └── sprites.js          # Sprites en Base64
```
