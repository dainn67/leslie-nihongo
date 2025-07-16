import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/app/store";
import CounterScreen from "./src/features/counter/counterScreen";

export default function App() {
  return (
    <Provider store={store}>
      <CounterScreen />
    </Provider>
  );
}
