const createEntityProxy = (entityName) => {
  return {
    list: async () => [],
    filter: () => ({ list: async () => [] }),
    get: async (id) => null,
    create: async (data) => ({ id: Date.now().toString(), ...data }),
    update: async (id, data) => ({ id, ...data }),
    delete: async (id) => true,
  };
};

const createIntegrationProxy = () => {
  return {
    InvokeLLM: async () => ({ response: '' }),
    SendEmail: async () => ({ success: true }),
    UploadFile: async () => ({ url: '' }),
    GenerateImage: async () => ({ url: '' }),
    ExtractDataFromUploadedFile: async () => ({}),
    CreateFileSignedUrl: async () => ({ url: '' }),
    UploadPrivateFile: async () => ({ url: '' }),
  };
};

const createAuthProxy = () => {
  return {
    me: async () => null,
    isLoggedIn: () => false,
    login: async () => {},
    logout: async () => {},
  };
};

export const createClient = (options) => {
  return {
    entities: new Proxy({}, {
      get: (target, prop) => createEntityProxy(prop)
    }),
    integrations: {
      Core: createIntegrationProxy(),
    },
    auth: createAuthProxy(),
  };
};

export const base44 = createClient({
  appId: "68e8dc85bfc3cf36edee27d2", 
  requiresAuth: true
});
