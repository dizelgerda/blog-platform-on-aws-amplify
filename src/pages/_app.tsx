import type { AppProps } from "next/app";
import { store } from "@helpers/store";
import { Provider } from "react-redux";
import { Amplify, AuthModeStrategyType } from "aws-amplify";
import AWSConfig from "../aws-exports";
import { useEffect } from "react";
import { checkAuth } from "@helpers/api";

import "@styles/index.css";

Amplify.configure({ ...AWSConfig, ssr: true });

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
