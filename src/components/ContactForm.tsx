"use client";

import { useState, type FormEvent } from "react";

import { SERVICES } from "@/data/services";

type Status = "idle" | "submitting" | "success" | "error";

type FieldErrors = Partial<Record<string, string[]>>;

const INITIAL = {
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
  company: "", // honeypot
};

/** Public lead capture form. Posts JSON to /api/contact. */
export function ContactForm() {
  const [values, setValues] = useState(INITIAL);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const update = (key: keyof typeof INITIAL, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    setFieldErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setStatus("success");
        setValues(INITIAL);
        return;
      }

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        fieldErrors?: FieldErrors;
      };
      setFieldErrors(data.fieldErrors ?? {});
      setErrorMsg(
        data.error ??
          "No pudimos enviar tu mensaje. Intenta nuevamente o escríbenos por WhatsApp.",
      );
      setStatus("error");
    } catch {
      setStatus("error");
      setErrorMsg("Error de conexión. Revisa tu red e intenta nuevamente.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
        <h3 className="text-xl font-bold text-steel-900">
          ¡Gracias! Recibimos tu solicitud.
        </h3>
        <p className="mt-2 text-steel-600">
          Te contactaremos a la brevedad. Si es urgente, escríbenos por WhatsApp.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-semibold text-brand-700 underline"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot — visually hidden, must remain empty. */}
      <div aria-hidden className="hidden">
        <label>
          No completar
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Nombre"
          name="name"
          value={values.name}
          onChange={(v) => update("name", v)}
          errors={fieldErrors.name}
          required
        />
        <Field
          label="Correo electrónico"
          name="email"
          type="email"
          value={values.email}
          onChange={(v) => update("email", v)}
          errors={fieldErrors.email}
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Teléfono (opcional)"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={(v) => update("phone", v)}
          errors={fieldErrors.phone}
        />
        <div>
          <label
            htmlFor="service"
            className="mb-1.5 block text-sm font-medium text-steel-700"
          >
            Servicio de interés (opcional)
          </label>
          <select
            id="service"
            name="service"
            value={values.service}
            onChange={(e) => update("service", e.target.value)}
            className="w-full rounded-lg border border-steel-300 bg-white px-3 py-2.5 text-sm text-steel-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          >
            <option value="">Selecciona un servicio</option>
            {SERVICES.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-steel-700"
        >
          Mensaje <span className="text-brand-600">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Cuéntanos qué necesitas: material, medidas, cantidad, plazos…"
          className="w-full rounded-lg border border-steel-300 bg-white px-3 py-2.5 text-sm text-steel-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
        {fieldErrors.message?.[0] ? (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.message[0]}</p>
        ) : null}
      </div>

      {status === "error" && errorMsg ? (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMsg}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Enviando…" : "Enviar solicitud"}
      </button>
    </form>
  );
}

type FieldProps = {
  readonly label: string;
  readonly name: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly type?: string;
  readonly required?: boolean;
  readonly errors?: string[];
};

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  errors,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-steel-700"
      >
        {label} {required ? <span className="text-brand-600">*</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-steel-300 bg-white px-3 py-2.5 text-sm text-steel-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      />
      {errors?.[0] ? (
        <p className="mt-1 text-sm text-red-600">{errors[0]}</p>
      ) : null}
    </div>
  );
}
