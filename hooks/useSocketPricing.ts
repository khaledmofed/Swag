"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface PriceChange {
  priceName: string;
  newPrice: number;
  direction: string;
  color: string;
}

interface PriceUpdateData {
  priceChanges: PriceChange[];
}

interface BroadcastPricesData {
  [key: string]: any;
}

export const useSocketPricing = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [priceUpdates, setPriceUpdates] = useState<PriceChange[]>([]);
  const [broadcastData, setBroadcastData] =
    useState<BroadcastPricesData | null>(null);

  useEffect(() => {
    // إنشاء اتصال Socket.io
    socketRef.current = io("https://concat-erp.com:3004");

    const socket = socketRef.current;

    // مستمعات الأحداث
    socket.on("connect", () => {
      console.log("✅ Connected to pricing socket");
      setIsConnected(true);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connect Error:", err.message);
      setIsConnected(false);
    });

    socket.on("disconnect", () => {
      console.warn("⚠️ Disconnected from pricing socket");
      setIsConnected(false);
    });

    // مستمع البيانات المباشرة
    socket.on("broadcast prices", (data: BroadcastPricesData) => {
      console.log("📡 Broadcast prices received:", data);
      setBroadcastData(data);
    });

    // مستمع تحديثات الأسعار
    socket.on("price_update", (data: PriceUpdateData) => {
      //   console.log("💰 Price update received:", data);

      const priceChanges = data.priceChanges;

      priceChanges.forEach((change) => {
        const { priceName, newPrice, direction, color } = change;

        // console.log(`🔄 Price change for ${priceName}:`, {
        //   newPrice,
        //   direction,
        //   color,
        // });

        if (
          [
            "gold-price-region24",
            "gold-price-region21",
            "gold-price-region18",
            "goldsounces",
            "silversounces",
            "ounceLowPrice",
            "ounceHighPrice",
            "silverLowPrice",
            "silverHighPrice",
          ].includes(priceName)
        ) {
          //   console.log(`✅ Valid price update for ${priceName}:`, {
          //     priceName,
          //     newPrice,
          //     direction,
          //     color,
          //   });

          updatePriceDisplay(priceName, newPrice, direction, color);
        } else {
          //   console.log(
          //     `❌ Ignored price update for ${priceName} (not in allowed list)`
          //   );
        }
      });

      setPriceUpdates(priceChanges);
    });

    // تنظيف الاتصال عند إلغاء التركيب
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        // console.log("🔌 Socket disconnected on cleanup");
      }
    };
  }, []);

  // دالة تحديث عرض الأسعار
  const updatePriceDisplay = (
    priceName: string,
    newPrice: number,
    direction: string,
    color: string
  ) => {
    // console.log(`🎨 Updating price display for ${priceName}:`, {
    //   newPrice,
    //   direction,
    //   color,
    //   timestamp: new Date().toISOString(),
    // });
    // هنا يمكن إضافة منطق تحديث واجهة المستخدم
    // مثل تحديث DOM أو إرسال أحداث مخصصة
  };

  // دالة للحصول على السعر الحالي لعيار معين
  const getCurrentPrice = (karat: number): number | null => {
    const priceKey = `gold-price-region${karat}`;

    // البحث في priceUpdates أولاً (أحدث البيانات)
    const latestUpdate = priceUpdates.find(
      (update) => update.priceName === priceKey
    );
    if (latestUpdate) {
      return latestUpdate.newPrice;
    }

    // البحث في broadcastData كبديل
    if (broadcastData && broadcastData[priceKey]) {
      return broadcastData[priceKey];
    }

    return null;
  };

  // دالة للحصول على آخر تحديث لسعر معين
  const getLastPriceUpdate = (priceName: string): PriceChange | null => {
    return (
      priceUpdates.find((update) => update.priceName === priceName) || null
    );
  };

  return {
    isConnected,
    priceUpdates,
    broadcastData,
    getCurrentPrice,
    getLastPriceUpdate,
    socket: socketRef.current,
  };
};
