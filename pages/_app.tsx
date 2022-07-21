import "./styles/globals.css";
import type { AppProps } from "next/app";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";

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
