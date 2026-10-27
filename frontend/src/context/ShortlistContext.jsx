import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { listingTheoId } from '../data/listings'

const KEY = 'maisoncu-shortlist'
const ShortlistContext = createContext(null)

function docLocal() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(raw) ? raw.filter(Boolean) : []
  } catch {
    return []
  }
}

export function ShortlistProvider({ children }) {
  const [ids, setIds] = useState(docLocal)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ids))
  }, [ids])

  const value = useMemo(() => {
    const ds = ids.map(listingTheoId).filter(Boolean)
    return {
      ids,
      ds,
      soLuong: ds.length,
      coTrong(id) {
        return ids.includes(id)
      },
      dao(id) {
        setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id].slice(-12)))
      },
      them(id) {
        setIds((cur) => (cur.includes(id) ? cur : [...cur, id].slice(-12)))
      },
      xoa(id) {
        setIds((cur) => cur.filter((x) => x !== id))
      },
      xoaHet() {
        setIds([])
      },
    }
  }, [ids])

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>
}

export function useShortlist() {
  const ctx = useContext(ShortlistContext)
  if (!ctx) throw new Error('useShortlist cần ShortlistProvider')
  return ctx
}
