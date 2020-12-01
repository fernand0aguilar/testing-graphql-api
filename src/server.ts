import express from "express";
import fetch from "node-fetch";
import "./config/envConfig"

import {
  PORT,
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

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});

type UserCredentialsType = {
  clientId: string;
  username: string;
  password: string;
};

async function getUserToken(url: string, userData: UserCredentialsType) {
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

app.get("/users-info", async (req, res) => {
  const developToken = await getUserToken(developEnvironment.signInUrl, devClientAuthCredentials)

  fetch(developEnvironment.graphqlUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + developToken
    },
    body: JSON.stringify({
      query: `{
        UserReadModels {
          id
          role
        }
      }`,
    }),
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      res.send(data);
    });
});
