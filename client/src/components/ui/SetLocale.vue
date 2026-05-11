<template>
  <Popover align="right">
    <template #trigger="{ isOpen, toggle }">
      <Tooltip text="Alterar idioma" side="bottom">
        <Button aria-label="Alterar idioma" :aria-expanded="isOpen" @click="toggle">
          <i-circle-flags:br class="size-7 shrink-0" />
        </Button>
      </Tooltip>
    </template>

    <template #content="{ close }">
      <div class="w-72 rounded-xl bg-white p-2 pb-4 shadow-xl ring-1 ring-black/5">
        <div class="flex flex-col">
          <div class="px-3 py-2">
            <span class="text-xs font-medium text-neutral-500"> Idiomas disponíveis </span>
          </div>

          <div class="flex flex-col gap-1">
            <DropdownItem is-active @click="close">
              <i-circle-flags:br class="size-5" />
              <span>Português (Brasil)</span>

              <template #append>
                <i-solar:unread-outline class="size-5 text-neutral-900" />
              </template>
            </DropdownItem>
          </div>
        </div>
      </div>
    </template>
  </Popover>
</template>
