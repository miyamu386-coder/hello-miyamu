"use client";

import { useRef, useState } from "react";

type Room = {
  id: string;
  name: string;
  image: string;
};
type Props = {
  onOpenKitchen: () => void;
  onOpenFridge: () => void;
  onOpenWork: () => void;
  onOpenPuzzle: () => void;
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

export default function RoomSwiper({
  onOpenKitchen,
  onOpenFridge,
  onOpenWork,
  onOpenPuzzle,
}: Props) {
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
    objectFit: room.id === "workroom" ? "contain" : "cover",
    objectPosition: "center",
    userSelect: "none",
    background: room.id === "workroom" ? "#2b1c12" : "transparent",
  }}
/>
{room.id === "living-kitchen" && (
  <>
    <button
  type="button"
aria-label="キッチンを開く"
onClick={onOpenKitchen}
      style={{
        position: "absolute",
        left: "32%",
        top: "22%",
        width: "38%",
        height: "40%",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        zIndex: 4,
      }}
    />

    <button
      type="button"
      aria-label="冷蔵庫を開く"
      onClick={onOpenFridge}
      style={{
        position: "absolute",
        right: "0%",
        top: "20%",
        width: "22%",
        height: "43%",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        zIndex: 4,
      }}
    />
  </>
)}
{room.id === "workroom" && (
  <>
    <button
      type="button"
      aria-label="パソコンを開く"
      onClick={onOpenWork}
      style={{
        position: "absolute",
        left: "4%",
        top: "35%",
        width: "33%",
        height: "27%",
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        zIndex: 4,
      }}
    />

    <button
      type="button"
      aria-label="本棚を開く"
      onClick={onOpenPuzzle}
      style={{
        position: "absolute",
        left: "42%",
        top: "13%",
        width: "32%",
        height: "46%",
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        zIndex: 4,
      }}
    />
  </>
)}

            <div
  style={{
    position: "absolute",
    left: "50%",
    bottom: "4%",
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