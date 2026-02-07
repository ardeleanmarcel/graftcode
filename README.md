# Graftcode Demo: Next.js + Python via Graftcode Gateway

A demo project connecting a **Next.js frontend** to a **Python backend** using [Graftcode](https://graftcode.com) and Graftcode Gateway (gg). No REST endpoints, no GraphQL — just direct method invocation across runtimes.

## Architecture

```
┌─────────────────────┐     WebSocket      ┌─────────────────────┐
│   Next.js Frontend  │ ──────────────────► │  Graftcode Gateway  │
│   (Server Actions)  │    ws://...:8080/ws │      (gg)           │
│                     │                     │                     │
│  Javonet SDK calls  │                     │  Hosts Python       │
│  HelloWorld.greet() │ ◄────────────────── │  hello_world module │
│  HelloWorld.add()   │     Binary result   │                     │
└─────────────────────┘                     └─────────────────────┘
        :3000                                    :8080 / :8081
```

The Next.js app uses **Server Actions** to call the Python backend via the Javonet SDK over WebSocket. This means:
- No REST controllers or API routes
- No manual serialization/deserialization
- Direct method calls across languages (JavaScript → Python)

## Prerequisites

- **Node.js** >= 18
- **Python 3.9+** (via Homebrew: `brew install python@3.11`)
- **Graftcode Gateway (gg)** — see installation below
- **OpenSSL 3** (`brew install openssl@3`)

## Installation

### 1. Install Graftcode Gateway

Download from [GitHub Releases](https://github.com/grft-dev/graftcode-gateway/releases/latest):

```bash
# macOS ARM64
curl -L -o gg.tar.gz https://github.com/grft-dev/graftcode-gateway/releases/latest/download/gg_macos_arm64.tar.gz
tar -xzf gg.tar.gz
cp gg_macos_arm64/usr/local/bin/gg ~/bin/gg
chmod +x ~/bin/gg
```

Verify: `gg --help`

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

## Running

### Step 1: Start the Graftcode Gateway

From the **project root**:

```bash
DYLD_LIBRARY_PATH="/opt/homebrew/opt/python@3.11/lib" \
PYTHONHOME="/opt/homebrew/opt/python@3.11/Frameworks/Python.framework/Versions/3.11" \
gg --runtime python \
   --modules ./backend/hello_world \
   --port 8080 \
   --httpPort 8081
```

With the Project Key (registered at [portal.graftcode.com](https://portal.graftcode.com)):

```bash
DYLD_LIBRARY_PATH="/opt/homebrew/opt/python@3.11/lib" \
PYTHONHOME="/opt/homebrew/opt/python@3.11/Frameworks/Python.framework/Versions/3.11" \
gg --runtime python \
   --modules ./backend/hello_world \
   --port 8080 \
   --httpPort 8081 \
   --projectKey https://grft.dev/019c33bb-1718-7573-9cc0-dfcca290cd46__graftcode
```

**Registry URL:** `https://grft.dev/019c33bb-1718-7573-9cc0-dfcca290cd46__graftcode`

You should see:
```
Graftcode Gateway is available on localhost:8080/ws
Graftcode Vision is available on http://localhost:8081/GV
```

### Step 2: Start the Next.js frontend

In a separate terminal:

```bash
cd frontend
npm run dev
```

### Step 3: Open the app

Visit [http://localhost:3000](http://localhost:3000) to interact with the demo:

- **Greet**: Enter a name and call `HelloWorld.greet(name)` on the Python backend
- **Add**: Enter two numbers and call `HelloWorld.add(a, b)` on the Python backend

## Project Structure

```
.
├── backend/
│   └── hello_world/
│       ├── __init__.py          # Python package init
│       ├── hello_world.py       # HelloWorld class with greet() and add()
│       └── pyproject.toml       # Package metadata for Graftcode GMA
├── frontend/
│   ├── src/app/
│   │   ├── actions.js           # Server Actions (Javonet SDK → Gateway)
│   │   ├── page.js              # Client component with interactive forms
│   │   ├── page.module.css      # Styles
│   │   └── layout.js            # App layout
│   ├── next.config.mjs
│   └── package.json
└── README.md
```

## How It Works

1. **Backend** (`backend/hello_world/hello_world.py`): A simple Python class with static methods. No framework, no decorators, no HTTP — just plain business logic.

2. **Graftcode Gateway** (`gg`): Loads the Python module and exposes all public methods via its binary protocol (WebSocket on port 8080). Also serves Graft Vision UI (port 8081) for introspection.

3. **Frontend** (`frontend/src/app/actions.js`): Next.js Server Actions use the `javonet-nodejs-sdk` to connect to the Gateway via WebSocket and invoke Python methods as if they were local function calls.

Key code in the server action:
```javascript
const pythonRuntime = Javonet.webSocket(new WsConnectionData("ws://localhost:8080/ws")).python();
const helloWorld = pythonRuntime.getType("hello_world.HelloWorld");
const result = await helloWorld.invokeStaticMethod("greet", name).execute();
return result.getValue(); // "Hello, World! Welcome to Graftcode."
```

## Graft Vision

When the gateway is running, visit [http://localhost:8081/GV](http://localhost:8081/GV) for a Swagger-like UI that shows the hosted modules, types, and methods.
