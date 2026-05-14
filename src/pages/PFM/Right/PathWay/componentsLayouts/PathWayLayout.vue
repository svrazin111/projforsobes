<template>
  <div>
    <div class="bg-[#efefef] w-full h-[calc(100vh-300px)]">
      <div class="h-[26px] flex justify-between">
        <slot name="map-button" />
      </div>
      <div class="h-[calc(100%-26px)] !overflow-x-scroll !overflow-y-hidden">
        <div class="w-[1600px] h-full">
          <div class="flex mb-1">
            <div style="width: 760px">
              <div class="text-[#0000BB] text-[11px] font-semibold whitespace-nowrap text-center">
                Путь следования маршрутом
              </div>
              <div class="flex gap-2">
                <slot name="variants-table" />
                <slot name="administation-table" />
              </div>
            </div>
            <div style="width: 760px">
              <div class="text-[#0000BB] text-[11px] font-semibold whitespace-nowrap text-center">
                Путь следования по плану формирования
              </div>
              <slot name="administation-pf-table" />
            </div>
          </div>

          <Splitpanes class="default-theme w-[1600px] h-[calc(100%-100px)]" horizontal>
            <Pane class="flex" size="34" min-size="10">
              <div class="w-[760px]">
                <slot name="opor-table" />
              </div>
              <div style="width: 760px">
                <slot name="st-per-table" />
              </div>
            </Pane>
            <Pane class="flex relative bg-red-300" size="66" min-size="10">
              <div class="absolute flex gap-1 left-0 bottom-0 text-[10px]">
                <div>Только стыки</div>
                <slot name="stk-only-checkbox" />
              </div>
              <div class="w-[760px] relative">
                <slot name="path-table" />
                <div class="w-[760px] absolute left-0 bottom-0">
                  <slot name="path-sums-table" />
                </div>
              </div>
              <div class="w-[760px] relative">
                <slot name="path-pf-table" />
                <div class="w-[760px] absolute left-0 bottom-0">
                  <slot name="path-pf-sums-table" />
                </div>
              </div>
            </Pane>
          </Splitpanes>
        </div>
      </div>
    </div>
    <slot name="map-dialog" />
  </div>
</template>

<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
</script>
