<script setup lang="ts">
import { loginUserMutation } from '@/api/@pinia/colada.gen'
import { zLoginUserData } from '@/api/zod.gen'
import { useAuthStore } from '@/stores/auth'
import { useMutation } from '@pinia/colada'
import { useHead } from '@unhead/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const message = ref<string | null>(null)
const remember = ref(false)

useHead({ title: 'Entrar na conta' })

const { errors, defineField, handleSubmit, meta } = useForm({
  validationSchema: toTypedSchema(zLoginUserData.shape.body),
  initialValues: {
    email: '',
    password: '',
  },
})

const [email] = defineField('email')
const [password] = defineField('password')

const { mutate, isLoading } = useMutation({
  ...loginUserMutation(),
  onSuccess(data) {
    auth.setUser(data.user)
    router.push({ name: 'game-home' })
  },
  onError(error) {
    message.value = error.response?.data?.message || 'Ocorreu um erro inesperado. Tente novamente.'
  },
})

const handleLogin = handleSubmit((values) => {
  message.value = null
  mutate({
    body: values,
  })
})
</script>

<template>
  <AuthForm @submit="handleLogin">
    <template #title> Entrar na conta </template>

    <template #content>
      <p v-if="message" class="mb-4 text-center text-sm font-medium text-red-600">
        {{ message }}
      </p>

      <div class="flex flex-col gap-4">
        <AuthInput v-model="email" name="email" label="E-mail" type="email" :error="errors.email" />

        <AuthInput
          v-model="password"
          name="password"
          label="Senha"
          type="password"
          :error="errors.password"
        />
      </div>

      <div class="mt-4 flex justify-start">
        <AuthCheckbox v-model="remember" id="rememberme" label="Manter login" />
      </div>

      <div class="my-10 flex justify-center md:my-20">
        <AuthButton
          type="submit"
          title="Entrar"
          :loading="isLoading"
          :disabled="isLoading || !meta.valid"
        />
      </div>
    </template>

    <template #footer>
      <AuthLink :to="{ name: 'forgot-password' }"> Não consegue entrar? </AuthLink>
      <AuthLink :to="{ name: 'register' }"> Criar conta </AuthLink>
    </template>
  </AuthForm>
</template>
