import { useNavigate } from 'react-router-dom'
import { Button } from '@consta/uikit/Button'
import { ResponsesEmptyPockets } from '@consta/uikit/ResponsesEmptyPockets'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <ResponsesEmptyPockets
        title="Страница не найдена"
        description="Возможно, вы перешли по неверной ссылке"
        actions={
          <Button
            label="На главную"
            view="primary"
            onClick={() => navigate('/')}
          />
        }
      />
    </div>
  )
}
