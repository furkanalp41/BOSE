import clsx from 'clsx'

const STATUS_LABEL = { connecting: 'Connecting…', live: 'LIVE', error: 'Reconnecting…' }
const STATUS_COLOR = { connecting: 'text-yellow-400', live: 'text-bull', error: 'text-bear' }

export default function StatusBar({ status }) {
  return (
    <div className="flex items-center gap-2 font-mono text-xs">
      <span className="relative flex h-2 w-2">
        <span
          className={clsx(
            'absolute inline-flex h-full w-full rounded-full opacity-75',
            status === 'live' ? 'bg-bull animate-ping' : status === 'error' ? 'bg-bear animate-ping' : 'bg-yellow-400 animate-ping'
          )}
        />
        <span
          className={clsx(
            'relative inline-flex h-2 w-2 rounded-full',
            status === 'live' ? 'bg-bull' : status === 'error' ? 'bg-bear' : 'bg-yellow-400'
          )}
        />
      </span>
      <span className={clsx('font-semibold tracking-widest uppercase text-[10px]', STATUS_COLOR[status])}>
        {STATUS_LABEL[status]}
      </span>
    </div>
  )
}
