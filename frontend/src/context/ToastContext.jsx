import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const push = useCallback((loai, noiDung) => {
    const id = crypto.randomUUID()
    setToasts((ds) => [...ds, { id, loai, noiDung }])
    setTimeout(() => setToasts((ds) => ds.filter((t) => t.id !== id)), 4200)
  }, [])

  const value = useMemo(
    () => ({
      thanhCong: (m) => push('ok', m),
      loi: (m) => push('loi', m),
    }),
    [push],
  )

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.loai}`}>
            {t.noiDung}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast cần ToastProvider')
  return ctx
}
