import createClient from "openapi-fetch";
import type { components, paths } from "./schemas";

export const client = createClient<paths>({
  baseUrl: "http://localhost:8080/v1"
});


export type Schemas = components["schemas"];
