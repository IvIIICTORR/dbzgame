<template>
  <div class="flex h-screen flex-col overflow-y-auto">
    <div
      class="fixed inset-0 -z-10 h-full w-full bg-[url('@/assets/images/wallpaper.webp')] bg-cover bg-center bg-no-repeat"
    ></div>

    <header class="flex items-center justify-center px-4 py-6 md:justify-start md:px-18 md:pt-12">
      <RouterLink to="/" class="pr-8">
        <LogoKodarGames class="h-auto w-28 text-white md:w-35" />
      </RouterLink>
    </header>

    <main class="mx-2 grid grow grid-cols-12 items-center gap-6 md:mx-18">
      <RouterView />
    </main>

    <footer
      class="flex flex-col items-center p-6 text-center text-xs font-extrabold tracking-widest uppercase md:m-[24px_72px_48px] md:items-start md:text-left"
    >
      <div
        class="mb-4 flex flex-col-reverse items-center justify-center gap-6 text-neutral-400 md:flex-row md:justify-start md:gap-3"
      >
        <nav class="flex flex-wrap justify-center gap-x-4 gap-y-2 md:justify-start">
          <RouterLink :to="{ name: 'suporte' }" class="hover:text-white">Suporte</RouterLink>
          <RouterLink :to="{ name: 'privacy-policy' }" class="hover:text-white"
            >Aviso de Privacidade</RouterLink
          >
          <RouterLink :to="{ name: 'terms-of-service' }" class="hover:text-white"
            >Termos de Serviço</RouterLink
          >
          <RouterLink :to="{ name: 'cookie-preferences' }" class="hover:text-white"
            >Preferências de Cookies</RouterLink
          >
        </nav>

        <div
          class="relative flex items-center rounded-sm bg-black/10 px-2.5 py-1.5 backdrop-blur-md"
        >
          <select
            id="locale-selector"
            name="locale"
            class="absolute inset-0 w-full cursor-pointer rounded-sm bg-white/20 opacity-0"
          >
            <option value="pt-br">Português (Brasil)</option>
          </select>

          <span class="mr-1 flex items-center gap-1">
            Português (Brasil)
            <i-circle-flags:br class="size-3" />
          </span>
        </div>
      </div>

      <div
        class="max-w-md text-[10px] leading-relaxed tracking-widest text-neutral-400 md:leading-6 md:whitespace-nowrap"
      >
        <span>
          Este site é protegido por hCaptcha. A
          <RouterLink :to="{ name: 'privacy-policy' }" class="text-white/90"
            >Aviso de Privacidade</RouterLink
          >
          e os
          <RouterLink :to="{ name: 'terms-of-service' }" class="text-white/90"
            >Termos de Serviço</RouterLink
          >
          são aplicáveis.
        </span>
      </div>
    </footer>
  </div>
</template>
