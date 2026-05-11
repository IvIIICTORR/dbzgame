<script setup lang="ts">
import { createUserMutation } from '@/api/@pinia/colada.gen'
import { zCreateUserData } from '@/api/zod.gen'
import { useMutation } from '@pinia/colada'
import { useHead } from '@unhead/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'

const router = useRouter()
const messageError = ref<string | null>(null)

useHead({ title: 'Criar Conta' })

const registerSchema = toTypedSchema(
  zCreateUserData.shape.body
    .extend({
      confirmPassword: z.string().min(1, 'A confirmação de senha é obrigatória'),
      acceptedTerms: z.boolean().refine((val) => val === true, {
        message: 'Você deve aceitar os termos de uso.',
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'As senhas não coincidem',
      path: ['confirmPassword'],
    }),
)

const { errors, defineField, handleSubmit, meta } = useForm({
  validationSchema: registerSchema,
  initialValues: {
    name: '',
    username: '',
    race: 'human',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  },
})

const [name] = defineField('name')
const [username] = defineField('username')
const [email] = defineField('email')
const [race] = defineField('race')
const [password] = defineField('password')
const [confirmPassword] = defineField('confirmPassword')
const [acceptedTerms] = defineField('acceptedTerms')

const raceOptions = [
  { label: 'Humano', value: 'human' },
  { label: 'Saiya-jin', value: 'saiyan' },
  { label: 'Namekuseijin', value: 'namekian' },
  { label: 'Majin', value: 'majin' },
  { label: 'Android', value: 'android' },
  { label: 'Raça Freeza', value: 'frieza_race' },
]

const { mutate, isLoading } = useMutation({
  ...createUserMutation(),
  onSuccess: () => {
    router.push({ name: 'login' })
  },
  onError: (error) => {
    messageError.value =
      error.response?.data?.message || 'Ocorreu um erro inesperado. Tente novamente.'
  },
})

const handleRegister = handleSubmit(({ confirmPassword: _, ...values }) => {
  mutate({ body: { ...values, acceptedTerms: true } })
})
</script>

<template>
  <AuthForm @submit="handleRegister">
    <template #title> Criar Conta </template>

    <template #content>
      <div v-if="messageError" class="mb-4 text-center text-sm text-red-500">
        {{ messageError }}
      </div>

      <div class="flex flex-col gap-4">
        <AuthInput v-model="name" name="name" label="Nome de Exibição" :error="errors.name" />
        <AuthInput
          v-model="username"
          name="username"
          label="Nome de Usuário"
          :error="errors.username"
        />
        <AuthInput v-model="email" name="email" label="E-mail" type="email" :error="errors.email" />
        <AuthSelect
          v-model="race"
          name="race"
          label="Raça"
          :options="raceOptions"
          :error="errors.race"
        />
        <AuthInput
          v-model="password"
          name="password"
          label="Senha"
          type="password"
          :error="errors.password"
        />
        <AuthInput
          v-model="confirmPassword"
          name="confirmPassword"
          label="Confirmar Senha"
          type="password"
          :error="errors.confirmPassword"
        />
      </div>

      <div class="mt-6">
        <AuthCheckbox
          v-model="acceptedTerms"
          id="acceptedTerms"
          label="Eu aceito os termos e condições"
          :error="errors.acceptedTerms"
        />
      </div>

      <div class="my-10 flex justify-center">
        <AuthButton
          type="submit"
          label="Cadastrar"
          :loading="isLoading"
          :disabled="isLoading || !meta.valid"
        />
      </div>
    </template>

    <template #footer>
      <AuthLink :to="{ name: 'login' }"> Entrar na conta </AuthLink>
    </template>
  </AuthForm>
</template>
