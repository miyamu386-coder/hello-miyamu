import { monthLabel } from "../lib/dateUtils";

type Props = {
  title: string;
  unit: string;
  ym: string;
};

export default function DiaryHeader({
  title,
  unit,
  ym,
}: Props) {
  return (
    <>

      <div
  style={{
    textAlign: "center",
    fontSize: 26,
    fontWeight: 900,
  }}
>
  {title}
</div>

<div
  style={{
    marginTop: 4,
    textAlign: "center",
    color: "#555",
    fontWeight: 700,
  }}
>
  {monthLabel(ym)}
</div>

    </>
  );
}