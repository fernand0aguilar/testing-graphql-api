import { CustomerDataType, userCredentials } from "./types";

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

export const productionEnvironment = {
  signInUrl: process.env.PRODUCTION_URL + "/auth/sign-in",
  graphqlUrl: process.env.PRODUCTION_URL + "/graphql",
};

export const prodClientAuthCredentials = {
  clientId: process.env.PRODUCTION_CLIENT_ID,
  username: process.env.PRODUCTION_CLIENT_USERNAME,
  password: process.env.PRODUCTION_CLIENT_PASSWORD,
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

export const mutationToSaveCustomer = (customerData: CustomerDataType): Record<string,string> => {
  return {
    query: `
        mutation {
            SaveCustomer(input: {
              id: "${customerData.id}"
              name: "${customerData.name}"
              surname: "${customerData.surname}"
            })
          }`,
  };
};

export const mutationToDeleteCustomerById = (id: string): Record<string,string> => {
  return {
    query: `
        mutation {
            DeleteCustomer(input: {
              id: "${id}"
            })
          }`,
  };
};

export const queryCustomerById = (id: string): Record<string,string> => {
  return {
    query: `
        query{
            CustomerReadModel(id: "${id}") {
                id
                name
                surname
                userId
                photoUrl
            }
        }`,
  };
};
