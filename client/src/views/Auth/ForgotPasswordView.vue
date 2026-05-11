<script setup lang="ts">
import { forgotPasswordMutation } from '@/api/@pinia/colada.gen'
import { zForgotPasswordData } from '@/api/zod.gen'
import { useMutation } from '@pinia/colada'
import { useHead } from '@unhead/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'

const isSubmitted = ref(false)

useHead({
  title: () => (isSubmitted.value ? 'E-mail enviado' : 'Esqueci minha senha'),
})

const { mutate, isLoading } = useMutation({
  ...forgotPasswordMutation(),
  onSuccess: () => {
    isSubmitted.value = true
  },
  onError: (error) => {
    const message = error.response?.data?.message || 'Ocorreu um erro inesperado. Tente novamente.'
    setFieldError('email', message)
  },
})

const { errors, defineField, handleSubmit, meta, setFieldError } = useForm({
  validationSchema: toTypedSchema(zForgotPasswordData.shape.body),
  initialValues: {
    email: '',
  },
})

const [email] = defineField('email')

const handleRecover = handleSubmit((values) => {
  mutate({ body: values })
})
</script>

<template>
  <AuthForm v-if="isSubmitted">
    <template #title> E-mail enviado </template>

    <template #content>
      <div class="flex flex-col items-center py-6 text-center">
        <div
          class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600"
        >
          <i-ic:outline-email class="size-10" />
        </div>
        <p class="text-base text-neutral-600">
          Enviamos as instruções de recuperação de senha para o e-mail <strong>{{ email }}</strong
          >.
        </p>
        <p class="mt-4 text-sm text-neutral-500">
          Caso não receba o e-mail em alguns minutos, verifique sua caixa de spam.
        </p>
      </div>
    </template>

    <template #footer>
      <AuthLink :to="{ name: 'login' }"> Voltar para o login </AuthLink>
    </template>
  </AuthForm>

  <AuthForm v-else @submit="handleRecover">
    <template #title> Esqueci minha senha </template>

    <template #subtitle>
      Digite seu e-mail para receber as instruções de recuperação de senha.
    </template>

    <template #content>
      <AuthInput v-model="email" name="email" label="E-mail" type="email" :error="errors.email" />

      <div class="my-20 flex justify-center">
        <AuthButton
          type="submit"
          label="Recuperar senha"
          :loading="isLoading"
          :disabled="isLoading || !meta.valid"
        />
      </div>
    </template>

    <template #footer>
      <AuthLink :to="{ name: 'login' }"> Voltar para o login </AuthLink>
    </template>
  </AuthForm>
</template>
