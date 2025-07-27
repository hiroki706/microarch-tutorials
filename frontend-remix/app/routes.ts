import {
  index,
  layout,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/layout.tsx", [
    index("./routes/home.tsx"),
    route("login", "./routes/form/login.tsx"),
  ]),
] satisfies RouteConfig;
