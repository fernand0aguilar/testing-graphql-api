import express from "express";
import fetch from "node-fetch";
import "./config/envConfig"
import expressPlayground from "graphql-playground-middleware-express";

import {
  developEnvironment,
  devClientAuthCredentials,
} from "./config/constants";

const app = express();

// /**
//  *  TODO ->
//  * https://thenewstack.io/automatic-testing-for-graphql-apis/
//  * */

app.get("/", (req, res) => {
  console.log("hello world");
  res.send("Hello World!");
});

app.get("/playground", expressPlayground({ endpoint: developEnvironment.graphqlUrl }))

type UserCredentialsType = {
  clientId: string;
  username: string;
  password: string;
};

export async function getUserToken(url: string, userData: UserCredentialsType): Promise<string> {
  const apiResult = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      charset: "utf-8",
    },
    body: JSON.stringify({
      clientId: userData.clientId,
      username: userData.username,
      password: userData.password,
    }),
  });
  const jsonResult = await apiResult.json();
  return jsonResult.accessToken;
}

export default app;