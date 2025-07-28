import { useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://concat-erp.com:3004");

export const useLivePrices = (onUpdate: (data: any) => void) => {
  useEffect(() => {
    socket.on("disconnect", () => console.warn("⚠️ Disconnected"));
    socket.on("price_update", (data) => onUpdate(data));

    return () => {
      socket.disconnect();
      return undefined;
    };
  }, []);
};