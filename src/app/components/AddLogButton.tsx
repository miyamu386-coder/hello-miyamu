type Props = {
  canAdd: boolean;
  mofuButtonImg: string;
  isMofuHover: boolean;
  justAdded: boolean;
  onAdd: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export default function AddLogButton({
  canAdd,
  mofuButtonImg,
  isMofuHover,
  justAdded,
  onAdd,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  return (
    <>
      <div style={{ marginTop: 18 }}>
        <button
          type="button"
          onClick={onAdd}
          disabled={!canAdd}
          aria-label="記録する"
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 16,
            border: "2px solid #333",
            background: "#fff",
            cursor: canAdd ? "pointer" : "not-allowed",
            opacity: canAdd ? 1 : 0.4,
          }}
        >
          <div style={{ position: "relative", textAlign: "center" }}>
            <img
              src={mofuButtonImg}
              alt="記録する"
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              style={{
                width: isMofuHover ? 240 : 220,
                height: isMofuHover ? 240 : 220,
                objectFit: "contain",
                display: "block",
                margin: "0 auto",
                transition: "all 0.15s ease",
              }}
            />

            {justAdded && (
              <div
                style={{
                  position: "absolute",
                  top: "-6px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0,0,0,0.75)",
                  color: "#fff",
                  padding: "6px 10px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 800,
                  pointerEvents: "none",
                  animation: "fadeUp 1.8s ease-out",
                  whiteSpace: "nowrap",
                }}
              >
                追加完了！
              </div>
            )}
          </div>
        </button>
      </div>

      <div style={{ marginTop: 10, color: "#888", fontSize: 14 }}>
        ※保存はローカルストレージ（月ごとに自動で分かれます）
      </div>
    </>
  );
}