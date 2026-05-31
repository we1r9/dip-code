import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField } from '@consta/uikit/TextField'
import { Button } from '@consta/uikit/Button'
import { ChoiceGroup } from '@consta/uikit/ChoiceGroup'
import { useToken } from '../hooks/useToken'

import styles from './HomePage.module.css'

type Mode = 'users' | 'posts'

const modes: Mode[] = ['users', 'posts']

const modeLabels: Record<Mode, string> = {
  users: 'Пользователи',
  posts: 'Посты',
}

export default function HomePage() {
  const { setToken } = useToken()
  const navigate = useNavigate()

  const [inputValue, setInputValue] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('users')
  const [error, setError] = useState(false)

  function handleSubmit() {
    if (!inputValue || inputValue.trim() === '') {
      setError(true)

      return
    }

    setToken(inputValue.trim())
    navigate(`/${mode}`)
  }

  return (
    <div className={styles.page}>
      <div className={styles.form}>
        <ChoiceGroup
          name="mode"
          items={modes}
          value={mode}
          onChange={setMode}
          getItemLabel={(item: Mode) => modeLabels[item]}
        />

        <div className={styles.inputRow}>
          <div className={styles.inputWrapper}>
            <TextField
              value={inputValue}
              onChange={setInputValue}
              placeholder="Введите токен"
              status={error ? 'alert' : undefined}
              caption={error ? 'Токен не может быть пустым' : undefined}
              label="Access token"
            />
          </div>

          <Button
            className={styles.submitButton}
            label="Войти"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}
