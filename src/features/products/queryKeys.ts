export const productKeys = {
  all: ["products"] as const,

  lists: () => [...productKeys.all, "list"] as const,

  list: (params: unknown) => [...productKeys.lists(), params] as const,

  detail: (id: number) => [...productKeys.all, "detail", id] as const,
};
