import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table } from '@consta/uikit/Table'
import { Pagination } from '@consta/uikit/Pagination'
import { ChoiceGroup } from '@consta/uikit/ChoiceGroup'
import { Button } from '@consta/uikit/Button'
import { Loader } from '@consta/uikit/Loader'
import { IconArrowLeft } from '@consta/icons/IconArrowLeft'
import { useToken } from '../hooks/useToken'

import styles from './PostsPage.module.css'

interface Post {
  id: number
  title: string
}

interface Row {
  id: string
  title: string
}

const columns = [
  { title: 'ID', accessor: 'id' as const, width: 100 },
  { title: 'Заголовок', accessor: 'title' as const },
]

const pageSizeOptions = [10, 25, 50]

export default function PostsPage() {
  const { token } = useToken()
  const navigate = useNavigate()

  const [rows, setRows] = useState<Row[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) return

    async function fetchPosts() {
      setLoading(true)
      try {
        const res = await fetch(
          `https://gorest.co.in/public/v2/posts?page=${page}&per_page=${perPage}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        const total = Number(res.headers.get('x-pagination-pages')) || 1
        setTotalPages(total)

        const data: Post[] = await res.json()
        if (!Array.isArray(data)) return

        setRows(data.map((post) => ({ id: String(post.id), title: post.title })))
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [token, page, perPage])

  function handlePerPageChange(value: number) {
    setPerPage(value)
    setPage(1)
  }

  return (
    <div className={styles.page}>
      <Button
        label="Назад"
        iconLeft={IconArrowLeft}
        view="ghost"
        onClick={() => navigate('/')}
        className={styles.back}
      />

      {loading ? (
        <div className={styles.loader}>
          <Loader />
        </div>
      ) : (
        <Table
          columns={columns}
          rows={rows}
          onRowClick={({ id }) => navigate(`/posts/${id}`)}
        />
      )}

      <div className={styles.controls}>
        <Pagination
          items={totalPages}
          value={page}
          onChange={setPage}
          arrows={[{ label: 'Предыдущая' }, { label: 'Следующая' }]}
          visibleCount={5}
        />

        <ChoiceGroup
          name="perPage"
          items={pageSizeOptions}
          value={perPage}
          onChange={handlePerPageChange}
          getItemLabel={(item: number) => String(item)}
        />
      </div>
    </div>
  )
}
