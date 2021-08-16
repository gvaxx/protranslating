import { store } from "../store/index";

export function onLoading(promise) {
  store.commit("changeLoading");
  return promise.finally(() => store.commit("changeLoading"));
}
