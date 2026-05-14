<template>
  <div class="flex gap-1">
    <Button2
      v-if="!props.is_multi"
      @click="emit('create')"
      v-tooltip.top="'Создание нового маршрута'"
      label="Добавить"
      img="document_add"
      :disabled="!youCanAddRow()"
    />
    <Button2
      v-if="!props.is_multi"
      @click="emit('edit')"
      v-tooltip.top="
        'Корректировка черновика, либо корректировка утвержденного маршрута по телеграмме с созданием архивной копии'
      "
      label="Изменить"
      img="document_edit"
      :disabled="!youCanEditRow()"
    />
    <Button2
      v-if="!props.is_multi"
      @click="emit('correct')"
      v-tooltip.top="'Дополнить/Исправить утвержденный маршрут в случае обнаружения ОШИБОК'"
      label="Дополнить/Исправить"
      img="document_certificate"
      :disabled="!youCanCorrectRow()"
    />
    <SplitButton
      v-if="!props.is_multi"
      v-tooltip.top="'Создать копию маршрута без прикрепленных документов'"
      @click="emit('copy')"
      :model="[
        {
          label: 'С прикрепленными документами',
          command: () => emit('copy_with_docs')
        },
        {
          label: 'Без прикрепленных документов',
          command: () => emit('copy')
        }
      ]"
      size="small"
      outlined
      severity="contrast"
      class="h-[22px] !bg-gray-100 hover:!bg-white"
      :disabled="!youCanCopyRow()"
    >
      <img :src="images.copy" />
      <div class="text-[10px] whitespace-nowrap">Копировать</div>
      <template #dropdownicon>
        <img :src="images.menu_down_custom" class="drowdown-img-custom rotate-180" />
      </template>
    </SplitButton>
    <Button2
      v-if="!props.is_multi"
      @click="emit('delete')"
      label="Удалить"
      img="document_delete"
      :disabled="!youCanDeleteRow()"
    />
    <Button2
      v-if="props.is_multi"
      @click="emit('multi_edit')"
      label="Изменить/Дополнить/Исправить"
      img="document_edit"
    />
    <Button2
      v-if="props.is_multi"
      @click="emit('multi_copy')"
      label="Копировать с корректировкой"
      img="copy"
    />
    <Button2
      v-if="props.is_multi"
      @click="emit('multi_approve')"
      label="Утвердить выбранные"
      img="document_certificate"
      :disabled="!youCanMultiApproveRows()"
    />
  </div>
</template>

<script setup lang="ts">
import { SplitButton } from 'primevue'

import { useUserStore } from '@/app/plugins/pinia/user'
import images from '@/shared/images/imported_images'
import Button2 from '@/shared/ui/button/Button2.vue'

import { PfmRow } from '../../const/types'

const props = defineProps<{
  row?: PfmRow
  rows?: PfmRow[]
  is_multi: boolean
}>()

const emit = defineEmits([
  'delete',
  'create',
  'edit',
  'correct',
  'copy',
  'copy_with_docs',
  'multi_copy',
  'multi_edit',
  'multi_approve'
])

const youCanAddRow = () => {
  if (useUserStore().road_edit.length == 0) return false

  if (props.row) {
    const edit_level = useUserStore().getEditLevel(props.row.rd_ot_code, props.row.rd_nz_code)
    if (edit_level == 'CD_EDIT' || edit_level == 'RD_IN_EDIT' || edit_level == 'RD_OUT_EDIT')
      return true

    return false
  }

  return true
}

const youCanCopyRow = () => {
  if (!props.row) return false

  const edit_level = useUserStore().getEditLevel(props.row.rd_ot_code, props.row.rd_nz_code)
  if (edit_level == 'CD_EDIT' || edit_level == 'RD_IN_EDIT' || edit_level == 'RD_OUT_EDIT')
    return true

  return false
}

const youCanEditRow = () => {
  if (!props.row) return false

  if (props.row.parent_id.length > 0) return false

  const edit_level = useUserStore().getEditLevel(props.row.rd_ot_code, props.row.rd_nz_code)

  if (edit_level == 'CD_EDIT' && props.row.status == '2') return false

  if (edit_level == 'CD_EDIT' || edit_level == 'RD_IN_EDIT' || edit_level == 'RD_OUT_EDIT')
    return true

  return false
}

const youCanCorrectRow = () => {
  if (!props.row) return false

  if (props.row.status != '1') return false

  const edit_level = useUserStore().getEditLevel(props.row.rd_ot_code, props.row.rd_nz_code)
  if (edit_level == 'CD_EDIT' || edit_level == 'RD_IN_EDIT' || edit_level == 'RD_OUT_EDIT')
    return true

  return false
}

const youCanDeleteRow = () => {
  if (!props.row) return false

  if (props.row.status == '1' || props.row.status == '2') return false

  const edit_level = useUserStore().getEditLevel(props.row.rd_ot_code, props.row.rd_nz_code)
  if (edit_level == 'CD_EDIT' || edit_level == 'RD_IN_EDIT' || edit_level == 'RD_OUT_EDIT')
    return true

  return false
}

const youCanMultiApproveRows = () => {
  if (!props.rows || !props.rows.length) return false

  let you_can = true

  props.rows.forEach((item) => {
    const edit_level = useUserStore().getEditLevel(item.rd_ot_code, item.rd_nz_code)

    if (edit_level == 'NO_EDIT') you_can = false
  })

  return you_can
}
</script>
