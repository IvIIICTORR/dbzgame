<script setup lang="ts">
import { resetPasswordMutation, verifyPasswordTokenQuery } from '@/api/@pinia/colada.gen'
import { zResetPasswordData } from '@/api/zod.gen'
import { useMutation, useQuery } from '@pinia/colada'
import { useHead } from '@unhead/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isSuccess = ref(false)

const token = computed(() => route.query.token as string)

useHead({ title: 'Redefinir senha' })

const { isLoading: isValidatingToken } = useQuery({
  ...verifyPasswordTokenQuery({ query: { token: token.value } }),
  enabled: () => !!token.value,
})

const { errors, defineField, handleSubmit, meta } = useForm({
  validationSchema: toTypedSchema(zResetPasswordData.shape.body),
  initialValues: {
    token: token.value,
    password: '',
  },
})

const [password] = defineField('password')

const { mutate, isLoading: isResetting } = useMutation({
  ...resetPasswordMutation(),
  onSuccess: () => {
    isSuccess.value = true
  },
})

const handleReset = handleSubmit((values) => {
  mutate({ body: values })
})
</script>

<template>
  <AuthForm v-if="isSuccess">
    <template #title> Redefinir senha </template>
    <template #content>
      <div class="flex flex-col items-center py-6 text-center">
        <div
          class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600"
        >
          <i-ic:baseline-check-circle class="size-10" />
        </div>
        <p class="text-neutral-600">Sua senha foi redefinida com sucesso!</p>
      </div>
    </template>
    <template #footer>
      <AuthButton @click="router.push({ name: 'login' })" label="Entrar na conta" />
    </template>
  </AuthForm>

  <AuthForm v-else @submit="handleReset">
    <template #title> Redefinir senha </template>
    <template #subtitle> Digite sua nova senha abaixo. </template>

    <template #content>
      <div class="flex flex-col gap-4">
        <AuthInput
          v-model="password"
          name="password"
          label="Nova senha"
          type="password"
          :error="errors.password"
          :disabled="isValidatingToken || isResetting"
          autocomplete="new-password"
        />
      </div>

      <div class="my-10 flex justify-center md:my-20">
        <AuthButton
          type="submit"
          label="Salvar nova senha"
          :loading="isResetting || isValidatingToken"
          :disabled="isResetting || isValidatingToken || !meta.valid"
        />
      </div>
    </template>
  </AuthForm>
</template>
