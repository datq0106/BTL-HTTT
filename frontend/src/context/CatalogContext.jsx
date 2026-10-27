import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { PublicTinDangApi } from '../api/services'
import { thongBaoLoi } from '../api/client'

const CatalogContext = createContext(null)

export function CatalogProvider({ children }) {
  const [khuVuc, setKhuVuc] = useState([])
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const version = useRef(0)

  const reload = useCallback(async () => {
    const current = ++version.current
    setLoading(true)
    try {
      const [khu, first] = await Promise.all([
        PublicTinDangApi.khuVuc(), PublicTinDangApi.danhSach({ trang: 0, kichThuoc: 100 }),
      ])
      const rows = [...(first.data.noiDung || [])]
      for (let trang = 1; trang < first.data.tongSoTrang; trang++) {
        const { data } = await PublicTinDangApi.danhSach({ trang, kichThuoc: 100 })
        rows.push(...(data.noiDung || []))
      }
      if (current === version.current) {
        setKhuVuc(khu.data || [])
        setListings(rows)
        setError('')
      }
    } catch (err) {
      if (current === version.current) setError(thongBaoLoi(err))
    } finally {
      if (current === version.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
    const update = () => reload()
    window.addEventListener('catalog_updated', update)
    return () => { version.current++; window.removeEventListener('catalog_updated', update) }
  }, [reload])

  const value = useMemo(() => ({
    khuVuc, listings, loading, error, reload,
    listingTheoId: (id) => listings.find((x) => x.id === id),
    khuVucTheoId: (id) => khuVuc.find((x) => x.id === id),
    loaiCan: [...new Set(listings.map((x) => x.loai))],
  }), [khuVuc, listings, loading, error, reload])

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const value = useContext(CatalogContext)
  if (!value) throw new Error('useCatalog cần CatalogProvider')
  return value
}
