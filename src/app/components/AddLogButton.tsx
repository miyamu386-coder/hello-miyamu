type Props = {
  canAdd: boolean;
  justAdded: boolean;
  onAdd: () => void;
};

export default function AddLogButton({
  canAdd,
  justAdded,
  onAdd,
}: Props) {
  return (
    <>
      <div style={{ marginTop: 18 }}>
  <button
    type="button"
    onClick={onAdd}
    disabled={!canAdd}
   style={{
  width: "100%",
  padding: "16px",
  borderRadius: 18,
  border: "1px solid #d7dfda",
  background: canAdd ? "#dce9e1" : "#eef2ef",
  color: canAdd ? "#34443a" : "#9aa39d",
  fontSize: 18,
  fontWeight: 800,
  cursor: canAdd ? "pointer" : "not-allowed",
  position: "relative",
  transition: "0.2s",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
}}
  >
    記録する

    {justAdded && (
      <div
        style={{
          position: "absolute",
          top: "-36px",
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
  </button>
</div>

      <div style={{ marginTop: 10, color: "#888", fontSize: 14 }}>
        ※保存はローカルストレージ（月ごとに自動で分かれます）
      </div>
    </>
  );
}