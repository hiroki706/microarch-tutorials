import {
  index,
  layout,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/layout.tsx", [
    index("./routes/page.tsx", ),
    route("login", "./routes/login/page.tsx"),
  ]),
] satisfies RouteConfig;
