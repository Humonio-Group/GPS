export const useBrand = () => {
  const { public: config } = useRuntimeConfig();

  return {
    name: config.brand.name,
  };
};
