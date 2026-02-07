"use server";

import { Javonet, WsConnectionData } from "javonet-nodejs-sdk";

const GATEWAY_URL =
  process.env.GRAFTCODE_GATEWAY_URL || "ws://localhost:8080/ws";

function getGatewayRuntime() {
  const wsConn = new WsConnectionData(GATEWAY_URL);
  return Javonet.webSocket(wsConn).python();
}

export async function greet(name) {
  const pythonRuntime = getGatewayRuntime();
  const helloWorldType = pythonRuntime.getType("hello_world.HelloWorld");
  const result = await helloWorldType
    .invokeStaticMethod("greet", name)
    .execute();

  return result.getValue();
}

export async function add(a, b) {
  const pythonRuntime = getGatewayRuntime();
  const helloWorldType = pythonRuntime.getType("hello_world.HelloWorld");
  const result = await helloWorldType
    .invokeStaticMethod("add", a, b)
    .execute();

  return result.getValue();
}
