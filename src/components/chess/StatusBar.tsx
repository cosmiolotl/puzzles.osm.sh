import { forwardRef, useState, type FormEvent } from 'react'
import { cn } from '@/lib/utils'

interface StatusBarProps {
  slug: string
  sideLabel: string
  progress: string
  message: string
  messageTone?: 'plain' | 'minus' | 'plus'
  canType: boolean
  onCommand: (text: string) => string | null
  hints: { key: string; label: string }[]
}

/*
  The bottom status line of the terminal: inverted, segments separated by
  rules. One row on desktop; below that it wraps into two rows so the
  progress and the message are never clipped. The command field is the
  keyboard way to move.
*/
export const StatusBar = forwardRef<HTMLInputElement, StatusBarProps>(function StatusBar(
  { slug, sideLabel, progress, message, messageTone = 'plain', canType, onCommand, hints },
  inputRef,
) {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const err = onCommand(text)
    setError(err)
    if (!err) setText('')
  }

  return (
    <footer
      className="sticky bottom-0 z-20 bg-ink text-ground text-sm leading-none"
      aria-label="Status"
    >
      <div className="flex flex-wrap lg:flex-nowrap items-stretch">
        <span className="hidden sm:flex items-center min-h-9 bg-rose text-ink px-3 font-medium whitespace-nowrap">
          {slug}
        </span>
        <span className="flex items-center min-h-9 px-3 whitespace-nowrap border-r border-ground/20">
          {sideLabel}
        </span>
        <span className="flex items-center min-h-9 px-3 whitespace-nowrap tabular-nums lg:border-r border-ground/20">
          {progress}
        </span>

        <div className="flex basis-full lg:basis-auto lg:flex-1 items-stretch min-h-9 border-t border-ground/20 lg:border-t-0 min-w-0">
          <span
            role="status"
            aria-live="polite"
            className={cn(
              'flex items-center px-3 whitespace-nowrap overflow-hidden text-ellipsis min-w-0',
              messageTone === 'minus' && 'text-[#e8b4b4]',
              messageTone === 'plus' && 'text-[#bfe0c2]',
            )}
          >
            {error ?? message}
          </span>

          <form
            onSubmit={submit}
            className={cn(
              'ml-auto items-center px-3 gap-2 border-l border-ground/20 shrink-0',
              canType ? 'flex' : 'hidden sm:flex',
            )}
          >
            <label htmlFor="move-command" className="text-rose select-none">
              :
            </label>
            <input
              id="move-command"
              ref={inputRef}
              type="text"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="go"
              disabled={!canType}
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                if (error) setError(null)
              }}
              placeholder={canType ? 'Nf3 or e2e4' : 'solved'}
              aria-label="Type a move and press enter"
              className="w-[12ch] sm:w-[16ch] bg-transparent border-0 outline-none text-ground placeholder:text-ground/60 disabled:opacity-60 focus-visible:outline-none"
            />
          </form>

          <ul className="hidden lg:flex items-center gap-4 px-3 border-l border-ground/20 text-ground/70 whitespace-nowrap">
            {hints.map((h) => (
              <li key={h.key} className="flex items-center gap-1.5">
                <kbd className="font-medium text-ground">{h.key}</kbd>
                <span>{h.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
})
