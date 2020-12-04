export type EnvironmentType = {
    signInUrl: string,
    graphqlUrl: string
}

export type ClientAuthCredentialsType = {
    clientId: string
    username: string
    password: string
}


export type CustomerDataType = {
    id: string;
    name: string;
    surname: string;
    photoUrl?: string;
  };
  

export type userCredentials = {
    username: string;
    password: string;
    role: string;
  };
  