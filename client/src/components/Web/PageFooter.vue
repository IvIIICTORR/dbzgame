<template>
  <footer class="mt-16 border-t border-neutral-800/60 pt-8">
    <p class="text-center text-sm text-neutral-500">
      Dúvidas? Fale com a gente em
      <a href="mailto:suporte@kodargames.com" class="text-red-500 underline hover:text-red-400">
        suporte@kodargames.com
      </a>
    </p>
    <div class="mt-5 flex items-center justify-center gap-4 text-xs text-neutral-600">
      <slot name="links" />
    </div>
  </footer>
</template>
