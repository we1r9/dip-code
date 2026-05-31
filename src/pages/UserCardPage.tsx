import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'
import { Badge } from '@consta/uikit/Badge'
import { Avatar } from '@consta/uikit/Avatar'
import { Loader } from '@consta/uikit/Loader'
import { IconArrowLeft } from '@consta/icons/IconArrowLeft'
import { ResponsesEmptyBox } from '@consta/uikit/ResponsesEmptyBox'
import { useToken } from '../hooks/useToken'

import styles from './UserCardPage.module.css'

interface User {
  id: number
  name: string
  email: string
  gender: string
  status: string
}

export default function UserCardPage() {
  const { id } = useParams()
  const { token } = useToken()
  const navigate = useNavigate()

  const [user, setUser] = useState<User | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [networkError, setNetworkError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token || !id) return

    async function fetchUser() {
      setLoading(true)
      setNotFound(false)
      setNetworkError(false)

      try {
        const res = await fetch(`https://gorest.co.in/public/v2/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          setNotFound(true)
          return
        }

        const data: User = await res.json()
        setUser(data)
      } catch {
        setNetworkError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [token, id])

  return (
    <div className={styles.page}>
      <Button
        label="Назад"
        iconLeft={IconArrowLeft}
        view="ghost"
        onClick={() => navigate('/users')}
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
      ) : notFound ? (
        <div className={styles.notFound}>
          <ResponsesEmptyBox
            title="Пользователь не найден"
            description="Возможно, он был удален"
            actions={
              <></>
            }
          />
        </div>
      ) : user ? (
        <Card
          verticalSpace="xl"
          horizontalSpace="xl"
          className={styles.card}
        >
          <div className={styles.avatarWrapper}>
            <Avatar
              name={user.name}
              size="l"
              form="round"
              className={styles.avatar}
            />
          </div>

          <div className={styles.header}>
            <Text size="2xl" weight="semibold">
              {user.name}
            </Text>

            <Badge
              label={user.status === 'active' ? 'Активен' : 'Неактивен'}
              status={user.status === 'active' ? 'success' : 'error'}
            />
          </div>

          <div className={styles.fields}>
            <div className={styles.field}>
              <Text size="s" view="secondary">ID</Text>

              <Text size="m">{user.id}</Text>
            </div>

            <div className={styles.field}>
              <Text size="s" view="secondary">Email</Text>

              <Text size="m">{user.email}</Text>
            </div>

            <div className={styles.field}>
              <Text size="s" view="secondary">Пол</Text>

              <Text size="m">
                {user.gender === 'male' ? 'Мужской' : 'Женский'}
              </Text>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
