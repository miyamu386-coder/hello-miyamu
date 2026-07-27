"use client";

import { useRef, useState } from "react";

type Room = {
  id: string;
  name: string;
  image: string;
};

const rooms: Room[] = [
  {
    id: "living-kitchen",
    name: "リビングキッチン",
    image: "/room/mofu-room.png",
  },
  {
    id: "workroom",
    name: "仕事部屋",
    image: "/room/mofu-workroom.png",
  },
];

export default function RoomSwiper() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);

  const handleScroll = () => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const roomWidth = container.clientWidth;

    if (roomWidth === 0) {
      return;
    }

    const nextIndex = Math.round(container.scrollLeft / roomWidth);

    setCurrentRoomIndex(nextIndex);
  };

  const moveToRoom = (index: number) => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      left: container.clientWidth * index,
      behavior: "smooth",
    });
  };

  return (
    <section
      style={{
        width: "100%",
        overflow: "hidden",
      }}
    >

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          display: "flex",
          width: "100%",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          overscrollBehaviorX: "contain",
        }}
      >
        {rooms.map((room) => (
          <div
            key={room.id}
            style={{
              position: "relative",
              flex: "0 0 100%",
              width: "100%",
              aspectRatio: "9 / 16",
              scrollSnapAlign: "start",
              scrollSnapStop: "always",
              overflow: "hidden",
              borderRadius: 20,
            }}
          >
            <img
              src={room.image}
              alt={room.name}
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
                objectPosition:
                   room.id === "workroom" ? "35% center" : "center",
                userSelect: "none",
              }}
            />
            <div
  style={{
    position: "absolute",
    left: "50%",
    bottom: "8%",
    width: 95,
    height: 135,
    transform: "translateX(-50%)",
    zIndex: 5,
    pointerEvents: "none",
  }}
>
  <img
    src="/mofu-normal.png"
    alt="モフ"
    draggable={false}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain",
      display: "block",
      userSelect: "none",
    }}
  />
</div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginTop: 12,
        }}
      >
        {rooms.map((room, index) => (
          <button
            key={room.id}
            type="button"
            aria-label={`${room.name}へ移動`}
            onClick={() => moveToRoom(index)}
            style={{
              width: currentRoomIndex === index ? 22 : 8,
              height: 8,
              padding: 0,
              border: "none",
              borderRadius: 999,
              background:
                currentRoomIndex === index ? "#4f7c5b" : "#c8c8c8",
              transition: "width 0.2s ease",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </section>
  );
}