import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table } from '@consta/uikit/Table'
import { Pagination } from '@consta/uikit/Pagination'
import { ChoiceGroup } from '@consta/uikit/ChoiceGroup'
import { Button } from '@consta/uikit/Button'
import { Loader } from '@consta/uikit/Loader'
import { IconArrowLeft } from '@consta/icons/IconArrowLeft'
import { ResponsesEmptyBox } from '@consta/uikit/ResponsesEmptyBox'
import { useToken } from '../hooks/useToken'

import styles from './UsersPage.module.css'

interface User {
  id: number
  name: string
  email: string
}

interface Row {
  id: string
  firstName: string
  lastName: string
  email: string
}

const columns = [
  { title: 'Имя', accessor: 'firstName' as const, width: 250 },
  { title: 'Фамилия', accessor: 'lastName' as const, width: 250 },
  { title: 'Email', accessor: 'email' as const, width: 350 },
]

const pageSizeOptions = [10, 25, 50]

function splitName(name: string) {
  const [firstName, ...rest] = name.trim().split(' ')

  return { firstName, lastName: rest.join(' ') }
}

export default function UsersPage() {
  const { token } = useToken()
  const navigate = useNavigate()

  const [rows, setRows] = useState<Row[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [loading, setLoading] = useState(false)
  const [networkError, setNetworkError] = useState(false)

  useEffect(() => {
    if (!token) return

    async function fetchUsers() {
      setLoading(true)
      setNetworkError(false)
      
      try {
        const res = await fetch(
          `https://gorest.co.in/public/v2/users?page=${page}&per_page=${perPage}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        const total = Number(res.headers.get('x-pagination-pages')) || 1
        setTotalPages(total)

        const data: User[] = await res.json()
        if (!Array.isArray(data)) return

        setRows(
          data.map((user) => ({
            id: String(user.id),
            ...splitName(user.name),
            email: user.email,
          }))
        )
      } catch {
        setNetworkError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
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
      ) : networkError ? (
        <div className={styles.networkError}>
          <ResponsesEmptyBox
            title="Нет соединения"
            description="Проверьте подключение к интернету и попробуйте снова"
            actions={
              <Button
                label="Перезагрузить"
                view="ghost"
                onClick={() => window.location.reload()}
              />
            }
          />
        </div>
      ) : (
        <Table
          columns={columns}
          rows={rows}
          onRowClick={({ id }) => navigate(`/users/${id}`)}
        />
      )}
      
      {!networkError && (
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
      )}
    </div>
  )
}
