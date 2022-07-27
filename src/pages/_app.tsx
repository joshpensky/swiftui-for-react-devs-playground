import type { AppProps } from "next/app";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import "./styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DndProvider
      backend={TouchBackend}
      options={{ enableKeyboardEvents: true, enableMouseEvents: true }}
    >
      <Component {...pageProps} />
    </DndProvider>
  );
}

export default MyApp;
