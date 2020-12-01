export const PORT = process.env.PORT || 3000;

export const developEnvironment = {
    signInUrl: process.env.DEVELOPMENT_URL + "/auth/sign-in",
    graphqlUrl: process.env.DEVELOPMENT_URL + "/graphql"
}

export const devClientAuthCredentials = {
    "clientId": process.env.DEVELOPMENT_CLIENT_ID,
    "username": process.env.DEVELOPMENT_CLIENT_USERNAME,
    "password": process.env.DEVELOPMENT_CLIENT_PASSWORD
}

