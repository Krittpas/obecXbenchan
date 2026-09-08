"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signIn, type ActionState } from "@/app/admin/actions";

const INITIAL: ActionState = { ok: false, message: "" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-navy" type="submit" disabled={pending} style={{ width: "100%" }}>
      {pending ? "กำลังตรวจสอบ…" : "เข้าสู่ระบบ"}
    </button>
  );
}

export default function LoginForm() {
  const [state, action] = useActionState(signIn, INITIAL);

  return (
    <form action={action}>
      {state.message && (
        <div className="alert alert-err" role="alert">
          {state.message}
        </div>
      )}
      <div className="field">
        <label htmlFor="email">อีเมล</label>
        <input id="email" name="email" type="email" autoComplete="username" required />
      </div>
      <div className="field">
        <label htmlFor="password">รหัสผ่าน</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <Submit />
    </form>
  );
}
