import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'
import { Avatar } from '@consta/uikit/Avatar'
import { Loader } from '@consta/uikit/Loader'
import { IconArrowLeft } from '@consta/icons/IconArrowLeft'
import { ResponsesEmptyPockets } from '@consta/uikit/ResponsesEmptyPockets'
import { ResponsesEmptyBox } from '@consta/uikit/ResponsesEmptyBox'
import { useToken } from '../hooks/useToken'

import styles from './PostCardPage.module.css'

interface Post {
  id: number
  title: string
  body: string
  user_id: number
}

interface Comment {
  id: number
  name: string
  email: string
  body: string
}

function formatAuthorName(name: string): string {
  const parts = name.trim().split(' ')
  const lastInitial = parts[1] ? ` ${parts[1][0]}.` : ''

  return `${parts[0]}${lastInitial}`
}

export default function PostCardPage() {
  const { id } = useParams()
  const { token } = useToken()
  const navigate = useNavigate()

  const [post, setPost] = useState<Post | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [networkError, setNetworkError] = useState(false)
  const [authorName, setAuthorName] = useState<string | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token || !id) return

    async function fetchData() {
      setLoading(true)
      setNotFound(false)
      setNetworkError(false)
      
      try {
        const [postRes, commentsRes] = await Promise.all([
          fetch(`https://gorest.co.in/public/v2/posts/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`https://gorest.co.in/public/v2/posts/${id}/comments`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        if (!postRes.ok) {
          if (postRes.status === 404) setNotFound(true)
          else setNetworkError(true)
          return
        }

        const postData: Post = await postRes.json()
        const commentsData: Comment[] = commentsRes.ok ? await commentsRes.json() : []

        setPost(postData)
        document.title = postData.title.split(' ').slice(0, 3).join(' ') + '...'
        if (Array.isArray(commentsData)) setComments(commentsData)

        const userRes = await fetch(
          `https://gorest.co.in/public/v2/users/${postData.user_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (userRes.ok) {
          const userData = await userRes.json()

          setAuthorName(userData?.name ? formatAuthorName(userData.name) : 'Аноним')
        } else {
          setAuthorName('Аноним')
        }
      } catch {
        setNetworkError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token, id])

  return (
    <div className={styles.page}>
      <Button
        label="Назад"
        iconLeft={IconArrowLeft}
        view="ghost"
        onClick={() => navigate('/posts')}
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
                view="primary"
                onClick={() => window.location.reload()}
              />
            }
          />
        </div>
      ) : notFound ? (
        <div className={styles.notFound}>
          <ResponsesEmptyPockets
            title="Пост не найден"
            description="Возможно, он был удален"
            actions={
              <></>
            }
          />
        </div>
      ) : post ? (
        <div className={styles.content}>
          <Card
            verticalSpace="xl"
            horizontalSpace="xl"
            className={styles.card}>

            {authorName && (
              <div className={styles.postHeader}>
                <Avatar name={authorName} size="m" form="round" />

                <Text size="m" weight="semibold">{authorName}</Text>
              </div>
            )}

            <Text size="xl" weight="semibold" className={styles.title}>
              {post.title}
            </Text>

            <Text size="m" view="secondary">
              {post.body}
            </Text>
          </Card>

          <div className={styles.comments}>
            {comments.length > 0 && (
              <Text size="l" weight="semibold" className={styles.commentsTitle}>
                Комментарии ({comments.length})
              </Text>
            )}

            {comments.length > 0 ? (
              comments.map((comment) => (
                <Card
                  key={comment.id}
                  verticalSpace="m"
                  horizontalSpace="l"
                  className={styles.comment}
                >
                  <div className={styles.commentHeader}>
                    <Avatar name={comment.name} size="s" form="round" />

                    <Text size="s" weight="semibold">{formatAuthorName(comment.name)}</Text>
                  </div>

                  <Text size="s">
                    {comment.body}
                  </Text>
                </Card>
              ))
            ) : (
              <div className={styles.empty}>
                <Text size="m" weight="semibold">Здесь пока что пусто</Text>

                <Text size="s" view="secondary">Станьте первым, кто оставит комментарий</Text>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
