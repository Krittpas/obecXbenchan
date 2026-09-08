import { deleteRecord, upsertRecord } from "@/app/admin/actions";
import type { Field, Resource } from "@/lib/admin-schema";
import { toDateInput, toDatetimeLocal } from "@/lib/format";
import type { Team } from "@/lib/types";

type Row = Record<string, unknown>;

function FieldInput({
  field,
  value,
  teams,
  idPrefix,
}: {
  field: Field;
  value: unknown;
  teams: Team[];
  idPrefix: string;
}) {
  const id = `${idPrefix}-${field.name}`;
  const common = { id, name: field.name, required: field.required };

  let control: React.ReactNode;

  switch (field.type) {
    case "textarea":
      control = <textarea {...common} defaultValue={(value as string) ?? ""} />;
      break;
    case "checkbox":
      control = (
        <label className="checkline">
          <input type="checkbox" id={id} name={field.name} defaultChecked={Boolean(value)} />
          {field.label}
        </label>
      );
      break;
    case "select":
      control = (
        <select {...common} defaultValue={(value as string) ?? ""}>
          {(field.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    case "team":
      control = (
        <select {...common} defaultValue={(value as string) ?? ""}>
          <option value="">— ยังไม่ระบุ —</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      );
      break;
    case "number":
      control = <input {...common} type="number" defaultValue={(value as number) ?? ""} />;
      break;
    case "datetime":
      control = <input {...common} type="datetime-local" defaultValue={toDatetimeLocal(value as string)} />;
      break;
    case "date":
      control = (
        <input
          {...common}
          type="date"
          defaultValue={typeof value === "string" && value.length === 10 ? value : toDateInput(value as string)}
        />
      );
      break;
    case "url":
      control = <input {...common} type="url" defaultValue={(value as string) ?? ""} />;
      break;
    case "color":
      control = <input {...common} type="text" placeholder="#22429E" defaultValue={(value as string) ?? ""} />;
      break;
    default:
      control = <input {...common} type="text" defaultValue={(value as string) ?? ""} />;
  }

  if (field.type === "checkbox") {
    return (
      <div className="field" style={field.full ? { gridColumn: "1 / -1" } : undefined}>
        {control}
        {field.hint && <span className="hint">{field.hint}</span>}
      </div>
    );
  }

  return (
    <div className="field" style={field.full ? { gridColumn: "1 / -1" } : undefined}>
      <label htmlFor={id}>
        {field.label}
        {field.required ? " *" : ""}
      </label>
      {control}
      {field.hint && <span className="hint">{field.hint}</span>}
    </div>
  );
}

function RecordForm({
  resource,
  row,
  teams,
}: {
  resource: Resource;
  row: Row | null;
  teams: Team[];
}) {
  const idPrefix = `${resource.key}-${row ? String(row.id) : "new"}`;

  return (
    <form action={upsertRecord}>
      <input type="hidden" name="__resource" value={resource.key} />
      {row && <input type="hidden" name="__id" value={String(row.id)} />}

      <div className="field-row">
        {resource.fields.map((field) => (
          <FieldInput
            key={field.name}
            field={field}
            value={row?.[field.name] ?? null}
            teams={teams}
            idPrefix={idPrefix}
          />
        ))}
      </div>

      <div className="row">
        <button className="btn btn-navy btn-sm" type="submit">
          {row ? "บันทึกการแก้ไข" : `เพิ่ม${resource.singular}`}
        </button>
      </div>
    </form>
  );
}

export default function ResourceEditor({
  resource,
  rows,
  teams,
}: {
  resource: Resource;
  rows: Row[];
  teams: Team[];
}) {
  return (
    <>
      <details className="panel">
        <summary style={{ cursor: "pointer", fontWeight: 600, color: "var(--navy)" }}>
          + เพิ่ม{resource.singular}ใหม่
        </summary>
        <div style={{ marginTop: "1rem" }}>
          <RecordForm resource={resource} row={null} teams={teams} />
        </div>
      </details>

      {rows.length === 0 ? (
        <p className="empty">ยังไม่มีข้อมูลในตารางนี้</p>
      ) : (
        rows.map((row) => {
          const title = String(row[resource.primary] ?? "(ไม่มีชื่อ)");
          const meta = (resource.secondary ?? [])
            .map((key) => row[key])
            .filter((v) => v !== null && v !== undefined && v !== "")
            .map(String)
            .join(" · ");

          return (
            <details className="panel" key={String(row.id)}>
              <summary style={{ cursor: "pointer" }}>
                <b style={{ color: "var(--navy)" }}>{title}</b>
                {meta && <span className="mute"> — {meta}</span>}
              </summary>

              <div style={{ marginTop: "1rem" }}>
                <RecordForm resource={resource} row={row} teams={teams} />

                <form action={deleteRecord} style={{ marginTop: "0.9rem" }}>
                  <input type="hidden" name="__resource" value={resource.key} />
                  <input type="hidden" name="__id" value={String(row.id)} />
                  <button className="btn btn-danger btn-sm" type="submit">
                    ลบรายการนี้
                  </button>
                </form>
              </div>
            </details>
          );
        })
      )}
    </>
  );
}
