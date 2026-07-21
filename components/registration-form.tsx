"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";

interface Helper {
  id: string;
  helperTitle: string;
  helperDescription: string;
  purposeLabel: string | null;
  linkUrl: string;
  linkLabel: string;
  isActive: boolean;
}

interface Option {
  id: string;
  label: string;
  value: string;
  helper: Helper | null;
}

interface Question {
  id: string;
  label: string;
  description: string | null;
  inputType: string;
  required: boolean;
  fieldKey: string | null;
  options: Option[];
}

interface EventWithQuestions {
  id: string;
  title: string;
  registrationsOpen: boolean;
  questions: Question[];
}

export function RegistrationForm({ event }: { event: EventWithQuestions }) {
  const { data: session } = useSession();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const visibleHelpers = useMemo(() => {
    return event.questions
      .flatMap((question) => question.options)
      .filter((option) => selectedOptions[option.id] === option.value && option.helper?.isActive)
      .map((option) => option.helper as Helper);
  }, [event.questions, selectedOptions]);

  return (
    <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Iscriviti all’evento</h2>
        <p className="mt-2 text-sm text-slate-600">
          L’iscrizione è sempre gratuita. Eventuali collette PayPal sono mostrate solo come supporto informativo.
        </p>
      </div>

      {!session?.user ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Per completare l’iscrizione devi prima accedere dalla pagina di login.
        </div>
      ) : null}

      <form className="space-y-6">
        {event.questions.map((question) => (
          <div key={question.id} className="space-y-3">
            <label className="block text-sm font-semibold text-slate-900">{question.label}</label>
            {question.description ? <p className="text-sm text-slate-500">{question.description}</p> : null}
            {question.inputType === "TEXT" ? (
              <input className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-brand-200 focus:ring" />
            ) : null}
            {question.inputType === "RADIO" ? (
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label key={option.id} className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-50">
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      onChange={() => setSelectedOptions((current) => ({ ...current, [option.id]: option.value }))}
                    />
                    <span className="text-sm text-slate-700">{option.label}</span>
                  </label>
                ))}
              </div>
            ) : null}
          </div>
        ))}

        {visibleHelpers.length > 0 ? (
          <div className="space-y-4 rounded-2xl border border-brand-200 bg-brand-50 p-5">
            {visibleHelpers.map((helper) => (
              <div key={helper.id} className="space-y-2">
                <h3 className="text-lg font-semibold text-brand-900">{helper.helperTitle}</h3>
                {helper.purposeLabel ? <p className="text-sm font-medium text-brand-700">{helper.purposeLabel}</p> : null}
                <p className="text-sm text-brand-900">{helper.helperDescription}</p>
                <a href={helper.linkUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">
                  {helper.linkLabel}
                </a>
              </div>
            ))}
          </div>
        ) : null}

        <button type="button" className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800">
          Conferma iscrizione (demo UI)
        </button>
      </form>
    </div>
  );
}
