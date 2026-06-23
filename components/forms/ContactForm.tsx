'use client'

import { useForm } from 'react-hook-form'
import { Button }    from '@/components/ui/Button'
import { showToast } from '@/components/ui/Toaster'
import { announce }  from '@/components/ui/LiveRegion'

interface FormValues {
  name:    string
  email:   string
  message: string
}

/* Field on the dark poster — underline that lights up orange on focus. */
const fieldCls =
  'peer w-full border-0 border-b border-[#f4f1ea]/25 bg-transparent pb-3 pt-2 ' +
  'text-body !text-[#f4f1ea] placeholder:text-[#f4f1ea]/35 caret-primary ' +
  'focus:border-primary outline-none! focus-visible:outline-none! transition-colors ' +
  'aria-[invalid=true]:border-danger'

const labelCls =
  'mb-1 block text-label font-mono text-[#f4f1ea]/45! peer-focus:text-primary! transition-colors'

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
    <div className="relative isolate overflow-hidden bg-[#1f3a34] text-[#f4f1ea] p-8 md:p-12">
      {/* Poster header */}
      <span className="text-label font-mono italic text-primary!">Formulario</span>
      <h3 className="text-title text-[#f4f1ea]! mt-4">
        Cuéntanos tu{' '}
        <em className="italic font-normal text-primary">proyecto.</em>
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-10 flex flex-col gap-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Name */}
          <div className="flex flex-col">
            <input
              id="name"
              placeholder="Tu nombre"
              autoComplete="name"
              aria-invalid={!!errors.name}
              className={`${fieldCls} order-2`}
              {...register('name', { required: 'El nombre es obligatorio' })}
            />
            <label htmlFor="name" className={`${labelCls} order-1`}>Nombre</label>
            {errors.name && <p role="alert" className="order-3 mt-2 text-label text-danger!">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <input
              id="email"
              type="email"
              inputMode="email"
              placeholder="tu@correo.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              className={`${fieldCls} order-2`}
              {...register('email', {
                required: 'El correo es obligatorio',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo no válido' },
              })}
            />
            <label htmlFor="email" className={`${labelCls} order-1`}>Correo electrónico</label>
            {errors.email && <p role="alert" className="order-3 mt-2 text-label text-danger!">{errors.email.message}</p>}
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col">
          <textarea
            id="message"
            rows={4}
            placeholder="Cuéntanos sobre tu proyecto…"
            className={`${fieldCls} order-2 resize-none`}
            {...register('message')}
          />
          <label htmlFor="message" className={`${labelCls} order-1`}>Mensaje</label>
        </div>

        <Button variant="filled" type="submit" disabled={isSubmitting} className="self-start">
          {isSubmitting ? 'Enviando…' : 'Hablemos'} <span aria-hidden>↗</span>
        </Button>
      </form>
    </div>
  )
}
