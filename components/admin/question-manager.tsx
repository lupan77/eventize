interface Helper {
  id: string;
  helperTitle: string;
  helperDescription: string;
  purposeLabel: string | null;
  linkUrl: string;
  linkLabel: string;
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
  kind: string;
  options: Option[];
}

interface EventWithQuestions {
  id: string;
  questions: Question[];
}

export function QuestionManager({ event }: { event: EventWithQuestions }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Domande e helper contestuali</h2>
          <p className="mt-2 text-sm text-slate-600">Visualizzazione delle domande configurate per l’evento, incluse le opzioni che attivano una colletta PayPal.</p>
        </div>
        <button className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">Aggiungi domanda</button>
      </div>
      <div className="mt-6 space-y-4">
        {event.questions.map((question) => (
          <div key={question.id} className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{question.label}</h3>
                <p className="text-sm text-slate-500">{question.kind.toLowerCase()} · {question.inputType.toLowerCase()}</p>
                {question.description ? <p className="mt-2 text-sm text-slate-600">{question.description}</p> : null}
              </div>
            </div>
            {question.options.length > 0 ? (
              <div className="mt-4 space-y-3">
                {question.options.map((option) => (
                  <div key={option.id} className="rounded-xl bg-slate-50 p-4">
                    <p className="font-medium text-slate-900">{option.label}</p>
                    <p className="text-sm text-slate-500">Valore: {option.value}</p>
                    {option.helper ? (
                      <div className="mt-3 rounded-xl border border-brand-200 bg-brand-50 p-4">
                        <p className="font-semibold text-brand-900">{option.helper.helperTitle}</p>
                        {option.helper.purposeLabel ? <p className="mt-1 text-sm font-medium text-brand-700">{option.helper.purposeLabel}</p> : null}
                        <p className="mt-1 text-sm text-brand-900">{option.helper.helperDescription}</p>
                        <a href={option.helper.linkUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-semibold text-brand-700 underline">
                          {option.helper.linkLabel}
                        </a>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
