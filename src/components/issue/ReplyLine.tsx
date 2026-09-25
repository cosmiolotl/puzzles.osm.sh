import { useEffect, useState, type FormEvent } from 'react'
import { CornerDownLeft } from 'lucide-react'
import { submitAnswer } from '@/server/issues.fn'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAME_KEY = 'puzzles.osm.sh:name'

interface ReplyLineProps {
  issueId: string
}

type Tone = 'plain' | 'minus'

/*
  The reply line: two prompts on one command line, then the verdict typed
  back on the next line, the way a shell answers.
*/
export function ReplyLine({ issueId }: ReplyLineProps) {
  const [name, setName] = useState('')
  const [answer, setAnswer] = useState('')
  const [pending, setPending] = useState(false)
  const [response, setResponse] = useState<{ text: string; tone: Tone } | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(NAME_KEY)
      if (saved) setName(saved)
    } catch {
    }
  }, [])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (pending) return
    setPending(true)
    setResponse(null)
    try {
      const result = await submitAnswer({ data: { issueId, name, answer } })
      if (!result.ok) {
        setResponse({ text: result.message, tone: 'minus' })
        return
      }
      try {
        localStorage.setItem(NAME_KEY, name.trim())
      } catch {
        // Storage is optional; the server has already received the answer.
      }
      setResponse({ text: result.message, tone: 'plain' })
      setAnswer('')
    } catch {
      setResponse({ text: 'could not reach the server. try again in a moment', tone: 'minus' })
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-6" aria-label="Submit an answer">
      <p className="text-ink-3 text-sm">
        <span className="select-none">#&nbsp;</span>
        reply with your name and answer. answers are reviewed before names appear.
      </p>
      <div
        className="mt-2 flex flex-col sm:flex-row sm:items-stretch gap-2 sm:gap-0 border-y border-rule sm:divide-x sm:divide-rule"
      >
        <label className="flex items-center gap-2 px-1 py-2 sm:pr-4">
          <span className="text-rose-ink select-none" aria-hidden="true">
            &gt;
          </span>
          <span className="sr-only">name</span>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name"
            autoComplete="nickname"
            maxLength={32}
            required
            className="w-full sm:w-[18ch] bg-transparent border-0 outline-none focus-visible:outline-none placeholder:text-ink-3"
          />
        </label>
        <label className="flex items-center gap-2 px-1 py-2 sm:pl-4 flex-1 border-t border-rule sm:border-t-0">
          <span className="text-rose-ink select-none" aria-hidden="true">
            &gt;
          </span>
          <span className="sr-only">answer</span>
          <input
            type="text"
            name="answer"
            aria-label="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="answer"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            maxLength={64}
            required
            className="w-full bg-transparent border-0 outline-none focus-visible:outline-none placeholder:text-ink-3"
          />
          <Button type="submit" size="sm" disabled={pending} aria-label="Submit answer">
            <CornerDownLeft /> {pending ? 'sending' : 'submit'}
          </Button>
        </label>
      </div>
      <p
        role="status"
        aria-live="polite"
        className={cn(
          'mt-2 min-h-[1.5em] text-sm',
          response?.tone === 'minus' && 'text-minus',
          !response && 'text-ink-3',
        )}
      >
        {response ? response.text : ' '}
      </p>
    </form>
  )
}
