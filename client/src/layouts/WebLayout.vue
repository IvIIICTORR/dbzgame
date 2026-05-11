<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import IconInstagram from '~icons/ri/instagram-line'
import IconTiktok from '~icons/ri/tiktok-fill'
import IconTwitter from '~icons/ri/twitter-x-fill'
import IconYoutube from '~icons/ri/youtube-fill'

// HEADER LOGIC
const isScrolled = ref(false)
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// HEADER MENU LOGIC
const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : ''
}

// LINKS
const navLinks = [
  { text: 'Sobre o Projeto', to: { name: 'about' } },
  { text: 'Trabalhe conosco', to: { name: 'careers' } },
  { text: 'Notícias', to: { name: 'news.index' } },
]

const socialLinks = [
  { name: 'Twitter', url: 'https://x.com/KodarGames', icon: IconTwitter },
  { name: 'Instagram', url: 'https://www.instagram.com/KodarGames/', icon: IconInstagram },
  { name: 'YouTube', url: 'https://www.youtube.com/@KodarGames', icon: IconYoutube },
  { name: 'TikTok', url: 'https://www.tiktok.com/@KodarGames', icon: IconTiktok },
]

const legalLinks = [
  { text: 'Aviso de Privacidade', to: { name: 'privacy-policy' } },
  { text: 'Termos de Serviço', to: { name: 'terms-of-service' } },
  { text: 'Preferências de Cookies', to: { name: 'cookie-preferences' } },
]
</script>

<template>
  <div>
    <header
      :class="[
        'fixed top-0 z-110 flex h-20 w-full items-center px-4 font-sans text-sm font-bold transition-all duration-300 ease-in-out md:px-8',
        isScrolled || isMenuOpen
          ? 'border-b-2 border-neutral-800 bg-neutral-900 shadow-md'
          : 'border-b-2 border-transparent bg-transparent',
      ]"
    >
      <div class="flex items-center gap-3">
        <Tooltip text="Visite a Kodar Games" side="bottom">
          <a
            href="https://www.kodargames.com/"
            target="_blank"
            class="group flex items-center gap-1.5 text-neutral-100 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <LogoKodarGames class="h-8 w-full" />
            <i-solar:alt-arrow-down-bold
              class="size-4 shrink-0 text-neutral-500 transition-transform group-hover:rotate-200"
            />
          </a>
        </Tooltip>
      </div>

      <nav class="ml-6 flex flex-1 items-center gap-4">
        <Tooltip text="Dragon Ball Z RPG Online" side="bottom">
          <RouterLink
            to="/"
            class="min-w-10 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <img src="@/assets/images/favicon.webp" class="h-6.5 w-auto" />
          </RouterLink>
        </Tooltip>

        <ul class="hidden items-center gap-1 md:flex">
          <li v-for="link in navLinks" :key="link.text">
            <NavItem :to="link.to" :text="link.text" />
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-4">
        <SetLocale />

        <div class="flex md:hidden">
          <Button class="bg-white/10" @click="toggleMenu">
            <i-solar:hamburger-menu-linear v-if="!isMenuOpen" class="size-6.5 text-neutral-100" />
            <i-ic:sharp-close v-else class="size-6.5 text-neutral-100" />
          </Button>
        </div>

        <div class="hidden md:flex">
          <NavItem :to="{ name: 'login' }" variant="button"> Jogue Grátis </NavItem>
        </div>
      </div>
    </header>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-full opacity-0"
    >
      <div
        v-show="isMenuOpen"
        class="fixed inset-0 z-100 h-screen w-full overflow-y-auto bg-neutral-900 pt-24 text-left shadow-2xl"
      >
        <div class="px-6">
          <ul class="flex flex-col gap-4">
            <li v-for="link in navLinks" :key="link.text" class="w-full">
              <NavItem
                :to="link.to"
                :text="link.text"
                class="h-12 w-full justify-start px-4 text-base!"
                @click="isMenuOpen = false"
              />
            </li>
          </ul>
        </div>

        <div class="mt-10 px-10">
          <NavItem
            :to="{ name: 'login' }"
            variant="button"
            class="h-12 w-full text-base"
            @click="isMenuOpen = false"
          >
            Jogue Grátis
          </NavItem>
        </div>
      </div>
    </Transition>

    <main class="overflow-y-auto">
      <RouterView />
    </main>

    <footer class="scroll-mt-20 border-t-2 border-neutral-800 bg-neutral-900 pb-12">
      <nav class="py-6">
        <ul class="flex flex-row flex-wrap items-center justify-center gap-3 px-4">
          <li v-for="social in socialLinks" :key="social.name">
            <Tooltip :text="social.name" side="top">
              <a
                :href="social.url"
                target="_blank"
                class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white/10 text-neutral-50 transition-all duration-200 hover:bg-white/20 active:scale-95 md:h-8 md:w-8"
              >
                <component :is="social.icon" class="h-5 w-5 md:h-4 md:w-4" />
                <span class="sr-only">{{ social.name }}</span>
              </a>
            </Tooltip>
          </li>
        </ul>
      </nav>

      <section class="flex items-baseline justify-center gap-5 pt-4 pb-5 md:pt-6">
        <a
          href="https://www.kodargames.com/"
          target="_blank"
          class="text-neutral-500 transition-colors hover:text-white"
        >
          <LogoKodarGames class="h-8 w-auto" />
        </a>
      </section>

      <section
        class="mx-auto max-w-full px-6 text-center text-[13px] leading-relaxed font-medium break-keep text-neutral-500 md:max-w-160"
      >
        <p>
          © {{ new Date().getFullYear() }} Kodar Games, Inc. Dragon Ball Z RPG Online e logotipos
          associados são marcas registradas.
        </p>
      </section>

      <nav class="py-7 text-center text-[13px] font-bold tracking-wider uppercase">
        <ul class="flex flex-col items-center justify-center gap-y-4 md:flex-row">
          <li v-for="link in legalLinks" :key="link.text" class="w-full md:w-auto">
            <NavItem :to="link.to" :text="link.text" />
          </li>
        </ul>
      </nav>
    </footer>
  </div>
</template>
