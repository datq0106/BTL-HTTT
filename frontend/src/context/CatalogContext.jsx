import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { PublicTinDangApi } from '../api/services'
import { thongBaoLoi } from '../api/client'

const CatalogContext = createContext(null)

async function taiCatalog() {
  const [khu, first] = await Promise.all([
    PublicTinDangApi.khuVuc(), PublicTinDangApi.danhSach({ trang: 0, kichThuoc: 100 }),
  ])
  const rows = [...(first.data.noiDung || [])]
  for (let trang = 1; trang < first.data.tongSoTrang; trang++) {
    const { data } = await PublicTinDangApi.danhSach({ trang, kichThuoc: 100 })
    rows.push(...(data.noiDung || []))
  }
  return { khuVuc: khu.data || [], listings: rows }
}

export function CatalogProvider({ children }) {
  const [khuVuc, setKhuVuc] = useState([])
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const version = useRef(0)

  const fetchAll = useCallback(() => {
    const current = ++version.current
    return taiCatalog()
      .then((data) => {
        if (current !== version.current) return
        setKhuVuc(data.khuVuc)
        setListings(data.listings)
        setError('')
      })
      .catch((err) => { if (current === version.current) setError(thongBaoLoi(err)) })
      .finally(() => { if (current === version.current) setLoading(false) })
  }, [])

  const reload = useCallback(() => {
    setLoading(true)
    return fetchAll()
  }, [fetchAll])

  useEffect(() => {
    const ref = version
    fetchAll()
    window.addEventListener('catalog_updated', reload)
    return () => { ref.current++; window.removeEventListener('catalog_updated', reload) }
  }, [fetchAll, reload])

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
