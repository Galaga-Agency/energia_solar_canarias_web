'use client'

import { useForm } from 'react-hook-form'
import { Input }     from '@/components/ui/Input'
import { TextArea }  from '@/components/ui/TextArea'
import { Button }    from '@/components/ui/Button'
import { showToast } from '@/components/ui/Toaster'
import { announce }  from '@/components/ui/LiveRegion'

interface FormValues {
  name:    string
  email:   string
  message: string
}

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()

  const onSubmit = async (data: FormValues) => {
    try {
      await new Promise((res) => setTimeout(res, 800))
      void data
      showToast('Mensaje enviado correctamente')
      announce('Mensaje enviado correctamente')
      reset()
    } catch {
      showToast('Error al enviar el mensaje', 'error')
      announce('Error al enviar el mensaje', 'assertive')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <Input
        label="Nombre"
        required
        autoComplete="name"
        error={errors.name?.message}
        {...register('name', { required: 'El nombre es obligatorio' })}
      />

      <Input
        label="Correo electrónico"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        error={errors.email?.message}
        {...register('email', {
          required: 'El correo es obligatorio',
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo no válido' },
        })}
      />

      <TextArea
        label="Mensaje"
        error={errors.message?.message}
        {...register('message')}
      />

      <Button variant="filled" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando…' : 'Hablemos ▶'}
      </Button>
    </form>
  )
}
