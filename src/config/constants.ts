export const PORT = process.env.PORT || 3000;

export const developEnvironment = {
  signInUrl: process.env.DEVELOPMENT_URL + "/auth/sign-in",
  graphqlUrl: process.env.DEVELOPMENT_URL + "/graphql",
};

export const devClientAuthCredentials = {
  clientId: process.env.DEVELOPMENT_CLIENT_ID,
  username: process.env.DEVELOPMENT_CLIENT_USERNAME,
  password: process.env.DEVELOPMENT_CLIENT_PASSWORD,
};

export const queryToFetchUserReadModels = {
  query: `query {
      UserReadModels {
        id
        role
      }
    }`,
};

export const queryToFetchSingleUserReadModel = (
  id: string
): Record<string, string> => {
  return {
    query: `query {
        UserReadModel(id: "${id}") {
          id
          role
        }
      }`,
  };
};

export const queryToFetchCustomerReadModels = {
  query: `query {
      CustomerReadModels {
        name
        surname
        userId
        id
        photoUrl
      }
    }`,
};


type userCredentials = {
  username: string;
  password: string;
  role: string;
};

export const mutationToSaveNewUser = (
  testUserCredentialsInput: userCredentials
): Record<string, string> => {
  return {
    query: `
        mutation {
            SaveUser(
                input: {
                username: "${testUserCredentialsInput.username}", 
                password: "${testUserCredentialsInput.password}", 
                role: "${testUserCredentialsInput.role}"
            }
            )
        }`,
  };
};

export const mutationToChangeUserRole = (id: string): Record<string,string> => {
  return {
    query: `mutation {
            ChangeUserRole(
                input: {
                    username: "${id}",  
                    role: "User"
                }
            )
        }`,
  };
};

export const mutationToDeleteUser = (id: string): Record<string,string> => {
  return {
    query: 
    `mutation {
        DeleteUser(
          input: {
            username: "${id}",  
          }
        )
      }`,
  };
};
