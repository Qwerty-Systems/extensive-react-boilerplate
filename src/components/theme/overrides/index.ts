// @third-party
import { merge } from "lodash-es";

// @project
import Button from "./Button";

/***************************  OVERRIDES - MAIN  ***************************/

export default function ComponentsOverrides(theme: any) {
  return merge(Button(theme));
}
