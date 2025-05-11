import { useState, useEffect } from 'react'
import { Asset } from '@/types'
import { fetchAssets } from '@/lib/api'

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAssets = async () => {
    try {
      setLoading(true)
      const data = await fetchAssets()
      setAssets(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加載資產時發生錯誤')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAssets()

    // 設置自動刷新
    const interval = setInterval(() => {
      loadAssets()
    }, Number(process.env.NEXT_PUBLIC_ASSET_UPDATE_INTERVAL || 5) * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return {
    assets,
    loading,
    error,
    refresh: loadAssets
  }
} 