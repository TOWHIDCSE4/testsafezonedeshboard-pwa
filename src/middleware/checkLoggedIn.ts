import { RouteLocationNormalized, NavigationGuardNext } from "vue-router";

const checkLoggedIn = async (
  from: RouteLocationNormalized,
  to: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const access_token = localStorage.getItem("access-token");

  if (access_token) {
    next("/");
  } else {
    next();
  }
};

export default checkLoggedIn;
